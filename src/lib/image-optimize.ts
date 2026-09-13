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

/** Bust immutable /images cache after the unique-photo bake. */
const IMAGE_REV = "v=2";

function withRev(src: string): string {
  if (!src.startsWith("/images/")) return src;
  if (src.includes("v=2")) return src;
  return src.includes("?") ? `${src}&${IMAGE_REV}` : `${src}?${IMAGE_REV}`;
}

export function toWebpSrc(src: string): string {
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) return src;
  const pathOnly = src.split("?")[0] || src;
  if (LOCAL_WEBP_MAP[pathOnly]) return withRev(LOCAL_WEBP_MAP[pathOnly]);
  // Generic: /images/foo.jpg → /images/foo.webp when we bake siblings at build
  if (/\.(jpe?g|png)$/i.test(pathOnly) && pathOnly.startsWith("/images/")) {
    return withRev(pathOnly.replace(/\.(jpe?g|png)$/i, ".webp"));
  }
  if (pathOnly.startsWith("/images/") && pathOnly.endsWith(".webp")) {
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
    pathOnly.startsWith("/images/projects/")
  ) {
    const webp = pathOnly.replace(/\.(jpe?g|png|webp)$/i, ".webp");
    return withRev(webp.replace(/\.webp$/i, "-sm.webp"));
  }
  return null;
}

export function isLocalPublicPath(src: string): boolean {
  return Boolean(src?.startsWith("/") && !src.startsWith("//"));
}
