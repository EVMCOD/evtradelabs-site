import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "evtradelabs-jwt-secret-change-in-production";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token");
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isAccount = req.nextUrl.pathname.startsWith("/account");
  const isProtected = isDashboard || isAccount;

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isProtected && token) {
    try {
      jwt.verify(token.value, JWT_SECRET);
      // Valid token - allow
    } catch {
      // Invalid token - redirect to login
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.set("auth_token", "", { maxAge: 0 });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*"],
};
