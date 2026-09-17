"use client";

import { useState } from "react";
import { paytrIframeSrc } from "@/lib/paytr-client";

export function PaytrCheckoutButton({
  orderNo,
  phone,
  totalLabel,
}: {
  orderNo: string;
  phone: string;
  totalLabel: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iframeToken, setIframeToken] = useState<string | null>(null);

  async function start() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/paytr/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNo, phone }),
      });
      const data = (await res.json()) as {
        error?: string;
        iframeToken?: string;
        code?: string;
      };
      if (!res.ok || !data.iframeToken) {
        throw new Error(
          data.error ||
            (data.code === "not_configured"
              ? "PayTR henüz bağlanmadı."
              : "Ödeme başlatılamadı")
        );
      }
      setIframeToken(data.iframeToken);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ödeme hatası");
    } finally {
      setLoading(false);
    }
  }

  if (iframeToken) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted">
          Güvenli PayTR ödeme formu — tutar {totalLabel}
        </p>
        <iframe
          src={paytrIframeSrc(iframeToken)}
          title="PayTR Güvenli Ödeme"
          className="w-full min-h-[420px] rounded-xl border border-border bg-white"
          frameBorder={0}
          scrolling="no"
          allow="payment *"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 p-2 rounded">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={() => void start()}
        disabled={loading}
        className="w-full min-h-11 py-3 bg-orange text-black font-semibold uppercase tracking-wider hover:bg-orange-dark disabled:opacity-50 rounded-lg"
      >
        {loading ? "PayTR açılıyor…" : "Kart ile güvenli öde (PayTR)"}
      </button>
      <p className="text-xs text-muted">
        3D Secure ile PayTR üzerinden tahsil edilir. Ödeme sonucu otomatik
        işlenir.
      </p>
    </div>
  );
}
