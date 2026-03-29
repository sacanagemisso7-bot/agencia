import { getBrandName } from "@/lib/brand";
import { cn } from "@/lib/utils";

const AMENI_NAVY = "#1B315B";
const AMENI_TEAL = "#28C7A5";

type AmeniMarkProps = {
  className?: string;
  navy?: string;
  teal?: string;
};

type AmeniLogoProps = {
  className?: string;
  name?: string;
  theme?: "light" | "dark";
};

export function AmeniMark({
  className,
  navy = AMENI_NAVY,
  teal = AMENI_TEAL,
}: AmeniMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 66 58"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 47H24L37 11H25L12 47Z" fill={teal} />
      <path d="M40 11H52L65 47H53L40 11Z" fill={navy} />
      <path d="M18 37H32L39 25H52L48 33H36L29 45H14L18 37Z" fill={navy} />
      <path d="M29 41H47L52 51H24L29 41Z" fill={teal} />
    </svg>
  );
}

export function AmeniLogo({
  className,
  name = getBrandName(),
  theme = "light",
}: AmeniLogoProps) {
  const dark = theme === "dark";
  const navy = dark ? "#8FB6FF" : AMENI_NAVY;
  const teal = dark ? "#30E2BC" : AMENI_TEAL;

  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      <div
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-[20px] border p-2.5 shadow-[0_18px_40px_rgba(4,10,22,0.18)]",
          dark
            ? "border-white/10 bg-[linear-gradient(180deg,rgba(17,31,59,0.94),rgba(7,14,28,0.9))]"
            : "border-ink-950/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(232,240,250,0.94))]",
        )}
      >
        <AmeniMark className="h-11 w-auto" navy={navy} teal={teal} />
      </div>
      <div className="min-w-0">
        <p
          className={cn(
            "truncate font-display text-2xl leading-none tracking-[-0.05em] sm:text-[2rem]",
            dark
              ? "bg-[linear-gradient(180deg,rgba(247,251,255,0.98),rgba(143,182,255,0.88))] bg-clip-text text-transparent"
              : "text-[#1B315B]",
          )}
        >
          {name}
        </p>
      </div>
    </div>
  );
}
