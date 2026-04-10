import { NextResponse } from "next/server";
import crypto from "crypto";
import { query } from "../../../../lib/d1";
import { getAuthUser } from "../../../../lib/auth";

const METAAPI_URL = "https://api.metaapi.cloud/v1";

function encrypt(text: string): string {
  const key = Buffer.from(process.env.ENCRYPTION_KEY || "default-key-32-chars!!!!!", "utf-8");
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

export async function POST(req: Request) {
  try {
    const user = getAuthUser(req as any);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { broker, server, login, investorPassword } = await req.json();

    if (!broker || !server || !login || !investorPassword) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
    }

    // Check existing
    const existing = await query(
      "SELECT id FROM Mt5Account WHERE userId = ? AND login = ? AND server = ? LIMIT 1",
      [user.userId, login, server]
    );

    if (existing.results.length > 0) {
      return NextResponse.json({ error: "Cuenta ya conectada" }, { status: 400 });
    }

    // Register in MetaApi
    const token = process.env.METAAPI_TOKEN;
    
    const provisioningRes = await fetch(`${METAAPI_URL}/users/current/accounts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `${broker} ${login}`,
        login,
        password: investorPassword,
        server,
        platform: "mt5",
      }),
    });

    if (!provisioningRes.ok) {
      const err = await provisioningRes.json();
      return NextResponse.json({ 
        error: "No se pudo conectar a MetaApi. Verifica los datos.", 
        details: err.message || "Unknown error" 
      }, { status: 400 });
    }

    // Save to D1
    const accountId = crypto.randomUUID();
    const now = new Date().toISOString();

    await query(
      "INSERT INTO Mt5Account (id, userId, broker, server, login, password, status, lastSync, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [accountId, user.userId, broker, server, login, encrypt(investorPassword), "connected", now, now, now]
    );

    return NextResponse.json({ success: true, accountId });
  } catch (error) {
    console.error("MT5 connect error:", error);
    return NextResponse.json({ error: "Error al conectar cuenta" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const user = getAuthUser(req as any);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await query(
      "SELECT id, broker, server, login, status, lastSync, createdAt FROM Mt5Account WHERE userId = ?",
      [user.userId]
    );

    return NextResponse.json({ accounts: result.results });
  } catch (error) {
    console.error("MT5 list error:", error);
    return NextResponse.json({ error: "Error al obtener cuentas" }, { status: 500 });
  }
}
