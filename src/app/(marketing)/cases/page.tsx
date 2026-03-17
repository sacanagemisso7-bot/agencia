import { CaseCard } from "@/components/marketing/case-card";
import { SectionHeading } from "@/components/marketing/section-heading";
import { getSiteContent } from "@/modules/site-content/repository";

export default async function CasesPage() {
  const content = await getSiteContent();

  return (
    <main className="container-shell py-20">
      <SectionHeading
        eyebrow="Resultados"
        title="Cases com contexto, estrategia e impacto em pipeline."
        description="Cada estudo de caso mostra o problema, a resposta tatica e o efeito no negocio."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {content.caseStudies.map((caseStudy) => (
          <CaseCard caseStudy={caseStudy} key={caseStudy.id} />
        ))}
      </div>
    </main>
  );
}

