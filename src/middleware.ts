import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

import { isAdminOnlyAdminPath } from "@/lib/rbac";

const cookieName = "agency-session";
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "dev-secret-change-me",
);

function applySecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/portal")) {
    const token = request.cookies.get(cookieName)?.value;

    if (!token) {
      return applySecurityHeaders(NextResponse.redirect(new URL("/login", request.url)));
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      const role = String(payload.role ?? "");

      if (pathname.startsWith("/admin") && role === "CLIENT") {
        return applySecurityHeaders(NextResponse.redirect(new URL("/portal", request.url)));
      }

      if (pathname.startsWith("/admin") && isAdminOnlyAdminPath(pathname) && role !== "ADMIN") {
        return applySecurityHeaders(NextResponse.redirect(new URL("/admin?error=forbidden", request.url)));
      }

      if (pathname.startsWith("/portal") && role !== "CLIENT") {
        return applySecurityHeaders(NextResponse.redirect(new URL("/admin", request.url)));
      }
    } catch {
      return applySecurityHeaders(NextResponse.redirect(new URL("/login", request.url)));
    }
  }

  if (pathname === "/login") {
    const token = request.cookies.get(cookieName)?.value;

    if (token) {
      try {
        const { payload } = await jwtVerify(token, secret);
        const role = String(payload.role ?? "");

        return applySecurityHeaders(
          NextResponse.redirect(new URL(role === "CLIENT" ? "/portal" : "/admin", request.url)),
        );
      } catch {
        return applySecurityHeaders(NextResponse.next());
      }
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*", "/login"],
};
