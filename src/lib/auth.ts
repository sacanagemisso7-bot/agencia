import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

import { demoAdminUser } from "@/lib/demo-data";
import { env } from "@/lib/env";
import type { UserSession } from "@/lib/types";

const cookieName = "agency-session";
const secret = new TextEncoder().encode(env.authSecret);

export async function createSessionCookie(user: UserSession) {
  const token = await new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function getSessionUser(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    return {
      id: payload.sub ?? demoAdminUser.id,
      name: String(payload.name ?? demoAdminUser.name),
      email: String(payload.email ?? demoAdminUser.email),
      role: (payload.role as UserSession["role"]) ?? demoAdminUser.role,
    };
  } catch {
    return null;
  }
}

