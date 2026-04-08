import { NextResponse } from "next/server";

let prisma: any = null;

async function getPrisma() {
  if (!prisma) {
    const { PrismaClient } = await import("@prisma/client");
    prisma = new PrismaClient({
      log: ["error"],
    });
  }
  return prisma;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const db = await getPrisma();
    const order = await db.order.findUnique({
      where: { stripeSessionId: sessionId },
      include: { licenses: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      orderId: order.id,
      status: order.status,
      licenseKey: order.licenseKey,
      licenses: order.licenses,
    });
  } catch (err: any) {
    console.error("License lookup error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
