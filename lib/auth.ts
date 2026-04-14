import { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/crypto";

const JWT_SECRET = process.env.JWT_SECRET || "evtradelabs-jwt-secret-change-in-production";

export interface AuthUser {
  userId: string;
  email: string;
}

export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  const token = req.cookies.get("auth_token");
  if (!token) return null;
  return verifyJWT<AuthUser>(token.value, JWT_SECRET);
}
