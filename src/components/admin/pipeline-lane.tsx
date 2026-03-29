import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

export function PipelineLane({
  title,
  helper,
  count,
  children,
}: {
  title: string;
  helper: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-500">{helper}</p>
          <h3 className="mt-2 font-display text-2xl text-ink-950">{title}</h3>
        </div>
        <span className="rounded-full bg-ink-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
          {count}
        </span>
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </Card>
  );
}
