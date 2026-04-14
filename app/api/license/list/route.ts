import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { query } from "@/lib/d1";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { results: licenses } = await query<any>(
      `SELECT id, key, productName, productSlug, status, createdAt
       FROM License
       WHERE customerEmail = ?
       ORDER BY createdAt DESC`,
      [user.email]
    );
    return NextResponse.json({ licenses });
  } catch (err) {
    console.error("license/list GET:", err);
    return NextResponse.json({ licenses: [] });
  }
}
