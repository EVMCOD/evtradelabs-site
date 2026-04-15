import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { query } from "@/lib/d1";

const SYMBOL_RE = /-(?:STD|ECN|Raw|Pro|Prime|Classic|Mini|Micro)\b.*$/i;

function normTime(t: any): string {
  const s = String(t);
  return /^\d{9,11}$/.test(s) ? new Date(Number(s) * 1000).toISOString() : s;
}

const r1 = (n: number) => Math.round(n * 10)  / 10;
const r2 = (n: number) => Math.round(n * 100) / 100;
const netP = (p: any) => (p.profit ?? 0) + (p.commission ?? 0) + (p.swap ?? 0);

// Sanitise closeReason — old records may have the string "null" written before the fix
const cleanReason = (r: any): string | null =>
  (!r || r === "null") ? null : String(r);

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { results: accounts } = await query<any>(
      `SELECT id, apiKey, accountLogin, accountName, broker, server, currency,
              balance, equity, leverage, status, lastSyncAt, connectedAt
       FROM MetricasAccount WHERE userId = ?`,
      [user.userId]
    );
    if (accounts.length === 0)
      return NextResponse.json({ account: null, positions: [], openPositions: [], balanceOps: [], synthEquity: [], stats: null });

    const account = accounts[0];

    const [tradesRes, balanceOpsRes] = await Promise.all([
      query<any>(
        `SELECT ticket, positionId, symbol, type, lots, price, profit,
                commission, swap, entry, time, comment, mae, mfe, sl, tp, closeReason
         FROM MetricasTrade WHERE accountId = ?
         ORDER BY time ASC LIMIT 10000`,
        [account.id]
      ),
      query<any>(
        `SELECT ticket, amount, type, time, comment FROM MetricasBalanceOp
         WHERE accountId = ? ORDER BY time ASC`,
        [account.id]
      ),
    ]);

    // Normalise deals
    const deals = tradesRes.results.map((t: any) => ({
      ...t,
      symbol: t.symbol?.replace(SYMBOL_RE, "") ?? t.symbol,
      time:   normTime(t.time),
    }));

    // Build IN/OUT maps
    const inMap:  Record<string, any> = {};
    const outMap: Record<string, any> = {};
    for (const d of deals) {
      if (!d.positionId) continue;
      if (d.entry === "in")  inMap[d.positionId]  = d;
      if (d.entry === "out") outMap[d.positionId] = d;
    }

    const pickExtreme = (a: number | null, b: number | null) =>
      (a != null && a !== 0) ? a : (b != null && b !== 0) ? b : null;

    // Closed positions
    const positions = Object.entries(outMap).map(([posId, out]) => {
      const inp = inMap[posId];
      return {
        positionId:  posId,
        symbol:      out.symbol,
        type:        out.type,
        lots:        out.lots || inp?.lots || 0,
        openPrice:   inp?.price  ?? null,
        openTime:    inp?.time   ?? null,
        closePrice:  out.price,
        closeTime:   out.time,
        profit:      out.profit,
        commission:  out.commission,
        swap:        out.swap,
        mae:         pickExtreme(out.mae, inp?.mae),
        mfe:         pickExtreme(out.mfe, inp?.mfe),
        sl:          inp?.sl  ?? out.sl  ?? null,
        tp:          inp?.tp  ?? out.tp  ?? null,
        closeReason: cleanReason(out.closeReason),
        comment:     out.comment ?? inp?.comment ?? null,
      };
    }).sort((a, b) => new Date(b.closeTime).getTime() - new Date(a.closeTime).getTime());

    // Open positions (IN without matching OUT)
    const openPositions = Object.entries(inMap)
      .filter(([posId]) => !outMap[posId])
      .map(([posId, inp]) => ({
        positionId: posId,
        symbol:     inp.symbol,
        type:       inp.type,
        lots:       inp.lots || 0,
        openPrice:  inp.price ?? null,
        openTime:   inp.time  ?? null,
        profit:     inp.profit || 0,
        commission: inp.commission || 0,
        swap:       inp.swap || 0,
        sl:         inp.sl  ?? null,
        tp:         inp.tp  ?? null,
        mae:        inp.mae ?? null,
        mfe:        inp.mfe ?? null,
      }))
      .sort((a, b) => (a.openTime ?? "").localeCompare(b.openTime ?? ""));

    const balanceOps = balanceOpsRes.results;
    const stats = computeStats(positions, balanceOps, account.balance ?? 0);
    const synthEquity = buildSynthEquity(positions, balanceOps, account.balance ?? 0);

    // Compute isLive: EA syncs every 60s — stale after 5 min
    const isLive = account.lastSyncAt
      ? Date.now() - new Date(account.lastSyncAt).getTime() < 5 * 60_000
      : false;

    return NextResponse.json({
      account: { ...account, isLive },
      positions, openPositions, balanceOps, synthEquity, stats,
    });
  } catch (err) {
    console.error("metricas/data GET:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// ── Synthetic equity from trade history ───────────────────────────
function buildSynthEquity(positions: any[], balanceOps: any[], currentBalance: number) {
  const sorted = [...positions].sort((a, b) => a.closeTime.localeCompare(b.closeTime));
  const totalPnL = sorted.reduce((s, p) => s + netP(p), 0);
  const totalOps = balanceOps.reduce((s: number, op: any) => s + (op.amount ?? 0), 0);
  let startBal = currentBalance - totalPnL - totalOps;
  if (startBal < 0) startBal = 0; // incomplete history guard

  type Ev = { time: number; amount: number };
  const events: Ev[] = [
    ...sorted.map(p   => ({ time: new Date(p.closeTime).getTime(), amount: netP(p) })),
    ...balanceOps.map((op: any) => ({ time: new Date(op.time).getTime(), amount: op.amount ?? 0 })),
  ].sort((a, b) => a.time - b.time);

  if (events.length === 0) return [];

  let bal = startBal;
  const curve: { time: string; balance: number }[] = [
    { time: new Date(events[0].time - 3_600_000).toISOString(), balance: startBal },
  ];
  for (const e of events) {
    bal += e.amount;
    curve.push({ time: new Date(e.time).toISOString(), balance: bal });
  }
  return curve;
}

// ── Stats ─────────────────────────────────────────────────────────
function computeStats(positions: any[], balanceOps: any[], currentBalance: number) {
  if (positions.length === 0) return null;

  const winners = positions.filter(p => netP(p) > 0);
  const losers  = positions.filter(p => netP(p) <= 0);
  const grossWin  = winners.reduce((s, p) => s + netP(p), 0);
  const grossLoss = Math.abs(losers.reduce((s, p) => s + netP(p), 0));

  // Symbol breakdown
  const bySymbol: Record<string, { trades: number; profit: number; wins: number }> = {};
  for (const p of positions) {
    if (!bySymbol[p.symbol]) bySymbol[p.symbol] = { trades: 0, profit: 0, wins: 0 };
    const n = netP(p);
    bySymbol[p.symbol].trades++;
    bySymbol[p.symbol].profit += n;
    if (n > 0) bySymbol[p.symbol].wins++;
  }

  // Drawdown from synthetic equity
  const sorted = [...positions].sort((a, b) => a.closeTime.localeCompare(b.closeTime));
  const synthEquity = buildSynthEquity(positions, balanceOps, currentBalance);
  let peak = -Infinity, maxDDPct = 0, maxDDAbs = 0;
  for (const pt of synthEquity) {
    if (pt.balance > peak) peak = pt.balance;
    const ddAbs = Math.max(0, peak - pt.balance);
    const ddPct = peak > 0 ? (ddAbs / peak) * 100 : 0;
    if (ddPct > maxDDPct) { maxDDPct = ddPct; maxDDAbs = ddAbs; }
  }

  // Avg trade duration (hours)
  const durs = sorted
    .filter(p => p.openTime && p.closeTime)
    .map(p => (new Date(p.closeTime).getTime() - new Date(p.openTime).getTime()) / 3_600_000);
  const avgDurationHours = durs.length > 0 ? durs.reduce((s, d) => s + d, 0) / durs.length : 0;

  // Consecutive streaks
  let maxConsecWins = 0, maxConsecLosses = 0, cW = 0, cL = 0;
  for (const p of sorted) {
    if (netP(p) > 0) { cW++; cL = 0; maxConsecWins  = Math.max(maxConsecWins,  cW); }
    else              { cL++; cW = 0; maxConsecLosses = Math.max(maxConsecLosses, cL); }
  }

  // Recovery factor
  const totalNetPnL = sorted.reduce((s, p) => s + netP(p), 0);
  const recoveryFactor = maxDDAbs > 0 ? totalNetPnL / maxDDAbs : 0;

  return {
    totalTrades:      positions.length,
    winRate:          r1(positions.length > 0 ? (winners.length / positions.length) * 100 : 0),
    profitFactor:     r2(grossLoss === 0 ? grossWin : grossWin / grossLoss),
    netProfit:        r2(totalNetPnL),
    grossWin:         r2(grossWin),
    grossLoss:        r2(grossLoss),
    avgWin:           r2(winners.length > 0 ? grossWin / winners.length : 0),
    avgLoss:          r2(losers.length  > 0 ? grossLoss / losers.length  : 0),
    maxDDPct:         r2(maxDDPct),
    maxDDAbs:         r2(maxDDAbs),
    recoveryFactor:   r2(recoveryFactor),
    avgDurationHours: r2(avgDurationHours),
    maxConsecWins,
    maxConsecLosses,
    symbols: Object.entries(bySymbol)
      .map(([name, d]) => ({
        name,
        trades:  d.trades,
        profit:  r2(d.profit),
        winRate: r1(d.trades > 0 ? (d.wins / d.trades) * 100 : 0),
        share:   r1(positions.length > 0 ? (d.trades / positions.length) * 100 : 0),
      }))
      .sort((a, b) => b.trades - a.trades)
      .slice(0, 8),
  };
}
