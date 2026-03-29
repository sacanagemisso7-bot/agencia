import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServicePageTemplate } from "@/components/marketing/service-page-template";
import { getMarketingServiceBySlug } from "@/lib/marketing-content";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/modules/site-content/repository";

export const metadata: Metadata = buildPageMetadata({
  title: "Web e Landing Pages | Ameni",
  description:
    "Sites institucionais premium, landing pages de alta conversao e estrutura digital para sustentar campanhas e crescimento.",
  path: "/web",
});

export default async function WebPage() {
  const content = await getSiteContent();
  const service = getMarketingServiceBySlug("web", content.services);

  if (!service) {
    notFound();
  }

  return <ServicePageTemplate service={service} />;
}

