import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { query } from "@/lib/d1";

function genKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.getRandomValues(new Uint8Array(28));
  return "evr_" + Array.from(bytes).map(b => chars[b % chars.length]).join("");
}

// GET — return existing group + accounts (or null if not set up yet)
export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { results: groups } = await query<any>(
      `SELECT id, name, status FROM ReplicadorGroup WHERE userId = ?`,
      [user.userId]
    );
    if (groups.length === 0) return NextResponse.json({ group: null, accounts: [] });

    const group = groups[0];
    const { results: accounts } = await query<any>(
      `SELECT id, role, apiKey, accountLogin, accountName, broker, server,
              currency, balance, equity, status, lastSeenAt, connectedAt,
              lotMode, lotValue, symbolSuffix, copyStopLoss, copyTakeProfit, maxSlippage
       FROM ReplicadorAccount WHERE groupId = ? ORDER BY role DESC, createdAt ASC`,
      [group.id]
    );

    return NextResponse.json({ group, accounts });
  } catch (err) {
    console.error("replicador/setup GET:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST — create group (first time) or add a new account
export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    let body: any;
    try { body = await req.json(); } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { action } = body; // "create_group" | "add_account"
    const now = new Date().toISOString();

    if (action === "create_group") {
      const existing = await query<any>(
        `SELECT id FROM ReplicadorGroup WHERE userId = ?`, [user.userId]
      );
      if (existing.results.length > 0)
        return NextResponse.json({ error: "Group already exists" }, { status: 409 });

      const groupId = crypto.randomUUID();
      await query(
        `INSERT INTO ReplicadorGroup (id, userId, name, status, createdAt, updatedAt)
         VALUES (?, ?, ?, 'active', ?, ?)`,
        [groupId, user.userId, body.name ?? "Grupo Principal", now, now]
      );

      // Auto-create master account
      const masterId = crypto.randomUUID();
      const masterKey = genKey();
      await query(
        `INSERT INTO ReplicadorAccount
           (id, groupId, userId, apiKey, role, status, lotMode, lotValue,
            symbolSuffix, copyStopLoss, copyTakeProfit, maxSlippage, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, 'master', 'pending', 'proportional', 1.0, '', 1, 1, 30, ?, ?)`,
        [masterId, groupId, user.userId, masterKey, now, now]
      );

      return NextResponse.json({ groupId, masterId, masterKey });
    }

    if (action === "add_account") {
      const { results: groups } = await query<any>(
        `SELECT id FROM ReplicadorGroup WHERE userId = ?`, [user.userId]
      );
      if (groups.length === 0)
        return NextResponse.json({ error: "Create a group first" }, { status: 400 });

      const groupId = groups[0].id;

      // Check follower limit (max 10 for now — gating hook point)
      const { results: existing } = await query<any>(
        `SELECT COUNT(*) AS n FROM ReplicadorAccount WHERE groupId = ? AND role = 'follower'`,
        [groupId]
      );
      if ((existing[0]?.n ?? 0) >= 10)
        return NextResponse.json({ error: "Follower limit reached" }, { status: 403 });

      const accountId = crypto.randomUUID();
      const apiKey    = genKey();
      const {
        lotMode = "proportional", lotValue = 1.0,
        symbolSuffix = "", copyStopLoss = 1, copyTakeProfit = 1, maxSlippage = 30,
      } = body;

      await query(
        `INSERT INTO ReplicadorAccount
           (id, groupId, userId, apiKey, role, status,
            lotMode, lotValue, symbolSuffix, copyStopLoss, copyTakeProfit, maxSlippage,
            createdAt, updatedAt)
         VALUES (?, ?, ?, ?, 'follower', 'pending', ?, ?, ?, ?, ?, ?, ?, ?)`,
        [accountId, groupId, user.userId, apiKey,
         lotMode, Number(lotValue), symbolSuffix,
         copyStopLoss ? 1 : 0, copyTakeProfit ? 1 : 0, Number(maxSlippage),
         now, now]
      );

      return NextResponse.json({ accountId, apiKey });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("replicador/setup POST:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE — remove a follower account
export async function DELETE(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { accountId } = await req.json();
    if (!accountId) return NextResponse.json({ error: "Missing accountId" }, { status: 400 });

    await query(
      `DELETE FROM ReplicadorAccount
       WHERE id = ? AND userId = ? AND role = 'follower'`,
      [accountId, user.userId]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("replicador/setup DELETE:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
