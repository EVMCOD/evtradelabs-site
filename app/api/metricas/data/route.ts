import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

let prisma: any = null;
async function getPrisma() {
  if (!prisma) {
    const { PrismaClient } = await import("@prisma/client");
    prisma = new PrismaClient({ log: ["error"] });
  }
  return prisma;
}

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getPrisma();

  const metricasAccount = await db.metricasAccount.findUnique({
    where: { userId: user.userId },
    select: {
      id: true,
      apiKey: true,
      accountLogin: true,
      accountName: true,
      broker: true,
      server: true,
      currency: true,
      balance: true,
      equity: true,
      leverage: true,
      status: true,
      lastSyncAt: true,
      connectedAt: true,
    },
  });

  if (!metricasAccount) {
    return NextResponse.json({ account: null, trades: [], snapshots: [], stats: null });
  }

  const [trades, snapshots] = await Promise.all([
    db.metricasTrade.findMany({
      where: { accountId: metricasAccount.id },
      orderBy: { time: "desc" },
      take: 500,
      select: {
        ticket: true,
        symbol: true,
        type: true,
        lots: true,
        price: true,
        profit: true,
        commission: true,
        swap: true,
        entry: true,
        time: true,
        comment: true,
      },
    }),
    db.metricasSnapshot.findMany({
      where: { accountId: metricasAccount.id },
      orderBy: { timestamp: "asc" },
      take: 90,
      select: { balance: true, equity: true, timestamp: true },
    }),
  ]);

  // Compute stats from closed trades (entry === "out")
  const closed = trades.filter((t: any) => t.entry === "out");
  const stats = computeStats(closed, metricasAccount.balance);

  return NextResponse.json({
    account: metricasAccount,
    trades,
    snapshots,
    stats,
  });
}

function computeStats(closed: any[], currentBalance: number | null) {
  if (closed.length === 0) return null;

  const winners = closed.filter((t: any) => t.profit + t.commission + t.swap > 0);
  const losers  = closed.filter((t: any) => t.profit + t.commission + t.swap <= 0);

  const grossWin  = winners.reduce((s: number, t: any) => s + t.profit + t.commission + t.swap, 0);
  const grossLoss = Math.abs(losers.reduce((s: number, t: any) => s + t.profit + t.commission + t.swap, 0));

  const profitFactor = grossLoss === 0 ? grossWin : grossWin / grossLoss;
  const winRate      = closed.length > 0 ? (winners.length / closed.length) * 100 : 0;
  const avgWin       = winners.length > 0 ? grossWin / winners.length : 0;
  const avgLoss      = losers.length > 0 ? grossLoss / losers.length : 0;
  const netProfit    = closed.reduce((s: number, t: any) => s + t.profit + t.commission + t.swap, 0);

  // Symbol breakdown
  const bySymbol: Record<string, { trades: number; profit: number; wins: number }> = {};
  for (const t of closed) {
    if (!bySymbol[t.symbol]) bySymbol[t.symbol] = { trades: 0, profit: 0, wins: 0 };
    const net = t.profit + t.commission + t.swap;
    bySymbol[t.symbol].trades++;
    bySymbol[t.symbol].profit += net;
    if (net > 0) bySymbol[t.symbol].wins++;
  }

  const symbols = Object.entries(bySymbol)
    .map(([name, d]: [string, any]) => ({
      name,
      trades: d.trades,
      profit: d.profit,
      winRate: d.trades > 0 ? (d.wins / d.trades) * 100 : 0,
      share: closed.length > 0 ? (d.trades / closed.length) * 100 : 0,
    }))
    .sort((a, b) => b.trades - a.trades)
    .slice(0, 8);

  return {
    totalTrades: closed.length,
    winRate: Math.round(winRate * 10) / 10,
    profitFactor: Math.round(profitFactor * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    grossWin: Math.round(grossWin * 100) / 100,
    grossLoss: Math.round(grossLoss * 100) / 100,
    avgWin: Math.round(avgWin * 100) / 100,
    avgLoss: Math.round(avgLoss * 100) / 100,
    symbols,
  };
}
