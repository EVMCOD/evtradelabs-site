import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/d1";

const LONG_POLL_MS    = 20_000; // hold connection up to 20s
const CHECK_INTERVAL  = 500;    // check D1 every 500ms

async function fetchPending(accId: string, now: string) {
  const { results } = await query<any>(
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
    [accId, now]
  );
  return results;
}

async function enrichClose(accId: string, rows: any[]) {
  return Promise.all(rows.map(async (row) => {
    if (row.action !== "close") return row;
    const { results } = await query<any>(
      `SELECT e.followerTicket
       FROM ReplicadorExecution e
       JOIN ReplicadorSignal    s ON s.id = e.signalId
       WHERE e.followerAccountId = ?
         AND e.status = 'done'
         AND s.action = 'open'
         AND s.masterPositionId = ?
       ORDER BY s.createdAt DESC LIMIT 1`,
      [accId, row.masterPositionId]
    );
    return { ...row, followerTicket: results[0]?.followerTicket ?? null };
  }));
}

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? req.headers.get("X-Api-Key");
  if (!apiKey) return NextResponse.json({ error: "Missing X-Api-Key" }, { status: 401 });

  try {
    const { results } = await query<any>(
      `SELECT id, role FROM ReplicadorAccount WHERE apiKey = ?`,
      [apiKey]
    );
    if (results.length === 0)
      return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
    if (results[0].role !== "follower")
      return NextResponse.json({ error: "Followers only" }, { status: 403 });

    const accId   = results[0].id;
    const deadline = Date.now() + LONG_POLL_MS;

    while (true) {
      const now = new Date().toISOString();

      // Expire stale pending executions
      await query(
        `UPDATE ReplicadorExecution SET status = 'expired'
         WHERE followerAccountId = ? AND status = 'pending'
           AND signalId IN (SELECT id FROM ReplicadorSignal WHERE expiresAt < ?)`,
        [accId, now]
      );

      // Check for pending signals
      const pending = await fetchPending(accId, now);
      if (pending.length > 0) {
        const signals = await enrichClose(accId, pending);
        return NextResponse.json({ signals });
      }

      if (Date.now() >= deadline)
        return NextResponse.json({ signals: [] }); // timeout — EA reconnects immediately

      await new Promise<void>(r => setTimeout(r, CHECK_INTERVAL));
    }
  } catch (err) {
    console.error("replicador/wait GET:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
