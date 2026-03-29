import type { MarketingProcessStep } from "@/lib/marketing-content";

import { ScrollRevealSection } from "@/components/marketing/scroll-reveal-section";
import { SectionHeading } from "@/components/marketing/section-heading";
import { cn } from "@/lib/utils";

export function ProcessExperience({ steps }: { steps: MarketingProcessStep[] }) {
  return (
    <section className="container-shell py-24 sm:py-28">
      <div className="grid gap-10 xl:grid-cols-[0.78fr_1.22fr]">
        <ScrollRevealSection className="xl:sticky xl:top-28 xl:self-start" variant="left">
          <SectionHeading
            eyebrow="Process direction"
            title="Nosso processo nao e uma timeline decorativa. E uma arquitetura de decisao."
            description="Cada etapa existe para conectar diagnostico, narrativa, execucao e otimizacao sem deixar a operacao parecer fragmentada."
            theme="dark"
          />
          <div className="mt-8 rounded-[30px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.92),rgba(6,12,24,0.9))] p-6 text-sm leading-8 text-mist-100/60">
            O projeto comeca com leitura estrategica e termina com presenca mais forte, operacao mais clara e
            capacidade real de escala.
          </div>
        </ScrollRevealSection>

        <div className="relative pl-0 xl:pl-12">
          <div className="pointer-events-none absolute bottom-10 left-4 top-6 hidden w-px bg-gradient-to-b from-white/0 via-mist-100/18 to-white/0 xl:block" />
          <div className="grid gap-5">
            {steps.map((step, index) => (
              <ScrollRevealSection
                className={cn(index % 2 === 0 ? "xl:mr-16" : "xl:ml-16")}
                delay={index * 90}
                key={`${step.step}-${step.title}`}
                variant={index % 2 === 0 ? "left" : "right"}
              >
                <article className="premium-outline premium-panel relative overflow-hidden rounded-[34px] p-6 sm:p-8">
                  <div className="absolute -right-6 top-1/2 -translate-y-1/2 font-display text-[7rem] leading-none tracking-[-0.08em] text-mist-100/[0.05] sm:text-[9rem]">
                    {step.step}
                  </div>
                  <div className="relative max-w-2xl">
                    <p className="text-[11px] uppercase tracking-[0.32em] text-jade-300/80">{step.step}</p>
                    <h3 className="mt-4 font-display text-3xl tracking-[-0.05em] text-white sm:text-4xl">{step.title}</h3>
                    <p className="mt-4 text-base leading-8 text-mist-100/62">{step.description}</p>
                  </div>
                </article>
              </ScrollRevealSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
