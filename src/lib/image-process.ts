/**
 * Server-side image processing for Hostinger uploads.
 * - Converts raster uploads to WebP (smaller, faster)
 * - Optional Remove.bg when REMOVE_BG_API_KEY is set
 */

export type ProcessedImage = {
  bytes: Buffer;
  mime: string;
  ext: string;
};

async function loadSharp() {
  try {
    const sharp = (await import("sharp")).default;
    return sharp;
  } catch (error) {
    console.error("[image-process] sharp unavailable:", error);
    return null;
  }
}

/** Remove.bg API — only when key present; returns PNG buffer. */
export async function removeBackground(
  bytes: Buffer
): Promise<Buffer | null> {
  const key = process.env.REMOVE_BG_API_KEY?.trim();
  if (!key) return null;

  const form = new FormData();
  form.append(
    "image_file",
    new Blob([Uint8Array.from(bytes)]),
    "upload.png"
  );
  form.append("size", "auto");

  const res = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { "X-Api-Key": key },
    body: form,
  });

  if (!res.ok) {
    console.error("[remove.bg]", res.status, await res.text());
    return null;
  }

  return Buffer.from(await res.arrayBuffer());
}

export async function processUploadImage(
  input: Buffer,
  opts: { removeBg?: boolean; maxEdge?: number } = {}
): Promise<ProcessedImage> {
  let bytes = input;

  if (opts.removeBg) {
    const cut = await removeBackground(bytes);
    if (cut) bytes = cut;
  }

  const sharp = await loadSharp();
  if (!sharp) {
    return { bytes, mime: "image/png", ext: "png" };
  }

  const maxEdge = opts.maxEdge ?? 2000;
  const pipeline = sharp(bytes, { failOn: "none" })
    .rotate()
    .resize({
      width: maxEdge,
      height: maxEdge,
      fit: "inside",
      withoutEnlargement: true,
    });

  const webp = await pipeline.webp({ quality: 82, effort: 4 }).toBuffer();
  return { bytes: webp, mime: "image/webp", ext: "webp" };
}
