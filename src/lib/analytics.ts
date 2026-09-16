"use client";

export type AnalyticsEvent =
  | "whatsapp_click"
  | "phone_click"
  | "add_to_list"
  | "generate_lead"
  | "quote_request";

const UTM_KEY = "zc-utm";
const CONSENT_KEY = "zc-cookie-consent";

type GtagFn = (...args: unknown[]) => void;
type FbqFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    fbq?: FbqFn;
    dataLayer?: unknown[];
  }
}

export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

export function setAnalyticsConsent(accepted: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONSENT_KEY, accepted ? "accepted" : "rejected");
  window.dispatchEvent(new Event("zc-consent"));
}

export function captureUtm() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const keys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "gclid",
      "fbclid",
    ];
    const found: Record<string, string> = {};
    for (const key of keys) {
      const value = params.get(key);
      if (value) found[key] = value;
    }
    if (Object.keys(found).length === 0) return;
    sessionStorage.setItem(UTM_KEY, JSON.stringify(found));
  } catch {
    /* ignore */
  }
}

export function readStoredUtm(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(UTM_KEY);
  } catch {
    return null;
  }
}

export function track(
  event: AnalyticsEvent,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;

  const payload = params ?? {};
  try {
    window.gtag?.("event", event, payload);
    if (event === "add_to_list") {
      // Keep existing Google Ads conversions on add_to_cart
      window.gtag?.("event", "add_to_cart", payload);
      window.fbq?.("trackCustom", "AddToList", payload);
    }
    if (event === "generate_lead" || event === "quote_request") {
      window.fbq?.("track", "Lead", payload);
      const sendTo = process.env.NEXT_PUBLIC_AW_SEND_TO;
      if (sendTo) {
        window.gtag?.("event", "conversion", { send_to: sendTo, ...payload });
      }
    }
  } catch {
    /* ignore */
  }
}

export function bindClickTracking() {
  if (typeof window === "undefined") return () => undefined;
  const handler = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest("a");
    if (!link) return;
    const href = link.getAttribute("href") || "";
    if (href.includes("wa.me") || href.includes("whatsapp")) {
      track("whatsapp_click", { href });
    } else if (href.startsWith("tel:")) {
      track("phone_click", { href });
    }
  };
  document.addEventListener("click", handler);
  return () => document.removeEventListener("click", handler);
}
