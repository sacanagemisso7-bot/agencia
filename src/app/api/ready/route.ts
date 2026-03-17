import { NextResponse } from "next/server";

import { createHealthPayload } from "@/lib/observability";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    if (prisma) {
      await prisma.$queryRaw`SELECT 1`;
    }

    return NextResponse.json(
      createHealthPayload({
        service: "agencia-premium-platform",
        status: "ok",
        checks: {
          app: "up",
          database: prisma ? "reachable" : "demo-mode",
        },
      }),
    );
  } catch {
    return NextResponse.json(
      createHealthPayload({
        service: "agencia-premium-platform",
        status: "degraded",
        checks: {
          app: "up",
          database: "unreachable",
        },
      }),
      { status: 503 },
    );
  }
}

