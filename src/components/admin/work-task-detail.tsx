import Link from "next/link";
import { CheckSquare2, Clock3, MessageSquareText, Sparkles, SplitSquareVertical, Waypoints } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, formatDateTime, formatMinutes, formatRelativeHoursFromNow } from "@/lib/formatters";
import type { ActivityRecord, CustomFieldDefinitionRecord, TaskDetailRecord, UserRecord } from "@/lib/types";
import {
  createChecklistItemAction,
  createTaskCommentAction,
  createWorkTaskAction,
  updateTaskCustomFieldValueAction,
} from "@/modules/work/actions";

function getCurrentCustomFieldValue(task: TaskDetailRecord, definition: CustomFieldDefinitionRecord) {
  return task.customFields.find((field) => field.definitionId === definition.id)?.value;
}

function renderCustomFieldPreview(value: TaskDetailRecord["customFields"][number]["value"] | undefined) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (value && typeof value === "object") {
    if ("selected" in value) {
      return String(value.selected ?? "-");
    }

    if ("values" in value && Array.isArray(value.values)) {
      return value.values.join(", ");
    }

    return JSON.stringify(value);
  }

  if (typeof value === "boolean") {
    return value ? "Sim" : "Nao";
  }

  return value == null ? "-" : String(value);
}

function defaultFieldValue(value: TaskDetailRecord["customFields"][number]["value"] | undefined) {
  if (value && typeof value === "object" && "selected" in value) {
    return String(value.selected ?? "");
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

export function WorkTaskDetail({
  task,
  users,
  customFieldDefinitions,
  activities,
}: {
  task: TaskDetailRecord;
  users: UserRecord[];
  customFieldDefinitions: CustomFieldDefinitionRecord[];
  activities: ActivityRecord[];
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-4">
        {[
          { label: "Status", value: task.statusLabel ?? task.status, meta: task.listName ?? "Sem lista" },
          { label: "Prazo", value: formatDate(task.dueDate), meta: task.dueDate ? formatRelativeHoursFromNow(task.dueDate) : "Sem SLA" },
          { label: "Estimativa", value: formatMinutes(task.estimatedMinutes), meta: `${formatMinutes(task.trackedMinutes)} registrados` },
          { label: "Subtarefas", value: String(task.subtaskCount), meta: `${task.commentCount} comentarios` },
        ].map((item) => (
          <Card className="p-5" key={item.label}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-950/44">{item.label}</p>
            <p className="mt-3 font-display text-[2.1rem] leading-none tracking-[-0.05em] text-ink-950">{item.value}</p>
            <p className="mt-3 text-sm text-ink-950/56">{item.meta}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.3fr)_400px]">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col gap-4 border-b border-ink-950/8 pb-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">{task.projectName ?? "Workspace task"}</p>
                <h2 className="mt-3 font-display text-[2.6rem] leading-none tracking-[-0.05em] text-ink-950">{task.title}</h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-ink-950/62">{task.description ?? "Sem descricao detalhada."}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge tone={task.status === "DONE" ? "success" : task.priority === "URGENT" ? "warning" : "neutral"}>
                  {task.statusLabel ?? task.status}
                </Badge>
                <Badge>{task.priority}</Badge>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[24px] border border-ink-950/8 bg-white px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-950/44">Contexto</p>
                <div className="mt-3 space-y-2 text-sm text-ink-950/68">
                  <p>Workspace: {task.workspaceName ?? "-"}</p>
                  <p>Projeto: {task.projectName ?? "-"}</p>
                  <p>Lista: {task.listName ?? "-"}</p>
                  <p>Cliente: {task.clientName ?? "-"}</p>
                  <p>Lead: {task.leadName ?? "-"}</p>
                  <p>Tarefa pai: {task.parentTaskTitle ?? "-"}</p>
                </div>
              </div>
              <div className="rounded-[24px] border border-ink-950/8 bg-sand-50 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-950/44">Pessoas e labels</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {task.assignees.map((assignee) => (
                    <span className="rounded-full bg-ink-950/6 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-ink-950/62" key={assignee.id}>
                      {assignee.name}
                    </span>
                  ))}
                  {!task.assignees.length ? <span className="text-sm text-ink-950/48">Sem responsavel definido</span> : null}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {task.labels.map((label) => (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-ink-950/62 ring-1 ring-ink-950/8" key={label}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <SplitSquareVertical className="size-5 text-emerald-600" />
              <div>
                <h3 className="font-display text-2xl text-ink-950">Subtarefas</h3>
                <p className="text-sm text-ink-950/58">Quebre entrega em pacotes menores sem perder o contexto da task principal.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {task.subtasks.map((subtask) => (
                <Link className="block rounded-[22px] border border-ink-950/8 bg-white px-4 py-4 transition hover:border-emerald-400/40" href={`/admin/work/tasks/${subtask.id}`} key={subtask.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-ink-950">{subtask.title}</p>
                    <Badge>{subtask.statusLabel ?? subtask.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-ink-950/58">{subtask.description ?? "Sem descricao."}</p>
                </Link>
              ))}
              {!task.subtasks.length ? (
                <p className="rounded-[22px] border border-dashed border-ink-950/12 bg-sand-50 px-4 py-4 text-sm text-ink-950/48">
                  Nenhuma subtarefa aberta ainda.
                </p>
              ) : null}
            </div>
            <form action={createWorkTaskAction} className="mt-5 grid gap-3">
              <input name="redirectTo" type="hidden" value={`/admin/work/tasks/${task.id}`} />
              <input name="parentTaskId" type="hidden" value={task.id} />
              <input name="workspaceId" type="hidden" value={task.workspaceId ?? ""} />
              <input name="projectId" type="hidden" value={task.projectId ?? ""} />
              <input name="listId" type="hidden" value={task.listId ?? ""} />
              <input name="clientId" type="hidden" value={task.clientId ?? ""} />
              <input name="leadId" type="hidden" value={task.leadId ?? ""} />
              <Input name="title" placeholder="Nova subtarefa" required />
              <Textarea className="min-h-[96px]" name="description" placeholder="Escopo da subtarefa." />
              <div className="grid gap-3 sm:grid-cols-3">
                <Select defaultValue="TODO" name="status">
                  <option value="TODO">A fazer</option>
                  <option value="IN_PROGRESS">Em andamento</option>
                  <option value="REVIEW">Revisao</option>
                  <option value="DONE">Concluida</option>
                </Select>
                <Select defaultValue="MEDIUM" name="priority">
                  <option value="LOW">Baixa</option>
                  <option value="MEDIUM">Media</option>
                  <option value="HIGH">Alta</option>
                  <option value="URGENT">Urgente</option>
                </Select>
                <Input name="dueDate" type="date" />
              </div>
              <Button type="submit">Criar subtarefa</Button>
            </form>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <CheckSquare2 className="size-5 text-emerald-600" />
              <div>
                <h3 className="font-display text-2xl text-ink-950">Checklist estruturado</h3>
                <p className="text-sm text-ink-950/58">Passos de execucao menores, com dono e data quando necessario.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {task.checklistItems.map((item) => (
                <div className="rounded-[22px] border border-ink-950/8 bg-white px-4 py-4" key={item.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-ink-950">{item.title}</p>
                    <Badge tone={item.done ? "success" : "neutral"}>{item.done ? "DONE" : "TODO"}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-ink-950/58">
                    {[item.assigneeName, item.dueDate ? formatDate(item.dueDate) : null].filter(Boolean).join(" | ") || "Sem dono / data"}
                  </p>
                </div>
              ))}
            </div>
            <form action={createChecklistItemAction} className="mt-5 grid gap-3">
              <input name="redirectTo" type="hidden" value={`/admin/work/tasks/${task.id}`} />
              <input name="taskId" type="hidden" value={task.id} />
              <Input name="title" placeholder="Novo item de checklist" required />
              <div className="grid gap-3 sm:grid-cols-2">
                <Select defaultValue="" name="assigneeId">
                  <option value="">Sem responsavel</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Select>
                <Input name="dueDate" type="date" />
              </div>
              <Button type="submit" variant="secondary">Adicionar item</Button>
            </form>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <MessageSquareText className="size-5 text-emerald-600" />
              <div>
                <h3 className="font-display text-2xl text-ink-950">Comentarios e mencoes</h3>
                <p className="text-sm text-ink-950/58">Conversa operacional dentro da propria task, com rastreabilidade.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {task.comments.map((comment) => (
                <div className="rounded-[22px] border border-ink-950/8 bg-white px-4 py-4" key={comment.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-ink-950">{comment.authorName ?? "Sistema"}</p>
                    <p className="text-xs uppercase tracking-[0.14em] text-ink-950/42">{formatDateTime(comment.createdAt)}</p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-ink-950/68">{comment.body}</p>
                  {comment.mentions.length ? (
                    <p className="mt-2 text-xs uppercase tracking-[0.14em] text-emerald-600">@{comment.mentions.join(" @")}</p>
                  ) : null}
                </div>
              ))}
              {!task.comments.length ? (
                <p className="rounded-[22px] border border-dashed border-ink-950/12 bg-sand-50 px-4 py-4 text-sm text-ink-950/48">
                  Nenhum comentario ainda. Use mencoes como @usuario para puxar alguem para a conversa.
                </p>
              ) : null}
            </div>
            <form action={createTaskCommentAction} className="mt-5 grid gap-3">
              <input name="redirectTo" type="hidden" value={`/admin/work/tasks/${task.id}`} />
              <input name="taskId" type="hidden" value={task.id} />
              <Textarea name="body" placeholder="Ex.: @Caio validar se a copy final conversa com a oferta premium." required />
              <Button type="submit">Publicar comentario</Button>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Waypoints className="size-5 text-emerald-600" />
              <div>
                <h3 className="font-display text-2xl text-ink-950">Dependencias</h3>
                <p className="text-sm text-ink-950/58">Bloqueios e itens previos que precisam estar resolvidos.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {task.dependencies.map((dependency) => (
                <div className="rounded-[22px] border border-ink-950/8 bg-white px-4 py-4" key={dependency.id}>
                  <p className="font-medium text-ink-950">{dependency.dependsOnTaskTitle ?? "Dependencia sem titulo"}</p>
                  <p className="mt-2 text-sm text-ink-950/58">Task relacionada: {dependency.dependsOnTaskId}</p>
                </div>
              ))}
              {!task.dependencies.length ? (
                <p className="rounded-[22px] border border-dashed border-ink-950/12 bg-sand-50 px-4 py-4 text-sm text-ink-950/48">
                  Nenhum bloqueio registrado nesta task.
                </p>
              ) : null}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="size-5 text-emerald-600" />
              <div>
                <h3 className="font-display text-2xl text-ink-950">Custom fields da task</h3>
                <p className="text-sm text-ink-950/58">Estruture dados operacionais sem quebrar a modelagem central.</p>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {customFieldDefinitions.map((definition) => {
                const currentValue = getCurrentCustomFieldValue(task, definition);

                return (
                  <form action={updateTaskCustomFieldValueAction} className="rounded-[22px] border border-ink-950/8 bg-white px-4 py-4" key={definition.id}>
                    <input name="redirectTo" type="hidden" value={`/admin/work/tasks/${task.id}`} />
                    <input name="definitionId" type="hidden" value={definition.id} />
                    <input name="entityType" type="hidden" value="TASK" />
                    <input name="entityId" type="hidden" value={task.id} />
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-ink-950">{definition.name}</p>
                      <Badge>{definition.fieldType}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-ink-950/52">Atual: {renderCustomFieldPreview(currentValue)}</p>

                    <div className="mt-4">
                      {definition.fieldType === "BOOLEAN" ? (
                        <Select defaultValue={String(Boolean(currentValue))} name="booleanValue">
                          <option value="true">Sim</option>
                          <option value="false">Nao</option>
                        </Select>
                      ) : definition.fieldType === "NUMBER" || definition.fieldType === "CURRENCY" ? (
                        <Input defaultValue={defaultFieldValue(currentValue)} name="numericValue" type="number" />
                      ) : definition.fieldType === "DATE" ? (
                        <Input defaultValue={defaultFieldValue(currentValue)} name="dateValue" type="date" />
                      ) : definition.fieldType === "SELECT" && Array.isArray(definition.options?.values) ? (
                        <Select defaultValue={defaultFieldValue(currentValue)} name="value">
                          <option value="">Selecionar</option>
                          {definition.options.values.map((option) => (
                            <option key={String(option)} value={String(option)}>
                              {String(option)}
                            </option>
                          ))}
                        </Select>
                      ) : definition.fieldType === "MULTI_SELECT" && Array.isArray(definition.options?.values) ? (
                        <div className="grid gap-2">
                          {definition.options.values.map((option) => (
                            <label className="flex items-center gap-3 rounded-2xl border border-ink-950/8 bg-sand-50 px-3 py-3 text-sm text-ink-950/72" key={String(option)}>
                              <input className="size-4 rounded border-ink-950/20 text-emerald-500 focus:ring-emerald-400" defaultChecked={Array.isArray(currentValue) ? currentValue.includes(String(option)) : false} name="multiValue" type="checkbox" value={String(option)} />
                              {String(option)}
                            </label>
                          ))}
                        </div>
                      ) : definition.fieldType === "TEXTAREA" ? (
                        <Textarea defaultValue={defaultFieldValue(currentValue)} name="value" />
                      ) : (
                        <Input defaultValue={defaultFieldValue(currentValue)} name="value" />
                      )}
                    </div>
                    <Button className="mt-4 w-full" size="sm" type="submit" variant="secondary">
                      Atualizar campo
                    </Button>
                  </form>
                );
              })}
              {!customFieldDefinitions.length ? (
                <p className="rounded-[22px] border border-dashed border-ink-950/12 bg-sand-50 px-4 py-4 text-sm text-ink-950/48">
                  Nenhum campo customizado para task ainda. Crie no Work Hub.
                </p>
              ) : null}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Clock3 className="size-5 text-emerald-600" />
              <div>
                <h3 className="font-display text-2xl text-ink-950">Atividade recente</h3>
                <p className="text-sm text-ink-950/58">Trilha auditavel da task.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {activities.map((activity) => (
                <div className="rounded-[22px] border border-ink-950/8 bg-white px-4 py-4" key={activity.id}>
                  <p className="font-medium text-ink-950">{activity.description}</p>
                  <p className="mt-2 text-sm text-ink-950/58">{[activity.actorName, formatDateTime(activity.createdAt)].filter(Boolean).join(" | ")}</p>
                </div>
              ))}
              {!activities.length ? (
                <p className="rounded-[22px] border border-dashed border-ink-950/12 bg-sand-50 px-4 py-4 text-sm text-ink-950/48">
                  Ainda sem eventos registrados para esta task.
                </p>
              ) : null}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
