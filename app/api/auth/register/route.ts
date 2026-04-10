import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../../../../lib/d1";

const JWT_SECRET = process.env.JWT_SECRET || "evtradelabs-jwt-secret-change-in-production";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email y password requeridos" }, { status: 400 });
    }

    // Check existing user
    const existing = await query(
      "SELECT id FROM User WHERE email = ? LIMIT 1",
      [email]
    );

    if (existing.results.length > 0) {
      return NextResponse.json({ error: "Email ya registrado" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const userId = crypto.randomUUID();
    const now = new Date().toISOString();

    await query(
      "INSERT INTO User (id, email, name, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, email, name || email.split("@")[0], hashedPassword, now, now]
    );

    // Create JWT
    const token = jwt.sign(
      { userId, email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({ 
      success: true, 
      user: { id: userId, email, name: name || email.split("@")[0] } 
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Error al registrar" }, { status: 500 });
  }
}
