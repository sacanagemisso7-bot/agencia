import type { MarketingMetric } from "@/lib/marketing-content";

import { ScrollRevealSection } from "@/components/marketing/scroll-reveal-section";

export function FloatingMetrics({ metrics }: { metrics: MarketingMetric[] }) {
  return (
    <section className="container-shell relative z-20 pt-2 pb-14 sm:pt-4 sm:pb-20">
      <ScrollRevealSection variant="scale">
        <div className="premium-outline premium-panel overflow-hidden rounded-[34px] px-5 py-6 sm:px-8 sm:py-8">
          <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
            <div>
              <p className="eyebrow-line">Signal board</p>
              <h2 className="mt-5 max-w-lg font-display text-4xl leading-[0.95] tracking-[-0.05em] text-white sm:text-5xl">
                Mais do que entregar muito. Entregar com
                <span className="bg-[linear-gradient(135deg,#9AD8FF,#30E2BC)] bg-clip-text font-editorial text-[1.12em] italic text-transparent"> presenca</span>,
                velocidade e consistencia.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <div className="rounded-[24px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(11,21,39,0.92),rgba(8,15,30,0.9))] p-5" key={metric.label}>
                  <p className="font-display text-4xl tracking-[-0.05em] text-white">{metric.value}</p>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-mist-100/40">{metric.label}</p>
                  {metric.detail ? <p className="mt-4 text-sm leading-7 text-mist-100/56">{metric.detail}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollRevealSection>
    </section>
  );
}
