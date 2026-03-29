import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import { CTASection } from "@/components/marketing/cta-section";
import { StructuredData } from "@/components/marketing/structured-data";
import { Button } from "@/components/ui/button";
import { formatLongDate } from "@/lib/formatters";
import { buildPageMetadata, getAbsoluteUrl, getSiteName } from "@/lib/seo";
import { getBlogPostBySlug, getSiteContent } from "@/modules/site-content/repository";

export async function generateStaticParams() {
  const content = await getSiteContent();
  return content.blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Insight | Ameni",
    };
  }

  return buildPageMetadata({
    title: `${post.title} | Insight | Ameni`,
    description: post.excerpt,
    path: `/insights/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt ?? undefined,
  });
}

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const paragraphs = post.content.split("\n\n").filter(Boolean);

  return (
    <main>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt ?? undefined,
          articleSection: post.category,
          url: getAbsoluteUrl(`/insights/${post.slug}`),
          author: {
            "@type": "Organization",
            name: getSiteName(),
          },
          publisher: {
            "@type": "Organization",
            name: getSiteName(),
          },
        }}
        id={`insight-schema-${post.slug}`}
      />
      <section className="container-shell pt-16 pb-14 sm:pt-20 sm:pb-18">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            <Link className="inline-flex items-center gap-2 text-sm text-white/54 transition hover:text-white" href="/insights">
              <ArrowLeft className="size-4" />
              Voltar para insights
            </Link>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">{post.category}</p>
            <h1 className="mt-5 max-w-4xl font-display text-5xl leading-tight text-white sm:text-6xl">{post.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-9 text-white/68">{post.excerpt}</p>
          </div>

          <div className="rounded-[34px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-emerald-400/10 p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">Publicado em</p>
            <p className="mt-4 font-display text-4xl text-white">{formatLongDate(post.publishedAt)}</p>
            <p className="mt-4 text-sm leading-7 text-white/64">
              Conteudo estrategico para marcas que valorizam clareza comercial, posicionamento forte e crescimento com
              mais criterio.
            </p>
          </div>
        </div>
      </section>

      <section className="container-shell py-8 sm:py-10">
        <div className="grid gap-10 lg:grid-cols-[0.74fr_0.26fr]">
          <article className="rounded-[34px] border border-white/10 bg-white/[0.04] p-7 sm:p-10">
            <div className="space-y-6 text-base leading-9 text-white/76">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>

          <aside className="space-y-4">
            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/42">Leitura pratica</p>
              <p className="mt-4 text-sm leading-7 text-white/64">
                Este insight foi escrito para ajudar liderancas a conectar marketing, percepcao de marca e resultado
                comercial com mais maturidade.
              </p>
            </div>
            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/42">Proximo passo</p>
              <p className="mt-4 text-sm leading-7 text-white/64">
                Se esse tema ja conversa com o momento da sua empresa, faz sentido avancar para um diagnostico mais
                aplicado.
              </p>
              <div className="mt-6">
                <Link href="/contato">
                  <Button className="w-full border border-emerald-300/18 bg-emerald-400 text-ink-950 hover:bg-emerald-300" size="lg">
                    Falar com a agencia
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <CTASection
        description="Podemos traduzir esse tipo de leitura para a realidade da sua operacao e indicar as prioridades mais relevantes agora."
        title="Quer transformar esse insight em um plano concreto de crescimento?"
      />
    </main>
  );
}
