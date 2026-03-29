"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { slugify } from "@/lib/utils";
import { requireBackofficeUser } from "@/modules/auth/guards";
import { recordActivity } from "@/modules/shared/activity-log";
import {
  createChecklistItem,
  createCustomFieldDefinition,
  createProject,
  createProjectList,
  createTaskComment,
  createWorkTask,
  createWorkTemplate,
  upsertCustomFieldValue,
} from "@/modules/work/repository";

const projectSchema = z.object({
  workspaceId: z.string().min(1),
  clientId: z.string().optional(),
  ownerId: z.string().optional(),
  name: z.string().min(3),
  summary: z.string().optional(),
  status: z.enum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED"]).optional(),
  health: z.enum(["ON_TRACK", "ATTENTION", "AT_RISK"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  templateId: z.string().optional(),
});

const listSchema = z.object({
  projectId: z.string().min(1),
  name: z.string().min(2),
  description: z.string().optional(),
  color: z.string().optional(),
  order: z.number().int().nonnegative().optional(),
});

const taskSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]).optional(),
  statusLabel: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  endDate: z.string().optional(),
  estimatedMinutes: z.number().int().nonnegative().optional(),
  trackedMinutes: z.number().int().nonnegative().optional(),
  recurringRule: z.string().optional(),
  blockedReason: z.string().optional(),
  ownerId: z.string().optional(),
  workspaceId: z.string().optional(),
  projectId: z.string().optional(),
  listId: z.string().optional(),
  parentTaskId: z.string().optional(),
  clientId: z.string().optional(),
  leadId: z.string().optional(),
});

const commentSchema = z.object({
  taskId: z.string().min(1),
  body: z.string().min(2),
});

const checklistSchema = z.object({
  taskId: z.string().min(1),
  title: z.string().min(2),
  assigneeId: z.string().optional(),
  dueDate: z.string().optional(),
});

const templateSchema = z.object({
  workspaceId: z.string().min(1),
  name: z.string().min(3),
  description: z.string().optional(),
  scope: z.enum(["PROJECT", "LIST", "TASK", "CHECKLIST", "DOCUMENT", "AUTOMATION"]),
});

const customFieldSchema = z.object({
  workspaceId: z.string().min(1),
  name: z.string().min(2),
  key: z.string().optional(),
  entityType: z.enum(["CLIENT", "PROJECT", "TASK", "CAMPAIGN", "CONTENT", "FORM"]),
  fieldType: z.enum(["TEXT", "TEXTAREA", "NUMBER", "CURRENCY", "BOOLEAN", "DATE", "SELECT", "MULTI_SELECT", "RELATION"]),
});

const customFieldValueSchema = z.object({
  definitionId: z.string().min(1),
  entityType: z.enum(["CLIENT", "PROJECT", "TASK", "CAMPAIGN", "CONTENT", "FORM"]),
  entityId: z.string().min(1),
});

function getRedirectPath(formData: FormData, fallback = "/admin/work") {
  const value = String(formData.get("redirectTo") ?? fallback).trim();
  return value.startsWith("/admin") ? value : fallback;
}

function getString(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value || undefined;
}

function getNumber(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? "").trim();
  return raw ? Number(raw) : undefined;
}

function getArray(formData: FormData, key: string) {
  const values = formData.getAll(key).map((value) => String(value).trim()).filter(Boolean);

  if (values.length) {
    return values;
  }

  const csv = String(formData.get(key) ?? "").trim();
  return csv ? csv.split(",").map((value) => value.trim()).filter(Boolean) : [];
}

function getTextAreaLines(formData: FormData, key: string) {
  return String(formData.get(key) ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function buildTemplatePayload(formData: FormData) {
  const rawPayload = String(formData.get("payload") ?? "").trim();

  if (rawPayload) {
    try {
      const parsed = JSON.parse(rawPayload) as Record<string, unknown>;
      return parsed;
    } catch {
      // Falls back to the guided payload builder below.
    }
  }

  const lists = getTextAreaLines(formData, "lists").map((name, index) => ({
    name,
    order: index,
    statusCatalog: ["Backlog", "Em andamento", "Em revisao", "Concluido"],
  }));

  return {
    projectName: getString(formData, "projectTemplateName"),
    projectSummary: getString(formData, "projectTemplateSummary"),
    lists,
  };
}

function buildCustomFieldOptions(formData: FormData, fieldType: string) {
  const options = getTextAreaLines(formData, "options");

  if (!options.length || !["SELECT", "MULTI_SELECT"].includes(fieldType)) {
    return null;
  }

  return {
    values: options,
  };
}

function buildCustomFieldValue(formData: FormData) {
  const textValue = getString(formData, "value");
  const multiValue = getArray(formData, "multiValue");
  const booleanValue = String(formData.get("booleanValue") ?? "").trim();
  const numericValue = getString(formData, "numericValue");
  const dateValue = getString(formData, "dateValue");

  if (multiValue.length) {
    return multiValue;
  }

  if (booleanValue) {
    return booleanValue === "true";
  }

  if (numericValue) {
    return Number(numericValue);
  }

  if (dateValue) {
    return dateValue;
  }

  return textValue ?? null;
}

function bounce(path: string, success: string) {
  const separator = path.includes("?") ? "&" : "?";
  redirect(`${path}${separator}success=${success}`);
}

export async function createProjectAction(formData: FormData) {
  const user = await requireBackofficeUser();
  const redirectTo = getRedirectPath(formData);
  const parsed = projectSchema.parse({
    workspaceId: getString(formData, "workspaceId"),
    clientId: getString(formData, "clientId"),
    ownerId: getString(formData, "ownerId"),
    name: getString(formData, "name"),
    summary: getString(formData, "summary"),
    status: getString(formData, "status"),
    health: getString(formData, "health"),
    startDate: getString(formData, "startDate"),
    endDate: getString(formData, "endDate"),
    templateId: getString(formData, "templateId"),
  });

  const project = await createProject({
    ...parsed,
    ownerId: parsed.ownerId ?? user.id,
  });

  await recordActivity({
    action: "project.created",
    entityType: "Project",
    entityId: project.id,
    clientId: project.clientId,
    actorId: user.id,
    actorName: user.name,
    description: `Projeto ${project.name} criado no Work OS.`,
    metadata: { workspaceId: project.workspaceId },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/work");
  revalidatePath(redirectTo);
  bounce(redirectTo, "project-created");
}

export async function createProjectListAction(formData: FormData) {
  const user = await requireBackofficeUser();
  const redirectTo = getRedirectPath(formData);
  const parsed = listSchema.parse({
    projectId: getString(formData, "projectId"),
    name: getString(formData, "name"),
    description: getString(formData, "description"),
    color: getString(formData, "color"),
    order: getNumber(formData, "order"),
  });

  const list = await createProjectList({
    ...parsed,
    statusCatalog: getTextAreaLines(formData, "statusCatalog"),
  });

  await recordActivity({
    action: "project.list.created",
    entityType: "ProjectList",
    entityId: list.id,
    actorId: user.id,
    actorName: user.name,
    description: `Lista ${list.name} adicionada ao projeto.`,
    metadata: { projectId: list.projectId },
  });

  revalidatePath("/admin/work");
  revalidatePath(redirectTo);
  bounce(redirectTo, "list-created");
}

export async function createWorkTaskAction(formData: FormData) {
  const user = await requireBackofficeUser();
  const redirectTo = getRedirectPath(formData);
  const parsed = taskSchema.parse({
    title: getString(formData, "title"),
    description: getString(formData, "description"),
    status: getString(formData, "status"),
    statusLabel: getString(formData, "statusLabel"),
    priority: getString(formData, "priority"),
    startDate: getString(formData, "startDate"),
    dueDate: getString(formData, "dueDate"),
    endDate: getString(formData, "endDate"),
    estimatedMinutes: getNumber(formData, "estimatedMinutes"),
    trackedMinutes: getNumber(formData, "trackedMinutes"),
    recurringRule: getString(formData, "recurringRule"),
    blockedReason: getString(formData, "blockedReason"),
    ownerId: getString(formData, "ownerId"),
    workspaceId: getString(formData, "workspaceId"),
    projectId: getString(formData, "projectId"),
    listId: getString(formData, "listId"),
    parentTaskId: getString(formData, "parentTaskId"),
    clientId: getString(formData, "clientId"),
    leadId: getString(formData, "leadId"),
  });

  const task = await createWorkTask({
    ...parsed,
    ownerId: parsed.ownerId ?? user.id,
    labels: getArray(formData, "labels"),
    assigneeIds: getArray(formData, "assigneeIds"),
    watcherIds: getArray(formData, "watcherIds"),
    blockedByTaskIds: getArray(formData, "blockedByTaskIds"),
  });

  await recordActivity({
    action: parsed.parentTaskId ? "task.subtask.created" : "task.created",
    entityType: "Task",
    entityId: task.id,
    taskId: task.id,
    clientId: task.clientId,
    leadId: task.leadId,
    actorId: user.id,
    actorName: user.name,
    description: parsed.parentTaskId
      ? `Subtarefa ${task.title} criada no fluxo operacional.`
      : `Tarefa ${task.title} criada no Work OS.`,
    metadata: {
      projectId: task.projectId,
      listId: task.listId,
      parentTaskId: task.parentTaskId,
      assigneeIds: task.assignees.map((assignee) => assignee.id),
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/work");
  revalidatePath("/admin/tasks");
  revalidatePath(redirectTo);
  bounce(redirectTo, parsed.parentTaskId ? "subtask-created" : "task-created");
}

export async function createTaskCommentAction(formData: FormData) {
  const user = await requireBackofficeUser();
  const redirectTo = getRedirectPath(formData);
  const parsed = commentSchema.parse({
    taskId: getString(formData, "taskId"),
    body: getString(formData, "body"),
  });

  const comment = await createTaskComment({
    ...parsed,
    authorId: user.id,
  });

  await recordActivity({
    action: "task.comment.created",
    entityType: "TaskComment",
    entityId: comment.id,
    taskId: parsed.taskId,
    actorId: user.id,
    actorName: user.name,
    description: `Novo comentario registrado na tarefa.`,
    metadata: { mentions: comment.mentions },
  });

  revalidatePath("/admin/work");
  revalidatePath(redirectTo);
  bounce(redirectTo, "comment-created");
}

export async function createChecklistItemAction(formData: FormData) {
  const user = await requireBackofficeUser();
  const redirectTo = getRedirectPath(formData);
  const parsed = checklistSchema.parse({
    taskId: getString(formData, "taskId"),
    title: getString(formData, "title"),
    assigneeId: getString(formData, "assigneeId"),
    dueDate: getString(formData, "dueDate"),
  });

  const checklistItem = await createChecklistItem(parsed);

  await recordActivity({
    action: "task.checklist_item.created",
    entityType: "TaskChecklistItem",
    entityId: checklistItem.id,
    taskId: parsed.taskId,
    actorId: user.id,
    actorName: user.name,
    description: `Checklist ${checklistItem.title} adicionado a tarefa.`,
  });

  revalidatePath("/admin/work");
  revalidatePath(redirectTo);
  bounce(redirectTo, "checklist-created");
}

export async function createWorkTemplateAction(formData: FormData) {
  const user = await requireBackofficeUser();
  const redirectTo = getRedirectPath(formData);
  const parsed = templateSchema.parse({
    workspaceId: getString(formData, "workspaceId"),
    name: getString(formData, "name"),
    description: getString(formData, "description"),
    scope: getString(formData, "scope"),
  });

  const template = await createWorkTemplate({
    ...parsed,
    payload: buildTemplatePayload(formData),
  });

  await recordActivity({
    action: "template.created",
    entityType: "WorkTemplate",
    entityId: template.id,
    actorId: user.id,
    actorName: user.name,
    description: `Template ${template.name} criado para padronizar operacoes.`,
    metadata: { scope: template.scope },
  });

  revalidatePath("/admin/work");
  revalidatePath(redirectTo);
  bounce(redirectTo, "template-created");
}

export async function createCustomFieldDefinitionAction(formData: FormData) {
  const user = await requireBackofficeUser();
  const redirectTo = getRedirectPath(formData);
  const parsed = customFieldSchema.parse({
    workspaceId: getString(formData, "workspaceId"),
    name: getString(formData, "name"),
    key: getString(formData, "key"),
    entityType: getString(formData, "entityType"),
    fieldType: getString(formData, "fieldType"),
  });

  const definition = await createCustomFieldDefinition({
    workspaceId: parsed.workspaceId,
    name: parsed.name,
    key: parsed.key ?? slugify(parsed.name),
    entityType: parsed.entityType,
    fieldType: parsed.fieldType,
    required: String(formData.get("required") ?? "") === "on",
    options: buildCustomFieldOptions(formData, parsed.fieldType),
  });

  await recordActivity({
    action: "custom_field.created",
    entityType: "CustomFieldDefinition",
    entityId: definition.id,
    actorId: user.id,
    actorName: user.name,
    description: `Campo customizado ${definition.name} criado para ${definition.entityType.toLowerCase()}.`,
    metadata: { fieldType: definition.fieldType },
  });

  revalidatePath("/admin/work");
  revalidatePath(redirectTo);
  bounce(redirectTo, "custom-field-created");
}

export async function updateTaskCustomFieldValueAction(formData: FormData) {
  const user = await requireBackofficeUser();
  const redirectTo = getRedirectPath(formData);
  const parsed = customFieldValueSchema.parse({
    definitionId: getString(formData, "definitionId"),
    entityType: getString(formData, "entityType"),
    entityId: getString(formData, "entityId"),
  });

  const value = await upsertCustomFieldValue({
    ...parsed,
    value: buildCustomFieldValue(formData),
  });

  await recordActivity({
    action: "custom_field.value.updated",
    entityType: "CustomFieldValue",
    entityId: value.id,
    taskId: parsed.entityType === "TASK" ? parsed.entityId : undefined,
    actorId: user.id,
    actorName: user.name,
    description: "Valor de campo customizado atualizado.",
    metadata: {
      definitionId: parsed.definitionId,
      entityType: parsed.entityType,
      entityId: parsed.entityId,
    },
  });

  revalidatePath("/admin/work");
  revalidatePath(redirectTo);
  bounce(redirectTo, "custom-field-updated");
}
