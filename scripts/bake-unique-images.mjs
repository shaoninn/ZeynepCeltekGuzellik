/**
 * Place unique generated photos and bake mobile-friendly WebP siblings.
 * Sources live in the Cursor assets folder used for this bake.
 * Run: node scripts/bake-unique-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const assets = path.resolve(
  "C:/Users/deniz/.cursor/projects/c-GitHub-ZeynepCeltekGuzellik/assets"
);
const publicDir = path.resolve("public");

const MAP = {
  "hero/hero-1.jpg": "hero-portrait.png",
  "gallery/gallery-1.jpg": "facial-hydrafacial.png",
  "gallery/gallery-2.jpg": "laser-room.png",
  "gallery/gallery-3.jpg": "lash-closeup.png",
  "gallery/gallery-4.jpg": "body-contour.png",
  "about/about-1.jpg": "treatment-room.png",
  "products/cilt-bakimi/1.jpg": "skin-glow.png",
  "products/alex-lazer/1.jpg": "alex-device.png",
  "products/lazer-bayan/1.jpg": "laser-leg.png",
  "products/lazer-erkek/1.jpg": "laser-men.png",
  "products/kirpik-kas/1.jpg": "brow-lamination.png",
  "products/kirpik-kas/2.jpg": "lash-tools.png",
  "products/bolgesel-incelme/1.jpg": "body-device.png",
  "products/alex-lazer/2.jpg": "alex-session.png",
  "products/alex-lazer/3.jpg": "laser-tip.png",
  "projects/cilt-1.jpg": "about-portrait.png",
  "projects/body-1.jpg": "body-session.png",
  "projects/salon-1.jpg": "salon-interior.png",
};

async function writeSet(destRel, srcName, widths) {
  const src = path.join(assets, srcName);
  if (!fs.existsSync(src)) throw new Error(`missing ${src}`);
  const jpgAbs = path.join(publicDir, "images", destRel);
  fs.mkdirSync(path.dirname(jpgAbs), { recursive: true });
  await sharp(src)
    .rotate()
    .resize({ width: widths.jpg, withoutEnlargement: false, fit: "cover" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(jpgAbs);
  const webpRel = destRel.replace(/\.jpe?g$/i, ".webp");
  const smRel = destRel.replace(/\.jpe?g$/i, "-sm.webp");
  await sharp(src)
    .rotate()
    .resize({ width: widths.webp, withoutEnlargement: false, fit: "cover" })
    .webp({ quality: 76, effort: 4 })
    .toFile(path.join(publicDir, "images", webpRel));
  await sharp(src)
    .rotate()
    .resize({ width: widths.sm, withoutEnlargement: false, fit: "cover" })
    .webp({ quality: 70, effort: 4 })
    .toFile(path.join(publicDir, "images", smRel));
}

const WIDTHS = {
  "hero/hero-1.jpg": { jpg: 1400, webp: 1400, sm: 720 },
  default: { jpg: 1200, webp: 1100, sm: 640 },
};

for (const [dest, src] of Object.entries(MAP)) {
  await writeSet(dest, src, WIDTHS[dest] || WIDTHS.default);
  console.log("✓", dest);
}
