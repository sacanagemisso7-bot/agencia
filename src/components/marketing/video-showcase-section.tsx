import { Play, Sparkles } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { integratedPillars, presenceFramework } from "@/lib/marketing-content";

export function VideoShowcaseSection() {
  return (
    <section className="container-shell py-24 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-emerald-400/10 p-6 lg:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">Conteudo e video</p>
              <h3 className="mt-4 font-display text-4xl text-white">Presenca que gera lembranca, confianca e conversao.</h3>
            </div>
            <div className="hidden size-14 items-center justify-center rounded-2xl border border-white/12 bg-black/20 text-emerald-300 sm:flex">
              <Play className="size-6" />
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {integratedPillars.map((pillar) => (
              <div className="rounded-[24px] border border-white/10 bg-black/20 p-5" key={pillar.title}>
                <pillar.icon className="size-5 text-emerald-300" />
                <h4 className="mt-4 text-lg font-semibold text-white">{pillar.title}</h4>
                <p className="mt-3 text-sm leading-7 text-white/62">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionHeading
            eyebrow="Narrativa visual"
            title="A agencia nao faz so anuncio. Ela constroi percepcao, ativos e atencao."
            description="Enquanto o pago acelera, o organico, o social e o video sustentam relevancia, proximidade e valor percebido."
            theme="dark"
          />
          <div className="mt-8 grid gap-4">
            {presenceFramework.map((item) => (
              <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5" key={item.title}>
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-white/12 bg-black/20 text-amber-300">
                    <item.icon className="size-5" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                </div>
                <p className="mt-4 text-sm leading-7 text-white/64">{item.description}</p>
              </div>
            ))}
            <div className="rounded-[26px] border border-emerald-400/18 bg-emerald-400/8 p-5 text-sm leading-7 text-white/76">
              <div className="flex items-center gap-3 text-emerald-300">
                <Sparkles className="size-5" />
                <span className="font-semibold uppercase tracking-[0.18em]">Sintese</span>
              </div>
              <p className="mt-4">
                A combinacao entre performance, conteudo, social e video aumenta alcance, reduz dependencia de um unico
                canal e posiciona a marca para crescer com mais valor percebido.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
