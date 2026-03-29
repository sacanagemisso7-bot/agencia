import { format } from "date-fns";

import { getAutomationSettings } from "@/modules/automation-config/repository";
import { listCampaigns } from "@/modules/campaigns/repository";
import { listClients } from "@/modules/clients/repository";
import { listFinancialEntries } from "@/modules/finance/repository";
import { rankLeadsByIntent } from "@/modules/leads/intent";
import { listLeads } from "@/modules/leads/repository";
import { listMessages } from "@/modules/messages/repository";
import { listProposals } from "@/modules/proposals/repository";

function incrementCounter(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function normalizeDimension(value?: string | null, fallback = "Nao identificado") {
  const normalized = value?.trim();
  return normalized ? normalized : fallback;
}

type AttributionBucket = {
  label: string;
  leads: number;
  convertedClients: number;
  acceptedProposals: number;
  paidRevenue: number;
};

function ensureAttributionBucket(map: Map<string, AttributionBucket>, label: string) {
  const existing = map.get(label);

  if (existing) {
    return existing;
  }

  const created: AttributionBucket = {
    label,
    leads: 0,
    convertedClients: 0,
    acceptedProposals: 0,
    paidRevenue: 0,
  };

  map.set(label, created);
  return created;
}

export async function getReportsSnapshot() {
  const [automationSettings, clients, leads, proposals, messages, campaigns, finance] = await Promise.all([
    getAutomationSettings(),
    listClients(),
    listLeads(),
    listProposals(),
    listMessages(),
    listCampaigns(),
    listFinancialEntries(),
  ]);

  const paidRevenue = finance
    .filter((entry) => entry.status === "PAID")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const pendingRevenue = finance
    .filter((entry) => entry.status === "PENDING" || entry.status === "OVERDUE")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const overdueEntries = finance.filter((entry) => entry.status === "OVERDUE").length;
  const queuedMessages = messages.filter((message) => message.status === "QUEUED").length;
  const sentMessages = messages.filter((message) => message.status === "SENT").length;
  const acceptedProposals = proposals.filter((proposal) => proposal.status === "ACCEPTED").length;

  const proposalAcceptanceRate = proposals.length ? (acceptedProposals / proposals.length) * 100 : 0;
  const leadConversionRate = leads.length ? (leads.filter((lead) => lead.status === "WON").length / leads.length) * 100 : 0;
  const rankedLeads = rankLeadsByIntent(leads, automationSettings);
  const highIntentLeads = rankedLeads.filter((item) => item.assessment.isHighIntent);
  const trackedLeads = leads.filter(
    (lead) => Boolean(lead.utmSource || lead.utmMedium || lead.utmCampaign || lead.utmContent || lead.utmTerm),
  );
  const leadMap = new Map(leads.map((lead) => [lead.id, lead] as const));
  const clientMap = new Map(clients.map((client) => [client.id, client] as const));

  const leadsBySourceMap = new Map<string, number>();
  const utmSourceMap = new Map<string, number>();
  const utmMediumMap = new Map<string, number>();
  const utmCampaignMap = new Map<string, number>();
  const landingPagesMap = new Map<string, number>();
  for (const lead of leads) {
    incrementCounter(leadsBySourceMap, normalizeDimension(lead.source, "Sem origem"));
    incrementCounter(utmSourceMap, normalizeDimension(lead.utmSource, "Direto / nao identificado"));
    incrementCounter(utmMediumMap, normalizeDimension(lead.utmMedium, "Sem medium"));
    incrementCounter(utmCampaignMap, normalizeDimension(lead.utmCampaign, "Sem campanha"));
    incrementCounter(landingPagesMap, normalizeDimension(lead.landingPage, "Pagina nao informada"));
  }

  const channelMixMap = new Map<string, number>();
  for (const message of messages) {
    incrementCounter(channelMixMap, message.channel);
  }

  const monthlyFinanceMap = new Map<string, number>();
  const sourceAttributionMap = new Map<string, AttributionBucket>();
  const campaignAttributionMap = new Map<string, AttributionBucket>();

  for (const entry of finance) {
    const referenceDate = entry.paidAt ?? entry.dueDate ?? entry.createdAt;
    const month = format(new Date(referenceDate), "MM/yyyy");
    monthlyFinanceMap.set(month, (monthlyFinanceMap.get(month) ?? 0) + entry.amount);
  }

  for (const lead of leads) {
    const sourceLabel = normalizeDimension(lead.utmSource || lead.source, "Direto / nao identificado");
    const campaignLabel = normalizeDimension(lead.utmCampaign, "Sem campanha");

    ensureAttributionBucket(sourceAttributionMap, sourceLabel).leads += 1;
    ensureAttributionBucket(campaignAttributionMap, campaignLabel).leads += 1;
  }

  for (const client of clients) {
    const convertedLead = client.convertedFromLeadId ? leadMap.get(client.convertedFromLeadId) : null;
    const sourceLabel = normalizeDimension(convertedLead?.utmSource || convertedLead?.source, "Direto / nao identificado");
    const campaignLabel = normalizeDimension(convertedLead?.utmCampaign, "Sem campanha");

    ensureAttributionBucket(sourceAttributionMap, sourceLabel).convertedClients += 1;
    ensureAttributionBucket(campaignAttributionMap, campaignLabel).convertedClients += 1;
  }

  for (const proposal of proposals) {
    if (proposal.status !== "ACCEPTED") {
      continue;
    }

    const lead = proposal.leadId
      ? leadMap.get(proposal.leadId)
      : proposal.clientId
        ? leadMap.get(clientMap.get(proposal.clientId)?.convertedFromLeadId ?? "")
        : null;

    const sourceLabel = normalizeDimension(lead?.utmSource || lead?.source, "Direto / nao identificado");
    const campaignLabel = normalizeDimension(lead?.utmCampaign, "Sem campanha");

    ensureAttributionBucket(sourceAttributionMap, sourceLabel).acceptedProposals += 1;
    ensureAttributionBucket(campaignAttributionMap, campaignLabel).acceptedProposals += 1;
  }

  for (const entry of finance) {
    if (entry.status !== "PAID") {
      continue;
    }

    const client = clientMap.get(entry.clientId);
    const lead = client?.convertedFromLeadId ? leadMap.get(client.convertedFromLeadId) : null;
    const sourceLabel = normalizeDimension(lead?.utmSource || lead?.source, "Direto / nao identificado");
    const campaignLabel = normalizeDimension(lead?.utmCampaign, "Sem campanha");

    ensureAttributionBucket(sourceAttributionMap, sourceLabel).paidRevenue += entry.amount;
    ensureAttributionBucket(campaignAttributionMap, campaignLabel).paidRevenue += entry.amount;
  }

  return {
    headline: {
      totalClients: clients.length,
      activeCampaigns: campaigns.filter((campaign) => campaign.status === "ACTIVE" || campaign.status === "OPTIMIZING").length,
      paidRevenue,
      pendingRevenue,
      overdueEntries,
      queuedMessages,
      sentMessages,
      trackedLeads: trackedLeads.length,
      highIntentLeads: highIntentLeads.length,
      trackedLeadRate: leads.length ? (trackedLeads.length / leads.length) * 100 : 0,
      highIntentLeadRate: leads.length ? (highIntentLeads.length / leads.length) * 100 : 0,
      proposalAcceptanceRate,
      leadConversionRate,
    },
    leadsBySource: Array.from(leadsBySourceMap.entries())
      .map(([source, total]) => ({ source, total }))
      .sort((a, b) => b.total - a.total),
    channelMix: Array.from(channelMixMap.entries())
      .map(([channel, total]) => ({ channel, total }))
      .sort((a, b) => b.total - a.total),
    utmSources: Array.from(utmSourceMap.entries())
      .map(([label, total]) => ({ label, total }))
      .sort((a, b) => b.total - a.total),
    utmMediums: Array.from(utmMediumMap.entries())
      .map(([label, total]) => ({ label, total }))
      .sort((a, b) => b.total - a.total),
    utmCampaigns: Array.from(utmCampaignMap.entries())
      .map(([label, total]) => ({ label, total }))
      .sort((a, b) => b.total - a.total),
    landingPages: Array.from(landingPagesMap.entries())
      .map(([label, total]) => ({ label, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6),
    monthlyFinance: Array.from(monthlyFinanceMap.entries())
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => a.month.localeCompare(b.month)),
    topClientsByRevenue: clients
      .map((client) => ({
        clientName: client.companyName,
        monthlyTicket: client.monthlyTicket ?? 0,
      }))
      .sort((a, b) => b.monthlyTicket - a.monthlyTicket)
      .slice(0, 5),
    revenueAttributionBySource: Array.from(sourceAttributionMap.values()).sort((a, b) => b.paidRevenue - a.paidRevenue || b.leads - a.leads),
    revenueAttributionByCampaign: Array.from(campaignAttributionMap.values()).sort((a, b) => b.paidRevenue - a.paidRevenue || b.leads - a.leads),
    acquisitionHighlights: {
      topSource: Array.from(leadsBySourceMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Sem dados",
      topUtmSource: Array.from(utmSourceMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Sem dados",
      topCampaign: Array.from(utmCampaignMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Sem dados",
      topLandingPage: Array.from(landingPagesMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Sem dados",
    },
    recentHighIntentLeads: highIntentLeads.slice(0, 5).map(({ lead, assessment }) => ({
      id: lead.id,
      name: lead.name,
      company: lead.company,
      serviceInterest: lead.serviceInterest,
      source: lead.source,
      utmSource: lead.utmSource,
      utmCampaign: lead.utmCampaign,
      estimatedTicket: lead.estimatedTicket,
      score: assessment.score,
      reasons: assessment.reasons,
    })),
  };
}
