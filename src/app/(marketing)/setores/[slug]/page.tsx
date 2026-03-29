import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectorPageTemplate } from "@/components/marketing/sector-page-template";
import { getSectorBySlug, getSectorCatalog } from "@/lib/sector-content";
import { buildPageMetadata } from "@/lib/seo";
import { getSectorCmsCatalog, getSiteContent } from "@/modules/site-content/repository";

type SectorPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const sectorCatalog = await getSectorCmsCatalog();
  return getSectorCatalog([], sectorCatalog).map((sector) => ({
    slug: sector.slug,
  }));
}

export async function generateMetadata({ params }: SectorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [content, sectorCatalog] = await Promise.all([getSiteContent(), getSectorCmsCatalog()]);
  const sector = getSectorBySlug(slug, content.caseStudies, sectorCatalog);

  if (!sector) {
    return buildPageMetadata({
      title: "Setor nao encontrado | Ameni",
      description: "A pagina solicitada nao foi encontrada.",
      path: `/setores/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${sector.name} | Ameni`,
    description: sector.seoDescription,
    path: `/setores/${sector.slug}`,
    keywords: sector.keywords,
  });
}

export default async function SectorPage({ params }: SectorPageProps) {
  const { slug } = await params;
  const [content, sectorCatalog] = await Promise.all([getSiteContent(), getSectorCmsCatalog()]);
  const sector = getSectorBySlug(slug, content.caseStudies, sectorCatalog);

  if (!sector) {
    notFound();
  }

  const relatedSectors = getSectorCatalog(content.caseStudies, sectorCatalog)
    .filter((item) => item.slug !== sector.slug)
    .slice(0, 3);

  return <SectorPageTemplate relatedSectors={relatedSectors} sector={sector} />;
}
