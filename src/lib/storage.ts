import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { env } from "@/lib/env";

type UploadResult = {
  fileName: string;
  fileUrl: string;
  mimeType?: string;
  sizeBytes: number;
};

type StorageProvider = {
  upload(file: File): Promise<UploadResult>;
};

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

class LocalStorageProvider implements StorageProvider {
  async upload(file: File): Promise<UploadResult> {
    const uploadRoot = path.join(process.cwd(), env.uploadDir);
    await mkdir(uploadRoot, { recursive: true });

    const safeName = sanitizeFileName(file.name);
    const storedFileName = `${randomUUID()}-${safeName}`;
    const absolutePath = path.join(uploadRoot, storedFileName);
    const buffer = Buffer.from(await file.arrayBuffer());

    await writeFile(absolutePath, buffer);

    const relativePath = `/${env.uploadDir.replace(/\\/g, "/").replace(/^public\//, "")}/${storedFileName}`;

    return {
      fileName: file.name,
      fileUrl: relativePath,
      mimeType: file.type || undefined,
      sizeBytes: file.size,
    };
  }
}

class CloudinaryUnsignedProvider implements StorageProvider {
  async upload(file: File): Promise<UploadResult> {
    if (!env.cloudinaryCloudName || !env.cloudinaryUploadPreset) {
      throw new Error("Cloudinary nao configurado. Defina CLOUDINARY_CLOUD_NAME e CLOUDINARY_UPLOAD_PRESET.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", env.cloudinaryUploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${env.cloudinaryCloudName}/auto/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Falha no upload Cloudinary: ${response.status} ${body}`);
    }

    const data = (await response.json()) as {
      secure_url: string;
      original_filename?: string;
      bytes?: number;
      format?: string;
    };

    return {
      fileName: file.name,
      fileUrl: data.secure_url,
      mimeType: data.format ? `${file.type.split("/")[0] || "application"}/${data.format}` : file.type || undefined,
      sizeBytes: data.bytes ?? file.size,
    };
  }
}

export function getStorageProvider(): StorageProvider {
  switch (env.storageProvider) {
    case "cloudinary":
      return new CloudinaryUnsignedProvider();
    case "local":
    default:
      return new LocalStorageProvider();
  }
}
