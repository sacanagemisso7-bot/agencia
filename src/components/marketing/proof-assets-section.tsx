import Link from "next/link";
import { ArrowUpRight, BarChart3, Film, LayoutPanelTop, Sparkles } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import type { CaseStudyRecord, ProofAssetsContentRecord } from "@/lib/types";

export function ProofAssetsSection({
  caseStudies,
  content,
}: {
  caseStudies: CaseStudyRecord[];
  content: ProofAssetsContentRecord;
}) {
  const spotlightCases = caseStudies.slice(0, 2);

  return (
    <section className="container-shell py-24 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
          theme="dark"
        />

        <div className="grid gap-4">
          <div className="premium-outline premium-panel rounded-[32px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">Marcas e operacoes</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {content.logos.map((logo) => (
                <span
                  className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/56"
                  key={logo}
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {content.features.map((item, index) => {
              const Icon = [BarChart3, Film, LayoutPanelTop][index] ?? Sparkles;

              return (
                <article className="premium-outline premium-panel rounded-[28px] p-5" key={item.title}>
                  <Icon className="size-5 text-emerald-300" />
                  <h3 className="mt-4 font-display text-2xl tracking-[-0.04em] text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/60">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="premium-outline premium-panel overflow-hidden rounded-[36px] bg-gradient-to-br from-[#0c1525] to-[#0a1019] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">{content.mockupEyebrow}</p>
              <h3 className="mt-3 font-display text-4xl tracking-[-0.05em] text-white">{content.mockupTitle}</h3>
            </div>
            <Sparkles className="size-5 text-amber-300" />
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-white/42">Performance snapshot</p>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {content.mockupMetrics.map((metric) => (
                  <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4" key={metric.label}>
                    <p className="font-display text-3xl text-white">{metric.value}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/42">{metric.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-3">
                {content.mockupBars.map((bar) => (
                  <div key={bar.label}>
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-white/42">
                      <span>{bar.label}</span>
                      <span>{bar.width}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/[0.06]">
                      <div className="h-2 rounded-full bg-gradient-to-r from-emerald-300 via-emerald-400 to-amber-300" style={{ width: bar.width }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/42">Criativo</p>
                <div className="mt-5 rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(48,178,124,0.22),_transparent_38%),#0b121d] p-5">
                  <p className="text-sm uppercase tracking-[0.16em] text-emerald-300">{content.creativeEyebrow}</p>
                  <p className="mt-4 font-display text-3xl text-white">{content.creativeTitle}</p>
                  <p className="mt-4 text-sm leading-7 text-white/60">{content.creativeDescription}</p>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/42">Landing page</p>
                <div className="mt-5 rounded-[24px] border border-white/10 bg-black/20 p-5">
                  <div className="h-3 w-16 rounded-full bg-white/12" />
                  <div className="mt-4 h-3 w-40 rounded-full bg-white/10" />
                  <div className="mt-3 h-3 w-28 rounded-full bg-white/10" />
                  <div className="mt-6 rounded-[18px] border border-emerald-300/18 bg-emerald-300/10 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-emerald-300">{content.landingEyebrow}</p>
                    <p className="mt-3 text-sm leading-6 text-white/68">{content.landingHighlight}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {spotlightCases.map((caseStudy) => (
            <Link
              className="premium-outline premium-panel rounded-[32px] p-6 transition duration-500 hover:-translate-y-1"
              href={`/cases/${caseStudy.slug}`}
              key={caseStudy.id}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">{caseStudy.niche}</p>
              <h3 className="mt-4 font-display text-3xl tracking-[-0.05em] text-white">{caseStudy.title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/60">{caseStudy.result}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm text-emerald-300">
                Ver leitura completa
                <ArrowUpRight className="size-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
