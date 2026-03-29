export const serviceInterestOptions = [
  "Tráfego Pago",
  "Tráfego Orgânico",
  "Social Media",
  "Video Maker",
  "Web / Landing Pages",
  "Branding / Posicionamento",
  "Estrutura full-service",
] as const;

export const urgencyOptions = [
  { value: "imediata", label: "Imediata" },
  { value: "30-dias", label: "Nos próximos 30 dias" },
  { value: "60-90-dias", label: "Entre 60 e 90 dias" },
  { value: "planejamento", label: "Ainda em planejamento" },
] as const;

export const contactPreferenceOptions = [
  { value: "WhatsApp", label: "WhatsApp" },
  { value: "Email", label: "Email" },
  { value: "Reunião estratégica", label: "Reunião estratégica" },
] as const;

export const estimatedTicketOptions = [
  { value: "3000", label: "Até R$ 3 mil / mês" },
  { value: "7000", label: "Entre R$ 3 mil e R$ 7 mil / mês" },
  { value: "15000", label: "Entre R$ 7 mil e R$ 15 mil / mês" },
  { value: "30000", label: "Acima de R$ 15 mil / mês" },
] as const;

export const leadFormSteps = [
  {
    id: "identificacao",
    title: "Contexto inicial",
    description: "Quem está falando e qual empresa quer crescer agora.",
  },
  {
    id: "qualificacao",
    title: "Momento do negócio",
    description: "Entendemos serviço de interesse, canal preferido, urgência e nível de investimento.",
  },
  {
    id: "objetivo",
    title: "Objetivo e desafio",
    description: "Mapeamos meta comercial, gargalos e o tipo de diagnóstico mais útil.",
  },
] as const;

export type LeadFormStepId = (typeof leadFormSteps)[number]["id"];
