import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { getAuthUser } from "@/lib/auth";

const prisma = new PrismaClient();
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
    // Get user from cookie
    const user = getAuthUser(req as any);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { broker, server, login, password, investorPassword } = await req.json();

    if (!broker || !server || !login || !investorPassword) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
    }

    // Check existing
    const existing = await prisma.mt5Account.findFirst({
      where: { userId: user.userId, login, server },
    });
    if (existing) {
      return NextResponse.json({ error: "Cuenta ya conectada" }, { status: 400 });
    }

    // Register account in MetaApi
    const token = process.env.METAAPI_TOKEN;
    
    const provisioningRes = await fetch(`${METAAPI_URL}/users/current/accounts`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
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

    const metaApiAccount = await provisioningRes.json();
    
    // Save to our DB
    const account = await prisma.mt5Account.create({
      data: {
        userId: user.userId,
        broker,
        server,
        login,
        password: encrypt(investorPassword),
        status: "connected",
        lastSync: new Date(),
      },
    });

    return NextResponse.json({ 
      success: true, 
      accountId: account.id,
      metaApiId: metaApiAccount.id,
    });
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

    const accounts = await prisma.mt5Account.findMany({
      where: { userId: user.userId },
      select: {
        id: true,
        broker: true,
        server: true,
        login: true,
        status: true,
        lastSync: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error("MT5 list error:", error);
    return NextResponse.json({ error: "Error al obtener cuentas" }, { status: 500 });
  }
}
