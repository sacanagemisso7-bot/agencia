import type {
  ActivityRecord,
  AIRequestRecord,
  AttachmentRecord,
  BlogPostRecord,
  CampaignRecord,
  CaseStudyRecord,
  ClientRecord,
  DashboardSummary,
  FinancialRecord,
  FAQRecord,
  LeadRecord,
  MessageRecord,
  ProposalRecord,
  ServiceRecord,
  SiteSettingsRecord,
  TaskRecord,
  TestimonialRecord,
  UserSession,
} from "@/lib/types";

export const demoAdminUser: UserSession = {
  id: "user_admin_1",
  name: "Amanda Rocha",
  email: "admin@agencia-premium.com",
  role: "ADMIN",
};

export const demoSettings: SiteSettingsRecord = {
  agencyName: "Atlas Growth Studio",
  heroTitle: "Trafego, oferta e operacao comercial alinhados para escalar vendas de alto ticket.",
  heroSubtitle:
    "Unimos estrategia, midia, CRO e IA comercial para transformar investimento em pipeline previsivel.",
  primaryCta: "Agendar diagnostico",
  secondaryCta: "Ver cases",
  email: "contato@atlasgrowth.studio",
  phone: "+55 11 4000-1234",
  whatsapp: "+55 11 98888-0000",
};

export const demoServices: ServiceRecord[] = [
  {
    id: "svc_1",
    name: "Gestao de trafego pago",
    slug: "gestao-de-trafego-pago",
    description: "Planejamento de canais, setup tecnico, rotina de otimizacao e leitura executiva.",
    benefit: "Mais previsibilidade de aquisicao e controle de CAC.",
    featured: true,
  },
  {
    id: "svc_2",
    name: "Landing pages e CRO",
    slug: "landing-pages-e-cro",
    description: "Paginas de alta conversao, testes de oferta e melhoria continua da jornada.",
    benefit: "Mais conversao sem necessariamente aumentar investimento.",
    featured: true,
  },
  {
    id: "svc_3",
    name: "Criativos e estrategia digital",
    slug: "criativos-e-estrategia-digital",
    description: "Criativos, ganchos, ofertas e direcionamento por etapa do funil.",
    benefit: "Mensagens mais fortes e campanhas com maior aderencia.",
  },
  {
    id: "svc_4",
    name: "Funis e automacao comercial",
    slug: "funis-e-automacao-comercial",
    description: "Fluxos de qualificação, follow-up e operacao assistida por IA.",
    benefit: "Equipe mais produtiva e menos oportunidades perdidas.",
  },
];

export const demoTestimonials: TestimonialRecord[] = [
  {
    id: "test_1",
    authorName: "Marina Torres",
    role: "CEO",
    company: "Derma Prime Clinic",
    quote:
      "A agencia organizou nossa captacao premium, reduziu o CPL e nos deu um processo comercial muito mais claro.",
    featured: true,
  },
  {
    id: "test_2",
    authorName: "Carlos Mendes",
    role: "Diretor Comercial",
    company: "MoveFit Studios",
    quote:
      "Nao foi so trafego. Houve melhoria de oferta, mensagens, paginas e follow-ups. Virou uma maquina mais consistente.",
  },
  {
    id: "test_3",
    authorName: "Beatriz Nogueira",
    role: "Socia",
    company: "Nogueira Interiores",
    quote:
      "O painel nos da visibilidade do que esta acontecendo e a IA agiliza muito os retornos comerciais.",
  },
];

export const demoCaseStudies: CaseStudyRecord[] = [
  {
    id: "case_1",
    title: "Clinica premium com agenda mais previsivel",
    niche: "Estetica",
    challenge: "Leads inconsistentes e excesso de dependencia de indicacao.",
    solution: "Reposicionamento da oferta, criativos novos, landing page e rotina comercial orientada por IA.",
    result: "CPL 31% menor e aumento de 42% em consultas agendadas.",
    metrics: {
      consultas: "+42%",
      cpl: "-31%",
      show_rate: "+18%",
    },
    featured: true,
  },
  {
    id: "case_2",
    title: "Loteamento de medio-alto padrao com leads qualificados",
    niche: "Imobiliario",
    challenge: "Muito volume com pouca qualidade para o time de vendas.",
    solution: "Segmentacao refinada, paginas por intencao e follow-up consultivo por etapa.",
    result: "Melhora na qualificacao e 2,6x mais oportunidades reais.",
    metrics: {
      oportunidades: "2,6x",
      taxa_reuniao: "+37%",
    },
  },
];

export const demoFaqs: FAQRecord[] = [
  {
    id: "faq_1",
    question: "Em quanto tempo os resultados costumam aparecer?",
    answer:
      "Nos primeiros 30 dias estruturamos conta, dados, criativos e paginas. Ganhos mais consistentes costumam ser percebidos entre 45 e 90 dias.",
    order: 1,
  },
  {
    id: "faq_2",
    question: "Vocês atuam so com midia paga?",
    answer:
      "Nao. A proposta inclui oferta, criativos, landing pages, CRM, follow-up e IA comercial quando faz sentido para o projeto.",
    order: 2,
  },
  {
    id: "faq_3",
    question: "A agencia atende negocios high-ticket?",
    answer:
      "Sim. A operacao foi desenhada para servicos, clinicas, mercado imobiliario, educacao premium e negocios com ciclo comercial mais consultivo.",
    order: 3,
  },
];

export const demoBlogPosts: BlogPostRecord[] = [
  {
    id: "blog_1",
    title: "Como reduzir CPL sem sacrificar qualidade do lead",
    slug: "como-reduzir-cpl-sem-sacrificar-qualidade",
    excerpt: "Os ajustes que mais movem ponteiros quando o problema nao e so a campanha, mas a oferta e a jornada.",
    category: "Performance",
    publishedAt: "2026-02-12T09:00:00.000Z",
  },
  {
    id: "blog_2",
    title: "O que uma agencia premium precisa mostrar no primeiro atendimento",
    slug: "o-que-uma-agencia-premium-precisa-mostrar",
    excerpt: "Estrutura comercial, narrativa e provas que aumentam conversao de diagnostico para proposta.",
    category: "Comercial",
    publishedAt: "2026-02-24T09:00:00.000Z",
  },
];

export const demoLeads: LeadRecord[] = [
  {
    id: "lead_1",
    name: "Luciana Araujo",
    email: "luciana@clinicabellavita.com",
    phone: "+55 11 99999-1111",
    company: "Clinica Bella Vita",
    niche: "Estetica",
    objective: "Aumentar agenda de procedimentos premium",
    message: "Quero mais previsibilidade de captacao e uma rotina melhor para o comercial.",
    source: "website",
    status: "PROPOSAL_SENT",
    tags: ["quente", "premium"],
    notes: "Fez reuniao e gostou do diagnostico.",
    ownerName: "Amanda Rocha",
    createdAt: "2026-03-10T13:30:00.000Z",
  },
  {
    id: "lead_2",
    name: "Rafael Pinto",
    email: "rafael@vistaimoveis.com",
    phone: "+55 21 97777-1111",
    company: "Vista Imoveis",
    niche: "Imobiliario",
    objective: "Gerar leads para lancamento",
    source: "indicação",
    status: "NEGOTIATION",
    tags: ["alto-ticket"],
    ownerName: "Amanda Rocha",
    createdAt: "2026-03-11T10:15:00.000Z",
  },
  {
    id: "lead_3",
    name: "Juliana Porto",
    email: "juliana@nutriforma.com",
    company: "NutriForma",
    niche: "Saude",
    objective: "Escalar vendas de programa online",
    source: "blog",
    status: "CONTACTED",
    tags: ["follow-up"],
    ownerName: "Amanda Rocha",
    createdAt: "2026-03-15T17:10:00.000Z",
  },
];

export const demoClients: ClientRecord[] = [
  {
    id: "client_1",
    name: "Henrique Dias",
    companyName: "Orion Imoveis",
    email: "henrique@orionimoveis.com",
    phone: "+55 21 98888-2222",
    niche: "Imobiliario",
    goals: "Gerar oportunidades qualificadas para empreendimentos premium",
    monthlyTicket: 6800,
    contractStatus: "ACTIVE",
    activeChannels: ["Email", "WhatsApp", "Meta Ads"],
    notes: "Valoriza clareza executiva e dashboard de acompanhamento.",
    websiteUrl: "https://orionimoveis.com.br",
    createdAt: "2026-01-22T09:00:00.000Z",
  },
  {
    id: "client_2",
    name: "Patricia Luz",
    companyName: "Dermacare Prime",
    email: "patricia@dermacareprime.com",
    niche: "Estetica",
    goals: "Aumentar consultas para procedimentos de maior ticket",
    monthlyTicket: 5200,
    contractStatus: "ACTIVE",
    activeChannels: ["Email", "Google Ads"],
    createdAt: "2026-02-04T09:00:00.000Z",
  },
];

export const demoProposals: ProposalRecord[] = [
  {
    id: "prop_1",
    title: "Retainer de performance Q2",
    summary: "Gestao de midia, CRO e IA comercial para acelerar o pipeline.",
    scope: "Meta Ads, Google Ads, landing pages e automacao comercial.",
    price: 6500,
    status: "SENT",
    leadId: "lead_1",
    leadName: "Luciana Araujo",
    validUntil: "2026-03-25T23:59:00.000Z",
    createdAt: "2026-03-12T15:20:00.000Z",
  },
  {
    id: "prop_2",
    title: "Sprint de funil de lancamento",
    summary: "Plano de 60 dias para captacao e qualificacao do lancamento.",
    scope: "Estrutura Meta, paginas, CRM e roteiros comerciais.",
    price: 9800,
    status: "DRAFT",
    clientId: "client_1",
    clientName: "Orion Imoveis",
    createdAt: "2026-03-14T08:00:00.000Z",
  },
];

export const demoTasks: TaskRecord[] = [
  {
    id: "task_1",
    title: "Revisar criativos da campanha de captacao",
    description: "Subir tres variacoes de angulo para fundo de funil.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    dueDate: "2026-03-18T17:00:00.000Z",
    ownerName: "Amanda Rocha",
    clientId: "client_1",
    clientName: "Orion Imoveis",
    createdAt: "2026-03-15T11:00:00.000Z",
  },
  {
    id: "task_2",
    title: "Mandar follow-up da proposta",
    status: "TODO",
    priority: "MEDIUM",
    leadId: "lead_1",
    leadName: "Luciana Araujo",
    createdAt: "2026-03-15T14:30:00.000Z",
  },
];

export const demoCampaigns: CampaignRecord[] = [
  {
    id: "camp_1",
    name: "Leads Meta - Condominio Vista",
    objective: "Gerar oportunidades para o lancamento premium",
    platform: "META",
    budget: 15000,
    status: "OPTIMIZING",
    metrics: {
      leads: 184,
      cpl: 49.2,
      ctr: "1.8%",
    },
    clientId: "client_1",
    clientName: "Orion Imoveis",
    createdAt: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "camp_2",
    name: "Google Search - Harmonizacao",
    objective: "Captar pacientes para procedimento premium",
    platform: "GOOGLE",
    budget: 7800,
    status: "ACTIVE",
    metrics: {
      conversoes: 44,
      cpa: 82,
    },
    clientId: "client_2",
    clientName: "Dermacare Prime",
    createdAt: "2026-03-06T10:00:00.000Z",
  },
];

export const demoMessages: MessageRecord[] = [
  {
    id: "msg_1",
    subject: "Follow-up da proposta",
    body: "Oi Luciana, tudo bem? Passei para retomar a proposta enviada e entender se faz sentido alinharmos os proximos passos.",
    channel: "EMAIL",
    status: "DRAFT",
    recipientName: "Luciana Araujo",
    recipientEmail: "luciana@clinicabellavita.com",
    leadId: "lead_1",
    leadName: "Luciana Araujo",
    aiRequestId: "ai_1",
    scheduledFor: "2026-03-16T09:00:00.000Z",
    providerName: "mock-email",
    createdAt: "2026-03-15T15:10:00.000Z",
  },
  {
    id: "msg_2",
    subject: "Resumo da reuniao semanal",
    body: "Resumo: CPL estabilizou, proximo passo e testar nova promessa no anuncio e revisar segmentacao.",
    channel: "EMAIL",
    status: "SENT",
    recipientName: "Henrique Dias",
    recipientEmail: "henrique@orionimoveis.com",
    clientId: "client_1",
    clientName: "Orion Imoveis",
    providerName: "mock-email",
    providerMessageId: "provider-msg-1",
    sentAt: "2026-03-14T19:00:00.000Z",
    createdAt: "2026-03-14T18:55:00.000Z",
  },
];

export const demoFinancialRecords: FinancialRecord[] = [
  {
    id: "fin_1",
    title: "Mensalidade Atlas OS - Marco",
    description: "Retainer mensal de performance e operacao comercial.",
    type: "INVOICE",
    status: "PENDING",
    amount: 6800,
    dueDate: "2026-03-20T00:00:00.000Z",
    reference: "INV-2026-003",
    clientId: "client_1",
    clientName: "Orion Imoveis",
    createdAt: "2026-03-01T09:00:00.000Z",
  },
  {
    id: "fin_2",
    title: "Mensalidade Dermacare - Fevereiro",
    type: "PAYMENT",
    status: "PAID",
    amount: 5200,
    paidAt: "2026-03-05T14:30:00.000Z",
    reference: "PAY-2026-014",
    clientId: "client_2",
    clientName: "Dermacare Prime",
    createdAt: "2026-03-05T14:30:00.000Z",
  },
];

export const demoAttachments: AttachmentRecord[] = [
  {
    id: "att_1",
    title: "Proposta comercial Q2",
    fileName: "proposta-q2.pdf",
    fileUrl: "https://example.com/proposta-q2.pdf",
    mimeType: "application/pdf",
    notes: "Versao enviada ao cliente para avaliacao.",
    clientId: "client_1",
    clientName: "Orion Imoveis",
    proposalId: "prop_2",
    proposalTitle: "Sprint de funil de lancamento",
    createdAt: "2026-03-14T09:15:00.000Z",
  },
];

export const demoAIRequests: AIRequestRecord[] = [
  {
    id: "ai_1",
    input: "Crie um follow-up consultivo da proposta enviada ha 3 dias.",
    objective: "Retomar a negociacao",
    tone: "consultivo",
    responseSize: "medio",
    mode: "SAVE_DRAFT",
    status: "GENERATED",
    generatedText:
      "Oi Luciana, tudo bem? Quis retomar a proposta para entender se fez sentido para o momento da clinica. Se achar util, posso resumir os proximos passos e o impacto esperado em agenda e previsibilidade.",
    leadId: "lead_1",
    leadName: "Luciana Araujo",
    createdAt: "2026-03-15T15:00:00.000Z",
  },
];

export const demoActivities: ActivityRecord[] = [
  {
    id: "log_1",
    action: "lead.created",
    entityType: "Lead",
    entityId: "lead_3",
    description: "Novo lead entrou pelo blog e foi atribuido para atendimento.",
    actorName: "Sistema",
    createdAt: "2026-03-15T17:12:00.000Z",
  },
  {
    id: "log_2",
    action: "ai.generated",
    entityType: "AIRequest",
    entityId: "ai_1",
    description: "IA gerou um follow-up consultivo e salvou como rascunho.",
    actorName: "Amanda Rocha",
    createdAt: "2026-03-15T15:05:00.000Z",
  },
  {
    id: "log_3",
    action: "campaign.optimized",
    entityType: "Campaign",
    entityId: "camp_1",
    description: "Atualizacao de criativos e redistribuicao de verba em conjunto com a equipe.",
    actorName: "Amanda Rocha",
    createdAt: "2026-03-14T16:40:00.000Z",
  },
];

export const demoDashboardSummary: DashboardSummary = {
  totalLeads: 38,
  activeClients: 12,
  openProposals: 6,
  pendingTasks: 9,
  runningCampaigns: 7,
  aiMessagesSent: 23,
  conversionRate: 32,
  estimatedRevenue: 84200,
};

export function createDemoSnapshot() {
  return {
    settings: structuredClone(demoSettings),
    services: structuredClone(demoServices),
    testimonials: structuredClone(demoTestimonials),
    caseStudies: structuredClone(demoCaseStudies),
    faqs: structuredClone(demoFaqs),
    blogPosts: structuredClone(demoBlogPosts),
    leads: structuredClone(demoLeads),
    clients: structuredClone(demoClients),
    proposals: structuredClone(demoProposals),
    tasks: structuredClone(demoTasks),
    campaigns: structuredClone(demoCampaigns),
    messages: structuredClone(demoMessages),
    financialRecords: structuredClone(demoFinancialRecords),
    attachments: structuredClone(demoAttachments),
    aiRequests: structuredClone(demoAIRequests),
    activities: structuredClone(demoActivities),
    dashboardSummary: structuredClone(demoDashboardSummary),
  };
}
