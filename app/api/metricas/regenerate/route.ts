import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { query } from "@/lib/d1";

function generateApiKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.getRandomValues(new Uint8Array(28));
  return "evm_" + Array.from(bytes).map(b => chars[b % chars.length]).join("");
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const newKey = generateApiKey();
    const now    = new Date().toISOString();

    const { results } = await query<any>(
      `UPDATE MetricasAccount SET apiKey = ?, updatedAt = ? WHERE userId = ? RETURNING apiKey`,
      [newKey, now, user.userId]
    );

    if (results.length === 0) {
      console.warn("metricas/regenerate: no account for userId", user.userId);
      return NextResponse.json({ error: "No account found" }, { status: 404 });
    }

    console.log("metricas/regenerate: key rotated for userId", user.userId);
    return NextResponse.json({ apiKey: results[0].apiKey });
  } catch (err) {
    console.error("metricas/regenerate POST:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
