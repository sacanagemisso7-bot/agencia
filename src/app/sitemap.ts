import type { MetadataRoute } from "next";

import { getSectorCatalog } from "@/lib/sector-content";
import { getAbsoluteUrl } from "@/lib/seo";
import { getSectorCmsCatalog, getSiteContent } from "@/modules/site-content/repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [content, sectorCatalog] = await Promise.all([getSiteContent(), getSectorCmsCatalog()]);
  const now = new Date();

  const staticRoutes = [
    "/",
    "/sobre",
    "/metodologia",
    "/como-funciona",
    "/servicos",
    "/setores",
    "/cases",
    "/depoimentos",
    "/insights",
    "/contato",
    "/trafego-pago",
    "/trafego-organico",
    "/social-media",
    "/video-maker",
    "/web",
    "/branding",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: getAbsoluteUrl(route),
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/contato" ? 0.9 : 0.8,
  }));

  const caseEntries: MetadataRoute.Sitemap = content.caseStudies.map((caseStudy) => ({
    url: getAbsoluteUrl(`/cases/${caseStudy.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const insightEntries: MetadataRoute.Sitemap = content.blogPosts.map((post) => ({
    url: getAbsoluteUrl(`/insights/${post.slug}`),
    lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const sectorEntries: MetadataRoute.Sitemap = getSectorCatalog(content.caseStudies, sectorCatalog).map((sector) => ({
    url: getAbsoluteUrl(`/setores/${sector.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...caseEntries, ...insightEntries, ...sectorEntries];
}
