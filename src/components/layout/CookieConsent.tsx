"use client";

import { useEffect, useState } from "react";
import { SiteLink } from "@/components/ui/SiteLink";
import { setAnalyticsConsent } from "@/lib/analytics";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(!localStorage.getItem("zc-cookie-consent"));
    } catch {
      setVisible(false);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 z-[80] p-3 sm:p-4 pointer-events-none bottom-[max(7.5rem,calc(env(safe-area-inset-bottom)+6.5rem))] md:bottom-4">
      <div className="pointer-events-auto mx-auto max-w-3xl border border-border bg-card px-4 py-4 sm:px-5">
        <p className="text-sm text-muted leading-relaxed mb-3">
          Ölçüm ve reklam dönüşümleri için çerez kullanırız. Kabul etmezseniz
          yalnızca zorunlu çerezler kalır.{" "}
          <SiteLink href="/cerez-politikasi" className="text-orange hover:underline">
            Çerez politikası
          </SiteLink>
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            className="min-h-11 px-4 bg-orange text-ink font-semibold text-sm"
            onClick={() => {
              setAnalyticsConsent(true);
              setVisible(false);
            }}
          >
            Kabul et
          </button>
          <button
            type="button"
            className="min-h-11 px-4 border border-border text-muted text-sm hover:text-cream"
            onClick={() => {
              setAnalyticsConsent(false);
              setVisible(false);
            }}
          >
            Reddet
          </button>
        </div>
      </div>
    </div>
  );
}
