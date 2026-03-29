import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { SectorPageViewModel } from "@/lib/sector-content";

export function SectorCard({ sector }: { sector: SectorPageViewModel }) {
  return (
    <Link
      className="group premium-outline premium-panel block h-full overflow-hidden rounded-[34px] p-7 transition duration-500 hover:-translate-y-1"
      href={`/setores/${sector.slug}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-jade-300">{sector.shortLabel}</p>
          <h3 className="mt-4 font-display text-3xl tracking-[-0.05em] text-white sm:text-4xl">{sector.name}</h3>
        </div>
        <div className="rounded-full border border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.9),rgba(6,12,24,0.88))] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-mist-100/50">
          Setor
        </div>
      </div>

      <p className="mt-5 text-sm leading-7 text-mist-100/64">{sector.summary}</p>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {sector.metrics.map((metric) => (
          <div className="rounded-[22px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.9),rgba(6,12,24,0.88))] p-4" key={metric.label}>
            <p className="font-display text-3xl tracking-[-0.05em] text-white">{metric.value}</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-mist-100/44">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        {sector.serviceMix.slice(0, 3).map((service) => (
          <span
            className="rounded-full border border-mist-100/10 bg-[linear-gradient(180deg,rgba(11,21,39,0.92),rgba(7,14,28,0.94))] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-mist-100/46"
            key={service.label}
          >
            {service.label}
          </span>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-2 text-sm font-medium text-white transition group-hover:text-jade-300">
        Ver pagina do setor
        <ArrowRight className="size-4" />
      </div>
    </Link>
  );
}
