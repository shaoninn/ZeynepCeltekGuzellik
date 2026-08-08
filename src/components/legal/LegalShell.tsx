import type { ReactNode } from "react";
import { LEGAL_UPDATED } from "@/lib/legal";

export function LegalShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose-dark">
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          {title}
        </h1>
        <p className="text-xs text-muted mb-8">Son güncelleme: {LEGAL_UPDATED}</p>
        {children}
      </div>
    </section>
  );
}
