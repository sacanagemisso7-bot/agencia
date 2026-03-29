import type { Metadata } from "next";
import { ArrowRightLeft, BrainCircuit, Clapperboard, Gauge, Search, Target } from "lucide-react";

import { CTASection } from "@/components/marketing/cta-section";
import { PageHero } from "@/components/marketing/page-hero";
import { ProcessSection } from "@/components/marketing/process-section";
import { StructuredData } from "@/components/marketing/structured-data";
import { buildPageMetadata, getAbsoluteUrl, getSiteName } from "@/lib/seo";
import { marketingProcess } from "@/lib/marketing-content";
import { getSiteContent } from "@/modules/site-content/repository";

export const metadata: Metadata = buildPageMetadata({
  title: "Metodologia | Ameni",
  description:
    "Conheca a metodologia premium da Ameni para integrar performance, conteudo, video, web e branding em uma operacao full-service.",
  path: "/metodologia",
});

const pillarIcons = [BrainCircuit, Target, Search, Clapperboard, Gauge, ArrowRightLeft];

export default async function MetodologiaPage() {
  const content = await getSiteContent();
  const methodology = content.methodology;

  return (
    <main>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Metodologia de growth full-service",
          provider: {
            "@type": "Organization",
            name: getSiteName(),
            url: getAbsoluteUrl("/"),
          },
          url: getAbsoluteUrl("/metodologia"),
          description:
            "Metodo premium para conectar trafego pago, organico, social media, video, web e branding em uma unica operacao comercial.",
        }}
        id="methodology-schema"
      />

      <PageHero
        aside={methodology.heroAside}
        description={methodology.heroDescription}
        eyebrow={methodology.heroEyebrow}
        title={methodology.heroTitle}
      />

      <section className="container-shell py-12 sm:py-16">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {methodology.pillars.map((pillar, index) => {
            const Icon = pillarIcons[index] ?? ArrowRightLeft;

            return (
            <article className="rounded-[30px] border border-white/10 bg-white/[0.04] p-7" key={pillar.title}>
              <div className="flex size-12 items-center justify-center rounded-2xl border border-white/12 bg-black/20 text-emerald-300">
                <Icon className="size-5" />
              </div>
              <h2 className="mt-5 font-display text-3xl text-white">{pillar.title}</h2>
              <p className="mt-4 text-sm leading-7 text-white/64">{pillar.description}</p>
            </article>
            );
          })}
        </div>
      </section>

      <ProcessSection
        description={methodology.processDescription}
        steps={marketingProcess}
        title={methodology.processTitle}
      />

      <section className="container-shell py-12 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[34px] border border-white/10 bg-gradient-to-br from-white/[0.05] to-emerald-400/10 p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">{methodology.impactEyebrow}</p>
            <h2 className="mt-5 font-display text-4xl text-white">{methodology.impactTitle}</h2>
          </div>
          <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-8 text-sm leading-8 text-white/66">
            {methodology.impactBody.map((paragraph, index) => (
              <p className={index ? "mt-5" : undefined} key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        description={methodology.ctaDescription}
        title={methodology.ctaTitle}
      />
    </main>
  );
}

