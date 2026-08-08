#!/usr/bin/env node
/**
 * Square favicon from logo mark only (no text).
 * Crops upper emblem, punches near-black → transparent, pads to square.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const logoPath = path.join(root, "public", "images", "logo", "logo.png");

async function extractMarkPng() {
  const meta = await sharp(logoPath).metadata();
  const w = meta.width || 1024;
  const h = meta.height || 1024;
  const cropH = Math.round(h * 0.42);
  const cropTop = Math.round(h * 0.02);
  const cropLeft = Math.round(w * 0.18);
  const cropW = Math.round(w * 0.64);

  const { data, info } = await sharp(logoPath)
    .extract({
      left: Math.max(0, cropLeft),
      top: Math.max(0, cropTop),
      width: Math.min(cropW, w - cropLeft),
      height: Math.min(cropH, h - cropTop),
    })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    if (data[i] < 45 && data[i + 1] < 40 && data[i + 2] < 35) {
      data[i + 3] = 0;
    }
  }

  const trimmed = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 10 })
    .png()
    .toBuffer();

  const tMeta = await sharp(trimmed).metadata();
  const tw = tMeta.width || 1;
  const th = tMeta.height || 1;
  const side = Math.max(tw, th);
  const pad = Math.round(side * 0.14);
  const canvas = side + pad * 2;

  return sharp({
    create: {
      width: canvas,
      height: canvas,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: trimmed,
        left: Math.floor((canvas - tw) / 2),
        top: Math.floor((canvas - th) / 2),
      },
    ])
    .png()
    .toBuffer();
}

async function resize(buf, size) {
  return sharp(buf)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

async function main() {
  if (!fs.existsSync(logoPath)) throw new Error(`Missing ${logoPath}`);

  const mark = await extractMarkPng();
  const png32 = await resize(mark, 32);
  const png48 = await resize(mark, 48);
  const png180 = await resize(mark, 180);
  const png192 = await resize(mark, 192);
  const png512 = await resize(mark, 512);

  const files = [
    ["public/favicon-32.png", png32],
    ["public/icon.png", png192],
    ["src/app/icon.png", png192],
    ["src/app/apple-icon.png", png180],
    ["public/apple-icon.png", png180],
    ["public/images/logo/mark.png", png512],
  ];

  for (const [rel, buf] of files) {
    const abs = path.join(root, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, buf);
    console.log("✓", rel);
  }

  const ico = await pngToIco([png32, png48]);
  fs.writeFileSync(path.join(root, "public/favicon.ico"), ico);
  fs.writeFileSync(path.join(root, "src/app/favicon.ico"), ico);
  console.log("✓ favicon.ico");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
