import Link from "next/link";

import type { CaseStudyRecord } from "@/lib/types";

export function CaseCard({ caseStudy }: { caseStudy: CaseStudyRecord }) {
  const metrics = Object.entries(caseStudy.metrics ?? {});

  return (
    <Link
      className="group premium-outline premium-panel block h-full overflow-hidden rounded-[34px] p-7 transition duration-500 hover:-translate-y-1"
      href={`/cases/${caseStudy.slug}`}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-jade-300">{caseStudy.niche}</p>
        <span className="rounded-full border border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.9),rgba(6,12,24,0.88))] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-mist-100/52">
          Case
        </span>
      </div>

      <h3 className="mt-5 max-w-xl font-display text-3xl tracking-[-0.05em] text-white sm:text-4xl">{caseStudy.title}</h3>

      <div className="mt-8 grid gap-4 text-sm leading-7 text-mist-100/66">
        <div className="rounded-[24px] border border-mist-100/8 bg-[linear-gradient(180deg,rgba(10,19,36,0.9),rgba(6,12,24,0.88))] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mist-100/40">Desafio</p>
          <p className="mt-3">{caseStudy.challenge}</p>
        </div>
        <div className="rounded-[24px] border border-mist-100/8 bg-[linear-gradient(180deg,rgba(10,19,36,0.9),rgba(6,12,24,0.88))] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mist-100/40">Solucao</p>
          <p className="mt-3">{caseStudy.solution}</p>
        </div>
        <div className="rounded-[24px] border border-jade-300/18 bg-[linear-gradient(135deg,rgba(16,31,56,0.96),rgba(13,47,67,0.72))] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-jade-300">Resultado</p>
          <p className="mt-3 text-white/82">{caseStudy.result}</p>
        </div>
      </div>

      {metrics.length ? (
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {metrics.map(([label, value]) => (
            <div className="rounded-[22px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(11,21,39,0.9),rgba(8,15,30,0.9))] p-4" key={label}>
              <p className="font-display text-3xl tracking-[-0.05em] text-white">{String(value)}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-mist-100/44">
                {label.replaceAll("_", " ")}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </Link>
  );
}
