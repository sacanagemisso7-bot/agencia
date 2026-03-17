import { ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { ServiceRecord } from "@/lib/types";

export function ServiceCard({ service }: { service: ServiceRecord }) {
  return (
    <Card className="h-full p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">
        {service.featured ? "Oferta principal" : "Especialidade"}
      </p>
      <h3 className="mt-4 font-display text-2xl text-ink-950">{service.name}</h3>
      <p className="mt-3 text-sm leading-7 text-ink-950/68">{service.description}</p>
      <div className="mt-6 flex items-center justify-between border-t border-ink-950/8 pt-5 text-sm text-ink-950">
        <span>{service.benefit}</span>
        <ArrowUpRight className="size-4" />
      </div>
    </Card>
  );
}

