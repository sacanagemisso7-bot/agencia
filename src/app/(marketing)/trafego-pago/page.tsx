import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServicePageTemplate } from "@/components/marketing/service-page-template";
import { getMarketingServiceBySlug } from "@/lib/marketing-content";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/modules/site-content/repository";

export const metadata: Metadata = buildPageMetadata({
  title: "Trafego Pago | Ameni",
  description:
    "Campanhas de performance, geracao de leads, Google Ads e Meta Ads com foco em previsibilidade, ROI e crescimento comercial.",
  path: "/trafego-pago",
});

export default async function TrafegoPagoPage() {
  const content = await getSiteContent();
  const service = getMarketingServiceBySlug("trafego-pago", content.services);

  if (!service) {
    notFound();
  }

  return <ServicePageTemplate service={service} />;
}

