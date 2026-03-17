import { TaskPriority, TaskStatus } from "@prisma/client";

import { demoStore, nextDemoId } from "@/lib/demo-store";
import { prisma, withFallback } from "@/lib/prisma";
import type { TaskRecord } from "@/lib/types";

type TaskInput = {
  title: string;
  description?: string;
  status?: TaskRecord["status"];
  priority?: TaskRecord["priority"];
  dueDate?: string;
  clientId?: string;
  leadId?: string;
};

function mapTask(task: {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  createdAt: Date;
  client?: { companyName: string } | null;
  lead?: { name: string } | null;
  owner?: { name: string } | null;
  clientId: string | null;
  leadId: string | null;
}): TaskRecord {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate?.toISOString(),
    ownerName: task.owner?.name,
    clientId: task.clientId,
    clientName: task.client?.companyName,
    leadId: task.leadId,
    leadName: task.lead?.name,
    createdAt: task.createdAt.toISOString(),
  };
}

export async function listTasks(): Promise<TaskRecord[]> {
  return withFallback(
    async () => {
      if (!prisma) {
        return demoStore.tasks;
      }

      const tasks = await prisma.task.findMany({
        orderBy: [{ status: "asc" }, { createdAt: "desc" }],
        include: {
          client: true,
          lead: true,
          owner: true,
        },
      });

      return tasks.map(mapTask);
    },
    () => demoStore.tasks,
  );
}

export async function getTaskById(id: string): Promise<TaskRecord | null> {
  return withFallback(
    async () => {
      if (!prisma) {
        return demoStore.tasks.find((task) => task.id === id) ?? null;
      }

      const task = await prisma.task.findUnique({
        where: { id },
        include: {
          client: true,
          lead: true,
          owner: true,
        },
      });

      return task ? mapTask(task) : null;
    },
    () => demoStore.tasks.find((task) => task.id === id) ?? null,
  );
}

export async function createTask(input: TaskInput): Promise<TaskRecord> {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const task = await prisma.task.create({
        data: {
          title: input.title,
          description: input.description,
          status: input.status ?? "TODO",
          priority: input.priority ?? "MEDIUM",
          dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
          clientId: input.clientId,
          leadId: input.leadId,
        },
        include: {
          client: true,
          lead: true,
          owner: true,
        },
      });

      return mapTask(task);
    },
    () => {
      const client = demoStore.clients.find((item) => item.id === input.clientId);
      const lead = demoStore.leads.find((item) => item.id === input.leadId);

      const task = {
        id: nextDemoId("task"),
        title: input.title,
        description: input.description,
        status: input.status ?? "TODO",
        priority: input.priority ?? "MEDIUM",
        dueDate: input.dueDate,
        clientId: input.clientId,
        clientName: client?.companyName,
        leadId: input.leadId,
        leadName: lead?.name,
        createdAt: new Date().toISOString(),
      } satisfies TaskRecord;

      demoStore.tasks.unshift(task);
      return task;
    },
  );
}

export async function deleteTask(id: string) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      return prisma.task.delete({
        where: { id },
      });
    },
    () => {
      const index = demoStore.tasks.findIndex((item) => item.id === id);
      if (index >= 0) {
        demoStore.tasks.splice(index, 1);
      }
      return null;
    },
  );
}

export async function updateTask(id: string, input: TaskInput) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const task = await prisma.task.update({
        where: { id },
        data: {
          title: input.title,
          description: input.description,
          status: input.status,
          priority: input.priority,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
          clientId: input.clientId,
          leadId: input.leadId,
        },
        include: {
          client: true,
          lead: true,
          owner: true,
        },
      });

      return mapTask(task);
    },
    () => {
      const task = demoStore.tasks.find((item) => item.id === id);
      const client = demoStore.clients.find((item) => item.id === input.clientId);
      const lead = demoStore.leads.find((item) => item.id === input.leadId);

      if (task) {
        Object.assign(task, {
          title: input.title,
          description: input.description,
          status: input.status,
          priority: input.priority,
          dueDate: input.dueDate,
          clientId: input.clientId,
          clientName: client?.companyName,
          leadId: input.leadId,
          leadName: lead?.name,
        });
      }

      return task;
    },
  );
}
