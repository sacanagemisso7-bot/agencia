import { Sparkles } from "lucide-react";

import { ScrollRevealSection } from "@/components/marketing/scroll-reveal-section";
import { SectionHeading } from "@/components/marketing/section-heading";
import { integratedPillars, webEcosystem } from "@/lib/marketing-content";

export function BrandNarrativeSection() {
  return (
    <section className="container-shell py-24 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
        <ScrollRevealSection variant="left">
          <SectionHeading
            eyebrow="Brand narrative system"
            title="Nao fazemos so anuncio. Construimos atencao, narrativa, base propria e valor percebido."
            description="A midia acelera. O organico sustenta. O social aproxima. O video captura atencao. O branding consolida a sensacao de valor."
            theme="dark"
          />
          <div className="mt-8 rounded-[30px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.92),rgba(6,12,24,0.9))] p-6 text-sm leading-8 text-mist-100/60">
            Quando esses vetores trabalham juntos, a marca deixa de parecer dependente de esforco pontual e passa a
            parecer estruturalmente forte.
          </div>
        </ScrollRevealSection>

        <div className="grid gap-5">
          <ScrollRevealSection variant="right">
            <div className="premium-outline premium-panel overflow-hidden rounded-[38px] p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-mist-100/38">Integrated brand physics</p>
                  <h3 className="mt-4 font-display text-4xl leading-[0.96] tracking-[-0.05em] text-white sm:text-5xl">
                    Crescimento premium nasce quando cada canal cumpre um papel claro na percepcao.
                  </h3>
                </div>
                <Sparkles className="hidden size-5 text-jade-300 sm:block" />
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {integratedPillars.map((pillar, index) => (
                  <div className="rounded-[26px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.9),rgba(6,12,24,0.88))] p-5" key={pillar.title}>
                    <div className="flex items-center justify-between gap-3">
                      <pillar.icon className="size-5 text-jade-300" />
                      <span className="text-[10px] uppercase tracking-[0.24em] text-mist-100/34">0{index + 1}</span>
                    </div>
                    <h4 className="mt-4 font-display text-2xl tracking-[-0.04em] text-white">{pillar.title}</h4>
                    <p className="mt-3 text-sm leading-7 text-mist-100/58">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollRevealSection>

          <div className="grid gap-4 md:grid-cols-2">
            {webEcosystem.map((item, index) => (
              <ScrollRevealSection delay={120 + index * 100} key={item.title} variant="scale">
                <div className="premium-outline premium-panel rounded-[30px] p-5">
                  <item.icon className="size-5 text-jade-300" />
                  <h4 className="mt-4 font-display text-2xl tracking-[-0.04em] text-white">{item.title}</h4>
                  <p className="mt-3 text-sm leading-7 text-mist-100/58">{item.description}</p>
                </div>
              </ScrollRevealSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
