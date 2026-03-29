-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProjectHealth" AS ENUM ('ON_TRACK', 'ATTENTION', 'AT_RISK');

-- CreateEnum
CREATE TYPE "TemplateScope" AS ENUM ('PROJECT', 'LIST', 'TASK', 'CHECKLIST', 'DOCUMENT', 'AUTOMATION');

-- CreateEnum
CREATE TYPE "CustomFieldEntity" AS ENUM ('CLIENT', 'PROJECT', 'TASK', 'CAMPAIGN', 'CONTENT', 'FORM');

-- CreateEnum
CREATE TYPE "CustomFieldType" AS ENUM ('TEXT', 'TEXTAREA', 'NUMBER', 'CURRENCY', 'BOOLEAN', 'DATE', 'SELECT', 'MULTI_SELECT', 'RELATION');

-- AlterTable
ALTER TABLE "Client" ADD COLUMN "workspaceId" TEXT;

-- AlterTable
ALTER TABLE "Task"
  ADD COLUMN "statusLabel" TEXT,
  ADD COLUMN "startDate" TIMESTAMP(3),
  ADD COLUMN "endDate" TIMESTAMP(3),
  ADD COLUMN "estimatedMinutes" INTEGER,
  ADD COLUMN "trackedMinutes" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "labels" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "recurringRule" TEXT,
  ADD COLUMN "blockedReason" TEXT,
  ADD COLUMN "workspaceId" TEXT,
  ADD COLUMN "projectId" TEXT,
  ADD COLUMN "listId" TEXT,
  ADD COLUMN "parentTaskId" TEXT;

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "clientId" TEXT,
    "ownerId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNING',
    "health" "ProjectHealth" NOT NULL DEFAULT 'ON_TRACK',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectList" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "statusCatalog" TEXT[] NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProjectList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskAssignment" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TaskAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskWatcher" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TaskWatcher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskComment" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "authorId" TEXT,
    "body" TEXT NOT NULL,
    "mentions" TEXT[] NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TaskComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskChecklistItem" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "assigneeId" TEXT,
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TaskChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskDependency" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "dependsOnTaskId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TaskDependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkTemplate" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "scope" "TemplateScope" NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "WorkTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomFieldDefinition" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "entityType" "CustomFieldEntity" NOT NULL,
    "fieldType" "CustomFieldType" NOT NULL,
    "options" JSONB,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CustomFieldDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomFieldValue" (
    "id" TEXT NOT NULL,
    "definitionId" TEXT NOT NULL,
    "entityType" "CustomFieldEntity" NOT NULL,
    "entityId" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CustomFieldValue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_slug_key" ON "Workspace"("slug");
CREATE UNIQUE INDEX "Project_workspaceId_slug_key" ON "Project"("workspaceId", "slug");
CREATE INDEX "Project_workspaceId_clientId_status_idx" ON "Project"("workspaceId", "clientId", "status");
CREATE INDEX "ProjectList_projectId_order_idx" ON "ProjectList"("projectId", "order");
CREATE UNIQUE INDEX "TaskAssignment_taskId_userId_key" ON "TaskAssignment"("taskId", "userId");
CREATE INDEX "TaskAssignment_userId_createdAt_idx" ON "TaskAssignment"("userId", "createdAt");
CREATE UNIQUE INDEX "TaskWatcher_taskId_userId_key" ON "TaskWatcher"("taskId", "userId");
CREATE INDEX "TaskComment_taskId_createdAt_idx" ON "TaskComment"("taskId", "createdAt");
CREATE INDEX "TaskChecklistItem_taskId_order_idx" ON "TaskChecklistItem"("taskId", "order");
CREATE UNIQUE INDEX "TaskDependency_taskId_dependsOnTaskId_key" ON "TaskDependency"("taskId", "dependsOnTaskId");
CREATE INDEX "WorkTemplate_workspaceId_scope_createdAt_idx" ON "WorkTemplate"("workspaceId", "scope", "createdAt");
CREATE UNIQUE INDEX "CustomFieldDefinition_workspaceId_key_entityType_key" ON "CustomFieldDefinition"("workspaceId", "key", "entityType");
CREATE INDEX "CustomFieldDefinition_workspaceId_entityType_createdAt_idx" ON "CustomFieldDefinition"("workspaceId", "entityType", "createdAt");
CREATE UNIQUE INDEX "CustomFieldValue_definitionId_entityId_key" ON "CustomFieldValue"("definitionId", "entityId");
CREATE INDEX "CustomFieldValue_entityType_entityId_idx" ON "CustomFieldValue"("entityType", "entityId");
CREATE INDEX "Task_projectId_listId_status_dueDate_idx" ON "Task"("projectId", "listId", "status", "dueDate");
CREATE INDEX "Task_ownerId_projectId_status_idx" ON "Task"("ownerId", "projectId", "status");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Project" ADD CONSTRAINT "Project_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Project" ADD CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ProjectList" ADD CONSTRAINT "ProjectList_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Task" ADD CONSTRAINT "Task_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Task" ADD CONSTRAINT "Task_listId_fkey" FOREIGN KEY ("listId") REFERENCES "ProjectList"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Task" ADD CONSTRAINT "Task_parentTaskId_fkey" FOREIGN KEY ("parentTaskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TaskAssignment" ADD CONSTRAINT "TaskAssignment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TaskAssignment" ADD CONSTRAINT "TaskAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TaskWatcher" ADD CONSTRAINT "TaskWatcher_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TaskWatcher" ADD CONSTRAINT "TaskWatcher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TaskComment" ADD CONSTRAINT "TaskComment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TaskComment" ADD CONSTRAINT "TaskComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TaskChecklistItem" ADD CONSTRAINT "TaskChecklistItem_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TaskChecklistItem" ADD CONSTRAINT "TaskChecklistItem_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TaskDependency" ADD CONSTRAINT "TaskDependency_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TaskDependency" ADD CONSTRAINT "TaskDependency_dependsOnTaskId_fkey" FOREIGN KEY ("dependsOnTaskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "WorkTemplate" ADD CONSTRAINT "WorkTemplate_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CustomFieldDefinition" ADD CONSTRAINT "CustomFieldDefinition_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CustomFieldValue" ADD CONSTRAINT "CustomFieldValue_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "CustomFieldDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
