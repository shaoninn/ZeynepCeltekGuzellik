/** Prefer pre-baked WebP when a sibling .webp exists for known local paths. */
const LOCAL_WEBP_MAP: Record<string, string> = {
  "/images/hero/hero-1.jpg": "/images/hero/hero-1.webp",
  "/images/hero/hero-1.webp": "/images/hero/hero-1.webp",
  "/images/hero/hero-2.jpg": "/images/hero/hero-2.webp",
  "/images/logo/logo-nobg.png": "/images/logo/logo-header.webp",
  "/images/logo/logo.png": "/images/logo/logo-header.webp",
  "/images/logo/logo.webp": "/images/logo/logo-header.webp",
  "/images/logo/logo-transparent.png": "/images/logo/logo-header.webp",
};

const LOCAL_WEBP_SM: Record<string, string> = {
  "/images/hero/hero-1.jpg": "/images/hero/hero-1-sm.webp",
  "/images/hero/hero-1.webp": "/images/hero/hero-1-sm.webp",
};

/**
 * Directories that always ship sibling .webp for jpg/png sources.
 * Other folders (e.g. raw uploads) keep the original extension.
 */
const WEBP_BAKED_PREFIXES = [
  "/images/products/",
  "/images/gallery/",
  "/images/about/",
  "/images/projects/",
  "/images/facility/",
  "/images/hero/",
  "/images/campaigns/",
] as const;

/** Bust immutable /images cache after the unique-photo bake. */
const IMAGE_REV = "v=8";

/**
 * Portrait campaign shots sit in landscape/square cards — keep the subject
 * (face, eye, hand) in frame instead of a naive center crop.
 */
const CAMPAIGN_OBJECT_POSITION: Record<string, string> = {
  "/images/campaigns/baslangic-paket.jpg": "object-[center_18%]",
  "/images/campaigns/guzellik-paket.jpg": "object-[center_22%]",
  "/images/campaigns/lazer-paket.jpg": "object-[center_45%]",
  "/images/campaigns/vip-paket.jpg": "object-center",
  "/images/campaigns/protez-tirnak.jpg": "object-[center_40%]",
  "/images/campaigns/ipek-kirpik.jpg": "object-[center_35%]",
  "/images/campaigns/popo-lift.jpg": "object-center",
  "/images/campaigns/gogus-toparlama.jpg": "object-center",
  "/images/campaigns/dudak-renklendirme.jpg": "object-[center_55%]",
  "/images/campaigns/kas-microblading-pudralama.jpg": "object-[center_30%]",
  "/images/campaigns/kalici-dipliner.jpg": "object-center",
  "/images/campaigns/kalici-eyeliner.jpg": "object-[center_40%]",
  "/images/campaigns/kirpik-lifting.jpg": "object-[center_35%]",
};

export function campaignObjectPosition(src: string | null | undefined): string {
  if (!src) return "object-center";
  const pathOnly = src.split("?")[0] || src;
  const jpgKey = pathOnly.replace(/\.(webp|png)$/i, ".jpg").replace(/-sm(?=\.jpg$)/i, "");
  return CAMPAIGN_OBJECT_POSITION[jpgKey] || "object-center";
}

function withRev(src: string): string {
  if (!src.startsWith("/images/")) return src;
  if (src.includes("v=")) return src;
  return src.includes("?") ? `${src}&${IMAGE_REV}` : `${src}?${IMAGE_REV}`;
}

function hasBakedWebpSibling(pathOnly: string): boolean {
  return WEBP_BAKED_PREFIXES.some((p) => pathOnly.startsWith(p));
}

export function toWebpSrc(src: string): string {
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) return src;
  const pathOnly = src.split("?")[0] || src;
  if (LOCAL_WEBP_MAP[pathOnly]) return withRev(LOCAL_WEBP_MAP[pathOnly]);
  if (
    /\.(jpe?g|png)$/i.test(pathOnly) &&
    pathOnly.startsWith("/images/") &&
    hasBakedWebpSibling(pathOnly)
  ) {
    return withRev(pathOnly.replace(/\.(jpe?g|png)$/i, ".webp"));
  }
  if (pathOnly.startsWith("/images/")) {
    return withRev(pathOnly);
  }
  return src;
}

export function toWebpSrcMobile(src: string): string | null {
  if (!src) return null;
  const pathOnly = src.split("?")[0] || src;
  if (pathOnly.includes("/logo/")) return null;
  if (LOCAL_WEBP_SM[pathOnly]) return withRev(LOCAL_WEBP_SM[pathOnly]);
  if (
    pathOnly.startsWith("/images/gallery/") ||
    pathOnly.startsWith("/images/products/") ||
    pathOnly.startsWith("/images/about/") ||
    pathOnly.startsWith("/images/projects/") ||
    pathOnly.startsWith("/images/campaigns/")
  ) {
    const webp = pathOnly.replace(/\.(jpe?g|png|webp)$/i, ".webp");
    return withRev(webp.replace(/\.webp$/i, "-sm.webp"));
  }
  return null;
}

export function isLocalPublicPath(src: string): boolean {
  return Boolean(src?.startsWith("/") && !src.startsWith("//"));
}
