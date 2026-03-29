import { NextResponse } from "next/server";

import { logOperationalEvent } from "@/lib/logger";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  await logOperationalEvent({
    level: "error",
    event: "client.error",
    message: String(payload.message ?? "Client error captured."),
    metadata: payload,
  });

  return NextResponse.json({ ok: true });
}
