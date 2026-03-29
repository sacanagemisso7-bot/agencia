import type { ReactNode } from "react";

import { Reveal } from "@/components/marketing/reveal";
import { cn } from "@/lib/utils";

export function ScrollRevealSection({
  children,
  className,
  delay = 0,
  variant = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "up" | "soft" | "scale" | "left" | "right";
}) {
  return (
    <Reveal className={cn("relative", className)} delay={delay} variant={variant}>
      {children}
    </Reveal>
  );
}
