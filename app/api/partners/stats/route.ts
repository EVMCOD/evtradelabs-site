import { NextResponse } from "next/server";
import { query } from "@/lib/d1";

// Get partner dashboard stats
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Código requerido" }, { status: 400 });
    }

    // Get partner
    const partner = await query(
      "SELECT * FROM Partner WHERE code = ? LIMIT 1",
      [code]
    );

    if (!partner.results[0]) {
      return NextResponse.json({ error: "Partner no encontrado" }, { status: 404 });
    }

    // Get referrals
    const referrals = await query(
      "SELECT * FROM Referral WHERE partnerId = ? ORDER BY createdAt DESC",
      [partner.results[0].id]
    );

    // Calculate totals
    let totalSales = 0;
    let totalCommission = 0;
    const last30Days = referrals.results.filter((r: any) => {
      const created = new Date(r.createdAt);
      const now = new Date();
      const diff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 30;
    });

    last30Days.forEach((r: any) => {
      totalSales += r.saleAmount || 0;
      totalCommission += r.commission || 0;
    });

    return NextResponse.json({
      partner: partner.results[0],
      stats: {
        totalReferrals: referrals.results.length,
        totalSales,
        totalCommission,
        recentReferrals: referrals.results.slice(0, 10)
      }
    });
  } catch (error) {
    console.error("Partner dashboard error:", error);
    return NextResponse.json({ error: "Error al obtener dashboard" }, { status: 500 });
  }
}