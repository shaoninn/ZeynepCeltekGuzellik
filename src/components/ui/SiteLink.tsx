"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useEditor } from "@/components/editor/EditorProvider";
import { toEditorHref } from "@/lib/editor-href";

type SiteLinkProps = ComponentProps<typeof Link>;

/**
 * Site navigation must not prefetch — Hostinger MySQL cannot absorb
 * dozens of parallel RSC (_rsc) hits from Link hover/viewport prefetch.
 * In visual editor mode, public paths remap under /duzenle.
 */
export function SiteLink({ prefetch = false, href, ...props }: SiteLinkProps) {
  const { enabled } = useEditor();
  const resolved =
    enabled && typeof href === "string" ? toEditorHref(href) : href;
  return <Link prefetch={prefetch} href={resolved} {...props} />;
}
