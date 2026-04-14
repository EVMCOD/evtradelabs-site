import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { query } from "@/lib/d1";

const SYMBOL_RE = /-(?:STD|ECN|Raw|Pro|Prime|Classic|Mini|Micro)\b.*$/i;

function normTime(t: any): string {
  const s = String(t);
  return /^\d{9,11}$/.test(s) ? new Date(Number(s) * 1000).toISOString() : s;
}

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
      return NextResponse.json({ account: null, trades: [], positions: [], snapshots: [], stats: null });

    const account = accounts[0];

    const [tradesRes, snapshotsRes] = await Promise.all([
      query<any>(
        `SELECT ticket, positionId, symbol, type, lots, price, profit,
                commission, swap, entry, time, comment, mae, mfe
         FROM MetricasTrade WHERE accountId = ?
         ORDER BY time ASC
         LIMIT 2000`,
        [account.id]
      ),
      query<any>(
        `SELECT balance, equity, timestamp FROM MetricasSnapshot
         WHERE accountId = ? ORDER BY timestamp ASC LIMIT 200`,
        [account.id]
      ),
    ]);

    // Normalise deals
    const deals = tradesRes.results.map((t: any) => ({
      ...t,
      symbol: t.symbol?.replace(SYMBOL_RE, "") ?? t.symbol,
      time:   normTime(t.time),
    }));

    // Build positions by merging IN + OUT deals via positionId
    const inMap:  Record<string, any> = {};
    const outMap: Record<string, any> = {};
    for (const d of deals) {
      if (!d.positionId) continue;
      if (d.entry === "in")  inMap[d.positionId]  = d;
      if (d.entry === "out") outMap[d.positionId] = d;
    }

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
        mae:         out.mae   || inp?.mae   || null,
        mfe:         out.mfe   || inp?.mfe   || null,
        comment:     out.comment ?? inp?.comment ?? null,
      };
    }).sort((a, b) => new Date(b.closeTime).getTime() - new Date(a.closeTime).getTime());

    // closed OUT deals for stats (backwards compat)
    const closed = deals.filter((t: any) => t.entry === "out");
    const stats  = computeStats(closed);

    return NextResponse.json({ account, deals, positions, snapshots: snapshotsRes.results, stats });
  } catch (err) {
    console.error("metricas/data GET:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

function computeStats(closed: any[]) {
  if (closed.length === 0) return null;
  const net = (t: any) => t.profit + t.commission + t.swap;
  const winners = closed.filter((t) => net(t) > 0);
  const losers  = closed.filter((t) => net(t) <= 0);
  const grossWin  = winners.reduce((s, t) => s + net(t), 0);
  const grossLoss = Math.abs(losers.reduce((s, t) => s + net(t), 0));
  const bySymbol: Record<string, { trades: number; profit: number; wins: number }> = {};
  for (const t of closed) {
    if (!bySymbol[t.symbol]) bySymbol[t.symbol] = { trades: 0, profit: 0, wins: 0 };
    const n = net(t);
    bySymbol[t.symbol].trades++;
    bySymbol[t.symbol].profit += n;
    if (n > 0) bySymbol[t.symbol].wins++;
  }
  return {
    totalTrades:  closed.length,
    winRate:      r1((winners.length / closed.length) * 100),
    profitFactor: r2(grossLoss === 0 ? grossWin : grossWin / grossLoss),
    netProfit:    r2(closed.reduce((s, t) => s + net(t), 0)),
    grossWin:     r2(grossWin),
    grossLoss:    r2(grossLoss),
    avgWin:       r2(winners.length > 0 ? grossWin / winners.length : 0),
    avgLoss:      r2(losers.length  > 0 ? grossLoss / losers.length  : 0),
    symbols: Object.entries(bySymbol)
      .map(([name, d]) => ({
        name,
        trades:  d.trades,
        profit:  r2(d.profit),
        winRate: r1(d.trades > 0 ? (d.wins / d.trades) * 100 : 0),
        share:   r1(closed.length > 0 ? (d.trades / closed.length) * 100 : 0),
      }))
      .sort((a, b) => b.trades - a.trades)
      .slice(0, 8),
  };
}

const r1 = (n: number) => Math.round(n * 10)  / 10;
const r2 = (n: number) => Math.round(n * 100) / 100;
