import { NextResponse } from "next/server";
import { query } from "@/lib/d1";

export async function POST(req: Request) {
  try {
    const { code, name, email } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Código requerido" }, { status: 400 });
    }

    // Check if code already exists
    const existing = await query(
      "SELECT id FROM Partner WHERE code = ? LIMIT 1",
      [code]
    );

    if (existing.results.length > 0) {
      return NextResponse.json({ error: "Código ya existe" }, { status: 400 });
    }

    // Create partner
    const id = crypto.randomUUID();
    await query(
      "INSERT INTO Partner (id, code, name, email, commission, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, code, name || code, email || null, 20.0, "active", new Date().toISOString()]
    );

    return NextResponse.json({ success: true, partner: { id, code } });
  } catch (error) {
    console.error("Partner create error:", error);
    return NextResponse.json({ error: "Error al crear partner" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (code) {
      const result = await query(
        "SELECT * FROM Partner WHERE code = ? LIMIT 1",
        [code]
      );
      return NextResponse.json({ partner: result.results[0] || null });
    }

    const result = await query("SELECT * FROM Partner ORDER BY createdAt DESC", []);
    return NextResponse.json({ partners: result.results });
  } catch (error) {
    console.error("Partner fetch error:", error);
    return NextResponse.json({ error: "Error al obtener partners" }, { status: 500 });
  }
}