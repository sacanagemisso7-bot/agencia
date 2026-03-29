import { addDays, format } from "date-fns";

import { listClients } from "@/modules/clients/repository";

import { createFinancialEntry, listFinancialEntries, updateFinancialEntryStatus } from "./repository";

export async function syncFinancialOverdueEntries() {
  const entries = await listFinancialEntries();
  let updated = 0;

  for (const entry of entries) {
    if (entry.status !== "PENDING" || !entry.dueDate) {
      continue;
    }

    if (new Date(entry.dueDate).getTime() >= Date.now()) {
      continue;
    }

    await updateFinancialEntryStatus(entry.id, "OVERDUE");
    updated += 1;
  }

  return {
    reviewed: entries.length,
    updated,
  };
}

export async function getFinanceSnapshot() {
  const [entries, clients] = await Promise.all([listFinancialEntries(), listClients()]);
  const now = Date.now();

  const paidEntries = entries.filter((entry) => entry.status === "PAID");
  const pendingEntries = entries.filter((entry) => entry.status === "PENDING");
  const overdueEntries = entries.filter((entry) => entry.status === "OVERDUE");
  const cancelledEntries = entries.filter((entry) => entry.status === "CANCELLED");
  const activeMrr = clients
    .filter((client) => client.contractStatus === "ACTIVE")
    .reduce((sum, client) => sum + (client.monthlyTicket ?? 0), 0);

  const totalPaid = paidEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalPending = pendingEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalOverdue = overdueEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const forecastNext30Days = entries
    .filter((entry) => entry.status !== "CANCELLED" && entry.dueDate)
    .filter((entry) => {
      const dueTime = new Date(entry.dueDate as string).getTime();
      return dueTime >= now && dueTime <= addDays(new Date(), 30).getTime();
    })
    .reduce((sum, entry) => sum + entry.amount, 0);
  const collectionRate = totalPaid + totalOverdue > 0 ? (totalPaid / (totalPaid + totalOverdue)) * 100 : 100;

  const agingBuckets = {
    upTo7: 0,
    eightTo30: 0,
    above30: 0,
  };

  for (const entry of overdueEntries) {
    const diffDays = entry.dueDate ? Math.floor((now - new Date(entry.dueDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    if (diffDays <= 7) {
      agingBuckets.upTo7 += entry.amount;
    } else if (diffDays <= 30) {
      agingBuckets.eightTo30 += entry.amount;
    } else {
      agingBuckets.above30 += entry.amount;
    }
  }

  const monthlyProjectionMap = new Map<string, { month: string; forecast: number; paid: number }>();
  for (const entry of entries) {
    const referenceDate = entry.dueDate ?? entry.paidAt ?? entry.createdAt;
    const month = format(new Date(referenceDate), "MM/yyyy");
    const current = monthlyProjectionMap.get(month) ?? { month, forecast: 0, paid: 0 };
    current.forecast += entry.status !== "CANCELLED" ? entry.amount : 0;
    if (entry.status === "PAID") {
      current.paid += entry.amount;
    }
    monthlyProjectionMap.set(month, current);
  }

  const clientsByExposure = clients
    .map((client) => {
      const clientEntries = entries.filter((entry) => entry.clientId === client.id);
      return {
        clientId: client.id,
        clientName: client.companyName,
        pending: clientEntries
          .filter((entry) => entry.status === "PENDING")
          .reduce((sum, entry) => sum + entry.amount, 0),
        overdue: clientEntries
          .filter((entry) => entry.status === "OVERDUE")
          .reduce((sum, entry) => sum + entry.amount, 0),
        paid: clientEntries
          .filter((entry) => entry.status === "PAID")
          .reduce((sum, entry) => sum + entry.amount, 0),
      };
    })
    .sort((a, b) => b.overdue - a.overdue || b.pending - a.pending)
    .slice(0, 6);

  return {
    headline: {
      activeMrr,
      totalPaid,
      totalPending,
      totalOverdue,
      forecastNext30Days,
      cancelledAmount: cancelledEntries.reduce((sum, entry) => sum + entry.amount, 0),
      collectionRate,
      overdueCount: overdueEntries.length,
      pendingCount: pendingEntries.length,
    },
    agingBuckets,
    monthlyProjection: Array.from(monthlyProjectionMap.values()).sort((a, b) => a.month.localeCompare(b.month)),
    clientsByExposure,
    entries,
  };
}

export async function ensureContractEntryForProposal(input: {
  proposalId: string;
  proposalTitle: string;
  amount: number;
  clientId: string;
}) {
  const entries = await listFinancialEntries();
  const reference = `proposal:${input.proposalId}:contract`;

  const existing = entries.find((entry) => entry.reference === reference);
  if (existing) {
    return existing;
  }

  return createFinancialEntry({
    title: `Contrato | ${input.proposalTitle}`,
    description: "Contrato gerado automaticamente a partir do aceite da proposta.",
    type: "CONTRACT",
    status: "PENDING",
    amount: input.amount,
    dueDate: addDays(new Date(), 7).toISOString(),
    reference,
    clientId: input.clientId,
  });
}
