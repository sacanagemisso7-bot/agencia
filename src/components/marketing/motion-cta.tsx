import { Badge } from "@/components/ui/badge";

import { LeadCaptureForm } from "@/components/marketing/lead-capture-form";
import { ScrollRevealSection } from "@/components/marketing/scroll-reveal-section";
import { SectionHeading } from "@/components/marketing/section-heading";

export function MotionCTA({
  eyebrow = "Strategic briefing",
  title,
  description,
  defaultServiceInterest,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  defaultServiceInterest?: string;
}) {
  return (
    <section className="container-shell py-24 sm:py-28">
      <ScrollRevealSection variant="scale">
        <div className="premium-outline premium-panel relative overflow-hidden rounded-[42px] p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,_rgba(48,226,188,0.18),_transparent_0_28%),radial-gradient(circle_at_90%_0%,_rgba(143,182,255,0.14),_transparent_0_24%),radial-gradient(circle_at_50%_100%,_rgba(27,66,132,0.28),_transparent_0_36%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mist-100/70 to-transparent" />

          <div className="relative grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:gap-14">
            <div>
              <Badge className="border border-jade-300/18 bg-jade-300/10 text-jade-300" tone="success">
                {eyebrow}
              </Badge>
              <SectionHeading
                className="mt-6"
                eyebrow="Final call"
                title={title}
                description={description}
                theme="dark"
              />
              <div className="mt-8 grid gap-3 text-sm leading-7 text-mist-100/66">
                <p>Diagnostico objetivo, leitura de gargalos e proposta de direcionamento inicial.</p>
                <p>Resposta premium, sem discurso generico e sem formula pronta.</p>
                <p>Se fizer sentido, a proxima etapa ja sai com agenda, escopo e rota de crescimento.</p>
              </div>
            </div>

            <div className="rounded-[32px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(11,21,39,0.92),rgba(7,14,28,0.94))] p-5 backdrop-blur-xl sm:p-7">
              <LeadCaptureForm defaultServiceInterest={defaultServiceInterest} theme="dark" />
            </div>
          </div>
        </div>
      </ScrollRevealSection>
    </section>
  );
}
