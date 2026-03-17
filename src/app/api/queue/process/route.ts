import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { logOperationalEvent } from "@/lib/logger";
import { processQueuedMessages } from "@/modules/messages/queue";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token || token !== env.queueSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await processQueuedMessages();
  await logOperationalEvent({
    level: "info",
    event: "queue.processed",
    message: "Fila de mensagens processada via endpoint.",
    metadata: result,
  });
  return NextResponse.json(result);
}
