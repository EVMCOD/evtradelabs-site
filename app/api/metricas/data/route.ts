import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { query } from "@/lib/d1";

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Load account
    const { results: accounts } = await query<any>(
      `SELECT id, apiKey, accountLogin, accountName, broker, server, currency,
              balance, equity, leverage, status, lastSyncAt, connectedAt
       FROM MetricasAccount WHERE userId = ?`,
      [user.userId]
    );

    if (accounts.length === 0) {
      return NextResponse.json({ account: null, trades: [], snapshots: [], stats: null });
    }

    const account = accounts[0];

    // Load trades + snapshots in parallel
    const [tradesRes, snapshotsRes] = await Promise.all([
      query<any>(
        `SELECT ticket, symbol, type, lots, price, profit, commission, swap,
                entry, time, comment
         FROM MetricasTrade
         WHERE accountId = ?
         ORDER BY time DESC
         LIMIT 500`,
        [account.id]
      ),
      query<any>(
        `SELECT balance, equity, timestamp
         FROM MetricasSnapshot
         WHERE accountId = ?
         ORDER BY timestamp ASC
         LIMIT 90`,
        [account.id]
      ),
    ]);

    const trades    = tradesRes.results;
    const snapshots = snapshotsRes.results;

    // Compute stats from closed trades
    const closed = trades.filter((t: any) => t.entry === "out");
    const stats  = computeStats(closed);

    return NextResponse.json({ account, trades, snapshots, stats });
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

  const profitFactor = grossLoss === 0 ? grossWin : grossWin / grossLoss;
  const winRate      = (winners.length / closed.length) * 100;
  const netProfit    = closed.reduce((s, t) => s + net(t), 0);

  // Symbol breakdown
  const bySymbol: Record<string, { trades: number; profit: number; wins: number }> = {};
  for (const t of closed) {
    if (!bySymbol[t.symbol]) bySymbol[t.symbol] = { trades: 0, profit: 0, wins: 0 };
    const n = net(t);
    bySymbol[t.symbol].trades++;
    bySymbol[t.symbol].profit += n;
    if (n > 0) bySymbol[t.symbol].wins++;
  }

  const symbols = Object.entries(bySymbol)
    .map(([name, d]) => ({
      name,
      trades: d.trades,
      profit: round2(d.profit),
      winRate: round1(d.trades > 0 ? (d.wins / d.trades) * 100 : 0),
      share: round1(closed.length > 0 ? (d.trades / closed.length) * 100 : 0),
    }))
    .sort((a, b) => b.trades - a.trades)
    .slice(0, 8);

  return {
    totalTrades: closed.length,
    winRate: round1(winRate),
    profitFactor: round2(profitFactor),
    netProfit: round2(netProfit),
    grossWin: round2(grossWin),
    grossLoss: round2(grossLoss),
    avgWin: round2(winners.length > 0 ? grossWin / winners.length : 0),
    avgLoss: round2(losers.length > 0 ? grossLoss / losers.length : 0),
    symbols,
  };
}

const round1 = (n: number) => Math.round(n * 10) / 10;
const round2 = (n: number) => Math.round(n * 100) / 100;
