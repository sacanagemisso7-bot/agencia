import Link from "next/link";
import { ArrowRight, BadgeCheck, Bot, ChartNoAxesCombined, Handshake, Sparkles } from "lucide-react";

import { CaseCard } from "@/components/marketing/case-card";
import { FAQList } from "@/components/marketing/faq-list";
import { LeadCaptureForm } from "@/components/marketing/lead-capture-form";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ServiceCard } from "@/components/marketing/service-card";
import { TestimonialCard } from "@/components/marketing/testimonial-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSiteContent } from "@/modules/site-content/repository";

export default async function HomePage() {
  const content = await getSiteContent();

  return (
    <main>
      <section className="bg-hero-glow">
        <div className="container-shell grid gap-10 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:py-28">
          <div className="animate-fade-up">
            <Badge tone="success">Operacao premium para agencias de performance</Badge>
            <h1 className="mt-6 max-w-4xl font-display text-5xl leading-tight text-ink-950 sm:text-6xl">
              {content.settings.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-950/72">
              {content.settings.heroSubtitle}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/contato">
                <Button size="lg">
                  {content.settings.primaryCta}
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/cases">
                <Button size="lg" variant="secondary">
                  {content.settings.secondaryCta}
                </Button>
              </Link>
            </div>
            <div className="mt-12 grid gap-5 text-sm text-ink-950/68 sm:grid-cols-3">
              <div>
                <p className="font-display text-3xl text-ink-950">32%</p>
                <p className="mt-1">Taxa media de conversao em propostas qualificadas</p>
              </div>
              <div>
                <p className="font-display text-3xl text-ink-950">+R$ 84k</p>
                <p className="mt-1">Receita mensal acompanhada no backoffice</p>
              </div>
              <div>
                <p className="font-display text-3xl text-ink-950">24h</p>
                <p className="mt-1">Tempo de resposta assistido por IA comercial</p>
              </div>
            </div>
          </div>
          <Card className="grid gap-5 p-7">
            <div className="rounded-[24px] bg-ink-950 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Prova social</p>
              <p className="mt-4 font-display text-3xl">Operacao com cara de software real</p>
              <p className="mt-3 text-sm leading-7 text-white/72">
                Dashboard, CRM, tarefas, campanhas, propostas e central IA em um unico fluxo.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: ChartNoAxesCombined, label: "Midia + CRO + comercial" },
                { icon: Bot, label: "IA para mensagens e follow-ups" },
                { icon: Handshake, label: "Relacao premium com cliente" },
                { icon: Sparkles, label: "Execucao elegante e auditavel" },
              ].map((item) => (
                <div className="rounded-[24px] bg-white p-5 ring-1 ring-ink-950/6" key={item.label}>
                  <item.icon className="size-5 text-emerald-500" />
                  <p className="mt-4 text-sm font-medium text-ink-950">{item.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="container-shell py-8">
        <Card className="grid gap-6 p-6 md:grid-cols-4">
          {[
            "Clinicas premium",
            "Mercado imobiliario",
            "Educacao high-ticket",
            "Servicos consultivos",
          ].map((item) => (
            <div className="flex items-center gap-3" key={item}>
              <BadgeCheck className="size-4 text-emerald-500" />
              <p className="text-sm text-ink-950/72">{item}</p>
            </div>
          ))}
        </Card>
      </section>

      <section className="container-shell py-24">
        <SectionHeading
          eyebrow="Servicos"
          title="Uma estrutura pensada para vender melhor e operar com mais clareza."
          description="Nao entregamos apenas gestao de anuncios. Alinhamos oferta, criativo, pagina, CRM e resposta comercial."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {content.services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <section className="container-shell py-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="Como funciona"
            title="Metodo orientado a previsibilidade."
            description="Diagnostico, estrategia, execucao e cadencia comercial amarrados em um unico sistema."
          />
          <div className="grid gap-5">
            {[
              ["01", "Diagnostico e arquitetura", "Mapeamos funil, oferta, dados, CRM e oportunidades de ganho imediato."],
              ["02", "Setup de performance", "Organizamos conta, tracking, paginas, copy, criativos e automacoes."],
              ["03", "Operacao orientada por rotina", "Leads, propostas, tarefas e campanhas ficam visiveis no mesmo backoffice."],
              ["04", "IA para escala comercial", "Mensagens, follow-ups, propostas e resumos ganham velocidade com supervisao."],
            ].map(([step, title, description]) => (
              <Card className="p-6" key={step}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">{step}</p>
                <h3 className="mt-3 font-display text-2xl text-ink-950">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink-950/68">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-24">
        <SectionHeading
          eyebrow="Cases"
          title="Resultados com contexto, nao so numeros soltos."
          description="Apresentamos o desafio, a estrategia e o impacto real no pipeline."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {content.caseStudies.map((caseStudy) => (
            <CaseCard caseStudy={caseStudy} key={caseStudy.id} />
          ))}
        </div>
      </section>

      <section className="container-shell py-24">
        <SectionHeading
          eyebrow="Depoimentos"
          title="Confianca nasce quando operacao e resultado andam juntos."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {content.testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </section>

      <section className="container-shell py-24">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeading
            eyebrow="FAQ"
            title="Perguntas que costumam surgir antes do primeiro diagnostico."
          />
          <FAQList faqs={content.faqs} />
        </div>
      </section>

      <section className="container-shell py-24">
        <Card className="grid gap-10 p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
          <div>
            <Badge tone="warning">CTA final</Badge>
            <h2 className="mt-5 font-display text-4xl text-ink-950">
              Se o objetivo e crescer com mais previsibilidade, vamos desenhar o proximo passo.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-ink-950/70">
              Conte rapidamente seu momento comercial e devolvemos uma leitura estrategica com oportunidades de ganho.
            </p>
          </div>
          <LeadCaptureForm />
        </Card>
      </section>
    </main>
  );
}

