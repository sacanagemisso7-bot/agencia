import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServicePageTemplate } from "@/components/marketing/service-page-template";
import { getMarketingServiceBySlug } from "@/lib/marketing-content";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/modules/site-content/repository";

export const metadata: Metadata = buildPageMetadata({
  title: "Social Media | Ameni",
  description:
    "Planejamento editorial, posicionamento de marca e gestao de presenca digital com criterio comercial e percepcao premium.",
  path: "/social-media",
});

export default async function SocialMediaPage() {
  const content = await getSiteContent();
  const service = getMarketingServiceBySlug("social-media", content.services);

  if (!service) {
    notFound();
  }

  return <ServicePageTemplate service={service} />;
}

