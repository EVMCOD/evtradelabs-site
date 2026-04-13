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

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getPrisma();
    const licenses = await db.license.findMany({
      where: { customerEmail: user.email },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        key: true,
        productName: true,
        productSlug: true,
        status: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ licenses });
  } catch (err) {
    console.error("License list error:", err);
    return NextResponse.json({ licenses: [] });
  }
}
