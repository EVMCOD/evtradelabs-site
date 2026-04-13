import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { query } from "@/lib/d1";

function generateApiKey(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return "evm_" + Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// GET — get existing account (creates one if this is the first time)
export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Try to find existing account
    const { results } = await query<any>(
      `SELECT id, apiKey, accountLogin, accountName, broker, server, currency,
              balance, equity, leverage, status, lastSyncAt, connectedAt
       FROM MetricasAccount WHERE userId = ?`,
      [user.userId]
    );

    if (results.length > 0) {
      return NextResponse.json({ account: results[0] });
    }

    // First time — create account with new API key
    const id     = crypto.randomUUID();
    const apiKey = generateApiKey();

    await query(
      `INSERT INTO MetricasAccount (id, userId, apiKey) VALUES (?, ?, ?)`,
      [id, user.userId, apiKey]
    );

    return NextResponse.json({
      account: {
        id, apiKey, accountLogin: null, accountName: null, broker: null,
        server: null, currency: "USD", balance: null, equity: null,
        leverage: null, status: "pending", lastSyncAt: null, connectedAt: null,
      },
    });
  } catch (err) {
    console.error("metricas/connect GET:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST — regenerate API key
export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const newKey = generateApiKey();
    const now    = new Date().toISOString();

    // Upsert — update if exists, insert if not
    const { results } = await query<any>(
      `SELECT id FROM MetricasAccount WHERE userId = ?`,
      [user.userId]
    );

    if (results.length > 0) {
      await query(
        `UPDATE MetricasAccount SET apiKey = ?, status = 'pending', updatedAt = ? WHERE userId = ?`,
        [newKey, now, user.userId]
      );
    } else {
      await query(
        `INSERT INTO MetricasAccount (id, userId, apiKey) VALUES (?, ?, ?)`,
        [crypto.randomUUID(), user.userId, newKey]
      );
    }

    return NextResponse.json({ account: { apiKey: newKey, status: "pending" } });
  } catch (err) {
    console.error("metricas/connect POST:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
