import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "evtradelabs-jwt-secret-change-in-production";

// Demo users - work without D1
const DEMO_USERS = [
  { email: "demo@evtl.io", password: "demo123", name: "Demo User" },
  { email: "test@evtl.io", password: "test123", name: "Test User" },
];

// Simple KV-style auth for Cloudflare Workers without D1
// Stores users in a simple Map (resets on worker restart - acceptable for demo)
const userStore = new Map<string, { password: string; name: string }>();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email y password requeridos" }, { status: 400 });
    }

    // Check demo users
    const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (demoUser) {
      const token = jwt.sign(
        { userId: "demo-" + Date.now(), email: demoUser.email, name: demoUser.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const response = NextResponse.json({ 
        success: true, 
        user: { id: "demo", email: demoUser.email, name: demoUser.name } 
      });

      response.cookies.set("auth_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    // Check in-memory store
    const stored = userStore.get(email);
    if (stored) {
      if (stored.password !== password) {
        return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
      }

      const token = jwt.sign(
        { userId: email, email: email, name: stored.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const response = NextResponse.json({ 
        success: true, 
        user: { id: email, email: email, name: stored.name } 
      });

      response.cookies.set("auth_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    // Register new user in memory store
    userStore.set(email, { password: password, name: email.split("@")[0] });

    const token = jwt.sign(
      { userId: email, email: email, name: email.split("@")[0] },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({ 
      success: true, 
      user: { id: email, email: email, name: email.split("@")[0] } 
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
