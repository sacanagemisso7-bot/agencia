export function createHealthPayload({
  service,
  status,
  checks,
}: {
  service: string;
  status: "ok" | "degraded";
  checks: Record<string, string>;
}) {
  return {
    service,
    status,
    checks,
    timestamp: new Date().toISOString(),
  };
}

