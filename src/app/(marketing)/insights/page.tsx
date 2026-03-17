import { SectionHeading } from "@/components/marketing/section-heading";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/formatters";
import { getSiteContent } from "@/modules/site-content/repository";

export default async function InsightsPage() {
  const content = await getSiteContent();

  return (
    <main className="container-shell py-20">
      <SectionHeading
        eyebrow="Insights"
        title="Conteudo para posicionar a agencia e educar o mercado."
        description="Uma base inicial de artigos que pode crescer para um blog completo e gerenciavel via CMS."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {content.blogPosts.map((post) => (
          <Card className="p-7" key={post.id}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">{post.category}</p>
            <h3 className="mt-3 font-display text-2xl text-ink-950">{post.title}</h3>
            <p className="mt-4 text-sm leading-7 text-ink-950/70">{post.excerpt}</p>
            <p className="mt-6 text-xs uppercase tracking-[0.16em] text-ink-950/42">
              {formatDate(post.publishedAt)}
            </p>
          </Card>
        ))}
      </div>
    </main>
  );
}

