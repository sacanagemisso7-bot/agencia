import { CaseCard } from "@/components/marketing/case-card";
import { SectionHeading } from "@/components/marketing/section-heading";
import type { CaseStudyRecord } from "@/lib/types";

export function CaseStudySection({ caseStudies }: { caseStudies: CaseStudyRecord[] }) {
  return (
    <section className="container-shell py-24 sm:py-28">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Resultados"
          title="Cases com leitura estrategica, contexto de negocio e impacto real."
          description="Apresentamos o problema, a mudanca estrutural e o efeito em demanda, autoridade e venda."
          theme="dark"
        />
        <div className="max-w-xl rounded-[30px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.92),rgba(6,12,24,0.9))] p-6 text-sm leading-8 text-mist-100/60">
          Crescimento saudavel nao nasce de uma unica acao. O que mostramos aqui e a combinacao entre posicionamento,
          execucao e disciplina operacional.
        </div>
      </div>

      <div className="mt-12 grid gap-6 xl:grid-cols-3">
        {caseStudies.map((caseStudy) => (
          <CaseCard caseStudy={caseStudy} key={caseStudy.id} />
        ))}
      </div>
    </section>
  );
}
