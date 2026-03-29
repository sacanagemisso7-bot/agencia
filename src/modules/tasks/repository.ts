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
  ownerId?: string;
  ownerName?: string;
  clientId?: string;
  leadId?: string;
};

function mapTask(task: {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  statusLabel?: string | null;
  priority: TaskPriority;
  startDate?: Date | null;
  dueDate: Date | null;
  endDate?: Date | null;
  estimatedMinutes?: number | null;
  trackedMinutes?: number | null;
  labels?: string[];
  recurringRule?: string | null;
  blockedReason?: string | null;
  ownerId: string | null;
  createdAt: Date;
  workspace?: { name: string } | null;
  project?: { name: string } | null;
  list?: { name: string } | null;
  parentTask?: { title: string } | null;
  client?: { companyName: string } | null;
  lead?: { name: string } | null;
  owner?: { name: string } | null;
  assignments?: Array<{ user: { id: string; name: string; email: string; role: "ADMIN" | "ACCOUNT_MANAGER" | "CLIENT" } }>;
  watchers?: Array<{ user: { id: string; name: string; email: string; role: "ADMIN" | "ACCOUNT_MANAGER" | "CLIENT" } }>;
  comments?: Array<{ id: string }>;
  subtasks?: Array<{ id: string }>;
  blockedBy?: Array<{ id: string }>;
  checklistItems?: Array<{ id: string; done: boolean }>;
  workspaceId?: string | null;
  projectId?: string | null;
  listId?: string | null;
  parentTaskId?: string | null;
  clientId: string | null;
  leadId: string | null;
}): TaskRecord {
  const checklistItems = task.checklistItems ?? [];

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    statusLabel: task.statusLabel ?? null,
    priority: task.priority,
    startDate: task.startDate?.toISOString(),
    dueDate: task.dueDate?.toISOString(),
    endDate: task.endDate?.toISOString(),
    estimatedMinutes: task.estimatedMinutes ?? null,
    trackedMinutes: task.trackedMinutes ?? 0,
    labels: task.labels ?? [],
    recurringRule: task.recurringRule ?? null,
    blockedReason: task.blockedReason ?? null,
    ownerId: task.ownerId,
    ownerName: task.owner?.name,
    workspaceId: task.workspaceId ?? null,
    workspaceName: task.workspace?.name ?? null,
    projectId: task.projectId ?? null,
    projectName: task.project?.name ?? null,
    listId: task.listId ?? null,
    listName: task.list?.name ?? null,
    parentTaskId: task.parentTaskId ?? null,
    parentTaskTitle: task.parentTask?.title ?? null,
    clientId: task.clientId,
    clientName: task.client?.companyName,
    leadId: task.leadId,
    leadName: task.lead?.name,
    assignees: (task.assignments ?? []).map((assignment) => ({
      id: assignment.user.id,
      name: assignment.user.name,
      email: assignment.user.email,
      role: assignment.user.role,
    })),
    watchers: (task.watchers ?? []).map((watcher) => ({
      id: watcher.user.id,
      name: watcher.user.name,
      email: watcher.user.email,
      role: watcher.user.role,
    })),
    checklistProgress: {
      completed: checklistItems.filter((item) => item.done).length,
      total: checklistItems.length,
    },
    commentCount: (task.comments ?? []).length,
    subtaskCount: (task.subtasks ?? []).length,
    blockedByCount: (task.blockedBy ?? []).length,
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
          workspace: true,
          project: true,
          list: true,
          parentTask: true,
          assignments: { include: { user: true } },
          watchers: { include: { user: true } },
          comments: { select: { id: true } },
          subtasks: { select: { id: true } },
          blockedBy: { select: { id: true } },
          checklistItems: { select: { id: true, done: true } },
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
          workspace: true,
          project: true,
          list: true,
          parentTask: true,
          assignments: { include: { user: true } },
          watchers: { include: { user: true } },
          comments: { select: { id: true } },
          subtasks: { select: { id: true } },
          blockedBy: { select: { id: true } },
          checklistItems: { select: { id: true, done: true } },
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
          ownerId: input.ownerId,
          clientId: input.clientId,
          leadId: input.leadId,
          labels: [],
        },
        include: {
          client: true,
          lead: true,
          owner: true,
          workspace: true,
          project: true,
          list: true,
          parentTask: true,
          assignments: { include: { user: true } },
          watchers: { include: { user: true } },
          comments: { select: { id: true } },
          subtasks: { select: { id: true } },
          blockedBy: { select: { id: true } },
          checklistItems: { select: { id: true, done: true } },
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
        labels: [],
        dueDate: input.dueDate,
        ownerId: input.ownerId,
        ownerName: input.ownerName,
        clientId: input.clientId,
        clientName: client?.companyName,
        leadId: input.leadId,
        leadName: lead?.name,
        assignees: [],
        watchers: [],
        checklistProgress: { completed: 0, total: 0 },
        commentCount: 0,
        subtaskCount: 0,
        blockedByCount: 0,
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
          ownerId: input.ownerId,
          clientId: input.clientId,
          leadId: input.leadId,
        },
        include: {
          client: true,
          lead: true,
          owner: true,
          workspace: true,
          project: true,
          list: true,
          parentTask: true,
          assignments: { include: { user: true } },
          watchers: { include: { user: true } },
          comments: { select: { id: true } },
          subtasks: { select: { id: true } },
          blockedBy: { select: { id: true } },
          checklistItems: { select: { id: true, done: true } },
        },
      });

      return mapTask(task);
    },
    () => {
      const task = demoStore.tasks.find((item) => item.id === id);
      const client = demoStore.clients.find((item) => item.id === input.clientId);
      const lead = demoStore.leads.find((item) => item.id === input.leadId);

      if (task) {
        const nextValues = {
          title: input.title,
          description: input.description,
          status: input.status,
          priority: input.priority,
          dueDate: input.dueDate,
          clientId: input.clientId,
          clientName: client?.companyName,
          leadId: input.leadId,
          leadName: lead?.name,
        } satisfies Partial<TaskRecord>;

        Object.assign(task, nextValues);

        if (typeof input.ownerId !== "undefined") {
          task.ownerId = input.ownerId;
          task.ownerName = input.ownerName;
        }
      }

      return task;
    },
  );
}
