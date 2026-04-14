import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { query } from "@/lib/d1";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { results: orders } = await query<any>(
      `SELECT id, productName, amount, currency, status, licenseKey, createdAt
       FROM "Order"
       WHERE customerEmail = ?
       ORDER BY createdAt DESC`,
      [user.email]
    );
    return NextResponse.json({ orders });
  } catch (err) {
    console.error("orders GET:", err);
    return NextResponse.json({ orders: [] });
  }
}
