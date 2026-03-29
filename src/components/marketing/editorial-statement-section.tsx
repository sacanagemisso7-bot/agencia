import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { ScrollRevealSection } from "@/components/marketing/scroll-reveal-section";
import type { SectorPageViewModel } from "@/lib/sector-content";
import { cn } from "@/lib/utils";

export function EditorialStatementSection({
  sectors,
}: {
  sectors: SectorPageViewModel[];
}) {
  return (
    <section className="container-shell py-24 sm:py-28">
      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <ScrollRevealSection className="premium-outline premium-panel overflow-hidden rounded-[40px] p-8 sm:p-10" variant="left">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mist-100/70 to-transparent" />
          <p className="eyebrow-line">Editorial positioning</p>
          <div className="mt-10 grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-end">
            <div>
              <p className="bg-[linear-gradient(135deg,#9AD8FF,#30E2BC)] bg-clip-text font-editorial text-[3.6rem] italic leading-[0.88] tracking-[-0.05em] text-transparent sm:text-[5rem]">
                A agencia nao entra so para gerar demanda.
              </p>
              <p className="mt-5 max-w-xl font-display text-4xl leading-[0.95] tracking-[-0.05em] text-white sm:text-5xl">
                Ela entra para desenhar a percepcao que sustenta essa demanda.
              </p>
            </div>

            <div className="rounded-[30px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.92),rgba(6,12,24,0.9))] p-6">
              <p className="text-sm leading-8 text-mist-100/60">
                Por isso a operacao combina aquisicao, conteudo, interface, direcao de marca e cadencia comercial. O
                objetivo nao e parecer movimentado. E parecer inevitavel.
              </p>
              <Link
                className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-jade-300 transition hover:text-white"
                href="/metodologia"
              >
                Ver metodologia completa
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </ScrollRevealSection>

        <div className="grid gap-4">
          {sectors.map((sector, index) => (
            <ScrollRevealSection
              className={cn(
                "premium-outline premium-panel overflow-hidden rounded-[32px] p-6",
                index === 1 ? "xl:ml-10" : "",
                index === 2 ? "xl:mr-10" : "",
              )}
              delay={120 + index * 100}
              key={sector.slug}
              variant="right"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-jade-300/80">{sector.shortLabel}</p>
                  <h3 className="mt-4 font-display text-3xl tracking-[-0.05em] text-white">{sector.name}</h3>
                </div>
                <Sparkles className="mt-1 size-5 text-jade-300/80" />
              </div>
              <p className="mt-4 text-sm leading-7 text-mist-100/58">{sector.summary}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {sector.metrics.slice(0, 3).map((metric) => (
                  <div className="rounded-[20px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.9),rgba(6,12,24,0.88))] p-4" key={metric.label}>
                    <p className="font-display text-2xl tracking-[-0.04em] text-white">{metric.value}</p>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-mist-100/40">{metric.label}</p>
                  </div>
                ))}
              </div>
            </ScrollRevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}
