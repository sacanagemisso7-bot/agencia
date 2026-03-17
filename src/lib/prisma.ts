import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  process.env.DATABASE_URL &&
  (global.__prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    }));

if (process.env.NODE_ENV !== "production" && prisma) {
  global.__prisma = prisma;
}

export async function withFallback<T>(operation: () => Promise<T>, fallback: () => T | Promise<T>) {
  if (!prisma) {
    return fallback();
  }

  try {
    return await operation();
  } catch (error) {
    console.error("Using fallback data due to runtime issue:", error);
    return fallback();
  }
}

