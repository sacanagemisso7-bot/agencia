import { format } from "date-fns";

import { listCampaigns } from "@/modules/campaigns/repository";
import { listClients } from "@/modules/clients/repository";
import { listFinancialEntries } from "@/modules/finance/repository";
import { listLeads } from "@/modules/leads/repository";
import { listMessages } from "@/modules/messages/repository";
import { listProposals } from "@/modules/proposals/repository";

export async function getReportsSnapshot() {
  const [clients, leads, proposals, messages, campaigns, finance] = await Promise.all([
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

  const leadsBySourceMap = new Map<string, number>();
  for (const lead of leads) {
    leadsBySourceMap.set(lead.source, (leadsBySourceMap.get(lead.source) ?? 0) + 1);
  }

  const channelMixMap = new Map<string, number>();
  for (const message of messages) {
    channelMixMap.set(message.channel, (channelMixMap.get(message.channel) ?? 0) + 1);
  }

  const monthlyFinanceMap = new Map<string, number>();
  for (const entry of finance) {
    const referenceDate = entry.paidAt ?? entry.dueDate ?? entry.createdAt;
    const month = format(new Date(referenceDate), "MM/yyyy");
    monthlyFinanceMap.set(month, (monthlyFinanceMap.get(month) ?? 0) + entry.amount);
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
      proposalAcceptanceRate,
      leadConversionRate,
    },
    leadsBySource: Array.from(leadsBySourceMap.entries())
      .map(([source, total]) => ({ source, total }))
      .sort((a, b) => b.total - a.total),
    channelMix: Array.from(channelMixMap.entries())
      .map(([channel, total]) => ({ channel, total }))
      .sort((a, b) => b.total - a.total),
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
  };
}

