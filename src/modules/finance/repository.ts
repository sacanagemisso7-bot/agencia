import { FinancialEntryType, FinancialStatus } from "@prisma/client";

import { demoStore, nextDemoId } from "@/lib/demo-store";
import { prisma, withFallback } from "@/lib/prisma";
import type { FinancialRecord } from "@/lib/types";

type FinancialInput = {
  title: string;
  description?: string;
  type: FinancialRecord["type"];
  status?: FinancialRecord["status"];
  amount: number;
  dueDate?: string;
  paidAt?: string;
  reference?: string;
  clientId: string;
};

function mapFinancial(entry: {
  id: string;
  title: string;
  description: string | null;
  type: FinancialEntryType;
  status: FinancialStatus;
  amount: { toNumber(): number };
  dueDate: Date | null;
  paidAt: Date | null;
  reference: string | null;
  clientId: string;
  client: { companyName: string };
  createdAt: Date;
}): FinancialRecord {
  return {
    id: entry.id,
    title: entry.title,
    description: entry.description,
    type: entry.type,
    status: entry.status,
    amount: entry.amount.toNumber(),
    dueDate: entry.dueDate?.toISOString(),
    paidAt: entry.paidAt?.toISOString(),
    reference: entry.reference,
    clientId: entry.clientId,
    clientName: entry.client.companyName,
    createdAt: entry.createdAt.toISOString(),
  };
}

export async function listFinancialEntries(): Promise<FinancialRecord[]> {
  return withFallback(
    async () => {
      if (!prisma) {
        return demoStore.financialRecords;
      }

      const entries = await prisma.financialEntry.findMany({
        orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
        include: {
          client: true,
        },
      });

      return entries.map(mapFinancial);
    },
    () => demoStore.financialRecords,
  );
}

export async function createFinancialEntry(input: FinancialInput): Promise<FinancialRecord> {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const entry = await prisma.financialEntry.create({
        data: {
          title: input.title,
          description: input.description,
          type: input.type,
          status: input.status ?? "PENDING",
          amount: input.amount,
          dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
          paidAt: input.paidAt ? new Date(input.paidAt) : undefined,
          reference: input.reference,
          clientId: input.clientId,
        },
        include: {
          client: true,
        },
      });

      return mapFinancial(entry);
    },
    () => {
      const client = demoStore.clients.find((item) => item.id === input.clientId);
      const entry = {
        id: nextDemoId("fin"),
        title: input.title,
        description: input.description,
        type: input.type,
        status: input.status ?? "PENDING",
        amount: input.amount,
        dueDate: input.dueDate,
        paidAt: input.paidAt,
        reference: input.reference,
        clientId: input.clientId,
        clientName: client?.companyName ?? "Cliente",
        createdAt: new Date().toISOString(),
      } satisfies FinancialRecord;

      demoStore.financialRecords.unshift(entry);
      return entry;
    },
  );
}

