import { defaultAutomationSettings } from "@/lib/automation-config";
import type { AutomationSettingsRecord, LeadRecord } from "@/lib/types";

export type LeadIntentAssessment = {
  score: number;
  isHighIntent: boolean;
  priorityLabel: "Alta prioridade" | "Media prioridade" | "Baixa prioridade";
  reasons: string[];
};

export type LeadSlaStatus = "on-track" | "due-soon" | "overdue";

export type LeadSlaAssessment = {
  dueAt: string;
  responseWindowHours: number;
  status: LeadSlaStatus;
  label: string;
};

const urgencyScores: Record<string, { score: number; reason: string }> = {
  imediata: { score: 34, reason: "urgencia imediata para iniciar o projeto" },
  "30-dias": { score: 24, reason: "janela curta de decisao" },
  "60-90-dias": { score: 14, reason: "prazo definido para comecar" },
  planejamento: { score: 6, reason: "interesse em planejamento estruturado" },
};

function getTicketSignal(estimatedTicket?: number | null) {
  if (!estimatedTicket) {
    return null;
  }

  if (estimatedTicket >= 30000) {
    return { score: 34, reason: "faixa de investimento muito forte" };
  }

  if (estimatedTicket >= 15000) {
    return { score: 28, reason: "orcamento com potencial de alta prioridade" };
  }

  if (estimatedTicket >= 7000) {
    return { score: 20, reason: "faixa de investimento aderente a operacao premium" };
  }

  if (estimatedTicket >= 3000) {
    return { score: 10, reason: "orcamento ja sinaliza intencao real" };
  }

  return null;
}

function normalizeText(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

function getLeadResponseWindowHours(
  lead: Pick<LeadRecord, "urgency" | "estimatedTicket" | "serviceInterest">,
  settings: AutomationSettingsRecord,
) {
  if (lead.urgency === "imediata") {
    return settings.leadSlaImmediateHours;
  }

  if (lead.urgency === "30-dias") {
    return settings.leadSlaThirtyDaysHours;
  }

  if (lead.urgency === "60-90-dias") {
    return settings.leadSlaSixtyToNinetyDaysHours;
  }

  if (lead.urgency === "planejamento") {
    return settings.leadSlaPlanningHours;
  }

  if (lead.serviceInterest === "Estrutura full-service" || (lead.estimatedTicket ?? 0) >= 15000) {
    return Math.min(settings.leadSlaThirtyDaysHours, settings.leadSlaDefaultHours);
  }

  return settings.leadSlaDefaultHours;
}

export function assessLeadIntent(lead: Pick<
  LeadRecord,
  | "company"
  | "contactPreference"
  | "createdAt"
  | "estimatedTicket"
  | "message"
  | "objective"
  | "serviceInterest"
  | "source"
  | "urgency"
  | "utmCampaign"
  | "utmMedium"
  | "utmSource"
>, settings: AutomationSettingsRecord = defaultAutomationSettings): LeadIntentAssessment {
  const reasons: string[] = [];
  let score = 0;

  const urgencySignal = lead.urgency ? urgencyScores[lead.urgency] : null;
  if (urgencySignal) {
    score += urgencySignal.score;
    reasons.push(urgencySignal.reason);
  }

  const ticketSignal = getTicketSignal(lead.estimatedTicket);
  if (ticketSignal) {
    score += ticketSignal.score;
    reasons.push(ticketSignal.reason);
  }

  if (lead.serviceInterest) {
    score += lead.serviceInterest === "Estrutura full-service" ? 18 : 12;
    reasons.push(`interesse em ${lead.serviceInterest.toLowerCase()}`);
  }

  if (lead.company) {
    score += 8;
    reasons.push("empresa identificada na entrada");
  }

  if (normalizeText(lead.contactPreference).includes("reuniao")) {
    score += 8;
    reasons.push("pediu reuniao estrategica no primeiro contato");
  }

  const messageText = `${lead.objective ?? ""} ${lead.message ?? ""}`.trim();
  if (messageText.length >= 60) {
    score += 10;
    reasons.push("contexto de negocio bem descrito");
  } else if (messageText.length >= 24) {
    score += 5;
    reasons.push("objetivo comercial declarado");
  }

  const source = normalizeText(lead.source);
  if (source.includes("indic")) {
    score += 16;
    reasons.push("origem por indicacao");
  } else if (source.includes("website") || source.includes("site")) {
    score += 8;
    reasons.push("entrada direta pelo site");
  }

  if (lead.utmCampaign || lead.utmSource || lead.utmMedium) {
    score += 6;
    reasons.push("captacao rastreada por UTM");
  }

  if (normalizeText(lead.utmMedium) === "cpc") {
    score += 6;
    reasons.push("lead vindo de campanha paga");
  }

  const boundedScore = Math.min(score, 100);

  if (boundedScore >= settings.highIntentThreshold) {
    return {
      score: boundedScore,
      isHighIntent: true,
      priorityLabel: "Alta prioridade",
      reasons,
    };
  }

  if (boundedScore >= Math.max(35, settings.highIntentThreshold - 25)) {
    return {
      score: boundedScore,
      isHighIntent: false,
      priorityLabel: "Media prioridade",
      reasons,
    };
  }

  return {
    score: boundedScore,
    isHighIntent: false,
    priorityLabel: "Baixa prioridade",
    reasons,
  };
}

export function rankLeadsByIntent<T extends LeadRecord>(leads: T[], settings: AutomationSettingsRecord = defaultAutomationSettings) {
  return leads
    .map((lead) => ({
      lead,
      assessment: assessLeadIntent(lead, settings),
    }))
    .sort((a, b) => {
      if (b.assessment.score !== a.assessment.score) {
        return b.assessment.score - a.assessment.score;
      }

      return new Date(b.lead.createdAt).getTime() - new Date(a.lead.createdAt).getTime();
    });
}

export function assessLeadSla(
  lead: Pick<LeadRecord, "createdAt" | "estimatedTicket" | "serviceInterest" | "urgency">,
  settings: AutomationSettingsRecord = defaultAutomationSettings,
): LeadSlaAssessment {
  const responseWindowHours = getLeadResponseWindowHours(lead, settings);
  const dueAt = new Date(new Date(lead.createdAt).getTime() + responseWindowHours * 60 * 60 * 1000).toISOString();
  const remainingHours = (new Date(dueAt).getTime() - Date.now()) / (1000 * 60 * 60);

  if (remainingHours <= 0) {
    return {
      dueAt,
      responseWindowHours,
      status: "overdue",
      label: "SLA estourado",
    };
  }

  if (remainingHours <= Math.min(2, responseWindowHours / 3)) {
    return {
      dueAt,
      responseWindowHours,
      status: "due-soon",
      label: "Responder agora",
    };
  }

  return {
    dueAt,
    responseWindowHours,
    status: "on-track",
    label: "Dentro do SLA",
  };
}
