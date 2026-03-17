import type { SelectOption } from "@/lib/types";

export const marketingNavigation = [
  { href: "/", label: "Home" },
  { href: "/sobre", label: "Sobre" },
  { href: "/servicos", label: "Servicos" },
  { href: "/cases", label: "Cases" },
  { href: "/depoimentos", label: "Depoimentos" },
  { href: "/insights", label: "Insights" },
  { href: "/contato", label: "Contato" },
];

export const adminNavigation = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/reports", label: "Relatorios" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/clients", label: "Clientes" },
  { href: "/admin/proposals", label: "Propostas" },
  { href: "/admin/tasks", label: "Tarefas" },
  { href: "/admin/campaigns", label: "Campanhas" },
  { href: "/admin/finance", label: "Financeiro" },
  { href: "/admin/messages", label: "Mensagens" },
  { href: "/admin/ai", label: "Central IA" },
  { href: "/admin/site", label: "CMS" },
  { href: "/admin/logs", label: "Logs" },
];

export const leadStatusOptions: SelectOption[] = [
  { value: "NEW", label: "Novo" },
  { value: "CONTACTED", label: "Contato iniciado" },
  { value: "MEETING_SCHEDULED", label: "Reuniao marcada" },
  { value: "PROPOSAL_SENT", label: "Proposta enviada" },
  { value: "NEGOTIATION", label: "Negociacao" },
  { value: "WON", label: "Fechado" },
  { value: "LOST", label: "Perdido" },
];

export const contractStatusOptions: SelectOption[] = [
  { value: "PENDING", label: "Pendente" },
  { value: "ACTIVE", label: "Ativo" },
  { value: "PAUSED", label: "Pausado" },
  { value: "ENDED", label: "Encerrado" },
];

export const proposalStatusOptions: SelectOption[] = [
  { value: "DRAFT", label: "Rascunho" },
  { value: "SENT", label: "Enviada" },
  { value: "VIEWED", label: "Visualizada" },
  { value: "ACCEPTED", label: "Aceita" },
  { value: "REJECTED", label: "Rejeitada" },
  { value: "EXPIRED", label: "Expirada" },
];

export const taskStatusOptions: SelectOption[] = [
  { value: "TODO", label: "A fazer" },
  { value: "IN_PROGRESS", label: "Em andamento" },
  { value: "REVIEW", label: "Em revisao" },
  { value: "DONE", label: "Concluida" },
];

export const taskPriorityOptions: SelectOption[] = [
  { value: "LOW", label: "Baixa" },
  { value: "MEDIUM", label: "Media" },
  { value: "HIGH", label: "Alta" },
  { value: "URGENT", label: "Urgente" },
];

export const campaignPlatformOptions: SelectOption[] = [
  { value: "META", label: "Meta Ads" },
  { value: "GOOGLE", label: "Google Ads" },
  { value: "LINKEDIN", label: "LinkedIn" },
  { value: "TIKTOK", label: "TikTok" },
  { value: "OTHER", label: "Outro" },
];

export const campaignStatusOptions: SelectOption[] = [
  { value: "PLANNING", label: "Planejamento" },
  { value: "ACTIVE", label: "Ativa" },
  { value: "OPTIMIZING", label: "Otimizando" },
  { value: "PAUSED", label: "Pausada" },
  { value: "COMPLETED", label: "Concluida" },
];

export const messageChannelOptions: SelectOption[] = [
  { value: "EMAIL", label: "Email" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "INTERNAL", label: "Mensagem interna" },
  { value: "SMS", label: "SMS" },
];

export const financialTypeOptions: SelectOption[] = [
  { value: "CONTRACT", label: "Contrato" },
  { value: "INVOICE", label: "Fatura" },
  { value: "PAYMENT", label: "Pagamento" },
  { value: "ADJUSTMENT", label: "Ajuste" },
];

export const financialStatusOptions: SelectOption[] = [
  { value: "PENDING", label: "Pendente" },
  { value: "PAID", label: "Pago" },
  { value: "OVERDUE", label: "Atrasado" },
  { value: "CANCELLED", label: "Cancelado" },
];

export const aiToneOptions: SelectOption[] = [
  { value: "formal", label: "Formal" },
  { value: "consultivo", label: "Consultivo" },
  { value: "premium", label: "Premium" },
  { value: "amigavel", label: "Amigavel" },
  { value: "estrategico", label: "Estrategico" },
  { value: "vendedor", label: "Vendedor" },
];

export const aiModeOptions: SelectOption[] = [
  { value: "TEXT_ONLY", label: "Apenas gerar" },
  { value: "SAVE_DRAFT", label: "Gerar e salvar rascunho" },
  { value: "AUTO_SEND", label: "Gerar e enviar" },
  { value: "GENERATE_PROPOSAL", label: "Gerar proposta" },
  { value: "CREATE_TASK", label: "Gerar tarefa" },
  { value: "INTERNAL_SUMMARY", label: "Gerar resumo interno" },
];
