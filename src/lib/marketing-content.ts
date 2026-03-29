import {
  Activity,
  ArrowRightLeft,
  BarChart3,
  Brush,
  Camera,
  Clapperboard,
  Compass,
  Film,
  Globe,
  Layers3,
  LineChart,
  MessageSquare,
  MonitorSmartphone,
  Search,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import type { CaseStudyRecord, ServiceRecord, TestimonialRecord } from "@/lib/types";
import { slugify } from "@/lib/utils";

export type MarketingMetric = {
  value: string;
  label: string;
  detail?: string;
};

export type MarketingProcessStep = {
  step: string;
  title: string;
  description: string;
};

export type MarketingService = {
  slug: string;
  shortLabel: string;
  name: string;
  category: string;
  icon: LucideIcon;
  headline: string;
  description: string;
  benefit: string;
  outcomes: string[];
  deliverables: string[];
  process: MarketingProcessStep[];
  proofPoints: string[];
  heroMetrics: MarketingMetric[];
  pageIntro: string;
  ctaTitle: string;
  ctaDescription: string;
};

export const marketingMetrics: MarketingMetric[] = [
  {
    value: "+42%",
    label: "mais eficiência em captação",
    detail: "estruturas com foco em ROI, lead qualificado e ritmo comercial.",
  },
  {
    value: "6 frentes",
    label: "de growth na mesma operação",
    detail: "mídia, SEO, social, vídeo, web e branding conectados.",
  },
  {
    value: "72h",
    label: "para destravar a primeira leitura estratégica",
    detail: "diagnóstico, prioridades e plano de ataque já no início.",
  },
  {
    value: "1 squad",
    label: "integrando marca, performance e conteúdo",
    detail: "menos retrabalho e mais velocidade de execução.",
  },
];

export const marketingProcess: MarketingProcessStep[] = [
  {
    step: "01",
    title: "Diagnóstico",
    description: "Lemos posicionamento, funil, canais, ativos digitais, gargalos de conversão e oportunidade de crescimento.",
  },
  {
    step: "02",
    title: "Estratégia",
    description: "Definimos prioridades, canais, narrativa, estrutura de campanhas e plano de conteúdo com recorte comercial.",
  },
  {
    step: "03",
    title: "Criação",
    description: "Transformamos a estratégia em páginas, roteiros, criativos, conteúdo, identidade e mensagem de mercado.",
  },
  {
    step: "04",
    title: "Execução",
    description: "Campanhas, cronograma editorial, vídeo, web e operação entram em cadência com governança real.",
  },
  {
    step: "05",
    title: "Otimização",
    description: "Medimos o que está performando, refinamos oferta, criativos, SEO e UX com ritmo contínuo de melhoria.",
  },
  {
    step: "06",
    title: "Escala",
    description: "Com base validada, ampliamos investimento, reforçamos ativos próprios e consolidamos crescimento sustentável.",
  },
];

export const marketingDifferentials = [
  {
    title: "Growth com visão integrada",
    description: "Não tratamos mídia, conteúdo e marca como ilhas. Cada frente conversa com a outra para elevar demanda e percepção de valor.",
    icon: ArrowRightLeft,
  },
  {
    title: "Criatividade com disciplina comercial",
    description: "Boa estética só vale quando move atenção, retenção e conversão. Nosso processo criativo nasce orientado a negócio.",
    icon: Brush,
  },
  {
    title: "Decisão guiada por dados",
    description: "Relatórios, sinais de canal e aprendizados de funil são traduzidos em decisão prática e priorização inteligente.",
    icon: LineChart,
  },
  {
    title: "Execução premium e responsiva",
    description: "Ritmo alto, acompanhamento próximo e estruturas organizadas para agir rápido sem perder clareza.",
    icon: Activity,
  },
];

export const integratedPillars = [
  {
    title: "Tráfego pago acelera",
    description: "Campanhas em Meta e Google destravam demanda com velocidade e previsibilidade.",
    icon: Target,
  },
  {
    title: "Orgânico constrói base",
    description: "SEO, blog e ativos de busca reduzem dependência de compra contínua e fortalecem autoridade.",
    icon: Search,
  },
  {
    title: "Social media cria relacionamento",
    description: "Conteúdo consistente aumenta familiaridade, proximidade e lembrança de marca.",
    icon: MessageSquare,
  },
  {
    title: "Vídeo amplia atenção e conversão",
    description: "Criativos, reels e institucionais melhoram retenção, narrativa e performance de anúncios.",
    icon: Film,
  },
];

const marketingServiceCatalogBase: MarketingService[] = [
  {
    slug: "trafego-pago",
    shortLabel: "Performance",
    name: "Tráfego Pago",
    category: "Aquisição e escala previsível",
    icon: Target,
    headline: "Campanhas desenhadas para transformar investimento em pipeline qualificado.",
    description:
      "Planejamos, operamos e otimizamos campanhas em Google Ads e Meta Ads com foco em lead qualificado, vendas e previsibilidade de crescimento.",
    benefit: "Escala com leitura de CAC, CPL, ROAS e impacto real no comercial.",
    outcomes: [
      "Geração de leads qualificados e demanda de alta intenção",
      "Redução de desperdício com estrutura, tracking e rotina de otimização",
      "Mais clareza para investir com segurança e acelerar quando o canal responde",
    ],
    deliverables: [
      "Planejamento de canais e verba",
      "Setup técnico e tracking",
      "Criativos e copy orientados à conversão",
      "Otimização semanal e leitura executiva",
    ],
    process: [
      {
        step: "01",
        title: "Arquitetura de campanha",
        description: "Definimos oferta, páginas, funil, canais e estrutura de mensuração.",
      },
      {
        step: "02",
        title: "Lançamento controlado",
        description: "Entramos com testes por público, promessa, criativo e intenção.",
      },
      {
        step: "03",
        title: "Otimização de escala",
        description: "Refinamos investimento, sinais de conversão e qualidade da demanda.",
      },
    ],
    proofPoints: ["Google Ads", "Meta Ads", "Lead generation", "ROI", "Escala previsível"],
    heroMetrics: [
      { value: "-31%", label: "CPL em operações com estrutura ajustada" },
      { value: "+2.6x", label: "mais oportunidades qualificadas em funis validados" },
      { value: "Semanal", label: "ritmo de leitura, ajuste e decisão" },
    ],
    pageIntro:
      "Mídia paga só escala de forma saudável quando oferta, página, criativo e comercial estão conectados. Entramos para organizar essa equação.",
    ctaTitle: "Quer acelerar captação com mais previsibilidade?",
    ctaDescription:
      "Mapeamos gargalos de canal, conversão e mensagem para indicar o melhor desenho de campanha para o seu momento.",
  },
  {
    slug: "trafego-organico",
    shortLabel: "Organic Growth",
    name: "Tráfego Orgânico",
    category: "Autoridade e crescimento sustentável",
    icon: Search,
    headline: "SEO e conteúdo estratégico para transformar busca em ativo de crescimento.",
    description:
      "Estruturamos SEO, arquitetura de conteúdo e autoridade digital para ranquear melhor, capturar demanda recorrente e reduzir dependência de mídia paga.",
    benefit: "Uma base de crescimento que continua trabalhando mesmo fora do investimento em anúncios.",
    outcomes: [
      "Mais visibilidade no Google para temas com intenção real de compra",
      "Conteúdo alinhado com funil, dúvidas e objeções do mercado",
      "Crescimento de autoridade com efeito composto ao longo do tempo",
    ],
    deliverables: [
      "Auditoria técnica e semântica",
      "Mapa de palavras-chave e clusters",
      "Calendário editorial e briefs de conteúdo",
      "Otimização on-page e acompanhamento de ranqueamento",
    ],
    process: [
      {
        step: "01",
        title: "Diagnóstico de busca",
        description: "Levantamos intenções, oportunidades de ranqueamento e lacunas do site.",
      },
      {
        step: "02",
        title: "Arquitetura editorial",
        description: "Construímos clusters, páginas e pautas que fortalecem autoridade e conversão.",
      },
      {
        step: "03",
        title: "Otimização e distribuição",
        description: "Acompanhamos performance orgânica e refinamos o conteúdo com critério de negócio.",
      },
    ],
    proofPoints: ["SEO", "Blog estratégico", "Google", "Conteúdo evergreen", "Autoridade"],
    heroMetrics: [
      { value: "+118%", label: "crescimento de sessões orgânicas em ciclos consistentes" },
      { value: "Longo prazo", label: "ativo proprietário que reduz dependência de compra de alcance" },
      { value: "Top funnel", label: "captação de demanda ainda na fase de pesquisa" },
    ],
    pageIntro:
      "Quem domina busca e conteúdo constrói ativo próprio. Nosso trabalho é transformar a presença orgânica em alavanca de autoridade e demanda.",
    ctaTitle: "Quer construir crescimento que não dependa só de anúncios?",
    ctaDescription:
      "Estruturamos SEO e conteúdo com visão comercial para que o orgânico se torne um canal relevante de autoridade e aquisição.",
  },
  {
    slug: "social-media",
    shortLabel: "Presence",
    name: "Social Media",
    category: "Presença e relacionamento de marca",
    icon: MessageSquare,
    headline: "Social media com direção de negócio, ritmo editorial e percepção premium.",
    description:
      "Planejamos a presença da marca, os temas, os formatos e a narrativa para que cada publicação fortaleça posicionamento, relacionamento e confiança.",
    benefit: "Uma presença digital coerente, ativa e conectada com a estratégia comercial.",
    outcomes: [
      "Mais consistência de marca e clareza de mensagem",
      "Conteúdo com função estratégica, não apenas volume",
      "Relacionamento mais próximo com público, comunidade e mercado",
    ],
    deliverables: [
      "Planejamento editorial mensal",
      "Diretrizes de posicionamento e linguagem",
      "Roteiros, copys e desdobramentos de conteúdo",
      "Gestão visual e acompanhamento de performance",
    ],
    process: [
      {
        step: "01",
        title: "Narrativa e posicionamento",
        description: "Definimos o que a marca precisa sustentar em discurso, percepção e tema.",
      },
      {
        step: "02",
        title: "Calendário e criação",
        description: "Transformamos pilares em pauta, roteiro, design e distribuição por canal.",
      },
      {
        step: "03",
        title: "Leitura de presença",
        description: "Ajustamos formatos, temas e chamadas com base em resposta real do mercado.",
      },
    ],
    proofPoints: ["Planejamento editorial", "Calendário de conteúdo", "Gestão de perfil", "Community mindset"],
    heroMetrics: [
      { value: "Consistência", label: "cadência editorial sustentada com critério" },
      { value: "+3.4x", label: "mais interações em narrativas bem posicionadas" },
      { value: "Marca viva", label: "presença que reforça confiança antes da venda" },
    ],
    pageIntro:
      "Presença digital forte não é volume de post. É discurso, constância, direção e construção de familiaridade com o mercado certo.",
    ctaTitle: "Sua marca já transmite o nível de empresa que você quer vender?",
    ctaDescription:
      "Montamos uma operação de social media que fortalece posicionamento, aproxima audiência e sustenta o comercial.",
  },
  {
    slug: "video-maker",
    shortLabel: "Vídeo",
    name: "Video Maker",
    category: "Narrativa visual e criativos que performam",
    icon: Clapperboard,
    headline: "Vídeo como ativo de atenção, diferenciação e conversão.",
    description:
      "Criamos vídeos curtos, criativos para anúncios, reels e institucionais com linguagem atual, recorte comercial e acabamento premium.",
    benefit: "Mais retenção, mais clareza de mensagem e mais performance em social e mídia.",
    outcomes: [
      "Criativos mais aderentes para anúncios e campanhas",
      "Mais atenção e retenção em redes sociais",
      "Melhor tradução do valor da marca em formatos dinâmicos",
    ],
    deliverables: [
      "Captação e direção de cena",
      "Roteiros e hooks de abertura",
      "Edição com cortes dinâmicos e motion",
      "Desdobramento para ads, reels e institucional",
    ],
    process: [
      {
        step: "01",
        title: "Conceito e roteiro",
        description: "Definimos ângulo, promessa, tempo e função de cada vídeo na jornada.",
      },
      {
        step: "02",
        title: "Captação e produção",
        description: "Organizamos set, gravação, motion, sonorização e identidade de marca.",
      },
      {
        step: "03",
        title: "Edição para performance",
        description: "Ajustamos ritmo, ganchos, versões e cortes conforme o canal e o objetivo.",
      },
    ],
    proofPoints: ["Reels", "Ads criativos", "Motion", "Institucional", "Short-form video"],
    heroMetrics: [
      { value: "3s", label: "primeira disputa real de atenção em vídeo curto" },
      { value: "+27%", label: "ganho médio de CTR com criativos mais fortes" },
      { value: "Multiuso", label: "ativos reaproveitados em social, ads e site" },
    ],
    pageIntro:
      "Vídeo bem dirigido acelera entendimento, memorabilidade e resposta comercial. Não é enfeite: é estrutura de atenção e percepção.",
    ctaTitle: "Quer transformar vídeo em ativo de crescimento?",
    ctaDescription:
      "Desenhamos roteiros, gravação e edição para fortalecer marca, atrair atenção e melhorar conversão.",
  },
  {
    slug: "web",
    shortLabel: "Web",
    name: "Web / Landing Pages",
    category: "Estrutura digital para converter melhor",
    icon: MonitorSmartphone,
    headline: "Páginas e estruturas web criadas para vender, captar e sustentar campanhas.",
    description:
      "Desenvolvemos sites institucionais, landing pages e jornadas digitais com foco em UX, velocidade, clareza de oferta e conversão.",
    benefit: "Uma estrutura digital com cara premium e função comercial clara.",
    outcomes: [
      "Mais conversão nas campanhas e nos acessos orgânicos",
      "Experiência mais clara para entender oferta, prova e próximo passo",
      "Ativos digitais prontos para crescer com a operação",
    ],
    deliverables: [
      "Landing pages de alta conversão",
      "Sites institucionais premium",
      "Arquitetura de navegação e UX",
      "Otimização técnica e desempenho",
    ],
    process: [
      {
        step: "01",
        title: "Estrutura e copy",
        description: "Organizamos oferta, prova, CTA e fluxo de navegação para a jornada ideal.",
      },
      {
        step: "02",
        title: "Design e desenvolvimento",
        description: "Construímos layout, componentes e experiência com performance e refinamento visual.",
      },
      {
        step: "03",
        title: "Iteração de conversão",
        description: "Ajustamos página com base em comportamento, canal e resposta de campanha.",
      },
    ],
    proofPoints: ["Landing pages", "Sites premium", "UX", "Performance", "Conversão"],
    heroMetrics: [
      { value: "+38%", label: "ganho de conversão com páginas focadas em proposta de valor" },
      { value: "<2.5s", label: "meta de carregamento em estruturas otimizadas" },
      { value: "Full funnel", label: "páginas para captação, prova, venda e pós-venda" },
    ],
    pageIntro:
      "Uma boa campanha para em uma página ruim. Nossa frente de web existe para garantir que a experiência digital sustente a venda.",
    ctaTitle: "Sua estrutura digital está convertendo no nível certo?",
    ctaDescription:
      "Desenhamos páginas e experiências que traduzem valor, reforçam confiança e capturam mais demanda.",
  },
  {
    slug: "branding",
    shortLabel: "Brand",
    name: "Branding / Posicionamento",
    category: "Percepção premium e coerência de marca",
    icon: Compass,
    headline: "Direção de marca para vender com mais valor percebido e consistência.",
    description:
      "Ajudamos a construir identidade, mensagem e direção criativa para que a marca pareça tão forte quanto a entrega que ela promete.",
    benefit: "Mais clareza, mais valor percebido e mais consistência em todos os pontos de contato.",
    outcomes: [
      "Posicionamento mais claro e memorável no mercado",
      "Tom de voz e linguagem alinhados ao público e ao ticket",
      "Percepção de marca mais premium e coerente",
    ],
    deliverables: [
      "Diagnóstico de marca e mercado",
      "Território verbal e tom de voz",
      "Direção criativa e identidade visual",
      "Guia de consistência para campanhas e conteúdo",
    ],
    process: [
      {
        step: "01",
        title: "Leitura de mercado",
        description: "Mapeamos posicionamento atual, concorrência e aspiração de percepção.",
      },
      {
        step: "02",
        title: "Construção de linguagem",
        description: "Definimos discurso, identidade, território visual e estrutura de mensagem.",
      },
      {
        step: "03",
        title: "Aplicação em canais",
        description: "Desdobramos a marca em site, social, campanhas, conteúdo e vendas.",
      },
    ],
    proofPoints: ["Identidade visual", "Posicionamento", "Tom de voz", "Percepção premium", "Consistência"],
    heroMetrics: [
      { value: "Clareza", label: "de mensagem para vender sem parecer commodity" },
      { value: "+valor", label: "percebido quando marca e entrega finalmente se alinham" },
      { value: "Coerência", label: "em cada ponto de contato com o mercado" },
    ],
    pageIntro:
      "Sem posicionamento claro, a empresa disputa atenção no preço. O branding entra para elevar percepção, memorabilidade e diferenciação.",
    ctaTitle: "Sua marca sustenta o ticket e a ambição do negócio?",
    ctaDescription:
      "Trabalhamos discurso, identidade e percepção para que sua empresa pareça o que realmente quer vender.",
  },
];

export function getMarketingServices(services: ServiceRecord[] = []) {
  const overrides = new Map(services.map((service) => [slugify(service.slug || service.name), service] as const));

  return marketingServiceCatalogBase.map((service) => {
    const override = overrides.get(service.slug);

    if (!override) {
      return service;
    }

    return {
      ...service,
      name: override.name,
      description: override.description,
      benefit: override.benefit,
    };
  });
}

export function getMarketingServiceBySlug(slug: string, services: ServiceRecord[] = []) {
  return getMarketingServices(services).find((service) => service.slug === slug);
}

export function getFeaturedCaseStudies(caseStudies: CaseStudyRecord[]) {
  return caseStudies
    .filter((caseStudy) => caseStudy.featured)
    .concat(caseStudies.filter((caseStudy) => !caseStudy.featured))
    .slice(0, 3);
}

export function getFeaturedTestimonials(testimonials: TestimonialRecord[]) {
  return testimonials
    .filter((testimonial) => testimonial.featured)
    .concat(testimonials.filter((testimonial) => !testimonial.featured))
    .slice(0, 4);
}

export const presenceFramework = [
  {
    title: "Aceleracao imediata",
    description: "Tráfego pago encurta o tempo para gerar demanda e testar a mensagem certa.",
    icon: TrendingUp,
  },
  {
    title: "Base proprietária",
    description: "SEO, blog e site constroem visibilidade própria e reduzem dependência de alcance alugado.",
    icon: Globe,
  },
  {
    title: "Relação contínua",
    description: "Social media mantém a marca presente, relevante e próxima da audiência.",
    icon: Layers3,
  },
  {
    title: "Narrativa de alto impacto",
    description: "Vídeo e criativos elevam atenção, retenção e entendimento da oferta.",
    icon: Camera,
  },
];

export const webEcosystem = [
  {
    title: "Landing pages com foco comercial",
    description: "Páginas por oferta, campanha e estágio de jornada para elevar conversão e clareza.",
    icon: MonitorSmartphone,
  },
  {
    title: "Assets de conteúdo",
    description: "Blog, materiais e páginas de autoridade para construir uma estrutura de demanda de longo prazo.",
    icon: BarChart3,
  },
];
