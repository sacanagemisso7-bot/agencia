import { env } from "@/lib/env";

type LogLevel = "info" | "warn" | "error";

type OperationalLog = {
  level: LogLevel;
  event: string;
  message: string;
  metadata?: Record<string, unknown>;
};

export async function logOperationalEvent(log: OperationalLog) {
  const payload = {
    ...log,
    appEnv: env.appEnv,
    timestamp: new Date().toISOString(),
  };

  if (log.level === "error") {
    console.error(payload);
  } else if (log.level === "warn") {
    console.warn(payload);
  } else {
    console.log(payload);
  }

  if (!env.observabilityWebhookUrl || (log.level !== "warn" && log.level !== "error")) {
    return;
  }

  try {
    await fetch(env.observabilityWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Failed to send observability webhook", error);
  }
}

