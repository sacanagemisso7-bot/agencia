"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export function Reveal({
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
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
        visible ? "translate-x-0 translate-y-0 scale-100 opacity-100 blur-0" : "",
        !visible && variant === "up" && "translate-y-10 opacity-0 blur-sm",
        !visible && variant === "soft" && "translate-y-6 opacity-0",
        !visible && variant === "scale" && "translate-y-4 scale-[0.97] opacity-0 blur-sm",
        !visible && variant === "left" && "-translate-x-10 opacity-0 blur-sm",
        !visible && variant === "right" && "translate-x-10 opacity-0 blur-sm",
        className,
      )}
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
