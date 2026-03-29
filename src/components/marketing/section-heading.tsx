import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  theme = "dark",
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  theme?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <p
        className={cn(
          "eyebrow-line",
          theme === "dark" ? "text-white/46" : "text-ink-950/46",
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-5 text-wrap-balance font-display text-4xl leading-[0.96] tracking-[-0.04em] sm:text-5xl lg:text-6xl",
          theme === "dark" ? "spotlight-text drop-shadow-[0_12px_36px_rgba(8,18,38,0.34)]" : "text-ink-950",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-6 max-w-2xl text-base leading-8 sm:text-lg",
            theme === "dark" ? "text-mist-100/64" : "text-ink-950/70",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
