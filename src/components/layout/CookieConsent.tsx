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
    <div className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <p className="min-w-0 flex-1 text-sm leading-relaxed text-muted">
          Ölçüm için çerez kullanırız. Reddederseniz yalnızca zorunlu çerezler
          kalır.{" "}
          <SiteLink href="/cerez-politikasi" className="text-orange hover:underline">
            Çerez politikası
          </SiteLink>
        </p>
        <div className="flex shrink-0 gap-2">
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
