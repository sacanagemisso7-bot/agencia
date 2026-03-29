import type { CaseStudyRecord } from "@/lib/types";

type SectorMetric = {
  value: string;
  label: string;
};

type SectorServiceLink = {
  label: string;
  href: string;
  description: string;
};

type SectorStep = {
  step: string;
  title: string;
  description: string;
};

type SectorCaseHighlight = {
  title: string;
  companyLabel: string;
  challenge: string;
  approach: string;
  result: string;
  metrics: SectorMetric[];
};

export type SectorPageContent = {
  slug: string;
  name: string;
  shortLabel: string;
  audience: string;
  seoDescription: string;
  heroTitle: string;
  heroDescription: string;
  summary: string;
  keywords: string[];
  matchingNiches: string[];
  metrics: SectorMetric[];
  painPoints: string[];
  serviceMix: SectorServiceLink[];
  differentiators: string[];
  playbook: SectorStep[];
  caseHighlights: SectorCaseHighlight[];
  ctaTitle: string;
  ctaDescription: string;
};

export type SectorPageViewModel = SectorPageContent & {
  matchedCaseStudies: CaseStudyRecord[];
};

export const defaultSectorCatalog: SectorPageContent[] = [
  {
    slug: "clinicas-e-estetica",
    name: "Clinicas e Estetica",
    shortLabel: "Estetica",
    audience: "Operacoes que precisam elevar agenda, valor percebido e constancia comercial.",
    seoDescription:
      "Agencia premium para clinicas e estetica com trafego pago, social, video, SEO e estrutura digital voltados a agenda previsivel e posicionamento premium.",
    heroTitle: "Growth para clinicas e estetica que precisam vender com previsibilidade sem parecer promocionais.",
    heroDescription:
      "Construimos uma operacao que une performance, social, video, web e posicionamento para aumentar agenda qualificada, elevar percepcao de valor e sustentar ticket premium.",
    summary:
      "Clinicas fortes nao dependem so de campanha. Dependem de narrativa, prova, rotina comercial e uma experiencia digital coerente com o nivel do procedimento vendido.",
    keywords: ["marketing para clinicas", "agencia para estetica", "trafego para clinicas", "branding para clinicas"],
    matchingNiches: ["estetica", "saude", "clinica", "dermatologia"],
    metrics: [
      { value: "+42%", label: "mais consultas agendadas em estruturas validadas" },
      { value: "-31%", label: "CPL em operacoes com promessa, pagina e criativo ajustados" },
      { value: "Premium", label: "percepcao de marca alinhada ao ticket dos procedimentos" },
    ],
    painPoints: [
      "Agenda irregular com dependencia excessiva de indicacao ou campanha pontual.",
      "Demanda entrando com baixa qualificacao para procedimentos de maior ticket.",
      "Presenca digital sem transmitir seguranca, sofisticacao e autoridade clinica.",
      "Time comercial respondendo sem cadencia, contexto ou follow-up consultivo.",
    ],
    serviceMix: [
      {
        label: "Trafego Pago",
        href: "/trafego-pago",
        description: "Meta e Google orientados a agenda, lead qualificado e previsibilidade de captacao.",
      },
      {
        label: "Video Maker",
        href: "/video-maker",
        description: "Criativos, depoimentos e reels que aumentam atencao e reforcam confianca.",
      },
      {
        label: "Web / Landing Pages",
        href: "/web",
        description: "Paginas por procedimento, prova social e jornadas desenhadas para conversao.",
      },
      {
        label: "Branding / Posicionamento",
        href: "/branding",
        description: "Mensagem, identidade e percepcao coerentes com um servico high-ticket.",
      },
    ],
    differentiators: [
      "Leitura conjunta entre canal, oferta, pagina e abordagem comercial.",
      "Direcao criativa pensada para procedimentos, prova e sensacao de seguranca.",
      "Ritmo operacional para nao deixar o lead esfriar entre clique, contato e agendamento.",
    ],
    playbook: [
      {
        step: "01",
        title: "Diagnostico de agenda e oferta",
        description: "Mapeamos o mix de procedimentos, gargalos de agenda, promessa comercial e sinais da operacao atual.",
      },
      {
        step: "02",
        title: "Estrutura de captacao premium",
        description: "Desenhamos canais, paginas, criativos e narrativa para atrair demanda mais aderente ao ticket.",
      },
      {
        step: "03",
        title: "Conteudo e prova",
        description: "Organizamos social, video e depoimentos para elevar autoridade e reduzir objecao antes da conversa.",
      },
      {
        step: "04",
        title: "Otimizacao de agenda",
        description: "Ajustamos campanha, abordagem e follow-up para melhorar show rate e volume de consultas.",
      },
    ],
    caseHighlights: [
      {
        title: "Clinica de harmonizacao com agenda mais consistente",
        companyLabel: "Operacao focada em procedimentos premium",
        challenge: "Boa procura em datas especificas, mas pouca regularidade ao longo do mes.",
        approach: "Reposicionamento da promessa, reels de prova, landing por procedimento e rotina de follow-up consultivo.",
        result: "Agenda mais previsivel, melhor qualificacao e mais seguranca para investir em escala.",
        metrics: [
          { value: "+39%", label: "show rate" },
          { value: "-24%", label: "lead desperdicado" },
        ],
      },
      {
        title: "Clinica dermatologica com mais autoridade digital",
        companyLabel: "Marca em fase de reposicionamento",
        challenge: "Marca tecnicamente forte, mas com presenca digital abaixo do ticket desejado.",
        approach: "Direcao de marca, social media estrategico, videos curtos e SEO para temas com intencao real de busca.",
        result: "Mais percepcao premium, mais reconhecimento e base melhor para campanhas de captacao.",
        metrics: [
          { value: "+2.1x", label: "alcance qualificado" },
          { value: "Top 5", label: "termos estrategicos em busca local" },
        ],
      },
    ],
    ctaTitle: "Quer uma operacao de captacao e marca mais forte para sua clinica?",
    ctaDescription:
      "Mapeamos onde a demanda se perde hoje e desenhamos uma estrutura mais previsivel para agenda, posicionamento e conversao.",
  },
  {
    slug: "imobiliario-e-lancamentos",
    name: "Imobiliario e Lancamentos",
    shortLabel: "Imobiliario",
    audience: "Empreendimentos, imobiliarias e operacoes comerciais que precisam qualificar melhor a demanda.",
    seoDescription:
      "Agencia para mercado imobiliario com trafego pago, landing pages, video e social media focados em lancamentos, demanda qualificada e rotina comercial.",
    heroTitle: "Marketing imobiliario para gerar demanda mais qualificada, menos volume vazio e mais velocidade comercial.",
    heroDescription:
      "Montamos a estrutura de campanha, paginas, criativos e narrativa que ajudam o time comercial a trabalhar com leads mais aderentes ao tipo de empreendimento vendido.",
    summary:
      "No imobiliario, escala sem qualificacao vira ruido. Nosso trabalho e equilibrar volume, intencao e narrativa para proteger o tempo do time de vendas.",
    keywords: ["marketing imobiliario", "agencia para lancamentos", "trafego para imobiliaria", "landing page imobiliaria"],
    matchingNiches: ["imobiliario", "real estate", "lancamento", "empreendimento"],
    metrics: [
      { value: "2.6x", label: "mais oportunidades reais em estruturas bem segmentadas" },
      { value: "+37%", label: "taxa de reuniao em paginas por intencao" },
      { value: "Menos ruido", label: "comercial mais protegido de curiosos e desencaixes" },
    ],
    painPoints: [
      "Muito lead curioso e pouco lead com perfil real para visita ou proposta.",
      "Campanhas desconectadas da narrativa do empreendimento e da pagina.",
      "Criativos genericos sem argumento forte para localizacao, produto e estilo de vida.",
      "Comercial gastando energia com base grande e pouco qualificada.",
    ],
    serviceMix: [
      {
        label: "Trafego Pago",
        href: "/trafego-pago",
        description: "Estrutura por publico, intencao e etapa de decisao para proteger a qualidade da demanda.",
      },
      {
        label: "Web / Landing Pages",
        href: "/web",
        description: "Paginas por empreendimento, regiao, produto e CTA comercial mais aderente.",
      },
      {
        label: "Video Maker",
        href: "/video-maker",
        description: "Criativos, tours curtos e cortes que traduzem valor, contexto e estilo de vida.",
      },
      {
        label: "Social Media",
        href: "/social-media",
        description: "Presenca que aquece a base, reforca prova e amplia desejo pelo produto.",
      },
    ],
    differentiators: [
      "Segmentacao e criacao pensadas junto do discurso comercial do empreendimento.",
      "Leitura de pagina e campanha para evitar volume sem intencao real.",
      "Suporte de conteudo e video para construir desejo e reduzir friccao na decisao.",
    ],
    playbook: [
      {
        step: "01",
        title: "Leitura de produto e publico",
        description: "Entendemos localizacao, perfil de comprador, argumentos de valor e objecoes mais comuns.",
      },
      {
        step: "02",
        title: "Arquitetura de captacao",
        description: "Definimos campanhas, paginas e criativos de acordo com o recorte do lancamento ou carteira.",
      },
      {
        step: "03",
        title: "Qualificacao e aquecimento",
        description: "Social, video e funil ajudam a amadurecer desejo e filtrar melhor o interesse.",
      },
      {
        step: "04",
        title: "Escala com governanca",
        description: "Otimizamos por resposta comercial, e nao apenas por volume de formulario.",
      },
    ],
    caseHighlights: [
      {
        title: "Lancamento de medio-alto padrao com mais visita qualificada",
        companyLabel: "Empreendimento com ciclo consultivo",
        challenge: "Muito cadastro frio chegando para um time comercial pequeno.",
        approach: "Pagina por intencao, argumento por estilo de vida e criativos diferentes para publico investidor e moradia.",
        result: "Menos ruido no pipeline e mais energia concentrada nas oportunidades certas.",
        metrics: [
          { value: "+34%", label: "visitas agendadas" },
          { value: "-29%", label: "lead sem aderencia" },
        ],
      },
      {
        title: "Imobiliaria premium com presenca mais contemporanea",
        companyLabel: "Carteira de imoveis de maior ticket",
        challenge: "Boa carteira, mas comunicacao sem forca para sustentar valor percebido.",
        approach: "Social editorial, video de produto, identidade mais executiva e campanhas com narrativa mais clara.",
        result: "Melhora na percepcao da marca e mais consistencia entre captacao e atendimento.",
        metrics: [
          { value: "+58%", label: "tempo de atencao em videos" },
          { value: "+22%", label: "resposta em campanhas de remarketing" },
        ],
      },
    ],
    ctaTitle: "Quer gerar demanda mais qualificada para o mercado imobiliario?",
    ctaDescription:
      "Entramos para alinhar midia, criativo, pagina e comercial em uma estrutura que protege a qualidade do lead e a eficiencia do time.",
  },
  {
    slug: "educacao-e-infoprodutos",
    name: "Educacao e Infoprodutos",
    shortLabel: "Educacao",
    audience: "Especialistas, escolas e operacoes de venda consultiva ou recorrente que precisam de crescimento sustentavel.",
    seoDescription:
      "Agencia para educacao, experts e infoprodutos com foco em autoridade, campanhas, social, video e funis de conversao para vender com mais previsibilidade.",
    heroTitle: "Growth para educacao e experts que precisam vender mais sem esgotar a marca em promessas vazias.",
    heroDescription:
      "Unimos captacao, conteudo, social, video e estrutura digital para construir autoridade, gerar demanda e melhorar conversao de ofertas educacionais e consultivas.",
    summary:
      "Negocios de educacao vendem melhor quando audiencia, narrativa, prova e funil trabalham juntos. O canal sozinho nao resolve promessa fraca ou posicionamento confuso.",
    keywords: ["marketing para infoproduto", "agencia para experts", "marketing para educacao", "funil para cursos"],
    matchingNiches: ["educacao", "curso", "infoproduto", "mentoria", "treinamento"],
    metrics: [
      { value: "Autoridade", label: "organico e conteudo como alavanca de desejo" },
      { value: "+29%", label: "conversao com paginas e narrativa melhor estruturadas" },
      { value: "Full funnel", label: "da descoberta a matricula ou call comercial" },
    ],
    painPoints: [
      "Dependencia excessiva de lancamento ou campanha sem ativo proprio de autoridade.",
      "Conteudo produzindo alcance, mas nao construindo demanda de compra.",
      "Pagina e oferta sem clareza para filtrar maturidade e objecao.",
      "Social e video sem funcao clara dentro do funil comercial.",
    ],
    serviceMix: [
      {
        label: "Trafego Organico",
        href: "/trafego-organico",
        description: "SEO e conteudo para construir busca, autoridade e base proprietaria.",
      },
      {
        label: "Social Media",
        href: "/social-media",
        description: "Narrativa editorial que aquece audiencia e reforca posicionamento do expert.",
      },
      {
        label: "Video Maker",
        href: "/video-maker",
        description: "Conteudo curto e criativos que melhoram atencao, retencao e argumento de oferta.",
      },
      {
        label: "Web / Landing Pages",
        href: "/web",
        description: "Jornadas e paginas para webinar, diagnostico, turma ou oferta evergreen.",
      },
    ],
    differentiators: [
      "Visao integrada entre construcao de autoridade e conversao de oferta.",
      "Conteudo com funcao estrategica, e nao apenas volume de publicacao.",
      "Funis mais claros para separar descoberta, aquecimento e decisao.",
    ],
    playbook: [
      {
        step: "01",
        title: "Posicionamento da oferta",
        description: "Revisamos promessa, publico, prova e o lugar que a oferta ocupa no mercado.",
      },
      {
        step: "02",
        title: "Base de demanda",
        description: "Organizamos busca, conteudo, social e video para construir interesse e lembranca.",
      },
      {
        step: "03",
        title: "Conversao",
        description: "Paginas, campanhas e CTA sao desenhados para transformar audiencia em lead e lead em venda.",
      },
      {
        step: "04",
        title: "Escala sustentavel",
        description: "Investimento, conteudo e recorrencia passam a operar em um ritmo previsivel.",
      },
    ],
    caseHighlights: [
      {
        title: "Programa de formacao com mais matriculas qualificadas",
        companyLabel: "Oferta premium de especializacao",
        challenge: "Bom interesse inicial, mas queda forte entre engajamento e decisao.",
        approach: "Reposicionamento de promessa, funil de conteudo, pagina mais clara e anuncios por maturidade.",
        result: "Mais leads aderentes e melhor taxa de matricula sem crescer custo no mesmo ritmo.",
        metrics: [
          { value: "+33%", label: "matriculas" },
          { value: "+21%", label: "conversao de lead para call" },
        ],
      },
      {
        title: "Expert com marca mais premium e menos dependencia de picos",
        companyLabel: "Negocio baseado em recorrencia",
        challenge: "Picos de receita em lancamentos e pouca constancia entre janelas comerciais.",
        approach: "SEO, editorial, video e captura evergreen para equilibrar descoberta, relacionamento e venda.",
        result: "Operacao mais equilibrada e ativo de autoridade construindo demanda continuamente.",
        metrics: [
          { value: "+118%", label: "trafego organico" },
          { value: "+47%", label: "leads evergreen" },
        ],
      },
    ],
    ctaTitle: "Quer vender educacao e consultoria com mais constancia e valor percebido?",
    ctaDescription:
      "Podemos desenhar um ecossistema mais forte entre conteudo, captacao, pagina e narrativa para o seu modelo de oferta.",
  },
  {
    slug: "servicos-premium-e-consultivos",
    name: "Servicos Premium e Consultivos",
    shortLabel: "Servicos",
    audience: "Escritorios, consultorias e empresas high-ticket que vendem confianca antes de vender escopo.",
    seoDescription:
      "Agencia para servicos premium e consultivos com foco em posicionamento, captacao qualificada, social, web e branding para aumentar percepcao de valor.",
    heroTitle: "Marketing para servicos premium que precisam parecer tao fortes quanto entregam.",
    heroDescription:
      "Estruturamos marca, demanda e jornada comercial para empresas que vendem consultoria, projeto ou servico de alto valor e nao podem competir por volume barato.",
    summary:
      "Em servicos consultivos, marca fraca encarece a venda. A presenca precisa transmitir clareza, criterio e confianca antes mesmo do primeiro contato comercial.",
    keywords: ["marketing para consultoria", "agencia para servicos premium", "branding para escritorio", "trafego high ticket"],
    matchingNiches: ["consultoria", "servicos", "interiores", "arquitetura", "juridico", "b2b"],
    metrics: [
      { value: "+valor", label: "percebido quando a marca sustenta o ticket" },
      { value: "Mais clareza", label: "na jornada entre interesse, diagnostico e proposta" },
      { value: "Menos commoditizacao", label: "com posicionamento e prova melhor estruturados" },
    ],
    painPoints: [
      "Marca e site nao traduzem o nivel real de entrega do negocio.",
      "Captacao depende demais de networking e indicacao sem previsibilidade.",
      "Conteudo existe, mas nao constroi autoridade nem favorece a venda consultiva.",
      "Comercial recebe leads sem contexto ou sem maturidade para o ticket.",
    ],
    serviceMix: [
      {
        label: "Branding / Posicionamento",
        href: "/branding",
        description: "Clareza de discurso, identidade e percepcao alinhadas ao nivel do servico.",
      },
      {
        label: "Web / Landing Pages",
        href: "/web",
        description: "Site e paginas que explicam valor, prova, metodo e proximo passo com mais criterio.",
      },
      {
        label: "Trafego Pago",
        href: "/trafego-pago",
        description: "Campanhas para demanda de alta intencao, diagnostico e oportunidades consultivas.",
      },
      {
        label: "Social Media",
        href: "/social-media",
        description: "Conteudo e presenca que mantem a marca viva e relevante para o mercado certo.",
      },
    ],
    differentiators: [
      "Forte peso em narrativa, prova e experiencia digital para elevar valor percebido.",
      "Leitura comercial de funil consultivo, nao apenas de lead barato.",
      "Integracao entre posicionamento, captacao e follow-up para proteger o ticket.",
    ],
    playbook: [
      {
        step: "01",
        title: "Posicionamento executivo",
        description: "Organizamos discurso, prova, diferenciais e recorte de publico para reduzir ambiguidade comercial.",
      },
      {
        step: "02",
        title: "Estrutura digital premium",
        description: "Site, paginas e ativos ganham mais clareza, sofisticacao e funcao comercial.",
      },
      {
        step: "03",
        title: "Demanda qualificada",
        description: "Campanhas e conteudo passam a atrair o perfil de oportunidade mais aderente ao ticket.",
      },
      {
        step: "04",
        title: "Ritmo de relacionamento",
        description: "Social, email e follow-up sustentam lembranca e maturidade ao longo do ciclo de venda.",
      },
    ],
    caseHighlights: [
      {
        title: "Consultoria especializada com agenda comercial mais limpa",
        companyLabel: "Operacao B2B de ciclo consultivo",
        challenge: "Boa reputacao no offline, mas baixa previsibilidade e site pouco vendedor.",
        approach: "Reposicionamento, nova pagina institucional, campanha de diagnostico e rotina de conteudo executivo.",
        result: "Mais reunioes aderentes, menor dependencia de indicacao e melhor percepcao na entrada do funil.",
        metrics: [
          { value: "+41%", label: "taxa de reuniao" },
          { value: "+18%", label: "aceite de proposta" },
        ],
      },
      {
        title: "Escritorio premium com presenca mais forte no digital",
        companyLabel: "Servico baseado em confianca e prova",
        challenge: "Conteudo disperso e imagem abaixo do nivel de entrega.",
        approach: "Social estrategico, branding verbal, videos curtos e site mais institucional-comercial.",
        result: "Marca mais coerente, mais confianca percebida e ciclo de conversa mais qualificado.",
        metrics: [
          { value: "+3.2x", label: "engajamento qualificado" },
          { value: "+26%", label: "leads com aderencia" },
        ],
      },
    ],
    ctaTitle: "Quer transformar presenca digital em vantagem comercial para o seu servico premium?",
    ctaDescription:
      "Podemos estruturar posicionamento, captacao e experiencia digital para sustentar mais valor percebido e mais previsibilidade de negocio.",
  },
];

function includesAnyNiche(niche: string, matchingNiches: string[]) {
  const normalizedNiche = niche.trim().toLowerCase();
  return matchingNiches.some((term) => normalizedNiche.includes(term));
}

export function getSectorCatalog(
  caseStudies: CaseStudyRecord[] = [],
  catalog: SectorPageContent[] = defaultSectorCatalog,
): SectorPageViewModel[] {
  return catalog.map((sector) => ({
    ...sector,
    matchedCaseStudies: caseStudies.filter((caseStudy) => includesAnyNiche(caseStudy.niche, sector.matchingNiches)).slice(0, 2),
  }));
}

export function getSectorBySlug(
  slug: string,
  caseStudies: CaseStudyRecord[] = [],
  catalog: SectorPageContent[] = defaultSectorCatalog,
): SectorPageViewModel | null {
  return getSectorCatalog(caseStudies, catalog).find((sector) => sector.slug === slug) ?? null;
}
