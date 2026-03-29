import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { logOperationalEvent } from "@/lib/logger";
import { runAutomationCycle } from "@/modules/automation/runner";

export const runtime = "nodejs";

function isAuthorized(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  const tokenFromHeader = request.headers.get("x-queue-secret");
  const tokenFromQuery = new URL(request.url).searchParams.get("token");
  const validTokens = [env.queueSecret, env.cronSecret].filter(Boolean);

  return validTokens.includes(token ?? "") || validTokens.includes(tokenFromHeader ?? "") || validTokens.includes(tokenFromQuery ?? "");
}

async function handle(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runAutomationCycle();
  await logOperationalEvent({
    level: "info",
    event: "queue.processed",
    message: "Ciclo de automacoes processado via endpoint.",
    metadata: result,
  });
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  return handle(request);
}

export async function GET(request: Request) {
  return handle(request);
}
