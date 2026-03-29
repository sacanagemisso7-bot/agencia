import type { Metadata } from "next";

import { CTASection } from "@/components/marketing/cta-section";
import { PageHero } from "@/components/marketing/page-hero";
import { ServiceCard } from "@/components/marketing/service-card";
import { getMarketingServices, marketingMetrics } from "@/lib/marketing-content";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/modules/site-content/repository";

export const metadata: Metadata = buildPageMetadata({
  title: "Servicos | Ameni",
  description:
    "Conheca as frentes de trafego pago, trafego organico, social media, video maker, web e branding da Ameni.",
  path: "/servicos",
});

export default async function ServicosPage() {
  const content = await getSiteContent();
  const services = getMarketingServices(content.services);

  return (
    <main>
      <PageHero
        aside="Cada servico foi desenhado para operar sozinho ou em combinacao, conforme a maturidade da marca e a urgencia do crescimento."
        description="Uma estrutura full-service para marcas que querem unir performance, conteudo, presenca e posicionamento em um unico parceiro."
        eyebrow="Servicos"
        title="Expertises que conectam demanda, percepcao e conversao."
      />

      <section className="container-shell pb-12">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {marketingMetrics.map((metric) => (
            <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5" key={metric.label}>
              <p className="font-display text-3xl text-white">{metric.value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/46">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell py-16 sm:py-20">
        <div className="grid gap-6 xl:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>

      <CTASection
        description="Mapeamos quais frentes devem entrar primeiro para gerar impacto real sem dispersar energia nem investimento."
        title="Quer entender qual combinacao de servicos faz mais sentido para o seu momento?"
      />
    </main>
  );
}

