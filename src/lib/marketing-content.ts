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
    label: "mais eficiencia em captacao",
    detail: "estruturas com foco em ROI, lead qualificado e ritmo comercial.",
  },
  {
    value: "6 frentes",
    label: "de growth na mesma operacao",
    detail: "midia, SEO, social, video, web e branding conectados.",
  },
  {
    value: "72h",
    label: "para destravar a primeira leitura estrategica",
    detail: "diagnostico, prioridades e plano de ataque ja no inicio.",
  },
  {
    value: "1 squad",
    label: "integrando marca, performance e conteudo",
    detail: "menos retrabalho e mais velocidade de execucao.",
  },
];

export const marketingProcess: MarketingProcessStep[] = [
  {
    step: "01",
    title: "Diagnostico",
    description: "Lemos posicionamento, funil, canais, ativos digitais, gargalos de conversao e oportunidade de crescimento.",
  },
  {
    step: "02",
    title: "Estrategia",
    description: "Definimos prioridades, canais, narrativa, estrutura de campanhas e plano de conteudo com recorte comercial.",
  },
  {
    step: "03",
    title: "Criacao",
    description: "Transformamos a estrategia em paginas, roteiros, criativos, conteudo, identidade e mensagem de mercado.",
  },
  {
    step: "04",
    title: "Execucao",
    description: "Campanhas, cronograma editorial, video, web e operacao entram em cadencia com governanca real.",
  },
  {
    step: "05",
    title: "Otimizacao",
    description: "Medimos o que esta performando, refinamos oferta, criativos, SEO e UX com ritmo continuo de melhoria.",
  },
  {
    step: "06",
    title: "Escala",
    description: "Com base validada, ampliamos investimento, reforcamos ativos proprios e consolidamos crescimento sustentavel.",
  },
];

export const marketingDifferentials = [
  {
    title: "Growth com visao integrada",
    description: "Nao tratamos midia, conteudo e marca como ilhas. Cada frente conversa com a outra para elevar demanda e percepcao de valor.",
    icon: ArrowRightLeft,
  },
  {
    title: "Criatividade com disciplina comercial",
    description: "Boa estetica so vale quando move atencao, retencao e conversao. Nosso processo criativo nasce orientado a negocio.",
    icon: Brush,
  },
  {
    title: "Decisao guiada por dados",
    description: "Relatorios, sinais de canal e aprendizados de funil sao traduzidos em decisao pratica e priorizacao inteligente.",
    icon: LineChart,
  },
  {
    title: "Execucao premium e responsiva",
    description: "Ritmo alto, acompanhamento proximo e estruturas organizadas para agir rapido sem perder clareza.",
    icon: Activity,
  },
];

export const integratedPillars = [
  {
    title: "Trafego pago acelera",
    description: "Campanhas em Meta e Google destravam demanda com velocidade e previsibilidade.",
    icon: Target,
  },
  {
    title: "Organico constroi base",
    description: "SEO, blog e ativos de busca reduzem dependencia de compra continua e fortalecem autoridade.",
    icon: Search,
  },
  {
    title: "Social media cria relacionamento",
    description: "Conteudo consistente aumenta familiaridade, proximidade e lembranca de marca.",
    icon: MessageSquare,
  },
  {
    title: "Video amplia atencao e conversao",
    description: "Criativos, reels e institucionais melhoram retencao, narrativa e performance de anuncios.",
    icon: Film,
  },
];

const marketingServiceCatalogBase: MarketingService[] = [
  {
    slug: "trafego-pago",
    shortLabel: "Performance",
    name: "Trafego Pago",
    category: "Aquisicao e escala previsivel",
    icon: Target,
    headline: "Campanhas desenhadas para transformar investimento em pipeline qualificado.",
    description:
      "Planejamos, operamos e otimizamos campanhas em Google Ads e Meta Ads com foco em lead qualificado, vendas e previsibilidade de crescimento.",
    benefit: "Escala com leitura de CAC, CPL, ROAS e impacto real no comercial.",
    outcomes: [
      "Geracao de leads qualificados e demanda de alta intencao",
      "Reducao de desperdicio com estrutura, tracking e rotina de otimizacao",
      "Mais clareza para investir com seguranca e acelerar quando o canal responde",
    ],
    deliverables: [
      "Planejamento de canais e verba",
      "Setup tecnico e tracking",
      "Criativos e copy orientados a conversao",
      "Otimizacao semanal e leitura executiva",
    ],
    process: [
      {
        step: "01",
        title: "Arquitetura de campanha",
        description: "Definimos oferta, paginas, funil, canais e estrutura de mensuracao.",
      },
      {
        step: "02",
        title: "Lancamento controlado",
        description: "Entramos com testes por publico, promessa, criativo e intencao.",
      },
      {
        step: "03",
        title: "Otimizacao de escala",
        description: "Refinamos investimento, sinais de conversao e qualidade da demanda.",
      },
    ],
    proofPoints: ["Google Ads", "Meta Ads", "Lead generation", "ROI", "Escala previsivel"],
    heroMetrics: [
      { value: "-31%", label: "CPL em operacoes com estrutura ajustada" },
      { value: "+2.6x", label: "mais oportunidades qualificadas em funis validados" },
      { value: "Semanal", label: "ritmo de leitura, ajuste e decisao" },
    ],
    pageIntro:
      "Midia paga so escala de forma saudavel quando oferta, pagina, criativo e comercial estao conectados. Entramos para organizar essa equacao.",
    ctaTitle: "Quer acelerar captacao com mais previsibilidade?",
    ctaDescription:
      "Mapeamos gargalos de canal, conversao e mensagem para indicar o melhor desenho de campanha para o seu momento.",
  },
  {
    slug: "trafego-organico",
    shortLabel: "Organic Growth",
    name: "Trafego Organico",
    category: "Autoridade e crescimento sustentavel",
    icon: Search,
    headline: "SEO e conteudo estrategico para transformar busca em ativo de crescimento.",
    description:
      "Estruturamos SEO, arquitetura de conteudo e autoridade digital para ranquear melhor, capturar demanda recorrente e reduzir dependencia de midia paga.",
    benefit: "Uma base de crescimento que continua trabalhando mesmo fora do investimento em anuncios.",
    outcomes: [
      "Mais visibilidade no Google para temas com intencao real de compra",
      "Conteudo alinhado com funil, duvidas e objecoes do mercado",
      "Crescimento de autoridade com efeito composto ao longo do tempo",
    ],
    deliverables: [
      "Auditoria tecnica e semantica",
      "Mapa de palavras-chave e clusters",
      "Calendario editorial e briefs de conteudo",
      "Otimizacao on-page e acompanhamento de ranqueamento",
    ],
    process: [
      {
        step: "01",
        title: "Diagnostico de busca",
        description: "Levantamos intencoes, oportunidades de ranqueamento e lacunas do site.",
      },
      {
        step: "02",
        title: "Arquitetura editorial",
        description: "Construimos clusters, paginas e pautas que fortalecem autoridade e conversao.",
      },
      {
        step: "03",
        title: "Otimizacao e distribuicao",
        description: "Acompanhamos performance organica e refinamos o conteudo com criterio de negocio.",
      },
    ],
    proofPoints: ["SEO", "Blog estrategico", "Google", "Conteudo evergreen", "Autoridade"],
    heroMetrics: [
      { value: "+118%", label: "crescimento de sessoes organicas em ciclos consistentes" },
      { value: "Longo prazo", label: "ativo proprietario que reduz dependencia de compra de alcance" },
      { value: "Top funnel", label: "captacao de demanda ainda na fase de pesquisa" },
    ],
    pageIntro:
      "Quem domina busca e conteudo constroi ativo proprio. Nosso trabalho e transformar a presenca organica em alavanca de autoridade e demanda.",
    ctaTitle: "Quer construir crescimento que nao dependa so de anuncios?",
    ctaDescription:
      "Estruturamos SEO e conteudo com visao comercial para que o organico se torne um canal relevante de autoridade e aquisicao.",
  },
  {
    slug: "social-media",
    shortLabel: "Presence",
    name: "Social Media",
    category: "Presenca e relacionamento de marca",
    icon: MessageSquare,
    headline: "Social media com direcao de negocio, ritmo editorial e percepcao premium.",
    description:
      "Planejamos a presenca da marca, os temas, os formatos e a narrativa para que cada publicacao fortaleca posicionamento, relacionamento e confianca.",
    benefit: "Uma presenca digital coerente, ativa e conectada com a estrategia comercial.",
    outcomes: [
      "Mais consistencia de marca e clareza de mensagem",
      "Conteudo com funcao estrategica, nao apenas volume",
      "Relacionamento mais proximo com publico, comunidade e mercado",
    ],
    deliverables: [
      "Planejamento editorial mensal",
      "Diretrizes de posicionamento e linguagem",
      "Roteiros, copys e desdobramentos de conteudo",
      "Gestao visual e acompanhamento de performance",
    ],
    process: [
      {
        step: "01",
        title: "Narrativa e posicionamento",
        description: "Definimos o que a marca precisa sustentar em discurso, percepcao e tema.",
      },
      {
        step: "02",
        title: "Calendario e criacao",
        description: "Transformamos pilares em pauta, roteiro, design e distribuicao por canal.",
      },
      {
        step: "03",
        title: "Leitura de presenca",
        description: "Ajustamos formatos, temas e chamadas com base em resposta real do mercado.",
      },
    ],
    proofPoints: ["Planejamento editorial", "Calendario de conteudo", "Gestao de perfil", "Community mindset"],
    heroMetrics: [
      { value: "Consistencia", label: "cadencia editorial sustentada com criterio" },
      { value: "+3.4x", label: "mais interacoes em narrativas bem posicionadas" },
      { value: "Marca viva", label: "presenca que reforca confianca antes da venda" },
    ],
    pageIntro:
      "Presenca digital forte nao e volume de post. E discurso, constancia, direcao e construcao de familiaridade com o mercado certo.",
    ctaTitle: "Sua marca ja transmite o nivel de empresa que voce quer vender?",
    ctaDescription:
      "Montamos uma operacao de social media que fortalece posicionamento, aproxima audiencia e sustenta o comercial.",
  },
  {
    slug: "video-maker",
    shortLabel: "Video",
    name: "Video Maker",
    category: "Narrativa visual e criativos que performam",
    icon: Clapperboard,
    headline: "Video como ativo de atencao, diferenciacao e conversao.",
    description:
      "Criamos videos curtos, criativos para anuncios, reels e institucionais com linguagem atual, recorte comercial e acabamento premium.",
    benefit: "Mais retencao, mais clareza de mensagem e mais performance em social e midia.",
    outcomes: [
      "Criativos mais aderentes para anuncios e campanhas",
      "Mais atencao e retencao em redes sociais",
      "Melhor traducao do valor da marca em formatos dinamicos",
    ],
    deliverables: [
      "Captacao e direcao de cena",
      "Roteiros e hooks de abertura",
      "Edicao com cortes dinamicos e motion",
      "Desdobramento para ads, reels e institucional",
    ],
    process: [
      {
        step: "01",
        title: "Conceito e roteiro",
        description: "Definimos angulo, promessa, tempo e funcao de cada video na jornada.",
      },
      {
        step: "02",
        title: "Captacao e producao",
        description: "Organizamos set, gravacao, motion, sonorizacao e identidade de marca.",
      },
      {
        step: "03",
        title: "Edicao para performance",
        description: "Ajustamos ritmo, ganchos, versoes e cortes conforme o canal e o objetivo.",
      },
    ],
    proofPoints: ["Reels", "Ads criativos", "Motion", "Institucional", "Short-form video"],
    heroMetrics: [
      { value: "3s", label: "primeira disputa real de atencao em video curto" },
      { value: "+27%", label: "ganho medio de CTR com criativos mais fortes" },
      { value: "Multiuso", label: "ativos reaproveitados em social, ads e site" },
    ],
    pageIntro:
      "Video bem dirigido acelera entendimento, memorabilidade e resposta comercial. Nao e enfeite: e estrutura de atencao e percepcao.",
    ctaTitle: "Quer transformar video em ativo de crescimento?",
    ctaDescription:
      "Desenhamos roteiros, gravacao e edicao para fortalecer marca, atrair atencao e melhorar conversao.",
  },
  {
    slug: "web",
    shortLabel: "Web",
    name: "Web / Landing Pages",
    category: "Estrutura digital para converter melhor",
    icon: MonitorSmartphone,
    headline: "Paginas e estruturas web criadas para vender, captar e sustentar campanhas.",
    description:
      "Desenvolvemos sites institucionais, landing pages e jornadas digitais com foco em UX, velocidade, clareza de oferta e conversao.",
    benefit: "Uma estrutura digital com cara premium e funcao comercial clara.",
    outcomes: [
      "Mais conversao nas campanhas e nos acessos organicos",
      "Experiencia mais clara para entender oferta, prova e proximo passo",
      "Ativos digitais prontos para crescer com a operacao",
    ],
    deliverables: [
      "Landing pages de alta conversao",
      "Sites institucionais premium",
      "Arquitetura de navegacao e UX",
      "Otimizacao tecnica e desempenho",
    ],
    process: [
      {
        step: "01",
        title: "Estrutura e copy",
        description: "Organizamos oferta, prova, CTA e fluxo de navegacao para a jornada ideal.",
      },
      {
        step: "02",
        title: "Design e desenvolvimento",
        description: "Construimos layout, componentes e experiencia com performance e refinamento visual.",
      },
      {
        step: "03",
        title: "Iteracao de conversao",
        description: "Ajustamos pagina com base em comportamento, canal e resposta de campanha.",
      },
    ],
    proofPoints: ["Landing pages", "Sites premium", "UX", "Performance", "Conversao"],
    heroMetrics: [
      { value: "+38%", label: "ganho de conversao com paginas focadas em proposta de valor" },
      { value: "<2.5s", label: "meta de carregamento em estruturas otimizadas" },
      { value: "Full funnel", label: "paginas para captacao, prova, venda e pos-venda" },
    ],
    pageIntro:
      "Uma boa campanha para em uma pagina ruim. Nossa frente de web existe para garantir que a experiencia digital sustente a venda.",
    ctaTitle: "Sua estrutura digital esta convertendo no nivel certo?",
    ctaDescription:
      "Desenhamos paginas e experiencias que traduzem valor, reforcam confianca e capturam mais demanda.",
  },
  {
    slug: "branding",
    shortLabel: "Brand",
    name: "Branding / Posicionamento",
    category: "Percepcao premium e coerencia de marca",
    icon: Compass,
    headline: "Direcao de marca para vender com mais valor percebido e consistencia.",
    description:
      "Ajudamos a construir identidade, mensagem e direcao criativa para que a marca pareca tao forte quanto a entrega que ela promete.",
    benefit: "Mais clareza, mais valor percebido e mais consistencia em todos os pontos de contato.",
    outcomes: [
      "Posicionamento mais claro e memoravel no mercado",
      "Tom de voz e linguagem alinhados ao publico e ao ticket",
      "Percepcao de marca mais premium e coerente",
    ],
    deliverables: [
      "Diagnostico de marca e mercado",
      "Territorio verbal e tom de voz",
      "Direcao criativa e identidade visual",
      "Guia de consistencia para campanhas e conteudo",
    ],
    process: [
      {
        step: "01",
        title: "Leitura de mercado",
        description: "Mapeamos posicionamento atual, concorrencia e aspiracao de percepcao.",
      },
      {
        step: "02",
        title: "Construcao de linguagem",
        description: "Definimos discurso, identidade, territorio visual e estrutura de mensagem.",
      },
      {
        step: "03",
        title: "Aplicacao em canais",
        description: "Desdobramos a marca em site, social, campanhas, conteudo e vendas.",
      },
    ],
    proofPoints: ["Identidade visual", "Posicionamento", "Tom de voz", "Percepcao premium", "Consistencia"],
    heroMetrics: [
      { value: "Clareza", label: "de mensagem para vender sem parecer commodity" },
      { value: "+valor", label: "percebido quando marca e entrega finalmente se alinham" },
      { value: "Coerencia", label: "em cada ponto de contato com o mercado" },
    ],
    pageIntro:
      "Sem posicionamento claro, a empresa disputa atencao no preco. O branding entra para elevar percepcao, memorabilidade e diferenciacao.",
    ctaTitle: "Sua marca sustenta o ticket e a ambicao do negocio?",
    ctaDescription:
      "Trabalhamos discurso, identidade e percepcao para que sua empresa pareca o que realmente quer vender.",
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
    description: "Trafego pago encurta o tempo para gerar demanda e testar a mensagem certa.",
    icon: TrendingUp,
  },
  {
    title: "Base proprietaria",
    description: "SEO, blog e site constroem visibilidade propria e reduzem dependencia de alcance alugado.",
    icon: Globe,
  },
  {
    title: "Relacao continua",
    description: "Social media mantem a marca presente, relevante e proxima da audiencia.",
    icon: Layers3,
  },
  {
    title: "Narrativa de alto impacto",
    description: "Video e criativos elevam atencao, retencao e entendimento da oferta.",
    icon: Camera,
  },
];

export const webEcosystem = [
  {
    title: "Landing pages com foco comercial",
    description: "Paginas por oferta, campanha e estagio de jornada para elevar conversao e clareza.",
    icon: MonitorSmartphone,
  },
  {
    title: "Assets de conteudo",
    description: "Blog, materiais e paginas de autoridade para construir uma estrutura de demanda de longo prazo.",
    icon: BarChart3,
  },
];
