import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServicePageTemplate } from "@/components/marketing/service-page-template";
import { getMarketingServiceBySlug } from "@/lib/marketing-content";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/modules/site-content/repository";

export const metadata: Metadata = buildPageMetadata({
  title: "Branding e Posicionamento | Ameni",
  description:
    "Identidade, direcao criativa, tom de voz e posicionamento premium para marcas que querem vender com mais valor percebido.",
  path: "/branding",
});

export default async function BrandingPage() {
  const content = await getSiteContent();
  const service = getMarketingServiceBySlug("branding", content.services);

  if (!service) {
    notFound();
  }

  return <ServicePageTemplate service={service} />;
}

