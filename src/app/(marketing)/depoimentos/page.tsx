import type { Metadata } from "next";

import { CTASection } from "@/components/marketing/cta-section";
import { PageHero } from "@/components/marketing/page-hero";
import { TestimonialSection } from "@/components/marketing/testimonial-section";
import { getFeaturedTestimonials } from "@/lib/marketing-content";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/modules/site-content/repository";

export const metadata: Metadata = buildPageMetadata({
  title: "Depoimentos | Ameni",
  description:
    "Veja como clientes percebem a Ameni quando performance, conteudo e operacao se alinham com criterio premium.",
  path: "/depoimentos",
});

export default async function DepoimentosPage() {
  const content = await getSiteContent();
  const testimonials = getFeaturedTestimonials(content.testimonials);

  return (
    <main>
      <PageHero
        aside="Confianca se constroi quando estrategia, comunicacao e acompanhamento fazem sentido para o dia a dia do cliente."
        description="Relatos de clientes que buscavam mais clareza, mais consistencia de marca e mais resultado na operacao comercial."
        eyebrow="Depoimentos"
        title="O mercado percebe quando uma agencia pensa alem da campanha."
      />

      <TestimonialSection testimonials={testimonials} />

      <CTASection
        description="Se voce quer um parceiro que una crescimento, marca e execucao profissional, o proximo passo pode comecar por uma conversa."
        title="Quer sentir essa mesma seguranca na sua operacao?"
      />
    </main>
  );
}

