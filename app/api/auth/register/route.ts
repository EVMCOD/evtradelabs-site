import { NextResponse } from "next/server";
import { hashPassword, signJWT } from "@/lib/crypto";
import { query } from "@/lib/d1";

const JWT_SECRET = process.env.JWT_SECRET || "evtradelabs-jwt-secret-change-in-production";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email y password requeridos" }, { status: 400 });
    }

    const existing = await query("SELECT id FROM User WHERE email = ? LIMIT 1", [email]);
    if (existing.results.length > 0) {
      return NextResponse.json({ error: "Email ya registrado" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const userId = crypto.randomUUID();
    const now    = new Date().toISOString();
    const displayName = name || email.split("@")[0];

    await query(
      "INSERT INTO User (id, email, name, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, email, displayName, hashedPassword, now, now]
    );

    const token = await signJWT({ userId, email }, JWT_SECRET);

    const response = NextResponse.json({ success: true, user: { id: userId, email, name: displayName } });
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Error al registrar", detail: error?.message }, { status: 500 });
  }
}
