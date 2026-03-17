import { Card } from "@/components/ui/card";
import type { CaseStudyRecord } from "@/lib/types";

export function CaseCard({ caseStudy }: { caseStudy: CaseStudyRecord }) {
  return (
    <Card className="p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">{caseStudy.niche}</p>
      <h3 className="mt-3 font-display text-2xl text-ink-950">{caseStudy.title}</h3>
      <div className="mt-6 space-y-4 text-sm leading-7 text-ink-950/72">
        <p>
          <strong>Desafio:</strong> {caseStudy.challenge}
        </p>
        <p>
          <strong>Solucao:</strong> {caseStudy.solution}
        </p>
        <p>
          <strong>Resultado:</strong> {caseStudy.result}
        </p>
      </div>
    </Card>
  );
}

