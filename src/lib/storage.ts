import { writeFile, mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

function useObjectStorage(): boolean {
  return Boolean(
    process.env.S3_BUCKET &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY
  );
}

function getS3Client(): S3Client {
  return new S3Client({
    region: process.env.S3_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  });
}

export async function storeUpload(
  filename: string,
  bytes: Buffer,
  mimeType: string
): Promise<{ url: string; key: string }> {
  if (useObjectStorage()) {
    const bucket = process.env.S3_BUCKET!;
    const key = `uploads/${filename}`;
    const client = getS3Client();
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: bytes,
        ContentType: mimeType,
      })
    );
    const publicBase =
      process.env.S3_PUBLIC_URL?.replace(/\/$/, "") ||
      (process.env.S3_ENDPOINT
        ? `${process.env.S3_ENDPOINT.replace(/\/$/, "")}/${bucket}`
        : "");
    const url = publicBase ? `${publicBase}/${key}` : `/${key}`;
    return { url, key };
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), bytes);
  return { url: `/uploads/${filename}`, key: filename };
}

export async function deleteUpload(keyOrFilename: string): Promise<void> {
  if (!keyOrFilename || keyOrFilename.includes("..")) return;

  if (useObjectStorage()) {
    const bucket = process.env.S3_BUCKET!;
    const key = keyOrFilename.startsWith("uploads/")
      ? keyOrFilename
      : `uploads/${keyOrFilename}`;
    try {
      await getS3Client().send(
        new DeleteObjectCommand({ Bucket: bucket, Key: key })
      );
    } catch {
      /* may already be gone */
    }
    return;
  }

  try {
    const name = keyOrFilename.replace(/^uploads\//, "");
    await unlink(path.join(process.cwd(), "public", "uploads", name));
  } catch {
    /* may already be gone */
  }
}

export function storageMode(): "s3" | "local" {
  return useObjectStorage() ? "s3" : "local";
}
