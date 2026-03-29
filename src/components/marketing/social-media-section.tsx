import { CalendarRange, MessageSquareText, Users } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";

const socialCards = [
  {
    title: "Planejamento editorial",
    description: "Definimos pilares de conteudo, recorrencia, canais e intencao de cada publicacao no ecossistema da marca.",
    icon: CalendarRange,
  },
  {
    title: "Posicionamento e comunidade",
    description: "Criamos uma presenca que reforca discurso, aproxima audiencia e sustenta relacionamento ao longo do tempo.",
    icon: Users,
  },
  {
    title: "Conteudo que conversa com negocio",
    description: "Nada de postagem vazia. Cada tema existe para educar, diferenciar, gerar confianca ou apoiar venda.",
    icon: MessageSquareText,
  },
];

export function SocialMediaSection() {
  return (
    <section className="container-shell py-24 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-4">
          {socialCards.map((card) => (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6" key={card.title}>
              <div className="flex size-11 items-center justify-center rounded-2xl border border-white/12 bg-black/20 text-emerald-300">
                <card.icon className="size-5" />
              </div>
              <h3 className="mt-5 font-display text-3xl text-white">{card.title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/64">{card.description}</p>
            </div>
          ))}
        </div>
        <SectionHeading
          eyebrow="Social media"
          title="Presenca digital com ritmo, coerencia e funcao estrategica."
          description="Social media nao e apenas frequencia. E construcao de familiaridade, narrativa e consistencia para a marca existir de forma forte no mercado."
          theme="dark"
        />
      </div>
    </section>
  );
}
