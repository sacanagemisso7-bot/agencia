"use client";

import { useEffect } from "react";

async function sendClientError(payload: Record<string, unknown>) {
  try {
    await fetch("/api/observability/client-error", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Swallow client-side observability failures.
  }
}

export function ClientObservability({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    function handleError(event: ErrorEvent) {
      void sendClientError({
        type: "window.error",
        message: event.message,
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    }

    function handleUnhandledRejection(event: PromiseRejectionEvent) {
      void sendClientError({
        type: "window.unhandledrejection",
        message:
          event.reason instanceof Error
            ? event.reason.message
            : typeof event.reason === "string"
              ? event.reason
              : "Unhandled promise rejection",
      });
    }

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, [enabled]);

  return null;
}
