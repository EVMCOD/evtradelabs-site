import { NextRequest, NextResponse } from "next/server";

let prisma: any = null;
async function getPrisma() {
  if (!prisma) {
    const { PrismaClient } = await import("@prisma/client");
    prisma = new PrismaClient({ log: ["error"] });
  }
  return prisma;
}

// Called by the MT5 EA — no JWT, auth via X-API-Key header
export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? req.headers.get("X-API-Key");
  if (!apiKey) {
    return NextResponse.json({ error: "Missing X-API-Key header" }, { status: 401 });
  }

  const db = await getPrisma();

  const metricasAccount = await db.metricasAccount.findUnique({
    where: { apiKey },
    select: { id: true },
  });

  if (!metricasAccount) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { event, account, trades, open_positions } = body;
  const now = new Date();

  // Update account metadata from the EA payload
  if (account) {
    const isFirstSync = !(await db.metricasAccount.findFirst({
      where: { id: metricasAccount.id, connectedAt: { not: null } },
      select: { id: true },
    }));

    await db.metricasAccount.update({
      where: { id: metricasAccount.id },
      data: {
        accountLogin: account.login ? String(account.login) : undefined,
        accountName: account.name ?? undefined,
        broker: account.broker ?? undefined,
        server: account.server ?? undefined,
        currency: account.currency ?? undefined,
        balance: account.balance != null ? Number(account.balance) : undefined,
        equity: account.equity != null ? Number(account.equity) : undefined,
        leverage: account.leverage != null ? Number(account.leverage) : undefined,
        status: "connected",
        lastSyncAt: now,
        connectedAt: isFirstSync ? now : undefined,
      },
    });

    // Write balance snapshot (at most once per minute to avoid bloat)
    if (account.balance != null && account.equity != null) {
      const oneMinuteAgo = new Date(now.getTime() - 60_000);
      const recentSnapshot = await db.metricasSnapshot.findFirst({
        where: { accountId: metricasAccount.id, timestamp: { gte: oneMinuteAgo } },
        select: { id: true },
      });
      if (!recentSnapshot) {
        await db.metricasSnapshot.create({
          data: {
            accountId: metricasAccount.id,
            balance: Number(account.balance),
            equity: Number(account.equity),
            margin: account.margin != null ? Number(account.margin) : 0,
          },
        });
      }
    }
  }

  // Upsert trades from EA history
  if (Array.isArray(trades) && trades.length > 0) {
    for (const t of trades) {
      if (!t.ticket || !t.symbol) continue;
      try {
        await db.metricasTrade.upsert({
          where: {
            accountId_ticket: {
              accountId: metricasAccount.id,
              ticket: String(t.ticket),
            },
          },
          update: {
            profit: t.profit != null ? Number(t.profit) : 0,
            commission: t.commission != null ? Number(t.commission) : 0,
            swap: t.swap != null ? Number(t.swap) : 0,
          },
          create: {
            accountId: metricasAccount.id,
            ticket: String(t.ticket),
            positionId: t.positionId ? String(t.positionId) : null,
            symbol: t.symbol,
            type: t.type ?? "buy",
            lots: t.lots != null ? Number(t.lots) : 0,
            price: t.price != null ? Number(t.price) : 0,
            profit: t.profit != null ? Number(t.profit) : 0,
            commission: t.commission != null ? Number(t.commission) : 0,
            swap: t.swap != null ? Number(t.swap) : 0,
            entry: t.entry ?? "out",
            time: t.time ? new Date(t.time) : now,
            comment: t.comment ?? null,
          },
        });
      } catch (err) {
        console.error("metricas/sync: failed to upsert trade", t.ticket, err);
      }
    }
  }

  const tradeCount = Array.isArray(trades) ? trades.length : 0;
  return NextResponse.json({ ok: true, event, tradesReceived: tradeCount });
}
