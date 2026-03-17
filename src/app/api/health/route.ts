import { NextResponse } from "next/server";

import { createHealthPayload } from "@/lib/observability";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    createHealthPayload({
      service: "agencia-premium-platform",
      status: "ok",
      checks: {
        app: "up",
      },
    }),
  );
}

