"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function CatalogGuard({
  title,
  adminHref,
  children,
}: {
  title: string;
  adminHref: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none select-none opacity-40">{children}</div>
      <div className="absolute inset-0 z-10 flex items-center justify-center p-6 bg-black/70">
        <div className="max-w-md w-full border border-orange/50 bg-card p-6 text-center shadow-2xl">
          <p className="font-display text-lg font-bold text-white mb-2">{title}</p>
          <p className="text-sm text-muted leading-relaxed mb-5">
            Bu bölüm canlı editörden düzenlenmez. Yanlışlıkla ürün / proje silinmesini
            önlemek için ekleme, silme ve düzenleme yalnızca klasik admin panelindedir.
          </p>
          <Link
            href={adminHref}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange text-white text-sm font-semibold uppercase tracking-wider hover:bg-orange-dark"
          >
            Admin paneline git
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
