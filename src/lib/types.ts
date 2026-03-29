export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "MEETING_SCHEDULED"
  | "PROPOSAL_SENT"
  | "NEGOTIATION"
  | "WON"
  | "LOST";

export type ContractStatus = "PENDING" | "ACTIVE" | "PAUSED" | "ENDED";
export type ProposalStatus = "DRAFT" | "SENT" | "VIEWED" | "ACCEPTED" | "REJECTED" | "EXPIRED";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type CampaignPlatform = "META" | "GOOGLE" | "LINKEDIN" | "TIKTOK" | "OTHER";
export type CampaignStatus = "PLANNING" | "ACTIVE" | "OPTIMIZING" | "PAUSED" | "COMPLETED";
export type MessageChannel = "EMAIL" | "WHATSAPP" | "INTERNAL" | "SMS";
export type MessageStatus = "DRAFT" | "QUEUED" | "SENT" | "FAILED";
export type AIRequestMode =
  | "TEXT_ONLY"
  | "SAVE_DRAFT"
  | "AUTO_SEND"
  | "GENERATE_PROPOSAL"
  | "CREATE_TASK"
  | "INTERNAL_SUMMARY";
export type AIRequestStatus = "PENDING" | "GENERATED" | "APPROVED" | "SENT" | "FAILED";
export type FinancialEntryType = "CONTRACT" | "INVOICE" | "PAYMENT" | "ADJUSTMENT";
export type FinancialStatus = "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
export type ProjectStatus = "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "ARCHIVED";
export type ProjectHealth = "ON_TRACK" | "ATTENTION" | "AT_RISK";
export type TemplateScope = "PROJECT" | "LIST" | "TASK" | "CHECKLIST" | "DOCUMENT" | "AUTOMATION";
export type CustomFieldEntity = "CLIENT" | "PROJECT" | "TASK" | "CAMPAIGN" | "CONTENT" | "FORM";
export type CustomFieldType = "TEXT" | "TEXTAREA" | "NUMBER" | "CURRENCY" | "BOOLEAN" | "DATE" | "SELECT" | "MULTI_SELECT" | "RELATION";

export type SelectOption = {
  label: string;
  value: string;
};

export type UserSession = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "ACCOUNT_MANAGER" | "CLIENT";
};

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: UserSession["role"];
  avatarUrl?: string | null;
  createdAt: string;
};

export type AssigneeRecord = {
  id: string;
  name: string;
  email?: string | null;
  role?: UserSession["role"];
};

export type WorkspaceRecord = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: string;
};

export type LeadRecord = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  niche?: string | null;
  contactPreference?: string | null;
  serviceInterest?: string | null;
  urgency?: string | null;
  objective?: string | null;
  message?: string | null;
  source: string;
  landingPage?: string | null;
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  status: LeadStatus;
  tags: string[];
  notes?: string | null;
  estimatedTicket?: number | null;
  ownerId?: string | null;
  ownerName?: string | null;
  createdAt: string;
};

export type ClientRecord = {
  id: string;
  workspaceId?: string | null;
  name: string;
  companyName: string;
  email: string;
  phone?: string | null;
  niche?: string | null;
  goals?: string | null;
  monthlyTicket?: number | null;
  contractStatus: ContractStatus;
  activeChannels: string[];
  notes?: string | null;
  websiteUrl?: string | null;
  convertedFromLeadId?: string | null;
  createdAt: string;
};

export type ProjectRecord = {
  id: string;
  workspaceId: string;
  workspaceName?: string | null;
  clientId?: string | null;
  clientName?: string | null;
  ownerId?: string | null;
  ownerName?: string | null;
  name: string;
  slug: string;
  summary?: string | null;
  status: ProjectStatus;
  health: ProjectHealth;
  startDate?: string | null;
  endDate?: string | null;
  taskCount: number;
  completedTaskCount: number;
  createdAt: string;
};

export type ProjectListRecord = {
  id: string;
  projectId: string;
  projectName?: string | null;
  name: string;
  description?: string | null;
  color?: string | null;
  order: number;
  statusCatalog: string[];
  taskCount: number;
  createdAt: string;
};

export type TaskChecklistItemRecord = {
  id: string;
  taskId: string;
  title: string;
  done: boolean;
  order: number;
  assigneeId?: string | null;
  assigneeName?: string | null;
  dueDate?: string | null;
  createdAt: string;
};

export type TaskCommentRecord = {
  id: string;
  taskId: string;
  authorId?: string | null;
  authorName?: string | null;
  body: string;
  mentions: string[];
  createdAt: string;
};

export type TaskDependencyRecord = {
  id: string;
  taskId: string;
  dependsOnTaskId: string;
  dependsOnTaskTitle?: string | null;
  createdAt: string;
};

export type TaskAssignmentRecord = {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  isPrimary: boolean;
  createdAt: string;
};

export type TaskWatcherRecord = {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  createdAt: string;
};

export type ProposalRecord = {
  id: string;
  title: string;
  summary: string;
  scope: string;
  price: number;
  status: ProposalStatus;
  validUntil?: string | null;
  clientId?: string | null;
  clientName?: string | null;
  leadId?: string | null;
  leadName?: string | null;
  createdAt: string;
};

export type TaskRecord = {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  statusLabel?: string | null;
  priority: TaskPriority;
  startDate?: string | null;
  dueDate?: string | null;
  endDate?: string | null;
  estimatedMinutes?: number | null;
  trackedMinutes?: number | null;
  labels: string[];
  recurringRule?: string | null;
  blockedReason?: string | null;
  ownerId?: string | null;
  ownerName?: string | null;
  workspaceId?: string | null;
  workspaceName?: string | null;
  projectId?: string | null;
  projectName?: string | null;
  listId?: string | null;
  listName?: string | null;
  parentTaskId?: string | null;
  parentTaskTitle?: string | null;
  clientId?: string | null;
  clientName?: string | null;
  leadId?: string | null;
  leadName?: string | null;
  assignees: AssigneeRecord[];
  watchers: AssigneeRecord[];
  checklistProgress?: {
    completed: number;
    total: number;
  };
  commentCount: number;
  subtaskCount: number;
  blockedByCount: number;
  isMyTask?: boolean;
  createdAt: string;
};

export type TaskDetailRecord = TaskRecord & {
  comments: TaskCommentRecord[];
  checklistItems: TaskChecklistItemRecord[];
  subtasks: TaskRecord[];
  dependencies: TaskDependencyRecord[];
  customFields: CustomFieldValueRecord[];
};

export type CampaignRecord = {
  id: string;
  name: string;
  objective: string;
  platform: CampaignPlatform;
  budget?: number | null;
  status: CampaignStatus;
  metrics?: Record<string, number | string> | null;
  notes?: string | null;
  clientId: string;
  clientName: string;
  createdAt: string;
};

export type MessageRecord = {
  id: string;
  subject?: string | null;
  body: string;
  channel: MessageChannel;
  status: MessageStatus;
  recipientName?: string | null;
  recipientEmail?: string | null;
  recipientPhone?: string | null;
  clientId?: string | null;
  clientName?: string | null;
  leadId?: string | null;
  leadName?: string | null;
  aiRequestId?: string | null;
  scheduledFor?: string | null;
  sentAt?: string | null;
  providerName?: string | null;
  providerMessageId?: string | null;
  deliveryNote?: string | null;
  createdAt: string;
};

export type AIRequestRecord = {
  id: string;
  input: string;
  objective?: string | null;
  tone?: string | null;
  responseSize?: string | null;
  mode: AIRequestMode;
  status: AIRequestStatus;
  generatedText?: string | null;
  error?: string | null;
  clientId?: string | null;
  clientName?: string | null;
  leadId?: string | null;
  leadName?: string | null;
  createdAt: string;
};

export type ActivityRecord = {
  id: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  description: string;
  actorName?: string | null;
  leadId?: string | null;
  clientId?: string | null;
  proposalId?: string | null;
  taskId?: string | null;
  campaignId?: string | null;
  messageId?: string | null;
  aiRequestId?: string | null;
  createdAt: string;
};

export type FinancialRecord = {
  id: string;
  title: string;
  description?: string | null;
  type: FinancialEntryType;
  status: FinancialStatus;
  amount: number;
  dueDate?: string | null;
  paidAt?: string | null;
  reference?: string | null;
  clientId: string;
  clientName: string;
  createdAt: string;
};

export type AttachmentRecord = {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
  notes?: string | null;
  clientId?: string | null;
  clientName?: string | null;
  leadId?: string | null;
  leadName?: string | null;
  proposalId?: string | null;
  proposalTitle?: string | null;
  createdAt: string;
};

export type ServiceRecord = {
  id: string;
  name: string;
  slug: string;
  description: string;
  benefit: string;
  featured?: boolean;
};

export type TestimonialRecord = {
  id: string;
  authorName: string;
  role: string;
  company: string;
  quote: string;
  featured?: boolean;
};

export type CaseStudyRecord = {
  id: string;
  slug: string;
  title: string;
  niche: string;
  challenge: string;
  solution: string;
  result: string;
  metrics?: Record<string, string | number>;
  featured?: boolean;
};

export type FAQRecord = {
  id: string;
  question: string;
  answer: string;
  order: number;
};

export type BlogPostRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  publishedAt?: string | null;
};

export type MethodologyPillarRecord = {
  title: string;
  description: string;
};

export type MethodologyContentRecord = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroAside: string;
  processTitle: string;
  processDescription: string;
  impactEyebrow: string;
  impactTitle: string;
  impactBody: string[];
  ctaTitle: string;
  ctaDescription: string;
  pillars: MethodologyPillarRecord[];
};

export type ProofFeatureRecord = {
  title: string;
  description: string;
};

export type ProofMetricRecord = {
  value: string;
  label: string;
};

export type ProofBarRecord = {
  label: string;
  width: string;
};

export type ProofAssetsContentRecord = {
  eyebrow: string;
  title: string;
  description: string;
  logos: string[];
  features: ProofFeatureRecord[];
  mockupEyebrow: string;
  mockupTitle: string;
  mockupMetrics: ProofMetricRecord[];
  mockupBars: ProofBarRecord[];
  creativeEyebrow: string;
  creativeTitle: string;
  creativeDescription: string;
  landingEyebrow: string;
  landingHighlight: string;
};

export type SiteSettingsRecord = {
  agencyName: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryCta: string;
  secondaryCta: string;
  email: string;
  phone: string;
  whatsapp: string;
  calendarUrl: string;
  calendarEmbedUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
};

export type DashboardSummary = {
  totalLeads: number;
  activeClients: number;
  openProposals: number;
  pendingTasks: number;
  runningCampaigns: number;
  aiMessagesSent: number;
  conversionRate: number;
  estimatedRevenue: number;
};

export type SiteContentBundle = {
  settings: SiteSettingsRecord;
  services: ServiceRecord[];
  testimonials: TestimonialRecord[];
  caseStudies: CaseStudyRecord[];
  faqs: FAQRecord[];
  blogPosts: BlogPostRecord[];
  methodology: MethodologyContentRecord;
  proofAssets: ProofAssetsContentRecord;
};

export type NotificationSeverity = "info" | "warning" | "critical" | "success";

export type NotificationRecord = {
  id: string;
  title: string;
  description: string;
  severity: NotificationSeverity;
  category: "lead" | "proposal" | "task" | "message" | "system";
  href?: string;
  createdAt: string;
};

export type AutomationSettingsRecord = {
  highIntentThreshold: number;
  leadSlaImmediateHours: number;
  leadSlaThirtyDaysHours: number;
  leadSlaSixtyToNinetyDaysHours: number;
  leadSlaPlanningHours: number;
  leadSlaDefaultHours: number;
  leadReminderDelayHours: number;
  proposalFollowUpAfterDays: number;
  proposalFollowUpChannel: MessageChannel;
  internalAlertRecipients: string;
};

export type WorkTemplateRecord = {
  id: string;
  workspaceId: string;
  name: string;
  description?: string | null;
  scope: TemplateScope;
  payload: Record<string, unknown>;
  createdAt: string;
};

export type CustomFieldDefinitionRecord = {
  id: string;
  workspaceId: string;
  name: string;
  key: string;
  entityType: CustomFieldEntity;
  fieldType: CustomFieldType;
  options?: Record<string, unknown> | null;
  required: boolean;
  createdAt: string;
};

export type CustomFieldValueRecord = {
  id: string;
  definitionId: string;
  definitionName?: string | null;
  entityType: CustomFieldEntity;
  entityId: string;
  value: Record<string, unknown> | string | number | boolean | string[] | null;
  createdAt: string;
};

export type TimelineItem = {
  id: string;
  title: string;
  description: string;
  kind: "activity" | "message" | "proposal" | "task" | "attachment" | "ai" | "campaign";
  status?: string;
  href?: string;
  createdAt: string;
  meta?: string;
};

export type WorkHubRecord = {
  workspace: WorkspaceRecord;
  projects: ProjectRecord[];
  projectLists: ProjectListRecord[];
  tasks: TaskRecord[];
  templates: WorkTemplateRecord[];
  customFields: CustomFieldDefinitionRecord[];
  users: UserRecord[];
};
