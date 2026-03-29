import { Badge } from "@/components/ui/badge";

import { LeadCaptureForm } from "@/components/marketing/lead-capture-form";
import { SectionHeading } from "@/components/marketing/section-heading";

export function CTASection({
  eyebrow = "Diagnostico",
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
      <div className="premium-outline premium-panel relative overflow-hidden rounded-[40px] p-6 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,_rgba(48,226,188,0.18),_transparent_0_28%),radial-gradient(circle_at_90%_0%,_rgba(143,182,255,0.14),_transparent_0_24%),radial-gradient(circle_at_50%_100%,_rgba(27,66,132,0.30),_transparent_0_36%)]" />
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14">
          <div className="relative">
            <Badge className="border border-jade-300/18 bg-jade-300/10 text-jade-300" tone="success">
              {eyebrow}
            </Badge>
            <SectionHeading className="mt-6" eyebrow="Proximo passo" title={title} description={description} theme="dark" />
            <div className="mt-8 grid gap-3 text-sm leading-7 text-mist-100/66">
              <p>Resposta inicial em ate 1 dia util.</p>
              <p>Leitura estrategica com foco em canal, oferta, conteudo, estrutura e oportunidade de crescimento.</p>
              <p>Sem formula generica. Conversa orientada ao estagio real do negocio.</p>
            </div>
          </div>
          <div className="relative rounded-[32px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(11,21,39,0.92),rgba(7,14,28,0.94))] p-6 backdrop-blur lg:p-8">
            <LeadCaptureForm defaultServiceInterest={defaultServiceInterest} theme="dark" />
          </div>
        </div>
      </div>
    </section>
  );
}
