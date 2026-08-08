"use client";

import Link from "next/link";
import { useEditor } from "@/components/editor/EditorProvider";

/** Soft tip: entity CRUD stays in classic admin. */
export function CatalogAdminHint({
  title,
  adminHref,
  adminLabel,
  detail = "kart ekleme / silme / içerik düzenleme burada yok.",
}: {
  title: string;
  adminHref: string;
  adminLabel: string;
  detail?: string;
}) {
  const { enabled } = useEditor();
  if (!enabled) return null;

  return (
    <div className="mb-6 border border-orange/40 bg-orange/10 px-4 py-3 text-sm text-muted leading-relaxed">
      <strong className="text-white">{title}</strong>
      {" — "}
      {detail}{" "}
      <Link href={adminHref} className="text-orange font-semibold hover:underline">
        {adminLabel}
      </Link>
    </div>
  );
}
