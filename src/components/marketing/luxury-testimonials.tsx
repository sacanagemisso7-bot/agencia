import type { TestimonialRecord } from "@/lib/types";

import { ScrollRevealSection } from "@/components/marketing/scroll-reveal-section";
import { SectionHeading } from "@/components/marketing/section-heading";
import { cn } from "@/lib/utils";

export function LuxuryTestimonials({ testimonials }: { testimonials: TestimonialRecord[] }) {
  const [lead, ...rest] = testimonials;

  return (
    <section className="container-shell py-24 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-[0.74fr_1.26fr]">
        <ScrollRevealSection variant="left">
          <SectionHeading
            eyebrow="Client confidence"
            title="Quando o projeto fica certo, a percepcao muda por dentro e por fora."
            description="Os relatos mais fortes nao falam so de campanha. Falam de clareza, valor percebido, confianca e ritmo de execucao."
            theme="dark"
          />
        </ScrollRevealSection>

        <div className="grid gap-5">
          {lead ? (
            <ScrollRevealSection variant="right">
              <article className="premium-outline premium-panel overflow-hidden rounded-[38px] p-7 sm:p-9">
                <p className="bg-[linear-gradient(135deg,#9AD8FF,#30E2BC)] bg-clip-text font-editorial text-[2.8rem] italic leading-[0.9] text-transparent sm:text-[3.8rem]">&ldquo;</p>
                <p className="max-w-4xl font-display text-3xl leading-[1.12] tracking-[-0.04em] text-white sm:text-4xl">
                  {lead.quote}
                </p>
                <div className="mt-8 border-t border-mist-100/10 pt-5">
                  <p className="text-base font-semibold text-white">{lead.authorName}</p>
                  <p className="mt-1 text-sm text-mist-100/52">
                    {lead.role} | {lead.company}
                  </p>
                </div>
              </article>
            </ScrollRevealSection>
          ) : null}

          <div className="grid gap-4 md:grid-cols-3">
            {rest.map((testimonial, index) => (
              <ScrollRevealSection delay={120 + index * 80} key={testimonial.id} variant="scale">
                <article
                  className={cn(
                    "premium-outline premium-panel flex h-full flex-col rounded-[30px] p-5",
                    index === 1 ? "md:-translate-y-4" : "",
                  )}
                >
                  <p className="text-lg leading-8 text-white/78">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="mt-auto border-t border-mist-100/10 pt-5">
                    <p className="font-semibold text-white">{testimonial.authorName}</p>
                    <p className="mt-1 text-sm text-mist-100/52">
                      {testimonial.role} | {testimonial.company}
                    </p>
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
