import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServicePageTemplate } from "@/components/marketing/service-page-template";
import { getMarketingServiceBySlug } from "@/lib/marketing-content";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/modules/site-content/repository";

export const metadata: Metadata = buildPageMetadata({
  title: "Video Maker | Ameni",
  description:
    "Videos curtos, criativos para anuncios, reels e institucionais com narrativa premium e foco em atencao, retencao e conversao.",
  path: "/video-maker",
});

export default async function VideoMakerPage() {
  const content = await getSiteContent();
  const service = getMarketingServiceBySlug("video-maker", content.services);

  if (!service) {
    notFound();
  }

  return <ServicePageTemplate service={service} />;
}

