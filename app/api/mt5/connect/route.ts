import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

// Encrypt password
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
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { broker, server, login, password } = await req.json();

    if (!broker || !server || !login || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    // Check if user already has this account connected
    const existing = await prisma.mt5Account.findFirst({
      where: { userId: session.user.id, login, server },
    });

    if (existing) {
      return NextResponse.json({ error: "Account already connected" }, { status: 400 });
    }

    // Save account
    const account = await prisma.mt5Account.create({
      data: {
        userId: session.user.id,
        broker,
        server,
        login,
        password: encrypt(password),
        status: "connected",
        lastSync: new Date(),
      },
    });

    return NextResponse.json({ success: true, accountId: account.id });
  } catch (error) {
    console.error("MT5 connect error:", error);
    return NextResponse.json({ error: "Failed to connect account" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accounts = await prisma.mt5Account.findMany({
      where: { userId: session.user.id },
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
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
  }
}
