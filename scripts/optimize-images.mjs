#!/usr/bin/env node
/**
 * Pre-generate WebP (and mobile-sized) assets for LCP / image delivery.
 * Hostinger skips Next.js sharp optimizer at runtime — bake formats at build.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");

const TARGETS = [
  {
    src: "images/hero/hero-1.jpg",
    outputs: [
      { file: "images/hero/hero-1.webp", width: 1600, quality: 78 },
      { file: "images/hero/hero-1-sm.webp", width: 960, quality: 72 },
    ],
  },
  {
    src: "images/hero/hero-2.jpg",
    outputs: [
      { file: "images/hero/hero-2.webp", width: 1400, quality: 78 },
    ],
  },
];

/** Convert all jpg under these dirs to matching .webp */
const BATCH_DIRS = [
  "images/about",
  "images/gallery",
  "images/projects",
  "images/products/cilt-bakimi",
  "images/products/kirpik-kas",
  "images/products/bolgesel-incelme",
  "images/products/lazer-bayan",
  "images/products/lazer-erkek",
  "images/products/alex-lazer",
];

async function writeWebp(inputPath, outputPath, width, quality) {
  if (!fs.existsSync(inputPath)) return false;
  const outAbs = path.join(publicDir, outputPath);
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });
  await sharp(inputPath)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 4 })
    .toFile(outAbs);
  const before = fs.statSync(inputPath).size;
  const after = fs.statSync(outAbs).size;
  console.log(
    `✓ ${outputPath} (${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB)`
  );
  return true;
}

async function main() {
  for (const target of TARGETS) {
    const input = path.join(publicDir, target.src);
    if (!fs.existsSync(input)) continue;
    for (const out of target.outputs) {
      await writeWebp(input, out.file, out.width, out.quality);
    }
  }

  for (const dir of BATCH_DIRS) {
    const abs = path.join(publicDir, dir);
    if (!fs.existsSync(abs)) continue;
    for (const name of fs.readdirSync(abs)) {
      if (!/\.(jpe?g|png)$/i.test(name)) continue;
      const rel = path.join(dir, name).replace(/\\/g, "/");
      const webpRel = rel.replace(/\.(png|jpe?g)$/i, ".webp");
      const webpSmRel = rel.replace(/\.(png|jpe?g)$/i, "-sm.webp");
      await writeWebp(path.join(publicDir, rel), webpRel, 1200, 75);
      // Gallery / cards: mobile-friendly width for image delivery audit
      if (dir.includes("gallery") || dir.includes("products")) {
        await writeWebp(path.join(publicDir, rel), webpSmRel, 640, 70);
      }
    }
  }
}

main().catch((err) => {
  console.error("[optimize-images]", err);
  process.exit(1);
});
