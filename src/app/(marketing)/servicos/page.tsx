import { SectionHeading } from "@/components/marketing/section-heading";
import { ServiceCard } from "@/components/marketing/service-card";
import { getSiteContent } from "@/modules/site-content/repository";

export default async function ServicosPage() {
  const content = await getSiteContent();

  return (
    <main className="container-shell py-20">
      <SectionHeading
        eyebrow="Servicos"
        title="Entregas desenhadas para aquisicao, conversao e operacao."
        description="Cada servico pode ser contratado em camadas, conforme a maturidade da operacao."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {content.services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </main>
  );
}

