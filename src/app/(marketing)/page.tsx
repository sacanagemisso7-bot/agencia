import type { Metadata } from "next";

import { ArtDirectedHomeExperience } from "@/components/marketing/art-directed-home-experience";
import { StructuredData } from "@/components/marketing/structured-data";
import {
  getFeaturedCaseStudies,
  getFeaturedTestimonials,
  marketingMetrics,
  marketingProcess,
} from "@/lib/marketing-content";
import { getSectorCatalog } from "@/lib/sector-content";
import { buildPageMetadata, getAbsoluteUrl, getSiteName } from "@/lib/seo";
import { getSectorCmsCatalog, getSiteContent } from "@/modules/site-content/repository";

export const metadata: Metadata = buildPageMetadata({
  title: "Ameni | Amenize a complexidade potencialize seus resultados",
  description:
    "Ameni integra estratégia, tráfego, conteúdo, social media, web e posicionamento para transformar complexidade em clareza e crescimento consistente.",
  path: "/",
  keywords: ["ameni", "agência de marketing digital", "tráfego pago", "social media", "branding", "landing pages"],
});

export default async function HomePage() {
  const [content, sectorCatalog] = await Promise.all([getSiteContent(), getSectorCmsCatalog()]);
  const caseStudies = getFeaturedCaseStudies(content.caseStudies);
  const testimonials = getFeaturedTestimonials(content.testimonials);
  const sectors = getSectorCatalog(content.caseStudies, sectorCatalog).slice(0, 3);

  return (
    <main>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: content.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
          about: {
            "@type": "Organization",
            name: getSiteName(),
            url: getAbsoluteUrl("/"),
          },
        }}
        id="home-faq-schema"
      />

      <ArtDirectedHomeExperience
        caseStudies={caseStudies}
        faqs={content.faqs}
        logos={content.proofAssets.logos}
        metrics={marketingMetrics}
        sectors={sectors}
        serviceRecords={content.services}
        settings={content.settings}
        steps={marketingProcess}
        testimonials={testimonials}
      />
    </main>
  );
}
