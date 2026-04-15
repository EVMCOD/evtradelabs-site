import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/d1";

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? req.headers.get("X-Api-Key");
  if (!apiKey) return NextResponse.json({ error: "Missing X-Api-Key" }, { status: 401 });

  try {
    const { results } = await query<any>(
      `SELECT id FROM ReplicadorAccount WHERE apiKey = ? AND role = 'follower'`,
      [apiKey]
    );
    if (results.length === 0)
      return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

    const accId = results[0].id;

    let body: any;
    try { body = await req.json(); } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { executionId, status, followerTicket, error } = body;
    if (!executionId || !status)
      return NextResponse.json({ error: "Missing executionId or status" }, { status: 400 });
    if (!["done", "failed", "skipped"].includes(status))
      return NextResponse.json({ error: "status must be done|failed|skipped" }, { status: 400 });

    const now = new Date().toISOString();

    const { results: updated } = await query<any>(
      `UPDATE ReplicadorExecution
       SET status         = ?,
           followerTicket = COALESCE(?, followerTicket),
           executedAt     = ?,
           error          = ?
       WHERE id = ? AND followerAccountId = ? AND status = 'pending'
       RETURNING id`,
      [
        status,
        followerTicket ? String(followerTicket) : null,
        now,
        error ?? null,
        executionId,
        accId,
      ]
    );

    if (updated.length === 0)
      return NextResponse.json({ error: "Execution not found or already confirmed" }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("replicador/confirm POST:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
