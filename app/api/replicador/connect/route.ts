import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/d1";

// Called by EA on OnInit and heartbeat — auth via X-Api-Key
export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? req.headers.get("X-Api-Key");
  if (!apiKey) return NextResponse.json({ error: "Missing X-Api-Key" }, { status: 401 });

  try {
    const { results } = await query<any>(
      `SELECT id, groupId, role, connectedAt FROM ReplicadorAccount WHERE apiKey = ?`,
      [apiKey]
    );
    if (results.length === 0)
      return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

    const acc = results[0];
    const now = new Date().toISOString();

    let body: any;
    try { body = await req.json(); } catch { body = {}; }
    const { account } = body;

    await query(
      `UPDATE ReplicadorAccount
       SET accountLogin = COALESCE(?, accountLogin),
           accountName  = COALESCE(?, accountName),
           broker       = COALESCE(?, broker),
           server       = COALESCE(?, server),
           currency     = COALESCE(?, currency),
           balance      = COALESCE(?, balance),
           equity       = COALESCE(?, equity),
           status       = 'connected',
           lastSeenAt   = ?,
           connectedAt  = COALESCE(connectedAt, ?),
           updatedAt    = ?
       WHERE id = ?`,
      [
        account?.login  ? String(account.login) : null,
        account?.name   ?? null,
        account?.broker ?? null,
        account?.server ?? null,
        account?.currency ?? null,
        account?.balance  != null ? Number(account.balance)  : null,
        account?.equity   != null ? Number(account.equity)   : null,
        now,
        acc.connectedAt ? null : now,
        now,
        acc.id,
      ]
    );

    return NextResponse.json({ ok: true, role: acc.role, accountId: acc.id, groupId: acc.groupId });
  } catch (err) {
    console.error("replicador/connect POST:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
