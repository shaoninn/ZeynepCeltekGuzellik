import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, isUnauthorized } from "@/lib/api";
import { deleteUpload, storeUpload } from "@/lib/storage";
import { writeAuditLog } from "@/lib/audit";
import { clientIp } from "@/lib/rate-limit";
import { processUploadImage } from "@/lib/image-process";

const MAX_SIZE = 8 * 1024 * 1024;

const MAGIC: { mime: string; ext: string; test: (b: Buffer) => boolean }[] = [
  {
    mime: "image/jpeg",
    ext: "jpg",
    test: (b) => b.length > 2 && b[0] === 0xff && b[1] === 0xd8,
  },
  {
    mime: "image/png",
    ext: "png",
    test: (b) =>
      b.length > 8 &&
      b[0] === 0x89 &&
      b[1] === 0x50 &&
      b[2] === 0x4e &&
      b[3] === 0x47,
  },
  {
    mime: "image/gif",
    ext: "gif",
    test: (b) =>
      b.length > 6 &&
      b[0] === 0x47 &&
      b[1] === 0x49 &&
      b[2] === 0x46,
  },
  {
    mime: "image/webp",
    ext: "webp",
    test: (b) =>
      b.length > 12 &&
      b[0] === 0x52 &&
      b[1] === 0x49 &&
      b[2] === 0x46 &&
      b[3] === 0x46 &&
      b[8] === 0x57 &&
      b[9] === 0x45 &&
      b[10] === 0x42 &&
      b[11] === 0x50,
  },
];

export async function GET() {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(assets);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Dosya seçilmedi. Lütfen bir görsel yükleyin." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Dosya boyutu 8 MB'dan büyük olamaz." },
        { status: 400 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const match = MAGIC.find((m) => m.test(bytes));
    if (!match) {
      return NextResponse.json(
        { error: "Geçersiz görsel. Sadece JPG, PNG, WEBP veya GIF." },
        { status: 400 }
      );
    }

    const removeBg =
      String(form.get("removeBg") || "") === "1" ||
      String(form.get("removeBg") || "").toLowerCase() === "true";
    const skipConvert =
      String(form.get("skipConvert") || "") === "1" || match.mime === "image/gif";

    let outBytes: Buffer = Buffer.from(bytes);
    let outMime = match.mime;
    let outExt = match.ext;
    let converted = false;

    if (!skipConvert) {
      try {
        const processed = await processUploadImage(bytes, { removeBg });
        outBytes = Buffer.from(processed.bytes);
        outMime = processed.mime;
        outExt = processed.ext;
        converted = true;
      } catch (error) {
        console.error("[upload] process failed, storing original:", error);
        if (removeBg) {
          const { removeBackground } = await import("@/lib/image-process");
          const cut = await removeBackground(bytes);
          if (cut) {
            outBytes = Buffer.from(cut);
            outMime = "image/png";
            outExt = "png";
          }
        }
      }
    } else if (removeBg) {
      const { removeBackground } = await import("@/lib/image-process");
      const cut = await removeBackground(bytes);
      if (cut) {
        outBytes = Buffer.from(cut);
        outMime = "image/png";
        outExt = "png";
      }
    }

    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${outExt}`;
    const stored = await storeUpload(safeName, outBytes, outMime);
    const alt = String(form.get("alt") || file.name);

    const asset = await prisma.mediaAsset.create({
      data: {
        filename: stored.key,
        url: stored.url,
        alt,
        mimeType: outMime,
        size: outBytes.length,
      },
    });

    await writeAuditLog({
      action: "media.upload",
      entity: "MediaAsset",
      entityId: asset.id,
      actor: auth,
      ip: clientIp(request),
      meta: { converted, removeBg, mime: outMime },
    });

    return NextResponse.json({
      ...asset,
      converted,
      removeBgApplied: removeBg,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Yükleme başarısız" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Medya ID gerekli" }, { status: 400 });
    }
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) {
      return NextResponse.json({ error: "Medya bulunamadı" }, { status: 404 });
    }

    await prisma.mediaAsset.delete({ where: { id } });
    await deleteUpload(asset.filename);
    await writeAuditLog({
      action: "media.delete",
      entity: "MediaAsset",
      entityId: id,
      actor: auth,
      ip: clientIp(request),
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Medya silinemedi" }, { status: 500 });
  }
}
