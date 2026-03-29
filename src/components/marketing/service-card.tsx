import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import type { MarketingService } from "@/lib/marketing-content";
import { cn } from "@/lib/utils";

export function ServiceCard({
  service,
  featured = false,
}: {
  service: MarketingService;
  featured?: boolean;
}) {
  return (
    <Link
      className={cn(
        "group premium-outline premium-panel relative block h-full overflow-hidden rounded-[34px] p-7 transition duration-500 hover:-translate-y-1",
        featured
          ? "bg-[radial-gradient(circle_at_top,_rgba(48,226,188,0.16),_transparent_34%),linear-gradient(180deg,rgba(13,25,45,0.96),rgba(8,15,30,0.92))]"
          : "",
      )}
      href={`/${service.slug}`}
    >
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-jade-300/75 to-transparent opacity-70" />
      <div className="absolute right-0 top-0 size-36 rounded-full bg-jade-300/12 blur-[80px]" />
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-mist-100/42">
            {featured ? "Full-service core" : service.category}
          </p>
          <h3 className="mt-4 font-display text-3xl tracking-[-0.05em] text-white sm:text-4xl">{service.name}</h3>
        </div>
        <div className="flex size-14 items-center justify-center rounded-2xl border border-mist-100/10 bg-[linear-gradient(180deg,rgba(13,25,45,0.94),rgba(8,15,30,0.92))] text-jade-300">
          <service.icon className="size-6" />
        </div>
      </div>

      <p className="mt-5 max-w-xl text-base leading-8 text-mist-100/68">{service.description}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {service.proofPoints.map((proofPoint) => (
          <span
            className="rounded-full border border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.9),rgba(6,12,24,0.88))] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-mist-100/52"
            key={proofPoint}
          >
            {proofPoint}
          </span>
        ))}
      </div>

      <div className="mt-8 grid gap-3 border-t border-mist-100/10 pt-6">
        {service.outcomes.slice(0, 2).map((outcome) => (
          <div className="rounded-[22px] border border-mist-100/8 bg-[linear-gradient(180deg,rgba(10,19,36,0.9),rgba(6,12,24,0.88))] p-4 text-sm leading-7 text-white/76" key={outcome}>
            <CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-300" />
            <span className="ml-3 inline-block">{outcome}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between text-sm font-semibold text-white">
        <span className="max-w-[18rem] text-mist-100/70">{service.benefit}</span>
        <span className="flex items-center gap-2 text-jade-300 transition group-hover:text-mist-50">
          Ver detalhe
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}
