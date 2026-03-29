import type { Metadata } from "next";
import Link from "next/link";

import { CTASection } from "@/components/marketing/cta-section";
import { PageHero } from "@/components/marketing/page-hero";
import { formatDate } from "@/lib/formatters";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/modules/site-content/repository";

export const metadata: Metadata = buildPageMetadata({
  title: "Insights | Ameni",
  description:
    "Artigos e analises sobre growth, posicionamento, performance e estrutura comercial para marcas que querem crescer com mais criterio.",
  path: "/insights",
  type: "article",
});

export default async function InsightsPage() {
  const content = await getSiteContent();

  return (
    <main>
      <PageHero
        aside="O objetivo aqui e educar o mercado, reforcar autoridade e abrir novas conversas comerciais com mais contexto e profundidade."
        description="Conteudo para mostrar visao estrategica, clareza comercial e repertorio de growth para marcas que valorizam decisao bem feita."
        eyebrow="Insights"
        title="Artigos, analises e pontos de vista para posicionar a agencia como parceira de crescimento."
      />

      <section className="container-shell py-12 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          {content.blogPosts.map((post) => (
            <Link
              className="rounded-[30px] border border-white/10 bg-white/[0.04] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
              href={`/insights/${post.slug}`}
              key={post.id}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">{post.category}</p>
              <h2 className="mt-4 font-display text-3xl text-white">{post.title}</h2>
              <p className="mt-4 text-sm leading-7 text-white/64">{post.excerpt}</p>
              <p className="mt-8 text-xs uppercase tracking-[0.18em] text-white/36">{formatDate(post.publishedAt)}</p>
            </Link>
          ))}
        </div>
      </section>

      <CTASection
        description="Podemos construir sua presenca de conteudo e autoridade com o mesmo nivel de criterio aplicado em performance."
        title="Quer transformar conteudo em vantagem competitiva para a sua marca?"
      />
    </main>
  );
}

