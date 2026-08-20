import fs from "fs/promises";
import path from "path";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf"
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function saveUploadedFile(file: File | null | undefined, folder = "uploads"): Promise<string | null> {
  if (!file || !(file instanceof File) || file.size === 0) {
    return null;
  }

  // 1. Validation
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type: ${file.type}. Allowed: JPEG, PNG, WEBP, GIF, SVG, PDF.`);
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File exceeds maximum size limit of 10 MB.`);
  }

  // 2. Secure Filename
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
  const filename = `upload_${Date.now()}_${cleanName}`;
  const targetDir = path.join(process.cwd(), "public", folder);

  await fs.mkdir(targetDir, { recursive: true });
  const filePath = path.join(targetDir, filename);

  // 3. Write Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await fs.writeFile(filePath, buffer);

  return `/${folder}/${filename}`;
}