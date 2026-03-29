import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import { CTASection } from "@/components/marketing/cta-section";
import { StructuredData } from "@/components/marketing/structured-data";
import { Button } from "@/components/ui/button";
import { buildPageMetadata, getAbsoluteUrl, getSiteName } from "@/lib/seo";
import { getSiteContent, getCaseStudyBySlug } from "@/modules/site-content/repository";

export async function generateStaticParams() {
  const content = await getSiteContent();
  return content.caseStudies.map((caseStudy) => ({
    slug: caseStudy.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    return {
      title: "Case | Ameni",
    };
  }

  return buildPageMetadata({
    title: `${caseStudy.title} | Case | Ameni`,
    description: caseStudy.result,
    path: `/cases/${caseStudy.slug}`,
  });
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  const metrics = Object.entries(caseStudy.metrics ?? {});

  return (
    <main>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: caseStudy.title,
          url: getAbsoluteUrl(`/cases/${caseStudy.slug}`),
          description: caseStudy.result,
          creator: {
            "@type": "Organization",
            name: getSiteName(),
          },
          about: caseStudy.niche,
        }}
        id={`case-schema-${caseStudy.slug}`}
      />
      <section className="container-shell pt-16 pb-14 sm:pt-20 sm:pb-18">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <Link className="inline-flex items-center gap-2 text-sm text-white/54 transition hover:text-white" href="/cases">
              <ArrowLeft className="size-4" />
              Voltar para cases
            </Link>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">{caseStudy.niche}</p>
            <h1 className="mt-5 max-w-4xl font-display text-5xl leading-tight text-white sm:text-6xl">{caseStudy.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-9 text-white/68">
              Um recorte de como estrategia, criacao e estrutura operacional se conectaram para melhorar demanda e qualidade
              comercial.
            </p>
          </div>

          <div className="rounded-[34px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-emerald-400/10 p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">Resultado central</p>
            <p className="mt-5 font-display text-4xl text-white">{caseStudy.result}</p>
            <p className="mt-4 text-sm leading-7 text-white/64">
              O foco nao foi apenas volume. O trabalho foi desenhado para melhorar a leitura de valor, a qualidade da
              demanda e a capacidade da operacao em transformar interesse em oportunidade.
            </p>
          </div>
        </div>
      </section>

      {metrics.length ? (
        <section className="container-shell py-6 sm:py-8">
          <div className="grid gap-4 md:grid-cols-3">
            {metrics.map(([label, value]) => (
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6" key={label}>
                <p className="font-display text-4xl text-white">{String(value)}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/42">{label.replaceAll("_", " ")}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="container-shell py-16 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-[30px] border border-white/10 bg-white/[0.04] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/42">Desafio</p>
            <p className="mt-4 text-sm leading-8 text-white/70">{caseStudy.challenge}</p>
          </article>
          <article className="rounded-[30px] border border-white/10 bg-white/[0.04] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/42">Solucao</p>
            <p className="mt-4 text-sm leading-8 text-white/70">{caseStudy.solution}</p>
          </article>
          <article className="rounded-[30px] border border-amber-300/20 bg-amber-300/8 p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">Impacto</p>
            <p className="mt-4 text-sm leading-8 text-white/80">{caseStudy.result}</p>
          </article>
        </div>
      </section>

      <section className="container-shell py-6 sm:py-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">Leitura do projeto</p>
            <h2 className="mt-4 font-display text-4xl text-white">Nao foi uma unica acao. Foi uma combinacao bem alinhada.</h2>
          </div>
          <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-7 text-sm leading-8 text-white/68">
            <p>
              Em projetos como este, o ganho real costuma aparecer quando campanha, mensagem, experiencia e rotina
              comercial finalmente deixam de disputar entre si.
            </p>
            <p className="mt-5">
              A estrutura certa melhora o clique, mas tambem melhora a percepcao de valor, a qualidade da resposta do
              time e a velocidade para transformar interesse em oportunidade concreta.
            </p>
            <div className="mt-8">
              <Link href="/contato">
                <Button className="border border-emerald-300/18 bg-emerald-400 text-ink-950 hover:bg-emerald-300" size="lg">
                  Quero uma leitura como essa
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        description="Podemos analisar seu momento atual e desenhar um plano para transformar performance, conteudo e estrutura em um proximo case forte."
        title="Quer construir um resultado com esse nivel de contexto e consistencia?"
      />
    </main>
  );
}
