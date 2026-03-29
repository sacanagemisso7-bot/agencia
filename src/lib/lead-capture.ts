export const serviceInterestOptions = [
  "Trafego Pago",
  "Trafego Organico",
  "Social Media",
  "Video Maker",
  "Web / Landing Pages",
  "Branding / Posicionamento",
  "Estrutura full-service",
] as const;

export const urgencyOptions = [
  { value: "imediata", label: "Imediata" },
  { value: "30-dias", label: "Nos proximos 30 dias" },
  { value: "60-90-dias", label: "Entre 60 e 90 dias" },
  { value: "planejamento", label: "Ainda em planejamento" },
] as const;

export const contactPreferenceOptions = [
  { value: "WhatsApp", label: "WhatsApp" },
  { value: "Email", label: "Email" },
  { value: "Reuniao estrategica", label: "Reuniao estrategica" },
] as const;

export const estimatedTicketOptions = [
  { value: "3000", label: "Ate R$ 3 mil / mes" },
  { value: "7000", label: "Entre R$ 3 mil e R$ 7 mil / mes" },
  { value: "15000", label: "Entre R$ 7 mil e R$ 15 mil / mes" },
  { value: "30000", label: "Acima de R$ 15 mil / mes" },
] as const;

export const leadFormSteps = [
  {
    id: "identificacao",
    title: "Contexto inicial",
    description: "Quem esta falando e qual empresa quer crescer agora.",
  },
  {
    id: "qualificacao",
    title: "Momento do negocio",
    description: "Entendemos servico de interesse, canal preferido, urgencia e nivel de investimento.",
  },
  {
    id: "objetivo",
    title: "Objetivo e desafio",
    description: "Mapeamos meta comercial, gargalos e o tipo de diagnostico mais util.",
  },
] as const;

export type LeadFormStepId = (typeof leadFormSteps)[number]["id"];
