import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/marketing/section-heading";

export default function SobrePage() {
  return (
    <main className="container-shell py-20">
      <SectionHeading
        eyebrow="Sobre"
        title="Uma agencia construida com mentalidade de produto."
        description="Nosso posicionamento une performance, experiencia premium e sistema operacional para crescer com seguranca."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Card className="p-8">
          <h3 className="font-display text-3xl text-ink-950">Historia</h3>
          <p className="mt-4 text-sm leading-8 text-ink-950/72">
            A Atlas nasceu para resolver um problema comum em operacoes de marketing: campanhas ate performam, mas o
            restante da jornada comercial segue desalinhado. Construimos uma entrega em que midia, oferta, paginas,
            CRM e comunicacao trabalham juntos.
          </p>
        </Card>
        <Card className="p-8">
          <h3 className="font-display text-3xl text-ink-950">Metodologia</h3>
          <p className="mt-4 text-sm leading-8 text-ink-950/72">
            Atuamos em ciclos curtos de diagnostico, execucao, leitura de dados e melhoria continua. O painel interno
            garante visibilidade de leads, campanhas, tarefas, propostas e interacoes geradas por IA.
          </p>
        </Card>
        <Card className="p-8">
          <h3 className="font-display text-3xl text-ink-950">Valores</h3>
          <p className="mt-4 text-sm leading-8 text-ink-950/72">
            Clareza, elegancia operacional, responsabilidade com o CAC e obsessao por experiencia do cliente. O foco e
            crescimento sustentavel, nao vaidade metrica.
          </p>
        </Card>
        <Card className="p-8">
          <h3 className="font-display text-3xl text-ink-950">Diferenciais</h3>
          <p className="mt-4 text-sm leading-8 text-ink-950/72">
            Unimos execucao premium com software proprio de apoio. Isso acelera atendimento, organiza historico e traz
            rastreabilidade para cada decisao comercial e operacional.
          </p>
        </Card>
      </div>
    </main>
  );
}

