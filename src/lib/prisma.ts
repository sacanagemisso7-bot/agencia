import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var __prismaFallbackWarnings: Set<string> | undefined;
}

const fallbackWarnings = global.__prismaFallbackWarnings ?? new Set<string>();

export const prisma =
  process.env.DATABASE_URL &&
  (global.__prisma ?? new PrismaClient());

if (process.env.NODE_ENV !== "production" && prisma) {
  global.__prisma = prisma;
}

if (process.env.NODE_ENV !== "production") {
  global.__prismaFallbackWarnings = fallbackWarnings;
}

function getFallbackFingerprint(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const connectionMatch = message.match(/Can't reach database server at `([^`]+)`/i);

  if (connectionMatch) {
    return `db-unreachable:${connectionMatch[1]}`;
  }

  return message.replace(/\s+/g, " ").trim().slice(0, 180);
}

function getFallbackLogMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const connectionMatch = message.match(/Can't reach database server at `([^`]+)`/i);

  if (connectionMatch) {
    return `Database offline at ${connectionMatch[1]}; using fallback data.`;
  }

  return `Using fallback data due to runtime issue: ${message}`;
}

export async function withFallback<T>(operation: () => Promise<T>, fallback: () => T | Promise<T>) {
  if (!prisma) {
    return fallback();
  }

  try {
    return await operation();
  } catch (error) {
    const fingerprint = getFallbackFingerprint(error);

    if (!fallbackWarnings.has(fingerprint)) {
      fallbackWarnings.add(fingerprint);
      console.warn(getFallbackLogMessage(error));
    }

    return fallback();
  }
}
