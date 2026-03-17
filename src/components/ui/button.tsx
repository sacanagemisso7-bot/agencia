import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "bg-ink-950 text-white hover:bg-ink-900",
        secondary: "bg-white text-ink-950 ring-1 ring-ink-950/10 hover:bg-sand-50",
        ghost: "bg-transparent text-ink-950 hover:bg-ink-950/5",
        accent: "bg-emerald-500 text-white hover:bg-emerald-400",
      },
      size: {
        md: "h-11 px-5",
        lg: "h-12 px-6 text-base",
        sm: "h-9 px-4 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);

Button.displayName = "Button";

