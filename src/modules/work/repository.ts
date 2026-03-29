import {
  CustomFieldEntity,
  CustomFieldType,
  Prisma,
  ProjectHealth,
  ProjectStatus,
  TaskPriority,
  TaskStatus,
  TemplateScope,
} from "@prisma/client";

import { demoStore, nextDemoId } from "@/lib/demo-store";
import { getBrandCompanyName } from "@/lib/brand";
import { prisma, withFallback } from "@/lib/prisma";
import type {
  AssigneeRecord,
  CustomFieldDefinitionRecord,
  CustomFieldEntity as CustomFieldEntityRecord,
  CustomFieldType as CustomFieldTypeRecord,
  CustomFieldValueRecord,
  ProjectHealth as ProjectHealthRecord,
  ProjectListRecord,
  ProjectRecord,
  ProjectStatus as ProjectStatusRecord,
  TaskChecklistItemRecord,
  TaskCommentRecord,
  TaskDependencyRecord,
  TaskDetailRecord,
  TaskPriority as TaskPriorityRecord,
  TaskRecord,
  TaskStatus as TaskStatusRecord,
  TemplateScope as TemplateScopeRecord,
  UserRecord,
  WorkHubRecord,
  WorkspaceRecord,
  WorkTemplateRecord,
} from "@/lib/types";
import { slugify } from "@/lib/utils";
import { listUsers } from "@/modules/users/repository";

type CreateProjectInput = {
  workspaceId: string;
  clientId?: string;
  ownerId?: string;
  name: string;
  summary?: string;
  status?: ProjectStatusRecord;
  health?: ProjectHealthRecord;
  startDate?: string;
  endDate?: string;
  templateId?: string;
};

type CreateProjectListInput = {
  projectId: string;
  name: string;
  description?: string;
  color?: string;
  order?: number;
  statusCatalog?: string[];
};

type CreateWorkTaskInput = {
  title: string;
  description?: string;
  status?: TaskStatusRecord;
  statusLabel?: string;
  priority?: TaskPriorityRecord;
  startDate?: string;
  dueDate?: string;
  endDate?: string;
  estimatedMinutes?: number;
  trackedMinutes?: number;
  labels?: string[];
  recurringRule?: string;
  blockedReason?: string;
  ownerId?: string;
  workspaceId?: string;
  projectId?: string;
  listId?: string;
  parentTaskId?: string;
  clientId?: string;
  leadId?: string;
  assigneeIds?: string[];
  watcherIds?: string[];
  blockedByTaskIds?: string[];
};

type CreateTaskCommentInput = {
  taskId: string;
  authorId?: string;
  body: string;
};

type CreateChecklistItemInput = {
  taskId: string;
  title: string;
  assigneeId?: string;
  dueDate?: string;
};

type CreateTemplateInput = {
  workspaceId: string;
  name: string;
  description?: string;
  scope: TemplateScopeRecord;
  payload: Record<string, unknown>;
};

type CreateCustomFieldDefinitionInput = {
  workspaceId: string;
  name: string;
  key: string;
  entityType: CustomFieldEntityRecord;
  fieldType: CustomFieldTypeRecord;
  options?: Record<string, unknown> | null;
  required?: boolean;
};

type UpsertCustomFieldValueInput = {
  definitionId: string;
  entityType: CustomFieldEntityRecord;
  entityId: string;
  value: Record<string, unknown> | string | number | boolean | string[] | null;
};

type TemplateTaskSeed = {
  title: string;
  description?: string;
  status?: TaskStatusRecord;
  statusLabel?: string;
  priority?: TaskPriorityRecord;
  labels?: string[];
  estimatedMinutes?: number;
  assigneeIds?: string[];
  watcherIds?: string[];
};

type TemplateListSeed = {
  name: string;
  description?: string;
  color?: string;
  order?: number;
  statusCatalog?: string[];
  tasks?: TemplateTaskSeed[];
};

type ProjectTemplatePayload = {
  projectName?: string;
  projectSummary?: string;
  lists: TemplateListSeed[];
};

const defaultWorkspaceSeed = {
  name: getBrandCompanyName(),
  slug: "ameni-digital-marketing",
  description: "Workspace central da agencia para comercial, operacao, criacao e entrega.",
};

const defaultStatusCatalog = ["Backlog", "Em andamento", "Em revisao", "Concluido"];

const taskListInclude = {
  owner: true,
  workspace: true,
  project: true,
  list: true,
  parentTask: true,
  client: true,
  lead: true,
  assignments: { include: { user: true } },
  watchers: { include: { user: true } },
  comments: { select: { id: true } },
  subtasks: { select: { id: true } },
  blockedBy: { select: { id: true } },
  checklistItems: { select: { id: true, done: true } },
} satisfies Prisma.TaskInclude;

const taskDetailInclude = {
  owner: true,
  workspace: true,
  project: true,
  list: true,
  parentTask: true,
  client: true,
  lead: true,
  assignments: { include: { user: true } },
  watchers: { include: { user: true } },
  comments: {
    include: {
      author: true,
    },
    orderBy: { createdAt: "desc" },
  },
  subtasks: {
    include: taskListInclude,
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
  },
  blockedBy: {
    include: {
      dependsOnTask: {
        select: {
          title: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  },
  checklistItems: {
    include: {
      assignee: true,
    },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  },
} satisfies Prisma.TaskInclude;

function toIso(value?: Date | null) {
  return value?.toISOString();
}

function parseDate(value?: string | null) {
  return value ? new Date(value) : undefined;
}

function uniqueValues(values?: Array<string | undefined | null>) {
  return Array.from(new Set((values ?? []).filter((value): value is string => Boolean(value && value.trim()))));
}

function extractMentions(body: string) {
  return Array.from(new Set((body.match(/@([^\s@]+)/g) ?? []).map((token) => token.slice(1))));
}

function normalizeProjectTemplatePayload(payload: unknown): ProjectTemplatePayload {
  if (!payload || typeof payload !== "object") {
    return { lists: [] };
  }

  const source = payload as Record<string, unknown>;
  const lists = Array.isArray(source.lists)
    ? source.lists
        .map((item, index) => {
          if (!item || typeof item !== "object") {
            return null;
          }

          const current = item as Record<string, unknown>;
          const tasks = Array.isArray(current.tasks)
            ? current.tasks
                .map((task) => {
                  if (!task || typeof task !== "object") {
                    return null;
                  }

                  const currentTask = task as Record<string, unknown>;
                  const title = String(currentTask.title ?? "").trim();

                  if (!title) {
                    return null;
                  }

                  return {
                    title,
                    description: currentTask.description ? String(currentTask.description) : undefined,
                    status: (currentTask.status as TaskStatusRecord | undefined) ?? "TODO",
                    statusLabel: currentTask.statusLabel ? String(currentTask.statusLabel) : undefined,
                    priority: (currentTask.priority as TaskPriorityRecord | undefined) ?? "MEDIUM",
                    labels: Array.isArray(currentTask.labels)
                      ? currentTask.labels.map((label) => String(label))
                      : [],
                    estimatedMinutes: currentTask.estimatedMinutes ? Number(currentTask.estimatedMinutes) : undefined,
                    assigneeIds: Array.isArray(currentTask.assigneeIds)
                      ? currentTask.assigneeIds.map((value) => String(value))
                      : [],
                    watcherIds: Array.isArray(currentTask.watcherIds)
                      ? currentTask.watcherIds.map((value) => String(value))
                      : [],
                  } satisfies TemplateTaskSeed;
                })
                .filter(Boolean) as TemplateTaskSeed[]
            : [];

          return {
            name: String(current.name ?? `Lista ${index + 1}`).trim(),
            description: current.description ? String(current.description) : undefined,
            color: current.color ? String(current.color) : undefined,
            order: typeof current.order === "number" ? current.order : index,
            statusCatalog: Array.isArray(current.statusCatalog)
              ? current.statusCatalog.map((value) => String(value))
              : defaultStatusCatalog,
            tasks,
          } satisfies TemplateListSeed;
        })
        .filter(Boolean) as TemplateListSeed[]
    : [];

  return {
    projectName: source.projectName ? String(source.projectName) : undefined,
    projectSummary: source.projectSummary ? String(source.projectSummary) : undefined,
    lists,
  };
}

function mapWorkspace(workspace: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
}): WorkspaceRecord {
  return {
    id: workspace.id,
    name: workspace.name,
    slug: workspace.slug,
    description: workspace.description,
    createdAt: workspace.createdAt.toISOString(),
  };
}

function mapUserToAssignee(user: Pick<UserRecord, "id" | "name" | "email" | "role">): AssigneeRecord {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function mapAssignees(
  items: Array<{ user: { id: string; name: string; email: string; role: "ADMIN" | "ACCOUNT_MANAGER" | "CLIENT" } }>,
): AssigneeRecord[] {
  return items.map((item) => ({
    id: item.user.id,
    name: item.user.name,
    email: item.user.email,
    role: item.user.role,
  }));
}

function mapProject(project: {
  id: string;
  workspaceId: string;
  workspace?: { name: string } | null;
  clientId: string | null;
  client?: { companyName: string } | null;
  ownerId: string | null;
  owner?: { name: string } | null;
  name: string;
  slug: string;
  summary: string | null;
  status: ProjectStatus;
  health: ProjectHealth;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  tasks?: Array<{ status: TaskStatus }>;
  _count?: { tasks: number };
}): ProjectRecord {
  const totalTasks = project._count?.tasks ?? project.tasks?.length ?? 0;
  const completedTasks = project.tasks?.filter((task) => task.status === "DONE").length ?? 0;

  return {
    id: project.id,
    workspaceId: project.workspaceId,
    workspaceName: project.workspace?.name ?? null,
    clientId: project.clientId,
    clientName: project.client?.companyName ?? null,
    ownerId: project.ownerId,
    ownerName: project.owner?.name ?? null,
    name: project.name,
    slug: project.slug,
    summary: project.summary,
    status: project.status,
    health: project.health,
    startDate: toIso(project.startDate),
    endDate: toIso(project.endDate),
    taskCount: totalTasks,
    completedTaskCount: completedTasks,
    createdAt: project.createdAt.toISOString(),
  };
}

function mapProjectList(list: {
  id: string;
  projectId: string;
  project?: { name: string } | null;
  name: string;
  description: string | null;
  color: string | null;
  order: number;
  statusCatalog: string[];
  createdAt: Date;
  _count?: { tasks: number };
  tasks?: Array<{ id: string }>;
}): ProjectListRecord {
  return {
    id: list.id,
    projectId: list.projectId,
    projectName: list.project?.name ?? null,
    name: list.name,
    description: list.description,
    color: list.color,
    order: list.order,
    statusCatalog: list.statusCatalog,
    taskCount: list._count?.tasks ?? list.tasks?.length ?? 0,
    createdAt: list.createdAt.toISOString(),
  };
}

function mapTask(task: {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  statusLabel: string | null;
  priority: TaskPriority;
  startDate: Date | null;
  dueDate: Date | null;
  endDate: Date | null;
  estimatedMinutes: number | null;
  trackedMinutes: number;
  labels: string[];
  recurringRule: string | null;
  blockedReason: string | null;
  ownerId: string | null;
  owner?: { name: string } | null;
  workspaceId: string | null;
  workspace?: { name: string } | null;
  projectId: string | null;
  project?: { name: string } | null;
  listId: string | null;
  list?: { name: string } | null;
  parentTaskId: string | null;
  parentTask?: { title: string } | null;
  clientId: string | null;
  client?: { companyName: string } | null;
  leadId: string | null;
  lead?: { name: string } | null;
  createdAt: Date;
  assignments?: Array<{ user: { id: string; name: string; email: string; role: "ADMIN" | "ACCOUNT_MANAGER" | "CLIENT" } }>;
  watchers?: Array<{ user: { id: string; name: string; email: string; role: "ADMIN" | "ACCOUNT_MANAGER" | "CLIENT" } }>;
  comments?: Array<{ id: string }>;
  subtasks?: Array<{ id: string }>;
  blockedBy?: Array<{ id: string }>;
  checklistItems?: Array<{ id: string; done: boolean }>;
}, currentUserId?: string): TaskRecord {
  const checklistItems = task.checklistItems ?? [];
  const assignees = mapAssignees(task.assignments ?? []);

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    statusLabel: task.statusLabel,
    priority: task.priority,
    startDate: toIso(task.startDate),
    dueDate: toIso(task.dueDate),
    endDate: toIso(task.endDate),
    estimatedMinutes: task.estimatedMinutes,
    trackedMinutes: task.trackedMinutes,
    labels: task.labels,
    recurringRule: task.recurringRule,
    blockedReason: task.blockedReason,
    ownerId: task.ownerId,
    ownerName: task.owner?.name ?? null,
    workspaceId: task.workspaceId,
    workspaceName: task.workspace?.name ?? null,
    projectId: task.projectId,
    projectName: task.project?.name ?? null,
    listId: task.listId,
    listName: task.list?.name ?? null,
    parentTaskId: task.parentTaskId,
    parentTaskTitle: task.parentTask?.title ?? null,
    clientId: task.clientId,
    clientName: task.client?.companyName ?? null,
    leadId: task.leadId,
    leadName: task.lead?.name ?? null,
    assignees,
    watchers: mapAssignees(task.watchers ?? []),
    checklistProgress: {
      completed: checklistItems.filter((item) => item.done).length,
      total: checklistItems.length,
    },
    commentCount: (task.comments ?? []).length,
    subtaskCount: (task.subtasks ?? []).length,
    blockedByCount: (task.blockedBy ?? []).length,
    isMyTask: Boolean(currentUserId && assignees.some((assignee) => assignee.id === currentUserId)),
    createdAt: task.createdAt.toISOString(),
  };
}

function mapTaskComment(comment: {
  id: string;
  taskId: string;
  authorId: string | null;
  author?: { name: string } | null;
  body: string;
  mentions: string[];
  createdAt: Date;
}): TaskCommentRecord {
  return {
    id: comment.id,
    taskId: comment.taskId,
    authorId: comment.authorId,
    authorName: comment.author?.name ?? null,
    body: comment.body,
    mentions: comment.mentions,
    createdAt: comment.createdAt.toISOString(),
  };
}

function mapChecklistItem(item: {
  id: string;
  taskId: string;
  title: string;
  done: boolean;
  order: number;
  assigneeId: string | null;
  assignee?: { name: string } | null;
  dueDate: Date | null;
  createdAt: Date;
}): TaskChecklistItemRecord {
  return {
    id: item.id,
    taskId: item.taskId,
    title: item.title,
    done: item.done,
    order: item.order,
    assigneeId: item.assigneeId,
    assigneeName: item.assignee?.name ?? null,
    dueDate: toIso(item.dueDate),
    createdAt: item.createdAt.toISOString(),
  };
}

function mapDependency(dependency: {
  id: string;
  taskId: string;
  dependsOnTaskId: string;
  dependsOnTask?: { title: string } | null;
  createdAt: Date;
}): TaskDependencyRecord {
  return {
    id: dependency.id,
    taskId: dependency.taskId,
    dependsOnTaskId: dependency.dependsOnTaskId,
    dependsOnTaskTitle: dependency.dependsOnTask?.title ?? null,
    createdAt: dependency.createdAt.toISOString(),
  };
}

function mapTemplate(template: {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  scope: TemplateScope;
  payload: Prisma.JsonValue;
  createdAt: Date;
}): WorkTemplateRecord {
  return {
    id: template.id,
    workspaceId: template.workspaceId,
    name: template.name,
    description: template.description,
    scope: template.scope,
    payload: (template.payload as Record<string, unknown>) ?? {},
    createdAt: template.createdAt.toISOString(),
  };
}

function mapCustomFieldDefinition(definition: {
  id: string;
  workspaceId: string;
  name: string;
  key: string;
  entityType: CustomFieldEntity;
  fieldType: CustomFieldType;
  options: Prisma.JsonValue | null;
  required: boolean;
  createdAt: Date;
}): CustomFieldDefinitionRecord {
  return {
    id: definition.id,
    workspaceId: definition.workspaceId,
    name: definition.name,
    key: definition.key,
    entityType: definition.entityType,
    fieldType: definition.fieldType,
    options: (definition.options as Record<string, unknown> | null) ?? null,
    required: definition.required,
    createdAt: definition.createdAt.toISOString(),
  };
}

function mapCustomFieldValue(value: {
  id: string;
  definitionId: string;
  definition?: { name: string } | null;
  entityType: CustomFieldEntity;
  entityId: string;
  value: Prisma.JsonValue;
  createdAt: Date;
}): CustomFieldValueRecord {
  return {
    id: value.id,
    definitionId: value.definitionId,
    definitionName: value.definition?.name ?? null,
    entityType: value.entityType,
    entityId: value.entityId,
    value: value.value as CustomFieldValueRecord["value"],
    createdAt: value.createdAt.toISOString(),
  };
}

function getFallbackWorkspace() {
  const existing = demoStore.workspaces[0];

  if (existing) {
    return existing;
  }

  const workspace = {
    id: nextDemoId("workspace"),
    name: defaultWorkspaceSeed.name,
    slug: defaultWorkspaceSeed.slug,
    description: defaultWorkspaceSeed.description,
    createdAt: new Date().toISOString(),
  } satisfies WorkspaceRecord;

  demoStore.workspaces.push(workspace);
  return workspace;
}

function getDemoUserById(userId?: string | null) {
  return demoStore.users.find((user) => user.id === userId) ?? null;
}

function buildDemoAssignees(userIds?: string[]) {
  return uniqueValues(userIds)
    .map((userId) => getDemoUserById(userId))
    .filter((user): user is UserRecord => Boolean(user))
    .map(mapUserToAssignee);
}

function hydrateDemoTask(task: TaskRecord, currentUserId?: string): TaskRecord {
  const commentCount = demoStore.taskComments.filter((item) => item.taskId === task.id).length;
  const subtaskCount = demoStore.tasks.filter((item) => item.parentTaskId === task.id).length;
  const blockedByCount = demoStore.taskDependencies.filter((item) => item.taskId === task.id).length;
  const checklistItems = demoStore.taskChecklistItems.filter((item) => item.taskId === task.id);
  const owner = getDemoUserById(task.ownerId);
  const assignees = task.assignees.length
    ? task.assignees
    : task.ownerId
      ? buildDemoAssignees([task.ownerId])
      : [];

  return {
    ...task,
    ownerName: task.ownerName ?? owner?.name ?? null,
    workspaceName: task.workspaceName ?? demoStore.workspaces.find((item) => item.id === task.workspaceId)?.name ?? null,
    projectName: task.projectName ?? demoStore.projects.find((item) => item.id === task.projectId)?.name ?? null,
    listName: task.listName ?? demoStore.projectLists.find((item) => item.id === task.listId)?.name ?? null,
    parentTaskTitle:
      task.parentTaskTitle ?? demoStore.tasks.find((item) => item.id === task.parentTaskId)?.title ?? null,
    clientName: task.clientName ?? demoStore.clients.find((item) => item.id === task.clientId)?.companyName ?? null,
    leadName: task.leadName ?? demoStore.leads.find((item) => item.id === task.leadId)?.name ?? null,
    labels: task.labels ?? [],
    assignees,
    watchers: task.watchers ?? [],
    checklistProgress: {
      completed: checklistItems.filter((item) => item.done).length,
      total: checklistItems.length,
    },
    commentCount,
    subtaskCount,
    blockedByCount,
    isMyTask: Boolean(currentUserId && assignees.some((assignee) => assignee.id === currentUserId)),
  };
}

async function ensureWorkspace() {
  if (!prisma) {
    return null;
  }

  const workspace =
    (await prisma.workspace.findFirst({
      orderBy: { createdAt: "asc" },
    })) ??
    (await prisma.workspace.create({
      data: defaultWorkspaceSeed,
    }));

  return workspace;
}

async function buildProjectSlug(workspaceId: string, name: string) {
  const base = slugify(name) || "projeto";

  if (!prisma) {
    return base;
  }

  let candidate = base;
  let suffix = 1;

  while (
    await prisma.project.findFirst({
      where: {
        workspaceId,
        slug: candidate,
      },
      select: { id: true },
    })
  ) {
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }

  return candidate;
}

async function resolveTaskContext(input: CreateWorkTaskInput) {
  if (!prisma) {
    return {
      workspaceId: input.workspaceId,
      projectId: input.projectId,
      listId: input.listId,
      clientId: input.clientId,
    };
  }

  let workspaceId = input.workspaceId;
  let projectId = input.projectId;
  let listId = input.listId;
  let clientId = input.clientId;

  if (listId) {
    const list = await prisma.projectList.findUnique({
      where: { id: listId },
      include: {
        project: true,
      },
    });

    if (list) {
      projectId = projectId ?? list.projectId;
      workspaceId = workspaceId ?? list.project.workspaceId;
      clientId = clientId ?? list.project.clientId ?? undefined;
    }
  }

  if (projectId) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        workspaceId: true,
        clientId: true,
      },
    });

    if (project) {
      workspaceId = workspaceId ?? project.workspaceId;
      clientId = clientId ?? project.clientId ?? undefined;
    }
  }

  if (input.parentTaskId) {
    const parentTask = await prisma.task.findUnique({
      where: { id: input.parentTaskId },
      select: {
        workspaceId: true,
        projectId: true,
        listId: true,
        clientId: true,
      },
    });

    if (parentTask) {
      workspaceId = workspaceId ?? parentTask.workspaceId ?? undefined;
      projectId = projectId ?? parentTask.projectId ?? undefined;
      listId = listId ?? parentTask.listId ?? undefined;
      clientId = clientId ?? parentTask.clientId ?? undefined;
    }
  }

  if (!workspaceId) {
    const workspace = await ensureWorkspace();
    workspaceId = workspace?.id;
  }

  return {
    workspaceId,
    projectId,
    listId,
    clientId,
  };
}

function resolveDemoTaskContext(input: CreateWorkTaskInput) {
  const workspace = getFallbackWorkspace();
  let projectId = input.projectId;
  let listId = input.listId;
  let clientId = input.clientId;
  let workspaceId = input.workspaceId ?? workspace.id;

  if (listId) {
    const list = demoStore.projectLists.find((item) => item.id === listId);
    const project = demoStore.projects.find((item) => item.id === list?.projectId);

    projectId = projectId ?? list?.projectId;
    workspaceId = workspaceId ?? project?.workspaceId ?? workspace.id;
    clientId = clientId ?? project?.clientId ?? undefined;
  }

  if (projectId) {
    const project = demoStore.projects.find((item) => item.id === projectId);
    workspaceId = workspaceId ?? project?.workspaceId ?? workspace.id;
    clientId = clientId ?? project?.clientId ?? undefined;
  }

  if (input.parentTaskId) {
    const parentTask = demoStore.tasks.find((item) => item.id === input.parentTaskId);
    workspaceId = workspaceId ?? parentTask?.workspaceId ?? workspace.id;
    projectId = projectId ?? parentTask?.projectId ?? undefined;
    listId = listId ?? parentTask?.listId ?? undefined;
    clientId = clientId ?? parentTask?.clientId ?? undefined;
  }

  return {
    workspaceId,
    projectId,
    listId,
    clientId,
  };
}

async function applyProjectTemplateToDatabase(
  projectId: string,
  workspaceId: string,
  clientId: string | undefined,
  ownerId: string | undefined,
  payload: ProjectTemplatePayload,
) {
  if (!prisma) {
    return;
  }

  for (const [index, listSeed] of payload.lists.entries()) {
    const list = await prisma.projectList.create({
      data: {
        projectId,
        name: listSeed.name,
        description: listSeed.description,
        color: listSeed.color,
        order: listSeed.order ?? index,
        statusCatalog: listSeed.statusCatalog?.length ? listSeed.statusCatalog : defaultStatusCatalog,
      },
    });

    for (const taskSeed of listSeed.tasks ?? []) {
      const assigneeIds = uniqueValues(taskSeed.assigneeIds);
      const watcherIds = uniqueValues(taskSeed.watcherIds);

      await prisma.task.create({
        data: {
          title: taskSeed.title,
          description: taskSeed.description,
          status: taskSeed.status ?? "TODO",
          statusLabel: taskSeed.statusLabel,
          priority: taskSeed.priority ?? "MEDIUM",
          labels: taskSeed.labels ?? [],
          estimatedMinutes: taskSeed.estimatedMinutes,
          ownerId: ownerId ?? assigneeIds[0],
          workspaceId,
          projectId,
          listId: list.id,
          clientId,
          assignments: assigneeIds.length
            ? {
                create: assigneeIds.map((userId, assigneeIndex) => ({
                  userId,
                  isPrimary: assigneeIndex === 0,
                })),
              }
            : undefined,
          watchers: watcherIds.length
            ? {
                create: watcherIds.map((userId) => ({ userId })),
              }
            : undefined,
        },
      });
    }
  }
}

function applyProjectTemplateToDemo(
  projectId: string,
  workspaceId: string,
  clientId: string | undefined,
  ownerId: string | undefined,
  payload: ProjectTemplatePayload,
) {
  for (const [index, listSeed] of payload.lists.entries()) {
    const list = {
      id: nextDemoId("list"),
      projectId,
      projectName: demoStore.projects.find((item) => item.id === projectId)?.name ?? null,
      name: listSeed.name,
      description: listSeed.description,
      color: listSeed.color,
      order: listSeed.order ?? index,
      statusCatalog: listSeed.statusCatalog?.length ? listSeed.statusCatalog : defaultStatusCatalog,
      taskCount: (listSeed.tasks ?? []).length,
      createdAt: new Date().toISOString(),
    } satisfies ProjectListRecord;

    demoStore.projectLists.push(list);

    for (const taskSeed of listSeed.tasks ?? []) {
      const assigneeIds = uniqueValues(taskSeed.assigneeIds);
      const watchers = buildDemoAssignees(taskSeed.watcherIds);
      const owner = getDemoUserById(ownerId ?? assigneeIds[0]);

      demoStore.tasks.unshift({
        id: nextDemoId("task"),
        title: taskSeed.title,
        description: taskSeed.description,
        status: taskSeed.status ?? "TODO",
        statusLabel: taskSeed.statusLabel,
        priority: taskSeed.priority ?? "MEDIUM",
        startDate: null,
        dueDate: null,
        endDate: null,
        estimatedMinutes: taskSeed.estimatedMinutes ?? null,
        trackedMinutes: 0,
        labels: taskSeed.labels ?? [],
        recurringRule: null,
        blockedReason: null,
        ownerId: owner?.id ?? null,
        ownerName: owner?.name ?? null,
        workspaceId,
        workspaceName: demoStore.workspaces.find((item) => item.id === workspaceId)?.name ?? null,
        projectId,
        projectName: demoStore.projects.find((item) => item.id === projectId)?.name ?? null,
        listId: list.id,
        listName: list.name,
        parentTaskId: null,
        parentTaskTitle: null,
        clientId: clientId ?? null,
        clientName: demoStore.clients.find((item) => item.id === clientId)?.companyName ?? null,
        leadId: null,
        leadName: null,
        assignees: buildDemoAssignees(assigneeIds),
        watchers,
        checklistProgress: {
          completed: 0,
          total: 0,
        },
        commentCount: 0,
        subtaskCount: 0,
        blockedByCount: 0,
        isMyTask: false,
        createdAt: new Date().toISOString(),
      });
    }
  }
}

function buildFallbackWorkHub(currentUserId: string | undefined, users: UserRecord[]): WorkHubRecord {
  const workspace = getFallbackWorkspace();

  return {
    workspace,
    projects: demoStore.projects
      .filter((project) => project.workspaceId === workspace.id)
      .map((project) => ({
        ...project,
        taskCount: demoStore.tasks.filter((task) => task.projectId === project.id).length,
        completedTaskCount: demoStore.tasks.filter((task) => task.projectId === project.id && task.status === "DONE").length,
      })),
    projectLists: demoStore.projectLists
      .filter((list) => demoStore.projects.some((project) => project.id === list.projectId && project.workspaceId === workspace.id))
      .sort((left, right) => left.order - right.order),
    tasks: demoStore.tasks
      .filter((task) => (task.workspaceId ?? workspace.id) === workspace.id)
      .map((task) => hydrateDemoTask(task, currentUserId))
      .sort((left, right) => {
        const leftDate = left.dueDate ?? left.createdAt;
        const rightDate = right.dueDate ?? right.createdAt;
        return new Date(leftDate).getTime() - new Date(rightDate).getTime();
      }),
    templates: demoStore.workTemplates.filter((template) => template.workspaceId === workspace.id),
    customFields: demoStore.customFieldDefinitions.filter((definition) => definition.workspaceId === workspace.id),
    users,
  };
}

export async function getWorkHubData(currentUserId?: string): Promise<WorkHubRecord> {
  const users = await listUsers();

  return withFallback(
    async () => {
      if (!prisma) {
        return buildFallbackWorkHub(currentUserId, users);
      }

      const workspace = await ensureWorkspace();

      if (!workspace) {
        return buildFallbackWorkHub(currentUserId, users);
      }

      const [projects, projectLists, tasks, templates, customFields] = await Promise.all([
        prisma.project.findMany({
          where: { workspaceId: workspace.id },
          include: {
            workspace: true,
            client: true,
            owner: true,
            tasks: {
              select: {
                status: true,
              },
            },
            _count: {
              select: {
                tasks: true,
              },
            },
          },
          orderBy: [{ status: "asc" }, { createdAt: "desc" }],
        }),
        prisma.projectList.findMany({
          where: {
            project: {
              workspaceId: workspace.id,
            },
          },
          include: {
            project: true,
            _count: {
              select: {
                tasks: true,
              },
            },
          },
          orderBy: [{ projectId: "asc" }, { order: "asc" }],
        }),
        prisma.task.findMany({
          where: {
            OR: [{ workspaceId: workspace.id }, { project: { workspaceId: workspace.id } }],
          },
          include: taskListInclude,
          orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
        }),
        prisma.workTemplate.findMany({
          where: { workspaceId: workspace.id },
          orderBy: { createdAt: "desc" },
        }),
        prisma.customFieldDefinition.findMany({
          where: { workspaceId: workspace.id },
          orderBy: [{ entityType: "asc" }, { createdAt: "desc" }],
        }),
      ]);

      return {
        workspace: mapWorkspace(workspace),
        projects: projects.map(mapProject),
        projectLists: projectLists.map(mapProjectList),
        tasks: tasks.map((task) => mapTask(task, currentUserId)),
        templates: templates.map(mapTemplate),
        customFields: customFields.map(mapCustomFieldDefinition),
        users,
      };
    },
    () => buildFallbackWorkHub(currentUserId, users),
  );
}

export async function getWorkTaskById(id: string, currentUserId?: string): Promise<TaskDetailRecord | null> {
  return withFallback(
    async () => {
      if (!prisma) {
        const task = demoStore.tasks.find((item) => item.id === id);
        if (!task) {
          return null;
        }

        return {
          ...hydrateDemoTask(task, currentUserId),
          comments: demoStore.taskComments.filter((item) => item.taskId === id),
          checklistItems: demoStore.taskChecklistItems.filter((item) => item.taskId === id).sort((left, right) => left.order - right.order),
          subtasks: demoStore.tasks.filter((item) => item.parentTaskId === id).map((item) => hydrateDemoTask(item, currentUserId)),
          dependencies: demoStore.taskDependencies.filter((item) => item.taskId === id),
          customFields: demoStore.customFieldValues
            .filter((value) => value.entityType === "TASK" && value.entityId === id)
            .map((value) => ({
              ...value,
              definitionName:
                value.definitionName ??
                demoStore.customFieldDefinitions.find((definition) => definition.id === value.definitionId)?.name ??
                null,
            })),
        };
      }

      const task = await prisma.task.findUnique({
        where: { id },
        include: taskDetailInclude,
      });

      if (!task) {
        return null;
      }

      const customFields = await prisma.customFieldValue.findMany({
        where: {
          entityType: "TASK",
          entityId: id,
        },
        include: {
          definition: true,
        },
        orderBy: { createdAt: "asc" },
      });

      return {
        ...mapTask(task, currentUserId),
        comments: task.comments.map(mapTaskComment),
        checklistItems: task.checklistItems.map(mapChecklistItem),
        subtasks: task.subtasks.map((item) => mapTask(item, currentUserId)),
        dependencies: task.blockedBy.map(mapDependency),
        customFields: customFields.map(mapCustomFieldValue),
      };
    },
    () => {
      const task = demoStore.tasks.find((item) => item.id === id);

      if (!task) {
        return null;
      }

      return {
        ...hydrateDemoTask(task, currentUserId),
        comments: demoStore.taskComments.filter((item) => item.taskId === id),
        checklistItems: demoStore.taskChecklistItems.filter((item) => item.taskId === id).sort((left, right) => left.order - right.order),
        subtasks: demoStore.tasks.filter((item) => item.parentTaskId === id).map((item) => hydrateDemoTask(item, currentUserId)),
        dependencies: demoStore.taskDependencies.filter((item) => item.taskId === id),
        customFields: demoStore.customFieldValues
          .filter((value) => value.entityType === "TASK" && value.entityId === id)
          .map((value) => ({
            ...value,
            definitionName:
              value.definitionName ??
              demoStore.customFieldDefinitions.find((definition) => definition.id === value.definitionId)?.name ??
              null,
          })),
      };
    },
  );
}

export async function createProject(input: CreateProjectInput): Promise<ProjectRecord> {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const workspace = input.workspaceId ? await prisma.workspace.findUnique({ where: { id: input.workspaceId } }) : await ensureWorkspace();

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      const slug = await buildProjectSlug(workspace.id, input.name);
      const template = input.templateId
        ? await prisma.workTemplate.findUnique({
            where: { id: input.templateId },
          })
        : null;

      const project = await prisma.project.create({
        data: {
          workspaceId: workspace.id,
          clientId: input.clientId,
          ownerId: input.ownerId,
          name: input.name,
          slug,
          summary: input.summary ?? normalizeProjectTemplatePayload(template?.payload).projectSummary,
          status: input.status ?? "PLANNING",
          health: input.health ?? "ON_TRACK",
          startDate: parseDate(input.startDate),
          endDate: parseDate(input.endDate),
        },
        include: {
          workspace: true,
          client: true,
          owner: true,
          tasks: {
            select: {
              status: true,
            },
          },
          _count: {
            select: {
              tasks: true,
            },
          },
        },
      });

      if (template) {
        await applyProjectTemplateToDatabase(
          project.id,
          project.workspaceId,
          project.clientId ?? undefined,
          project.ownerId ?? undefined,
          normalizeProjectTemplatePayload(template.payload),
        );
      }

      const hydratedProject = await prisma.project.findUnique({
        where: { id: project.id },
        include: {
          workspace: true,
          client: true,
          owner: true,
          tasks: {
            select: {
              status: true,
            },
          },
          _count: {
            select: {
              tasks: true,
            },
          },
        },
      });

      return mapProject(hydratedProject ?? project);
    },
    () => {
      const workspace = demoStore.workspaces.find((item) => item.id === input.workspaceId) ?? getFallbackWorkspace();
      const client = demoStore.clients.find((item) => item.id === input.clientId);
      const owner = getDemoUserById(input.ownerId);
      const slugBase = slugify(input.name) || "projeto";
      const currentSlugs = new Set(
        demoStore.projects.filter((item) => item.workspaceId === workspace.id).map((item) => item.slug),
      );
      let slug = slugBase;
      let index = 1;

      while (currentSlugs.has(slug)) {
        index += 1;
        slug = `${slugBase}-${index}`;
      }

      const template = input.templateId ? demoStore.workTemplates.find((item) => item.id === input.templateId) : null;
      const templatePayload = normalizeProjectTemplatePayload(template?.payload);

      const project = {
        id: nextDemoId("project"),
        workspaceId: workspace.id,
        workspaceName: workspace.name,
        clientId: client?.id ?? null,
        clientName: client?.companyName ?? null,
        ownerId: owner?.id ?? null,
        ownerName: owner?.name ?? null,
        name: input.name,
        slug,
        summary: input.summary ?? templatePayload.projectSummary ?? null,
        status: input.status ?? "PLANNING",
        health: input.health ?? "ON_TRACK",
        startDate: input.startDate ?? null,
        endDate: input.endDate ?? null,
        taskCount: 0,
        completedTaskCount: 0,
        createdAt: new Date().toISOString(),
      } satisfies ProjectRecord;

      demoStore.projects.unshift(project);

      if (template) {
        applyProjectTemplateToDemo(
          project.id,
          project.workspaceId,
          project.clientId ?? undefined,
          project.ownerId ?? undefined,
          templatePayload,
        );
      }

      return {
        ...project,
        taskCount: demoStore.tasks.filter((item) => item.projectId === project.id).length,
        completedTaskCount: demoStore.tasks.filter((item) => item.projectId === project.id && item.status === "DONE").length,
      };
    },
  );
}

export async function createProjectList(input: CreateProjectListInput): Promise<ProjectListRecord> {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const nextOrder =
        typeof input.order === "number"
          ? input.order
          : await prisma.projectList.count({
              where: { projectId: input.projectId },
            });

      const list = await prisma.projectList.create({
        data: {
          projectId: input.projectId,
          name: input.name,
          description: input.description,
          color: input.color,
          order: nextOrder,
          statusCatalog: input.statusCatalog?.length ? input.statusCatalog : defaultStatusCatalog,
        },
        include: {
          project: true,
          _count: {
            select: {
              tasks: true,
            },
          },
        },
      });

      return mapProjectList(list);
    },
    () => {
      const project = demoStore.projects.find((item) => item.id === input.projectId);
      const nextOrder =
        typeof input.order === "number"
          ? input.order
          : demoStore.projectLists.filter((item) => item.projectId === input.projectId).length;

      const list = {
        id: nextDemoId("list"),
        projectId: input.projectId,
        projectName: project?.name ?? null,
        name: input.name,
        description: input.description,
        color: input.color,
        order: nextOrder,
        statusCatalog: input.statusCatalog?.length ? input.statusCatalog : defaultStatusCatalog,
        taskCount: 0,
        createdAt: new Date().toISOString(),
      } satisfies ProjectListRecord;

      demoStore.projectLists.push(list);
      return list;
    },
  );
}

export async function createWorkTask(input: CreateWorkTaskInput): Promise<TaskRecord> {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const context = await resolveTaskContext(input);
      const assigneeIds = uniqueValues(input.assigneeIds);
      const watcherIds = uniqueValues(input.watcherIds);
      const blockedByTaskIds = uniqueValues(input.blockedByTaskIds);
      const ownerId = input.ownerId ?? assigneeIds[0];

      const task = await prisma.task.create({
        data: {
          title: input.title,
          description: input.description,
          status: input.status ?? "TODO",
          statusLabel: input.statusLabel,
          priority: input.priority ?? "MEDIUM",
          startDate: parseDate(input.startDate),
          dueDate: parseDate(input.dueDate),
          endDate: parseDate(input.endDate),
          estimatedMinutes: input.estimatedMinutes,
          trackedMinutes: input.trackedMinutes ?? 0,
          labels: uniqueValues(input.labels),
          recurringRule: input.recurringRule,
          blockedReason: input.blockedReason,
          ownerId,
          workspaceId: context.workspaceId,
          projectId: context.projectId,
          listId: context.listId,
          parentTaskId: input.parentTaskId,
          clientId: context.clientId,
          leadId: input.leadId,
          assignments: assigneeIds.length
            ? {
                create: assigneeIds.map((userId, index) => ({
                  userId,
                  isPrimary: index === 0,
                })),
              }
            : undefined,
          watchers: watcherIds.length
            ? {
                create: watcherIds.map((userId) => ({ userId })),
              }
            : undefined,
          blockedBy: blockedByTaskIds.length
            ? {
                create: blockedByTaskIds.map((dependsOnTaskId) => ({ dependsOnTaskId })),
              }
            : undefined,
        },
        include: taskListInclude,
      });

      return mapTask(task);
    },
    () => {
      const context = resolveDemoTaskContext(input);
      const owner = getDemoUserById(input.ownerId ?? input.assigneeIds?.[0]);
      const assignees = buildDemoAssignees(input.assigneeIds?.length ? input.assigneeIds : owner?.id ? [owner.id] : []);
      const watchers = buildDemoAssignees(input.watcherIds);
      const project = demoStore.projects.find((item) => item.id === context.projectId);
      const list = demoStore.projectLists.find((item) => item.id === context.listId);
      const workspace = demoStore.workspaces.find((item) => item.id === context.workspaceId) ?? getFallbackWorkspace();
      const parentTask = demoStore.tasks.find((item) => item.id === input.parentTaskId);
      const client = demoStore.clients.find((item) => item.id === context.clientId);
      const lead = demoStore.leads.find((item) => item.id === input.leadId);

      const task = {
        id: nextDemoId("task"),
        title: input.title,
        description: input.description,
        status: input.status ?? "TODO",
        statusLabel: input.statusLabel ?? null,
        priority: input.priority ?? "MEDIUM",
        startDate: input.startDate ?? null,
        dueDate: input.dueDate ?? null,
        endDate: input.endDate ?? null,
        estimatedMinutes: input.estimatedMinutes ?? null,
        trackedMinutes: input.trackedMinutes ?? 0,
        labels: uniqueValues(input.labels),
        recurringRule: input.recurringRule ?? null,
        blockedReason: input.blockedReason ?? null,
        ownerId: owner?.id ?? null,
        ownerName: owner?.name ?? null,
        workspaceId: workspace.id,
        workspaceName: workspace.name,
        projectId: project?.id ?? null,
        projectName: project?.name ?? null,
        listId: list?.id ?? null,
        listName: list?.name ?? null,
        parentTaskId: parentTask?.id ?? null,
        parentTaskTitle: parentTask?.title ?? null,
        clientId: client?.id ?? null,
        clientName: client?.companyName ?? null,
        leadId: lead?.id ?? null,
        leadName: lead?.name ?? null,
        assignees,
        watchers,
        checklistProgress: {
          completed: 0,
          total: 0,
        },
        commentCount: 0,
        subtaskCount: 0,
        blockedByCount: uniqueValues(input.blockedByTaskIds).length,
        isMyTask: false,
        createdAt: new Date().toISOString(),
      } satisfies TaskRecord;

      demoStore.tasks.unshift(task);

      for (const blockedTaskId of uniqueValues(input.blockedByTaskIds)) {
        const dependencyTask = demoStore.tasks.find((item) => item.id === blockedTaskId);
        demoStore.taskDependencies.push({
          id: nextDemoId("task_dep"),
          taskId: task.id,
          dependsOnTaskId: blockedTaskId,
          dependsOnTaskTitle: dependencyTask?.title ?? null,
          createdAt: new Date().toISOString(),
        });
      }

      return hydrateDemoTask(task);
    },
  );
}

export async function createTaskComment(input: CreateTaskCommentInput): Promise<TaskCommentRecord> {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const comment = await prisma.taskComment.create({
        data: {
          taskId: input.taskId,
          authorId: input.authorId,
          body: input.body,
          mentions: extractMentions(input.body),
        },
        include: {
          author: true,
        },
      });

      return mapTaskComment(comment);
    },
    () => {
      const author = getDemoUserById(input.authorId);
      const comment = {
        id: nextDemoId("task_comment"),
        taskId: input.taskId,
        authorId: author?.id ?? null,
        authorName: author?.name ?? null,
        body: input.body,
        mentions: extractMentions(input.body),
        createdAt: new Date().toISOString(),
      } satisfies TaskCommentRecord;

      demoStore.taskComments.unshift(comment);
      return comment;
    },
  );
}

export async function createChecklistItem(input: CreateChecklistItemInput): Promise<TaskChecklistItemRecord> {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const order = await prisma.taskChecklistItem.count({
        where: { taskId: input.taskId },
      });

      const item = await prisma.taskChecklistItem.create({
        data: {
          taskId: input.taskId,
          title: input.title,
          assigneeId: input.assigneeId,
          dueDate: parseDate(input.dueDate),
          order,
        },
        include: {
          assignee: true,
        },
      });

      return mapChecklistItem(item);
    },
    () => {
      const assignee = getDemoUserById(input.assigneeId);
      const item = {
        id: nextDemoId("task_check"),
        taskId: input.taskId,
        title: input.title,
        done: false,
        order: demoStore.taskChecklistItems.filter((entry) => entry.taskId === input.taskId).length,
        assigneeId: assignee?.id ?? null,
        assigneeName: assignee?.name ?? null,
        dueDate: input.dueDate ?? null,
        createdAt: new Date().toISOString(),
      } satisfies TaskChecklistItemRecord;

      demoStore.taskChecklistItems.push(item);
      return item;
    },
  );
}

export async function createWorkTemplate(input: CreateTemplateInput): Promise<WorkTemplateRecord> {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const template = await prisma.workTemplate.create({
        data: {
          workspaceId: input.workspaceId,
          name: input.name,
          description: input.description,
          scope: input.scope,
          payload: input.payload as Prisma.InputJsonValue,
        },
      });

      return mapTemplate(template);
    },
    () => {
      const template = {
        id: nextDemoId("template"),
        workspaceId: input.workspaceId,
        name: input.name,
        description: input.description,
        scope: input.scope,
        payload: input.payload,
        createdAt: new Date().toISOString(),
      } satisfies WorkTemplateRecord;

      demoStore.workTemplates.unshift(template);
      return template;
    },
  );
}

export async function createCustomFieldDefinition(
  input: CreateCustomFieldDefinitionInput,
): Promise<CustomFieldDefinitionRecord> {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const definition = await prisma.customFieldDefinition.create({
        data: {
          workspaceId: input.workspaceId,
          name: input.name,
          key: input.key,
          entityType: input.entityType,
          fieldType: input.fieldType,
          options: (input.options ?? null) as Prisma.InputJsonValue | undefined,
          required: input.required ?? false,
        },
      });

      return mapCustomFieldDefinition(definition);
    },
    () => {
      const definition = {
        id: nextDemoId("custom_field"),
        workspaceId: input.workspaceId,
        name: input.name,
        key: input.key,
        entityType: input.entityType,
        fieldType: input.fieldType,
        options: input.options ?? null,
        required: input.required ?? false,
        createdAt: new Date().toISOString(),
      } satisfies CustomFieldDefinitionRecord;

      demoStore.customFieldDefinitions.unshift(definition);
      return definition;
    },
  );
}

export async function upsertCustomFieldValue(input: UpsertCustomFieldValueInput): Promise<CustomFieldValueRecord> {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const value = await prisma.customFieldValue.upsert({
        where: {
          definitionId_entityId: {
            definitionId: input.definitionId,
            entityId: input.entityId,
          },
        },
        create: {
          definitionId: input.definitionId,
          entityType: input.entityType,
          entityId: input.entityId,
          value: input.value as Prisma.InputJsonValue,
        },
        update: {
          value: input.value as Prisma.InputJsonValue,
        },
        include: {
          definition: true,
        },
      });

      return mapCustomFieldValue(value);
    },
    () => {
      const existing = demoStore.customFieldValues.find(
        (item) => item.definitionId === input.definitionId && item.entityId === input.entityId,
      );

      if (existing) {
        existing.value = input.value;
        return {
          ...existing,
          definitionName:
            existing.definitionName ??
            demoStore.customFieldDefinitions.find((definition) => definition.id === existing.definitionId)?.name ??
            null,
        };
      }

      const created = {
        id: nextDemoId("custom_value"),
        definitionId: input.definitionId,
        definitionName:
          demoStore.customFieldDefinitions.find((definition) => definition.id === input.definitionId)?.name ?? null,
        entityType: input.entityType,
        entityId: input.entityId,
        value: input.value,
        createdAt: new Date().toISOString(),
      } satisfies CustomFieldValueRecord;

      demoStore.customFieldValues.unshift(created);
      return created;
    },
  );
}

