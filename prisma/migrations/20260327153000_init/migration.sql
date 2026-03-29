-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'ACCOUNT_MANAGER', 'CLIENT');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'MEETING_SCHEDULED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('PENDING', 'ACTIVE', 'PAUSED', 'ENDED');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "CampaignPlatform" AS ENUM ('META', 'GOOGLE', 'LINKEDIN', 'TIKTOK', 'OTHER');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('PLANNING', 'ACTIVE', 'OPTIMIZING', 'PAUSED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('DRAFT', 'QUEUED', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "MessageChannel" AS ENUM ('EMAIL', 'WHATSAPP', 'INTERNAL', 'SMS');

-- CreateEnum
CREATE TYPE "AIRequestMode" AS ENUM ('TEXT_ONLY', 'SAVE_DRAFT', 'AUTO_SEND', 'GENERATE_PROPOSAL', 'CREATE_TASK', 'INTERNAL_SUMMARY');

-- CreateEnum
CREATE TYPE "AIRequestStatus" AS ENUM ('PENDING', 'GENERATED', 'APPROVED', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "FinancialEntryType" AS ENUM ('CONTRACT', 'INVOICE', 'PAYMENT', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "FinancialStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "niche" TEXT,
    "contactPreference" TEXT,
    "serviceInterest" TEXT,
    "urgency" TEXT,
    "objective" TEXT,
    "message" TEXT,
    "source" TEXT NOT NULL DEFAULT 'site',
    "landingPage" TEXT,
    "referrer" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmTerm" TEXT,
    "utmContent" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "tags" TEXT[],
    "notes" TEXT,
    "estimatedTicket" DECIMAL(10,2),
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "niche" TEXT,
    "goals" TEXT,
    "monthlyTicket" DECIMAL(10,2),
    "contractStatus" "ContractStatus" NOT NULL DEFAULT 'PENDING',
    "activeChannels" TEXT[],
    "notes" TEXT,
    "websiteUrl" TEXT,
    "convertedFromLeadId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'DRAFT',
    "validUntil" TIMESTAMP(3),
    "clientId" TEXT,
    "leadId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "dueDate" TIMESTAMP(3),
    "checklist" JSONB,
    "ownerId" TEXT,
    "clientId" TEXT,
    "leadId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "platform" "CampaignPlatform" NOT NULL,
    "budget" DECIMAL(10,2),
    "status" "CampaignStatus" NOT NULL DEFAULT 'PLANNING',
    "metrics" JSONB,
    "notes" TEXT,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "channel" "MessageChannel" NOT NULL DEFAULT 'EMAIL',
    "status" "MessageStatus" NOT NULL DEFAULT 'DRAFT',
    "recipientName" TEXT,
    "recipientEmail" TEXT,
    "recipientPhone" TEXT,
    "scheduledFor" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "providerName" TEXT,
    "providerMessageId" TEXT,
    "deliveryNote" TEXT,
    "clientId" TEXT,
    "leadId" TEXT,
    "aiRequestId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIRequest" (
    "id" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "objective" TEXT,
    "tone" TEXT,
    "responseSize" TEXT,
    "mode" "AIRequestMode" NOT NULL,
    "status" "AIRequestStatus" NOT NULL DEFAULT 'PENDING',
    "generatedText" TEXT,
    "error" TEXT,
    "clientId" TEXT,
    "leadId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "actorId" TEXT,
    "leadId" TEXT,
    "clientId" TEXT,
    "proposalId" TEXT,
    "taskId" TEXT,
    "campaignId" TEXT,
    "messageId" TEXT,
    "aiRequestId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialEntry" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "FinancialEntryType" NOT NULL,
    "status" "FinancialStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(10,2) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "reference" TEXT,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "notes" TEXT,
    "clientId" TEXT,
    "leadId" TEXT,
    "proposalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseStudy" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "challenge" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "metrics" JSONB,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "benefit" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQ" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Lead_status_createdAt_idx" ON "Lead"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Client_convertedFromLeadId_key" ON "Client"("convertedFromLeadId");

-- CreateIndex
CREATE INDEX "Client_contractStatus_createdAt_idx" ON "Client"("contractStatus", "createdAt");

-- CreateIndex
CREATE INDEX "Proposal_status_createdAt_idx" ON "Proposal"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Task_status_priority_dueDate_idx" ON "Task"("status", "priority", "dueDate");

-- CreateIndex
CREATE INDEX "Campaign_status_platform_createdAt_idx" ON "Campaign"("status", "platform", "createdAt");

-- CreateIndex
CREATE INDEX "Message_status_channel_createdAt_idx" ON "Message"("status", "channel", "createdAt");

-- CreateIndex
CREATE INDEX "Message_providerMessageId_idx" ON "Message"("providerMessageId");

-- CreateIndex
CREATE INDEX "AIRequest_mode_status_createdAt_idx" ON "AIRequest"("mode", "status", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_entityType_createdAt_idx" ON "ActivityLog"("entityType", "createdAt");

-- CreateIndex
CREATE INDEX "FinancialEntry_clientId_status_dueDate_idx" ON "FinancialEntry"("clientId", "status", "dueDate");

-- CreateIndex
CREATE INDEX "Attachment_clientId_proposalId_leadId_createdAt_idx" ON "Attachment"("clientId", "proposalId", "leadId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSetting_key_key" ON "SiteSetting"("key");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_convertedFromLeadId_fkey" FOREIGN KEY ("convertedFromLeadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_aiRequestId_fkey" FOREIGN KEY ("aiRequestId") REFERENCES "AIRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIRequest" ADD CONSTRAINT "AIRequest_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIRequest" ADD CONSTRAINT "AIRequest_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIRequest" ADD CONSTRAINT "AIRequest_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_aiRequestId_fkey" FOREIGN KEY ("aiRequestId") REFERENCES "AIRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialEntry" ADD CONSTRAINT "FinancialEntry_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

