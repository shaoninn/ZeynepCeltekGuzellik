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

export function toWebpSrc(src: string): string {
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) return src;
  const pathOnly = src.split("?")[0] || src;
  if (LOCAL_WEBP_MAP[pathOnly]) return LOCAL_WEBP_MAP[pathOnly];
  // Generic: /images/foo.jpg → /images/foo.webp when we bake siblings at build
  if (/\.(jpe?g|png)$/i.test(pathOnly) && pathOnly.startsWith("/images/")) {
    return pathOnly.replace(/\.(jpe?g|png)$/i, ".webp");
  }
  return src;
}

export function toWebpSrcMobile(src: string): string | null {
  if (!src) return null;
  const pathOnly = src.split("?")[0] || src;
  if (pathOnly.includes("/logo/")) return null;
  return LOCAL_WEBP_SM[pathOnly] || null;
}

export function isLocalPublicPath(src: string): boolean {
  return Boolean(src?.startsWith("/") && !src.startsWith("//"));
}
