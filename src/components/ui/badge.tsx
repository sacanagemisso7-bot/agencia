import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
  {
    variants: {
      tone: {
        neutral: "bg-ink-950/6 text-ink-950",
        success: "bg-emerald-500/12 text-emerald-500",
        warning: "bg-amber-400/18 text-ink-950",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

type BadgeProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ tone }), className)} {...props} />;
}
