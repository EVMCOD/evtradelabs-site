import { NextResponse } from "next/server";
import { query } from "@/lib/d1";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const { results: orders } = await query<any>(
      `SELECT id, status, licenseKey FROM "Order" WHERE stripeSessionId = ? LIMIT 1`,
      [sessionId]
    );

    if (orders.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = orders[0];

    const { results: licenses } = await query<any>(
      `SELECT id, key, productSlug, productName, status FROM License WHERE orderId = ?`,
      [order.id]
    );

    return NextResponse.json({
      orderId: order.id,
      status: order.status,
      licenseKey: order.licenseKey,
      licenses,
    });
  } catch (err) {
    console.error("license GET:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
