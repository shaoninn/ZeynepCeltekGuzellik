"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { usePathname } from "next/navigation";
import { toEditorHref } from "@/lib/editor-href";

type SiteLinkProps = ComponentProps<typeof Link>;

/**
 * Site navigation must not prefetch — Hostinger MySQL cannot absorb
 * dozens of parallel RSC (_rsc) hits from Link hover/viewport prefetch.
 * Under /duzenle, public paths remap into the editor shell (no EditorProvider import).
 */
export function SiteLink({ prefetch = false, href, ...props }: SiteLinkProps) {
  const pathname = usePathname();
  const inEditor = pathname?.startsWith("/duzenle") ?? false;
  const resolved =
    inEditor && typeof href === "string" ? toEditorHref(href) : href;
  return <Link prefetch={prefetch} href={resolved} {...props} />;
}
