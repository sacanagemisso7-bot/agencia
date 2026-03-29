import { Search, TrendingUp } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";

export function OrganicGrowthSection() {
  return (
    <section className="container-shell py-24 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <SectionHeading
          eyebrow="Organic growth"
          title="SEO e conteudo para transformar busca em ativo de crescimento."
          description="O organico entra para construir base, autoridade e uma fonte de demanda que amadurece junto com a marca."
          theme="dark"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
            <Search className="size-6 text-emerald-300" />
            <h3 className="mt-5 font-display text-3xl text-white">Arquitetura de busca</h3>
            <p className="mt-4 text-sm leading-7 text-white/64">
              Organizamos paginas, clusters, blog e SEO tecnico para capturar demanda de quem ja esta pesquisando a
              solucao.
            </p>
          </div>
          <div className="rounded-[30px] border border-white/10 bg-gradient-to-br from-white/[0.05] to-amber-300/10 p-6">
            <TrendingUp className="size-6 text-amber-300" />
            <h3 className="mt-5 font-display text-3xl text-white">Crescimento composto</h3>
            <p className="mt-4 text-sm leading-7 text-white/64">
              Conteudo estrategico gera relevancia acumulada, reduz dependencia de compra de alcance e amplia a
              autoridade da empresa no longo prazo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
