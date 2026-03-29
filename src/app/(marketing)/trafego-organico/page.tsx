import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServicePageTemplate } from "@/components/marketing/service-page-template";
import { getMarketingServiceBySlug } from "@/lib/marketing-content";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/modules/site-content/repository";

export const metadata: Metadata = buildPageMetadata({
  title: "Trafego Organico | Ameni",
  description:
    "SEO, ranqueamento no Google, blog estrategico e conteudo para construir autoridade digital e crescimento sustentavel.",
  path: "/trafego-organico",
});

export default async function TrafegoOrganicoPage() {
  const content = await getSiteContent();
  const service = getMarketingServiceBySlug("trafego-organico", content.services);

  if (!service) {
    notFound();
  }

  return <ServicePageTemplate service={service} />;
}

