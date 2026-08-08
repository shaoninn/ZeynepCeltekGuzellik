import Image from "next/image";
import { SiteLink } from "@/components/ui/SiteLink";
import { SITE_NAME } from "@/lib/constants";

interface LogoProps {
  href?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
}

const heights = { sm: 36, md: 44, lg: 56 } as const;
const widths = { sm: 110, md: 150, lg: 190 } as const;

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
      <Image
        src="/images/logo/logo.webp"
        alt={SITE_NAME}
        width={w}
        height={h}
        priority={priority}
        unoptimized
        className="h-auto w-auto max-w-[min(58vw,11.5rem)] sm:max-w-none object-contain object-left"
        style={{ maxHeight: h, width: "auto" }}
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
