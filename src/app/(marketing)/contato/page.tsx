import type { Metadata } from "next";
import { CalendarDays, Mail, PhoneCall } from "lucide-react";

import { LeadCaptureForm } from "@/components/marketing/lead-capture-form";
import { PageHero } from "@/components/marketing/page-hero";
import { SchedulingEmbedSection } from "@/components/marketing/scheduling-embed-section";
import { StructuredData } from "@/components/marketing/structured-data";
import { PageToast } from "@/components/ui/page-toast";
import { buildPageMetadata, getAbsoluteUrl, getSiteName } from "@/lib/seo";
import { getSiteContent } from "@/modules/site-content/repository";

export const metadata: Metadata = buildPageMetadata({
  title: "Contato | Ameni",
  description:
    "Solicite um diagnóstico estratégico da sua marca e entenda como tráfego, conteúdo, vídeo, web e posicionamento podem operar juntos.",
  path: "/contato",
});

const contactItems = [
  {
    label: "Email",
    icon: Mail,
    field: "email",
  },
  {
    label: "Telefone",
    icon: PhoneCall,
    field: "phone",
  },
  {
    label: "Agendamento",
    icon: CalendarDays,
    field: "calendar",
  },
] as const;

export default async function ContatoPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string; service?: string }>;
}) {
  const query = await searchParams;
  const content = await getSiteContent();

  return (
    <main>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: `${getSiteName()} | Contato`,
          url: getAbsoluteUrl("/contato"),
          description:
            "Página de contato com formulário de diagnóstico, agenda embutida e canais diretos da Ameni.",
        }}
        id="contact-page-schema"
      />
      <PageToast message={query?.success === "1" ? "Recebemos seu contato e o lead entrou no CRM." : undefined} />
      <PageHero
        aside="Se fizer sentido, nos envie contexto sobre ticket, canal principal, objetivo de crescimento e o que você sente que hoje está travando a operação."
        description="Conte rapidamente o momento da empresa e devolvemos uma leitura inicial sobre posicionamento, canais, estrutura e próximos passos."
        eyebrow="Contato"
        title="Vamos desenhar um diagnóstico comercial e estratégico para a sua marca."
      />

      <section className="container-shell py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="grid gap-4">
            {contactItems.map((item) => {
              const value =
                item.field === "email"
                  ? content.settings.email
                  : item.field === "phone"
                    ? content.settings.phone
                    : "Resposta inicial em até 1 dia útil";

              return (
                <article className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6" key={item.label}>
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-white/12 bg-black/20 text-emerald-300">
                    <item.icon className="size-5" />
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-white/42">{item.label}</p>
                  <p className="mt-3 text-base leading-8 text-white/72">{value}</p>
                </article>
              );
            })}
          </div>

          <div className="rounded-[34px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-emerald-400/10 p-6 lg:p-8">
            <LeadCaptureForm defaultServiceInterest={query?.service} theme="dark" />
          </div>
        </div>
      </section>

      <SchedulingEmbedSection
        calendarEmbedUrl={content.settings.calendarEmbedUrl}
        calendarUrl={content.settings.calendarUrl}
        whatsapp={content.settings.whatsapp}
      />
    </main>
  );
}

