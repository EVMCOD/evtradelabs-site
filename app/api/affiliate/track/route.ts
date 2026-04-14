import { NextResponse } from "next/server";
import { query } from "@/lib/d1";

// Track partner referral
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const partnerCode = searchParams.get("code");

    if (!partnerCode) {
      return NextResponse.json({ error: "Código requerido" }, { status: 400 });
    }

    // Verify partner exists
    const partner = await query(
      "SELECT * FROM Partner WHERE code = ? AND status = 'active' LIMIT 1",
      [partnerCode]
    );

    if (!partner.results[0]) {
      return NextResponse.json({ error: "Partner no válido" }, { status: 404 });
    }

    // Return partner info with affiliate link
    return NextResponse.json({
      valid: true,
      partner: {
        code: partner.results[0].code,
        name: partner.results[0].name,
        commission: partner.results[0].commission
      },
      affiliateLink: `https://evtradelabs.com?ref=${partnerCode}`
    });
  } catch (error) {
    console.error("Partner validate error:", error);
    return NextResponse.json({ error: "Error al validar partner" }, { status: 500 });
  }
}

// Store referral conversion
export async function POST(req: Request) {
  try {
    const { partnerCode, productSlug, saleAmount, saleId } = await req.json();

    if (!partnerCode || !saleId) {
      return NextResponse.json({ error: "Datos requeridos" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    // Check if already tracked
    const existing = await query(
      "SELECT id FROM Referral WHERE saleId = ? LIMIT 1",
      [saleId]
    );

    if (existing.results.length > 0) {
      return NextResponse.json({ message: "Ya registrado" });
    }

    // Get partner
    const partner = await query(
      "SELECT id FROM Partner WHERE code = ? LIMIT 1",
      [partnerCode]
    );

    if (!partner.results[0]) {
      return NextResponse.json({ error: "Partner no encontrado" }, { status: 404 });
    }

    // Calculate commission (default 20%)
    const commission = saleAmount * 0.20;

    await query(
      "INSERT INTO Referral (id, partnerId, productSlug, saleAmount, commission, saleId, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id, partner.results[0].id, productSlug, saleAmount, commission, saleId, "pending", now]
    );

    return NextResponse.json({ success: true, commission });
  } catch (error) {
    console.error("Referral track error:", error);
    return NextResponse.json({ error: "Error al guardar referral" }, { status: 500 });
  }
}