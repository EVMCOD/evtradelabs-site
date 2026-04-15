import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/d1";

export async function GET(req: NextRequest) {
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
    if (acc.role !== "follower")
      return NextResponse.json({ error: "Only follower accounts can poll" }, { status: 403 });

    const now = new Date().toISOString();

    // Expire stale pending executions whose signal TTL has passed
    await query(
      `UPDATE ReplicadorExecution SET status = 'expired'
       WHERE followerAccountId = ? AND status = 'pending'
         AND signalId IN (
           SELECT id FROM ReplicadorSignal WHERE expiresAt < ?
         )`,
      [acc.id, now]
    );

    // Fetch pending executions for this follower (non-expired signals only)
    const { results: pending } = await query<any>(
      `SELECT
         e.id          AS executionId,
         s.action,
         s.symbol,
         s.type,
         s.lots        AS masterLots,
         s.masterBalance,
         s.sl,
         s.tp,
         s.masterPositionId,
         s.closePrice
       FROM ReplicadorExecution e
       JOIN ReplicadorSignal    s ON s.id = e.signalId
       WHERE e.followerAccountId = ?
         AND e.status = 'pending'
         AND s.expiresAt > ?
       ORDER BY s.createdAt ASC
       LIMIT 20`,
      [acc.id, now]
    );

    // For close signals, look up the followerTicket from the matching open execution
    const signals = await Promise.all(pending.map(async (row: any) => {
      if (row.action !== "close") return row;

      const { results: openExec } = await query<any>(
        `SELECT e.followerTicket
         FROM ReplicadorExecution e
         JOIN ReplicadorSignal    s ON s.id = e.signalId
         WHERE e.followerAccountId = ?
           AND e.status = 'done'
           AND s.action = 'open'
           AND s.masterPositionId = ?
         ORDER BY s.createdAt DESC LIMIT 1`,
        [acc.id, row.masterPositionId]
      );

      return { ...row, followerTicket: openExec[0]?.followerTicket ?? null };
    }));

    return NextResponse.json({ signals });
  } catch (err) {
    console.error("replicador/poll GET:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
