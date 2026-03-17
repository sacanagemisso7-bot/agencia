import * as React from "react";

import { cn } from "@/lib/utils";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-11 w-full rounded-2xl border border-ink-950/10 bg-white px-4 text-sm text-ink-950 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10",
          className,
        )}
        {...props}
      />
    );
  },
);

Select.displayName = "Select";

