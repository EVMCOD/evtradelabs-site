import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

let prisma: any = null;
async function getPrisma() {
  if (!prisma) {
    const { PrismaClient } = await import("@prisma/client");
    prisma = new PrismaClient({ log: ["error"] });
  }
  return prisma;
}

function generateApiKey(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return "evm_" + Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// GET — returns existing API key, creates one if not exists
export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getPrisma();

  let account = await db.metricasAccount.findUnique({
    where: { userId: user.userId },
    select: {
      apiKey: true,
      accountLogin: true,
      accountName: true,
      broker: true,
      server: true,
      currency: true,
      balance: true,
      equity: true,
      status: true,
      lastSyncAt: true,
      connectedAt: true,
    },
  });

  if (!account) {
    account = await db.metricasAccount.create({
      data: {
        userId: user.userId,
        apiKey: generateApiKey(),
      },
      select: {
        apiKey: true,
        accountLogin: true,
        accountName: true,
        broker: true,
        server: true,
        currency: true,
        balance: true,
        equity: true,
        status: true,
        lastSyncAt: true,
        connectedAt: true,
      },
    });
  }

  return NextResponse.json({ account });
}

// POST — regenerates API key
export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getPrisma();
  const newKey = generateApiKey();

  const account = await db.metricasAccount.upsert({
    where: { userId: user.userId },
    update: { apiKey: newKey, status: "pending" },
    create: { userId: user.userId, apiKey: newKey },
    select: { apiKey: true, status: true },
  });

  return NextResponse.json({ account });
}
