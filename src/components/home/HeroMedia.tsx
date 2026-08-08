import {
  isLocalPublicPath,
  toWebpSrc,
  toWebpSrcMobile,
} from "@/lib/image-optimize";

type HeroMediaProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
};

/**
 * Server-safe LCP image — no client JS, no opacity animation, single download.
 * Uses srcSet so mobile does not also fetch the desktop asset.
 */
export function HeroMedia({
  src,
  alt,
  className = "object-cover object-center",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw",
}: HeroMediaProps) {
  const webp = toWebpSrc(src);
  const webpSm = toWebpSrcMobile(src);
  const local = isLocalPublicPath(src);

  if (local && webpSm) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={webpSm}
        srcSet={`${webpSm} 960w, ${webp} 1600w`}
        sizes={sizes}
        alt={alt}
        width={1600}
        height={1600}
        className={`absolute inset-0 h-full w-full ${className}`}
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={webp}
      alt={alt}
      width={1600}
      height={1600}
      className={`absolute inset-0 h-full w-full ${className}`}
      loading="eager"
      decoding="async"
      fetchPriority="high"
      sizes={sizes}
    />
  );
}

/** Build preload hrefs for the real hero asset (not hardcoded defaults). */
export function heroPreloadHrefs(src: string): {
  mobile: string;
  desktop: string;
} {
  const webp = toWebpSrc(src);
  const webpSm = toWebpSrcMobile(src) || webp;
  return { mobile: webpSm, desktop: webp };
}
