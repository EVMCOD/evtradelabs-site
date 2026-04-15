import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/d1";

const SIGNAL_TTL_MS = 30_000; // signals expire after 30s

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? req.headers.get("X-Api-Key");
  if (!apiKey) return NextResponse.json({ error: "Missing X-Api-Key" }, { status: 401 });

  try {
    const { results } = await query<any>(
      `SELECT id, groupId, role FROM ReplicadorAccount WHERE apiKey = ?`,
      [apiKey]
    );
    if (results.length === 0)
      return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

    const acc = results[0];
    if (acc.role !== "master")
      return NextResponse.json({ error: "Only master accounts can send signals" }, { status: 403 });

    let body: any;
    try { body = await req.json(); } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { action, symbol, type, lots, price, sl, tp,
            masterTicket, masterPositionId, masterBalance,
            closePrice, profit } = body;

    if (!action || !masterTicket || !masterPositionId)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    if (!["open", "close"].includes(action))
      return NextResponse.json({ error: "action must be open|close" }, { status: 400 });

    const now       = new Date().toISOString();
    const expiresAt = new Date(Date.now() + SIGNAL_TTL_MS).toISOString();
    const signalId  = crypto.randomUUID();

    await query(
      `INSERT INTO ReplicadorSignal
         (id, groupId, masterAccountId, action, symbol, type, lots, price,
          sl, tp, masterTicket, masterPositionId, masterBalance,
          closePrice, profit, createdAt, expiresAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        signalId, acc.groupId, acc.id, action,
        symbol ?? null, type ?? null,
        lots       != null ? Number(lots)       : null,
        price      != null ? Number(price)      : null,
        sl         != null ? Number(sl)         : null,
        tp         != null ? Number(tp)         : null,
        String(masterTicket), String(masterPositionId),
        masterBalance != null ? Number(masterBalance) : null,
        closePrice != null ? Number(closePrice) : null,
        profit     != null ? Number(profit)     : null,
        now, expiresAt,
      ]
    );

    // Create a pending execution row for every follower in the group
    const { results: followers } = await query<any>(
      `SELECT id FROM ReplicadorAccount WHERE groupId = ? AND role = 'follower' AND status = 'connected'`,
      [acc.groupId]
    );

    for (const f of followers) {
      await query(
        `INSERT INTO ReplicadorExecution (id, signalId, followerAccountId, status, createdAt)
         VALUES (?, ?, ?, 'pending', ?)`,
        [crypto.randomUUID(), signalId, f.id, now]
      );
    }

    console.log(`replicador/signal: ${action} ${symbol ?? ""} → ${followers.length} follower(s)`);
    return NextResponse.json({ ok: true, signalId, followers: followers.length });
  } catch (err) {
    console.error("replicador/signal POST:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
