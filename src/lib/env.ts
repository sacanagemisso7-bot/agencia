const fallbackSecret = "dev-secret-change-me";

export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  authSecret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? fallbackSecret,
  adminEmail: process.env.ADMIN_EMAIL ?? "admin@agencia-premium.com",
  adminPassword: process.env.ADMIN_PASSWORD ?? "Admin123!",
  aiProvider: process.env.AI_PROVIDER ?? "mock",
  aiApiKey: process.env.AI_API_KEY ?? "",
  aiModel: process.env.AI_MODEL ?? "mock-commercial-writer",
  aiBaseUrl: process.env.AI_BASE_URL ?? "https://api.openai.com/v1",
  smtpHost: process.env.SMTP_HOST ?? "",
  smtpPort: Number(process.env.SMTP_PORT ?? 587),
  smtpUser: process.env.SMTP_USER ?? "",
  smtpPass: process.env.SMTP_PASS ?? "",
  smtpFrom: process.env.SMTP_FROM ?? "contato@agencia-premium.com",
  whatsappApiUrl: process.env.WHATSAPP_API_URL ?? "",
  whatsappApiToken: process.env.WHATSAPP_API_TOKEN ?? "",
  queueSecret: process.env.QUEUE_SECRET ?? "change-me",
  uploadDir: process.env.UPLOAD_DIR ?? "public/uploads",
  appEnv: process.env.APP_ENV ?? "development",
  storageProvider: process.env.STORAGE_PROVIDER ?? "local",
  storagePublicBaseUrl: process.env.STORAGE_PUBLIC_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET ?? "",
  observabilityWebhookUrl: process.env.OBSERVABILITY_WEBHOOK_URL ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
};

export const isDemoMode = !env.databaseUrl;
