import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ScrollRevealSection } from "@/components/marketing/scroll-reveal-section";
import { SectionHeading } from "@/components/marketing/section-heading";
import type { ProofAssetsContentRecord, CaseStudyRecord } from "@/lib/types";

export function ResultsShowcase({
  caseStudies,
  proofAssets,
}: {
  caseStudies: CaseStudyRecord[];
  proofAssets: ProofAssetsContentRecord;
}) {
  const [featuredCase, ...secondaryCases] = caseStudies;
  const featuredMetrics = Object.entries(featuredCase?.metrics ?? {});

  return (
    <section className="container-shell py-24 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
        <SectionHeading
          eyebrow="Proof of capability"
          title="Resultados, dashboards e sinais de marca apresentados com densidade executiva."
          description="Mesmo quando o projeto e criativo, a leitura final precisa soar segura, mensuravel e estrategicamente madura."
          theme="dark"
        />
        <div className="rounded-[30px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.92),rgba(6,12,24,0.9))] p-6 text-sm leading-8 text-mist-100/60">
          O caso ideal nao mostra so numeros. Mostra contexto, decisao, melhoria de percepcao e impacto comercial.
        </div>
      </div>

      <div className="mt-12 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        {featuredCase ? (
          <ScrollRevealSection variant="left">
            <Link className="premium-outline premium-panel group block overflow-hidden rounded-[38px] p-6 sm:p-8" href={`/cases/${featuredCase.slug}`}>
              <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.32em] text-jade-300/82">{featuredCase.niche}</p>
                  <h3 className="mt-5 font-display text-4xl leading-[0.95] tracking-[-0.05em] text-white sm:text-5xl">
                    {featuredCase.title}
                  </h3>
                  <p className="mt-6 text-sm leading-8 text-mist-100/58">{featuredCase.challenge}</p>
                  <div className="mt-6 rounded-[28px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.92),rgba(6,12,24,0.9))] p-5">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-mist-100/38">Strategic move</p>
                    <p className="mt-3 text-sm leading-8 text-mist-100/68">{featuredCase.solution}</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[30px] border border-jade-300/16 bg-[linear-gradient(135deg,rgba(16,31,56,0.98),rgba(12,50,72,0.76))] p-6">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-jade-300">Business impact</p>
                    <p className="mt-4 font-display text-3xl leading-[1.02] tracking-[-0.04em] text-white">{featuredCase.result}</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {featuredMetrics.map(([label, value]) => (
                      <div className="rounded-[22px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.9),rgba(6,12,24,0.88))] p-4" key={label}>
                        <p className="font-display text-3xl tracking-[-0.05em] text-white">{String(value)}</p>
                        <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-mist-100/40">{label.replaceAll("_", " ")}</p>
                      </div>
                    ))}
                  </div>

                  <div className="inline-flex items-center gap-2 text-sm font-medium text-jade-300 transition group-hover:text-white">
                    Ver leitura completa
                    <ArrowRight className="size-4" />
                  </div>
                </div>
              </div>
            </Link>
          </ScrollRevealSection>
        ) : null}

        <div className="grid gap-6">
          <ScrollRevealSection delay={120} variant="right">
            <div className="premium-outline premium-panel overflow-hidden rounded-[34px] p-6">
              <p className="text-[11px] uppercase tracking-[0.28em] text-mist-100/38">Live proof board</p>
              <h3 className="mt-4 font-display text-3xl tracking-[-0.05em] text-white">{proofAssets.mockupTitle}</h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {proofAssets.mockupMetrics.map((metric) => (
                  <div className="rounded-[22px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.9),rgba(6,12,24,0.88))] p-4" key={metric.label}>
                    <p className="font-display text-3xl tracking-[-0.05em] text-white">{metric.value}</p>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-mist-100/40">{metric.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-4">
                {proofAssets.mockupBars.map((bar) => (
                  <div key={bar.label}>
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-mist-100/40">
                      <span>{bar.label}</span>
                      <span>{bar.width}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/[0.06]">
                      <div className="h-2 rounded-full bg-gradient-to-r from-emerald-300 via-jade-400 to-mist-100" style={{ width: bar.width }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollRevealSection>

          <div className="grid gap-4 md:grid-cols-2">
            {secondaryCases.map((caseStudy, index) => (
              <ScrollRevealSection delay={220 + index * 80} key={caseStudy.id} variant="scale">
                <Link className="premium-outline premium-panel block rounded-[30px] p-5 transition duration-500 hover:-translate-y-1" href={`/cases/${caseStudy.slug}`}>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-jade-300/78">{caseStudy.niche}</p>
                  <h3 className="mt-4 font-display text-3xl tracking-[-0.05em] text-white">{caseStudy.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-mist-100/58">{caseStudy.result}</p>
                </Link>
              </ScrollRevealSection>
            ))}
          </div>

          <ScrollRevealSection delay={340} variant="soft">
            <div className="rounded-[30px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.92),rgba(6,12,24,0.9))] p-5">
              <p className="text-[11px] uppercase tracking-[0.28em] text-mist-100/36">Trusted by growth-driven brands</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {proofAssets.logos.map((logo) => (
                  <span className="rounded-full border border-mist-100/10 bg-[linear-gradient(180deg,rgba(11,21,39,0.92),rgba(7,14,28,0.94))] px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-mist-100/46" key={logo}>
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </ScrollRevealSection>
        </div>
      </div>
    </section>
  );
}
