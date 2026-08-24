import fs from "fs/promises";
import path from "path";

const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || "local";

// Use variables for paths to bypass strict TS check on uninstalled packages
const s3ModulePath = "@aws-sdk/client-s3";
const presignerModulePath = "@aws-sdk/s3-request-presigner";

export async function uploadFile(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<string> {
  const uniqueName = `${Date.now()}-${filename.replace(/\s+/g, "-")}`;

  if (STORAGE_PROVIDER === "s3" || STORAGE_PROVIDER === "r2") {
    try {
      const { S3Client, PutObjectCommand } = await import(s3ModulePath);
      const s3Client = new S3Client({
        region: process.env.AWS_REGION || "us-east-1",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
        },
        endpoint: process.env.AWS_ENDPOINT || undefined,
      });

      const bucketName = process.env.AWS_BUCKET_NAME || "";
      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: uniqueName,
          Body: buffer,
          ContentType: mimeType,
        })
      );
      return uniqueName;
    } catch (err: any) {
      throw new Error(`Failed uploading to cloud storage: ${err?.message}`);
    }
  }

  // Local fallback filesystem write
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, uniqueName);
    await fs.writeFile(filePath, buffer);
    return `/uploads/${uniqueName}`;
  } catch (err: any) {
    throw new Error(`Failed writing file locally: ${err?.message}`);
  }
}

export async function getFileUrl(key: string): Promise<string> {
  if (!key) return "";
  
  if (key.startsWith("/") || key.startsWith("http")) {
    return key;
  }

  if (STORAGE_PROVIDER === "s3" || STORAGE_PROVIDER === "r2") {
    try {
      const { S3Client, GetObjectCommand } = await import(s3ModulePath);
      const { getSignedUrl } = await import(presignerModulePath);

      const s3Client = new S3Client({
        region: process.env.AWS_REGION || "us-east-1",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
        },
        endpoint: process.env.AWS_ENDPOINT || undefined,
      });

      const bucketName = process.env.AWS_BUCKET_NAME || "";
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      return getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } catch (err) {
      // Fallback
      return `/uploads/${key}`;
    }
  }

  return `/uploads/${key}`;
}
