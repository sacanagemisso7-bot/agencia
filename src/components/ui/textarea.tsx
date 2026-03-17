import * as React from "react";

import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[120px] w-full rounded-3xl border border-ink-950/10 bg-white px-4 py-3 text-sm text-ink-950 shadow-sm outline-none transition placeholder:text-ink-950/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

