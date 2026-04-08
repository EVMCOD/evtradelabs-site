import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const order = await prisma.order.findUnique({
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
  } catch (err) {
    console.error("License lookup error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
