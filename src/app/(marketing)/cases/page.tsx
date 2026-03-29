import type { Metadata } from "next";

import { CaseStudySection } from "@/components/marketing/case-study-section";
import { CTASection } from "@/components/marketing/cta-section";
import { PageHero } from "@/components/marketing/page-hero";
import { getFeaturedCaseStudies } from "@/lib/marketing-content";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/modules/site-content/repository";

export const metadata: Metadata = buildPageMetadata({
  title: "Cases | Ameni",
  description:
    "Estudos de caso com contexto, estrategia e impacto real em demanda, autoridade e conversao para marcas premium.",
  path: "/cases",
});

export default async function CasesPage() {
  const content = await getSiteContent();
  const caseStudies = getFeaturedCaseStudies(content.caseStudies);

  return (
    <main>
      <PageHero
        aside="Mesmo quando um numero chama atencao, olhamos para o que realmente mudou: canal, percepcao, qualidade da demanda e ritmo comercial."
        description="Cases com contexto, leitura estrategica e estrutura real de crescimento. Nada de numero solto sem explicar o que foi feito."
        eyebrow="Cases"
        title="Resultados que mostram como performance, conteudo e posicionamento se reforcam."
      />

      <CaseStudySection caseStudies={caseStudies} />

      <CTASection
        description="Podemos analisar seu cenario atual e desenhar um caminho de ganho em demanda, conversao e valor percebido."
        title="Quer construir um case consistente na proxima fase da sua marca?"
      />
    </main>
  );
}

