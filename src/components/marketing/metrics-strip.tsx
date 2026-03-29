import type { MarketingMetric } from "@/lib/marketing-content";

export function MetricsStrip({ metrics }: { metrics: MarketingMetric[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div
          className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
          key={metric.label}
        >
          <p className="font-display text-4xl text-white">{metric.value}</p>
          <p className="mt-3 text-sm font-medium uppercase tracking-[0.18em] text-white/62">{metric.label}</p>
          {metric.detail ? <p className="mt-3 text-sm leading-7 text-white/54">{metric.detail}</p> : null}
        </div>
      ))}
    </div>
  );
}
