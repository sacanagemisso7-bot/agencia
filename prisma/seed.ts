import bcrypt from "bcryptjs";
import {
  AIRequestMode,
  AIRequestStatus,
  CampaignPlatform,
  CampaignStatus,
  ContractStatus,
  LeadStatus,
  MessageChannel,
  MessageStatus,
  PrismaClient,
  ProposalStatus,
  TaskPriority,
  TaskStatus,
  UserRole,
} from "@prisma/client";

const marketingSettingsSeed = {
  agencyName: "Ameni",
  heroTitle: "Amenize a complexidade potencialize seus resultados",
  heroSubtitle:
    "A Ameni integra estratégia, tráfego, conteúdo, social media, web e posicionamento para simplificar a operação, reduzir ruído e acelerar resultados com mais clareza.",
  primaryCta: "Solicitar diagnóstico",
  secondaryCta: "Agendar reunião",
  email: "contato@ameni.digital",
  phone: "+55 11 4000-1234",
  whatsapp: "+55 42 98891-6791",
  calendarUrl: "",
  calendarEmbedUrl: "",
  instagramUrl: "",
  linkedinUrl: "",
} as const;

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@agencia-premium.com" },
    update: {
      name: "Joice Martins",
    },
    create: {
      name: "Joice Martins",
      email: "admin@agencia-premium.com",
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: "caio@ameni.digital" },
    update: {},
    create: {
      name: "Caio Martins",
      email: "caio@ameni.digital",
      passwordHash,
      role: UserRole.ACCOUNT_MANAGER,
    },
  });

  await prisma.service.createMany({
    data: [
      {
        name: "Gestao de Trafego Pago",
        slug: "gestao-de-trafego-pago",
        description: "Planejamento, setup e otimizacao de campanhas para alta performance.",
        benefit: "Escala com previsibilidade e controle de CAC.",
        featured: true,
      },
      {
        name: "Landing Pages e CRO",
        slug: "landing-pages-cro",
        description: "Paginas de alta conversao, testes e melhoria continua de UX.",
        benefit: "Mais taxa de conversao com o mesmo investimento de midia.",
      },
      {
        name: "Criativos e Estrategia",
        slug: "criativos-e-estrategia",
        description: "Narrativa, ofertas e criativos alinhados ao funil e ao ticket.",
        benefit: "Mensagens mais fortes para acelerar vendas.",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.siteSetting.upsert({
    where: { key: "marketing.hero" },
    update: {},
    create: {
      key: "marketing.hero",
      value: marketingSettingsSeed,
    },
  });

  await prisma.testimonial.createMany({
    data: [
      {
        authorName: "Marina Torres",
        role: "CEO",
        company: "Derma Prime Clinic",
        quote: "Em 90 dias, a agencia organizou nosso funil e reduziu o CPL sem perder qualidade.",
        featured: true,
      },
      {
        authorName: "Carlos Mendes",
        role: "Diretor Comercial",
        company: "MoveFit Studios",
        quote: "O atendimento e a clareza operacional transformaram nossa visibilidade e conversao.",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.fAQ.createMany({
    data: [
      {
        question: "Em quanto tempo comecam os resultados?",
        answer: "Nos primeiros 30 dias estruturamos dados, criativos e diagnostico. Ganhos consistentes costumam aparecer entre 45 e 90 dias.",
        order: 1,
      },
      {
        question: "A agencia tambem cria as paginas?",
        answer: "Sim. O escopo pode incluir landing pages, ajustes de CRO, criativos e automacoes comerciais.",
        order: 2,
      },
    ],
    skipDuplicates: true,
  });

  const lead = await prisma.lead.create({
    data: {
      name: "Luciana Araujo",
      email: "luciana@clinicabellavita.com",
      phone: "+55 11 99999-1111",
      company: "Clinica Bella Vita",
      niche: "Estetica",
      contactPreference: "Reuniao estrategica",
      objective: "Aumentar agenda de procedimentos premium",
      message: "Quero melhorar a previsibilidade da captacao",
      source: "website",
      status: LeadStatus.PROPOSAL_SENT,
      tags: ["premium", "quente"],
      ownerId: admin.id,
    },
  });

  const client = await prisma.client.create({
    data: {
      name: "Henrique Dias",
      companyName: "Orion Imoveis",
      email: "henrique@orionimoveis.com",
      phone: "+55 21 98888-2222",
      niche: "Imobiliario",
      goals: "Gerar leads qualificados para empreendimentos de medio-alto padrao",
      monthlyTicket: 6800,
      contractStatus: ContractStatus.ACTIVE,
      activeChannels: ["email", "whatsapp", "meta"],
      notes: "Cliente valoriza relatatorios executivos e respostas rapidas.",
    },
  });

  await prisma.user.upsert({
    where: { email: client.email },
    update: {},
    create: {
      name: client.name,
      email: client.email,
      passwordHash,
      role: UserRole.CLIENT,
    },
  });

  await prisma.proposal.create({
    data: {
      title: "Retainer de Performance Q2",
      summary: "Gestao de midia, CRO e processo comercial assistido por IA.",
      scope: "Meta Ads, Google Ads, paginas, CRM e rotina de follow-up.",
      price: 6500,
      status: ProposalStatus.SENT,
      leadId: lead.id,
      createdById: admin.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Revisar criativos da campanha de captacao",
      description: "Subir tres variacoes de angulo para publico de fundo de funil.",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      ownerId: admin.id,
      clientId: client.id,
    },
  });

  await prisma.campaign.create({
    data: {
      name: "Leads Meta - Condominio Vista",
      objective: "Gerar oportunidades para o lancamento premium",
      platform: CampaignPlatform.META,
      budget: 15000,
      status: CampaignStatus.OPTIMIZING,
      metrics: {
        cpl: 49.2,
        ctr: 1.8,
        leads: 184,
      },
      clientId: client.id,
    },
  });

  const aiRequest = await prisma.aIRequest.create({
    data: {
      input: "Crie um follow-up educado para proposta enviada ha 3 dias.",
      objective: "Retomar a negociacao com seguranca",
      tone: "consultivo",
      responseSize: "medio",
      mode: AIRequestMode.SAVE_DRAFT,
      status: AIRequestStatus.GENERATED,
      generatedText:
        "Oi Luciana, tudo bem? Passei para retomar a proposta enviada e entender se faz sentido alinharmos os proximos passos.",
      leadId: lead.id,
      createdById: admin.id,
    },
  });

  const message = await prisma.message.create({
    data: {
      subject: "Follow-up da proposta",
      body: "Oi Luciana, tudo bem? Passei para retomar a proposta enviada e entender se faz sentido alinharmos os proximos passos.",
      channel: MessageChannel.EMAIL,
      status: MessageStatus.DRAFT,
      scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 12),
      recipientName: lead.name,
      recipientEmail: lead.email,
      leadId: lead.id,
      aiRequestId: aiRequest.id,
      createdById: admin.id,
    },
  });

  await prisma.activityLog.createMany({
    data: [
      {
        action: "lead.created",
        entityType: "Lead",
        entityId: lead.id,
        description: "Lead criado a partir do formulario do site.",
        actorId: admin.id,
        leadId: lead.id,
      },
      {
        action: "message.draft",
        entityType: "Message",
        entityId: message.id,
        description: "IA gerou um rascunho de follow-up para o lead.",
        actorId: admin.id,
        leadId: lead.id,
        messageId: message.id,
        aiRequestId: aiRequest.id,
      },
    ],
  });

  await prisma.financialEntry.createMany({
    data: [
      {
        title: "Mensalidade Ameni Digital Marketing - Março",
        description: "Retainer mensal de performance e operação comercial.",
        type: "INVOICE",
        status: "PENDING",
        amount: 6800,
        dueDate: new Date("2026-03-20T00:00:00.000Z"),
        reference: "INV-2026-003",
        clientId: client.id,
      },
      {
        title: "Pagamento Dermacare - Fevereiro",
        type: "PAYMENT",
        status: "PAID",
        amount: 5200,
        paidAt: new Date("2026-03-05T14:30:00.000Z"),
        reference: "PAY-2026-014",
        clientId: client.id,
      },
    ],
  });

  await prisma.attachment.create({
    data: {
      title: "Proposta comercial Q2",
      fileName: "proposta-q2.pdf",
      fileUrl: "https://example.com/proposta-q2.pdf",
      mimeType: "application/pdf",
      notes: "Versao enviada ao cliente para avaliacao.",
      clientId: client.id,
      leadId: lead.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
