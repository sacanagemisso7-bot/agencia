import Link from "next/link";
import { ArrowRight, CalendarClock, CircleDot, FolderKanban, Layers3, LayoutList, Milestone, Plus, Sparkles, Table2, Workflow } from "lucide-react";

import { PageSection } from "@/components/admin/page-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, formatDateLabel, formatMinutes, formatRelativeHoursFromNow } from "@/lib/formatters";
import { taskPriorityOptions, taskStatusOptions } from "@/lib/navigation";
import type { ClientRecord, LeadRecord, TaskRecord, WorkHubRecord } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  createCustomFieldDefinitionAction,
  createProjectAction,
  createProjectListAction,
  createWorkTaskAction,
  createWorkTemplateAction,
} from "@/modules/work/actions";

export type WorkView = "list" | "board" | "calendar" | "table" | "timeline" | "my";

const viewOptions: Array<{ value: WorkView; label: string; icon: typeof LayoutList }> = [
  { value: "list", label: "List view", icon: LayoutList },
  { value: "board", label: "Board", icon: Layers3 },
  { value: "calendar", label: "Calendar", icon: CalendarClock },
  { value: "table", label: "Table", icon: Table2 },
  { value: "timeline", label: "Timeline", icon: Workflow },
  { value: "my", label: "My tasks", icon: CircleDot },
];

function getProjectProgress(taskCount: number, completedTaskCount: number) {
  if (!taskCount) {
    return 0;
  }

  return Math.round((completedTaskCount / taskCount) * 100);
}

function groupTasksByList(tasks: TaskRecord[]) {
  return tasks.reduce<Record<string, TaskRecord[]>>((accumulator, task) => {
    const key = task.listId ?? "sem-lista";
    accumulator[key] ??= [];
    accumulator[key].push(task);
    return accumulator;
  }, {});
}

function formatTaskStatus(task: TaskRecord) {
  return task.statusLabel ?? task.status;
}

function formatCustomFieldType(fieldType: string) {
  return fieldType.replaceAll("_", " ");
}

function TaskPill({ task }: { task: TaskRecord }) {
  return (
    <Link href={`/admin/work/tasks/${task.id}`}>
      <div className="rounded-[22px] border border-ink-950/8 bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:border-emerald-400/40 hover:shadow-[0_20px_45px_rgba(9,17,31,0.08)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium text-ink-950">{task.title}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-950/40">
              {[task.projectName, task.listName].filter(Boolean).join(" | ") || "Workspace"}
            </p>
          </div>
          <Badge tone={task.status === "DONE" ? "success" : task.priority === "URGENT" ? "warning" : "neutral"}>
            {formatTaskStatus(task)}
          </Badge>
        </div>
        <p className="mt-3 text-sm leading-6 text-ink-950/62">{task.description ?? "Sem descricao operacional registrada."}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {task.labels.slice(0, 3).map((label) => (
            <span className="rounded-full bg-ink-950/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-950/62" key={label}>
              {label}
            </span>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs uppercase tracking-[0.12em] text-ink-950/42">
          <span>{task.assignees.length ? task.assignees.map((assignee) => assignee.name.split(" ")[0]).join(", ") : "Sem dono"}</span>
          <span>{task.dueDate ? `${formatDate(task.dueDate)} | ${formatRelativeHoursFromNow(task.dueDate)}` : "Sem prazo"}</span>
        </div>
      </div>
    </Link>
  );
}

function ViewCanvas({ view, data }: { view: WorkView; data: WorkHubRecord }) {
  const listGroups = groupTasksByList(data.tasks);
  const myTasks = data.tasks.filter((task) => task.isMyTask);

  if (view === "table") {
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Tarefa</TableHeaderCell>
              <TableHeaderCell>Projeto</TableHeaderCell>
              <TableHeaderCell>Lista</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Responsaveis</TableHeaderCell>
              <TableHeaderCell>Prazo</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Link className="font-medium text-ink-950 hover:text-emerald-600" href={`/admin/work/tasks/${task.id}`}>
                    {task.title}
                  </Link>
                </TableCell>
                <TableCell>{task.projectName ?? "-"}</TableCell>
                <TableCell>{task.listName ?? "-"}</TableCell>
                <TableCell>{formatTaskStatus(task)}</TableCell>
                <TableCell>{task.assignees.length ? task.assignees.map((assignee) => assignee.name.split(" ")[0]).join(", ") : "-"}</TableCell>
                <TableCell>{task.dueDate ? `${formatDate(task.dueDate)} | ${formatRelativeHoursFromNow(task.dueDate)}` : "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (view === "calendar") {
    const tasksWithDates = data.tasks.filter((task) => task.dueDate).reduce<Record<string, TaskRecord[]>>((accumulator, task) => {
      const key = formatDate(task.dueDate);
      accumulator[key] ??= [];
      accumulator[key].push(task);
      return accumulator;
    }, {});

    return (
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {Object.entries(tasksWithDates).map(([label, tasks]) => (
          <div className="rounded-[24px] border border-ink-950/8 bg-white p-4" key={label}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">{label}</p>
            <div className="mt-4 space-y-3">
              {tasks.map((task) => (
                <TaskPill key={task.id} task={task} />
              ))}
            </div>
          </div>
        ))}
        {!Object.keys(tasksWithDates).length ? (
          <p className="rounded-[24px] border border-dashed border-ink-950/12 bg-white/72 p-5 text-sm text-ink-950/55">
            Nenhuma tarefa com data definida ainda. Use a view de lista para iniciar a malha operacional.
          </p>
        ) : null}
      </div>
    );
  }

  if (view === "timeline") {
    return (
      <div className="space-y-4">
        {data.tasks.map((task) => (
          <div className="grid gap-4 rounded-[24px] border border-ink-950/8 bg-white p-5 lg:grid-cols-[140px_minmax(0,1fr)_180px]" key={task.id}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">{formatDateLabel(task.startDate ?? task.createdAt)}</p>
              <p className="mt-2 text-sm text-ink-950/45">{task.dueDate ? `Entrega ${formatDate(task.dueDate)}` : "Backlog ativo"}</p>
            </div>
            <div>
              <Link className="font-display text-2xl tracking-[-0.04em] text-ink-950 hover:text-emerald-600" href={`/admin/work/tasks/${task.id}`}>
                {task.title}
              </Link>
              <p className="mt-2 text-sm leading-7 text-ink-950/62">{task.description ?? "Sem descricao detalhada."}</p>
            </div>
            <div className="space-y-2 text-sm text-ink-950/62">
              <p>{task.projectName ?? "Sem projeto"}</p>
              <p>{task.assignees.length ? task.assignees.map((assignee) => assignee.name.split(" ")[0]).join(", ") : "Sem responsavel"}</p>
              <p>{formatMinutes(task.estimatedMinutes)}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (view === "my") {
    return (
      <div className="grid gap-4">
        {(myTasks.length ? myTasks : data.tasks.slice(0, 6)).map((task) => (
          <TaskPill key={task.id} task={task} />
        ))}
      </div>
    );
  }

  if (view === "board") {
    return (
      <div className="grid gap-4 xl:grid-cols-3 2xl:grid-cols-4">
        {data.projectLists.map((list) => (
          <div className="rounded-[24px] border border-ink-950/8 bg-white p-4" key={list.id}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">{list.projectName}</p>
                <h3 className="mt-2 font-display text-2xl tracking-[-0.04em] text-ink-950">{list.name}</h3>
              </div>
              <span className="rounded-full bg-ink-950/6 px-3 py-1 text-xs text-ink-950/60">
                {listGroups[list.id]?.length ?? 0}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {(listGroups[list.id] ?? []).map((task) => (
                <TaskPill key={task.id} task={task} />
              ))}
              {!listGroups[list.id]?.length ? (
                <p className="rounded-[20px] border border-dashed border-ink-950/12 bg-sand-50 px-4 py-4 text-sm text-ink-950/45">
                  Nenhuma tarefa nesta coluna ainda.
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.projects.map((project) => {
        const projectLists = data.projectLists.filter((list) => list.projectId === project.id);
        const projectTasks = data.tasks.filter((task) => task.projectId === project.id);

        return (
          <div className="rounded-[28px] border border-ink-950/8 bg-white p-5" key={project.id}>
            <div className="flex flex-col gap-4 border-b border-ink-950/8 pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">{project.clientName ?? "Projeto interno"}</p>
                <h3 className="mt-3 font-display text-[2rem] leading-none tracking-[-0.05em] text-ink-950">{project.name}</h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-950/62">{project.summary ?? "Sem resumo executivo."}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Status", value: project.status },
                  { label: "Health", value: project.health },
                  { label: "Progresso", value: `${getProjectProgress(project.taskCount, project.completedTaskCount)}%` },
                ].map((item) => (
                  <div className="rounded-[22px] border border-ink-950/8 bg-sand-50 px-4 py-4" key={item.label}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-950/42">{item.label}</p>
                    <p className="mt-2 font-medium text-ink-950">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-3">
              {projectLists.map((list) => (
                <div className="rounded-[24px] border border-ink-950/8 bg-[#f9fbf8] p-4" key={list.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-emerald-600">{list.statusCatalog.slice(0, 2).join(" | ")}</p>
                      <h4 className="mt-2 font-medium text-ink-950">{list.name}</h4>
                    </div>
                    <span className="rounded-full bg-ink-950/6 px-3 py-1 text-xs text-ink-950/60">{list.taskCount}</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {projectTasks.filter((task) => task.listId === list.id).slice(0, 4).map((task) => (
                      <TaskPill key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function UserCheckGrid({ users, name }: { users: WorkHubRecord["users"]; name: string }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {users.map((user) => (
        <label className="flex items-center gap-3 rounded-2xl border border-ink-950/8 bg-white px-3 py-3 text-sm text-ink-950/72" key={`${name}-${user.id}`}>
          <input className="size-4 rounded border-ink-950/20 text-emerald-500 focus:ring-emerald-400" name={name} type="checkbox" value={user.id} />
          <span className="truncate">{user.name}</span>
        </label>
      ))}
    </div>
  );
}

export function WorkHub({
  data,
  view,
  clients,
  leads,
}: {
  data: WorkHubRecord;
  view: WorkView;
  clients: ClientRecord[];
  leads: LeadRecord[];
}) {
  const overdueTasks = data.tasks.filter((task) => task.dueDate && new Date(task.dueDate).getTime() < Date.now() && task.status !== "DONE");
  const inFlightTasks = data.tasks.filter((task) => ["TODO", "IN_PROGRESS", "REVIEW"].includes(task.status));

  return (
    <div className="space-y-8">
      <PageSection
        title="Agency Work OS"
        description="Hierarquia operacional, estruturas reutilizaveis e views sincronizadas para tirar a operacao da agencia do modo 'modulos soltos' e levar para um work management de verdade."
      >
        <div className="grid gap-4 xl:grid-cols-4">
          {[
            { label: "Projetos ativos", value: String(data.projects.length), meta: `${data.projectLists.length} listas vivas` },
            { label: "Backlog operacional", value: String(inFlightTasks.length), meta: `${overdueTasks.length} itens em atraso` },
            { label: "Templates", value: String(data.templates.length), meta: "Padroes reutilizaveis" },
            { label: "Custom fields", value: String(data.customFields.length), meta: "Modelagem adaptavel" },
          ].map((item) => (
            <Card className="p-5" key={item.label}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-950/44">{item.label}</p>
              <p className="mt-3 font-display text-[2.4rem] leading-none tracking-[-0.06em] text-ink-950">{item.value}</p>
              <p className="mt-3 text-sm text-ink-950/58">{item.meta}</p>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {viewOptions.map((option) => {
            const Icon = option.icon;
            const isActive = option.value === view;

            return (
              <Link
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition",
                  isActive ? "bg-ink-950 text-white" : "bg-white text-ink-950 ring-1 ring-ink-950/10 hover:bg-sand-50",
                )}
                href={`/admin/work?view=${option.value}`}
                key={option.value}
              >
                <Icon className="size-4" />
                <span>{option.label}</span>
              </Link>
            );
          })}
        </div>
      </PageSection>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.35fr)_420px]">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col gap-3 border-b border-ink-950/8 pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">Workspace</p>
                <h2 className="mt-2 font-display text-[2.2rem] tracking-[-0.05em] text-ink-950">{data.workspace.name}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-950/62">{data.workspace.description}</p>
              </div>
              <div className="rounded-[22px] border border-ink-950/8 bg-sand-50 px-5 py-4 text-sm text-ink-950/62">
                <p className="font-semibold text-ink-950">{data.tasks.length} tarefas conectadas</p>
                <p className="mt-1">Mesma base de dados alimentando views diferentes.</p>
              </div>
            </div>
            <div className="mt-6">
              <ViewCanvas data={data} view={view} />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <FolderKanban className="size-5 text-emerald-600" />
              <div>
                <h3 className="font-display text-2xl text-ink-950">Novo projeto</h3>
                <p className="text-sm text-ink-950/58">Crie projetos por cliente e ja injete templates operacionais.</p>
              </div>
            </div>
            <form action={createProjectAction} className="mt-5 grid gap-3">
              <input name="workspaceId" type="hidden" value={data.workspace.id} />
              <input name="redirectTo" type="hidden" value={`/admin/work?view=${view}`} />
              <Input name="name" placeholder="Projeto de growth Q3" required />
              <Textarea name="summary" placeholder="Resumo executivo, escopo e contexto do projeto." />
              <Select defaultValue="" name="clientId">
                <option value="">Cliente opcional</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.companyName}
                  </option>
                ))}
              </Select>
              <Select defaultValue="" name="ownerId">
                <option value="">Owner do projeto</option>
                {data.users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
              <Select defaultValue="" name="templateId">
                <option value="">Sem template</option>
                {data.templates.filter((template) => template.scope === "PROJECT").map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </Select>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input name="startDate" type="date" />
                <Input name="endDate" type="date" />
              </div>
              <Button type="submit">
                Criar projeto
                <Plus className="ml-2 size-4" />
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <h3 className="font-display text-2xl text-ink-950">Nova lista / board</h3>
            <form action={createProjectListAction} className="mt-5 grid gap-3">
              <input name="redirectTo" type="hidden" value={`/admin/work?view=${view}`} />
              <Select defaultValue="" name="projectId">
                <option value="">Projeto</option>
                {data.projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </Select>
              <Input name="name" placeholder="Criacao e aprovacao" required />
              <Textarea className="min-h-[96px]" name="description" placeholder="Contexto da lista." />
              <Input name="color" placeholder="#30b27c" />
              <Textarea className="min-h-[96px]" name="statusCatalog" placeholder="Backlog&#10;Em andamento&#10;Em revisao&#10;Concluido" />
              <Button type="submit" variant="secondary">
                Adicionar lista
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Milestone className="size-5 text-emerald-600" />
              <div>
                <h3 className="font-display text-2xl text-ink-950">Nova tarefa avancada</h3>
                <p className="text-sm text-ink-950/58">Assignees, watchers, labels, datas, contexto comercial e estrutura de projeto.</p>
              </div>
            </div>
            <form action={createWorkTaskAction} className="mt-5 grid gap-3">
              <input name="redirectTo" type="hidden" value={`/admin/work?view=${view}`} />
              <input name="workspaceId" type="hidden" value={data.workspace.id} />
              <Input name="title" placeholder="Lancar sprint de criativos para campanha premium" required />
              <Textarea name="description" placeholder="Escopo, entregaveis, contexto e criterios de pronto." />
              <div className="grid gap-3 sm:grid-cols-2">
                <Select defaultValue="TODO" name="status">
                  {taskStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <Select defaultValue="MEDIUM" name="priority">
                  {taskPriorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
              <Input name="statusLabel" placeholder="Status customizado, ex: aguardando cliente" />
              <div className="grid gap-3 sm:grid-cols-2">
                <Select defaultValue="" name="projectId">
                  <option value="">Projeto opcional</option>
                  {data.projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </Select>
                <Select defaultValue="" name="listId">
                  <option value="">Lista opcional</option>
                  {data.projectLists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.projectName} | {list.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Select defaultValue="" name="clientId">
                  <option value="">Sem cliente</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.companyName}
                    </option>
                  ))}
                </Select>
                <Select defaultValue="" name="leadId">
                  <option value="">Sem lead</option>
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Input name="startDate" type="date" />
                <Input name="dueDate" type="date" />
                <Input name="estimatedMinutes" placeholder="Estimativa em min" type="number" />
              </div>
              <Input name="labels" placeholder="labels separadas por virgula" />
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-950/44">Responsaveis</p>
                <UserCheckGrid name="assigneeIds" users={data.users} />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-950/44">Watchers</p>
                <UserCheckGrid name="watcherIds" users={data.users} />
              </div>
              <Button type="submit">
                Criar tarefa
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="size-5 text-emerald-600" />
              <div>
                <h3 className="font-display text-2xl text-ink-950">Templates e modelagem</h3>
                <p className="text-sm text-ink-950/58">Transforme operacoes recorrentes em blocos reutilizaveis.</p>
              </div>
            </div>
            <form action={createWorkTemplateAction} className="mt-5 grid gap-3">
              <input name="redirectTo" type="hidden" value={`/admin/work?view=${view}`} />
              <input name="workspaceId" type="hidden" value={data.workspace.id} />
              <Input name="name" placeholder="Onboarding de cliente high-ticket" required />
              <Textarea className="min-h-[90px]" name="description" placeholder="Quando usar este template e qual operacao ele padroniza." />
              <Select defaultValue="PROJECT" name="scope">
                <option value="PROJECT">Projeto</option>
                <option value="LIST">Lista</option>
                <option value="TASK">Tarefa</option>
                <option value="CHECKLIST">Checklist</option>
                <option value="DOCUMENT">Documento</option>
                <option value="AUTOMATION">Automacao</option>
              </Select>
              <Input name="projectTemplateName" placeholder="Nome padrao do projeto gerado" />
              <Textarea className="min-h-[100px]" name="projectTemplateSummary" placeholder="Resumo padrao do projeto." />
              <Textarea className="min-h-[110px]" name="lists" placeholder="Diagnostico&#10;Criacao&#10;Aprovacao&#10;Publicacao" />
              <Button type="submit" variant="secondary">
                Salvar template
              </Button>
            </form>

            <div className="mt-5 space-y-3">
              {data.templates.slice(0, 4).map((template) => (
                <div className="rounded-[22px] border border-ink-950/8 bg-sand-50 px-4 py-4" key={template.id}>
                  <p className="font-medium text-ink-950">{template.name}</p>
                  <p className="mt-1 text-sm text-ink-950/58">{template.description ?? "Template operacional pronto para reuse."}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-display text-2xl text-ink-950">Custom fields</h3>
            <form action={createCustomFieldDefinitionAction} className="mt-5 grid gap-3">
              <input name="redirectTo" type="hidden" value={`/admin/work?view=${view}`} />
              <input name="workspaceId" type="hidden" value={data.workspace.id} />
              <Input name="name" placeholder="Canal principal" required />
              <Input name="key" placeholder="canal_principal" />
              <div className="grid gap-3 sm:grid-cols-2">
                <Select defaultValue="TASK" name="entityType">
                  <option value="TASK">Task</option>
                  <option value="PROJECT">Projeto</option>
                  <option value="CLIENT">Cliente</option>
                  <option value="CAMPAIGN">Campanha</option>
                  <option value="CONTENT">Conteudo</option>
                  <option value="FORM">Formulario</option>
                </Select>
                <Select defaultValue="TEXT" name="fieldType">
                  <option value="TEXT">Texto</option>
                  <option value="TEXTAREA">Textarea</option>
                  <option value="NUMBER">Numero</option>
                  <option value="CURRENCY">Moeda</option>
                  <option value="BOOLEAN">Booleano</option>
                  <option value="DATE">Data</option>
                  <option value="SELECT">Select</option>
                  <option value="MULTI_SELECT">Multi select</option>
                  <option value="RELATION">Relacao</option>
                </Select>
              </div>
              <Textarea className="min-h-[90px]" name="options" placeholder="Opcao 1&#10;Opcao 2&#10;Opcao 3" />
              <label className="flex items-center gap-3 rounded-2xl border border-ink-950/8 bg-white px-4 py-3 text-sm text-ink-950/72">
                <input className="size-4 rounded border-ink-950/20 text-emerald-500 focus:ring-emerald-400" name="required" type="checkbox" />
                Campo obrigatorio
              </label>
              <Button type="submit" variant="secondary">
                Criar campo
              </Button>
            </form>

            <div className="mt-5 space-y-3">
              {data.customFields.slice(0, 5).map((field) => (
                <div className="rounded-[22px] border border-ink-950/8 bg-white px-4 py-4" key={field.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-ink-950">{field.name}</p>
                    <Badge>{field.entityType}</Badge>
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.14em] text-ink-950/42">{formatCustomFieldType(field.fieldType)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
