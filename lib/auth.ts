import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "evtradelabs-jwt-secret-change-in-production";

export interface AuthUser {
  userId: string;
  email: string;
}

export function getAuthUser(req: NextRequest): AuthUser | null {
  const token = req.cookies.get("auth_token");
  if (!token) return null;

  try {
    const decoded = jwt.verify(token.value, JWT_SECRET) as AuthUser;
    return decoded;
  } catch {
    return null;
  }
}
