import { SiteLink } from "@/components/ui/SiteLink";
import { SITE_NAME } from "@/lib/constants";

interface LogoProps {
  href?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
  /** Avoid on marketing LCP pages — hero should win fetch priority. */
  priority?: boolean;
}

const heights = { sm: 40, md: 52, lg: 64 } as const;
const widths = { sm: 120, md: 160, lg: 200 } as const;

/** Compact transparent WebP header mark (~9KB). */
export function Logo({
  href = "/",
  className = "",
  size = "md",
  priority = false,
}: LogoProps) {
  const h = heights[size];
  const w = widths[size];

  const content = (
    <span className={`inline-flex items-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo/logo-header.webp"
        alt={SITE_NAME}
        width={w}
        height={h}
        className="h-auto w-auto max-w-[min(58vw,11.5rem)] sm:max-w-none object-contain object-left"
        style={{ maxHeight: h, width: "auto" }}
        decoding="async"
        {...(priority
          ? { fetchPriority: "high" as const }
          : { loading: "lazy" as const, fetchPriority: "low" as const })}
      />
    </span>
  );

  if (href === null) return content;

  return (
    <SiteLink
      href={href}
      className="inline-flex items-center shrink-0"
      aria-label={`${SITE_NAME} Ana Sayfa`}
      style={{ minHeight: h }}
    >
      {content}
    </SiteLink>
  );
}
