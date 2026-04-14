import { NextResponse } from "next/server";
import { verifyPassword, signJWT } from "@/lib/crypto";
import { query } from "@/lib/d1";

const JWT_SECRET = process.env.JWT_SECRET || "evtradelabs-jwt-secret-change-in-production";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email y password requeridos" }, { status: 400 });
    }

    const result = await query("SELECT * FROM User WHERE email = ? LIMIT 1", [email]);
    const user   = result.results[0];

    if (!user || !user.password) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const token = await signJWT({ userId: user.id, email: user.email }, JWT_SECRET);

    const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Error en el servidor", detail: error?.message }, { status: 500 });
  }
}
