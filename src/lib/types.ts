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

export type LeadRecord = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  niche?: string | null;
  objective?: string | null;
  message?: string | null;
  source: string;
  status: LeadStatus;
  tags: string[];
  notes?: string | null;
  ownerName?: string | null;
  createdAt: string;
};

export type ClientRecord = {
  id: string;
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
  priority: TaskPriority;
  dueDate?: string | null;
  ownerName?: string | null;
  clientId?: string | null;
  clientName?: string | null;
  leadId?: string | null;
  leadName?: string | null;
  createdAt: string;
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
  category: string;
  publishedAt?: string | null;
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
};
