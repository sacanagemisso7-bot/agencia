import type { Metadata } from "next";

import { SectorCard } from "@/components/marketing/sector-card";
import { SectionHeading } from "@/components/marketing/section-heading";
import { getSectorCatalog } from "@/lib/sector-content";
import { buildPageMetadata } from "@/lib/seo";
import { getSectorCmsCatalog, getSiteContent } from "@/modules/site-content/repository";

export const metadata: Metadata = buildPageMetadata({
  title: "Setores | Ameni",
  description:
    "Paginas por nicho com estrategia, mix de servicos e recortes de cases para clinicas, imobiliario, educacao e servicos premium.",
  path: "/setores",
  keywords: ["agencia por nicho", "marketing para clinicas", "marketing imobiliario", "marketing para educacao"],
});

export default async function SectorsIndexPage() {
  const [content, sectorCatalog] = await Promise.all([getSiteContent(), getSectorCmsCatalog()]);
  const sectors = getSectorCatalog(content.caseStudies, sectorCatalog);

  return (
    <main className="container-shell py-16 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <SectionHeading
          eyebrow="Setores"
          title="Playbooks por mercado para mostrar como a agencia pensa crescimento em contextos diferentes."
          description="Cada pagina abaixo traduz o mesmo principio: combinar captacao, narrativa, conteudo, marca e estrutura digital conforme a realidade comercial de cada negocio."
          theme="dark"
        />
        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 text-sm leading-7 text-white/62">
          Essas paginas nao sao apenas paginas de servico. Elas ajudam a explicar como o ecossistema muda conforme o
          ticket, o ciclo comercial, a maturidade do publico e o tipo de prova que cada setor exige.
        </div>
      </div>

      <div className="mt-12 grid gap-6 xl:grid-cols-2">
        {sectors.map((sector) => (
          <SectorCard key={sector.slug} sector={sector} />
        ))}
      </div>
    </main>
  );
}

