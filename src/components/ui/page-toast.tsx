"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function PageToast({
  message,
  type = "success",
}: {
  message?: string | null;
  type?: "success" | "error";
}) {
  useEffect(() => {
    if (!message) {
      return;
    }

    if (type === "error") {
      toast.error(message);
      return;
    }

    toast.success(message);
  }, [message, type]);

  return null;
}
