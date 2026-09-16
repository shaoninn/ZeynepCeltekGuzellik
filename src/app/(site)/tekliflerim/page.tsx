"use client";

import { useState } from "react";
import { SiteLink } from "@/components/ui/SiteLink";
import { OrderTimeline } from "@/components/admin/OrderTimeline";
import { formatPrice } from "@/lib/utils";
import { workflowLabel } from "@/lib/order-workflow";

interface LookupItem {
  productName: string;
  quantity: number;
  lineTotal: number;
  widthCm?: number | null;
  heightCm?: number | null;
  color?: string | null;
}

interface LookupResult {
  orderNo: string;
  name: string;
  status: string;
  workflow: string;
  paymentStatus: string;
  invoiceNo?: string | null;
  mountAt?: string | null;
  mountNote?: string | null;
  total: number;
  createdAt: string;
  items: LookupItem[];
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Beklemede",
  CONFIRMED: "Onaylandı",
  CANCELLED: "İptal",
};

const PAYMENT_LABEL: Record<string, string> = {
  UNPAID: "Ödenmedi",
  PENDING: "Ödeme bekleniyor",
  PAID: "Ödendi",
  REFUNDED: "İade",
};

export default function TekliflerimPage() {
  const [phone, setPhone] = useState("");
  const [orderNo, setOrderNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<LookupResult | null>(null);
  const [mountDate, setMountDate] = useState("");
  const [mountNote, setMountNote] = useState("");
  const [mountMsg, setMountMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/quotes/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), orderNo: orderNo.trim() }),
      });
      const data = (await res.json()) as LookupResult & { error?: string };
      if (!res.ok) {
        setError(data.error || "Teklif bulunamadı.");
        return;
      }
      setResult(data);
      if (data.mountAt) setMountDate(data.mountAt.slice(0, 16));
      if (data.mountNote) setMountNote(data.mountNote);
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  async function requestMount(e: React.FormEvent) {
    e.preventDefault();
    setMountMsg(null);
    try {
      const res = await fetch("/api/quotes/mount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          orderNo: orderNo.trim(),
          mountAt: mountDate,
          mountNote,
        }),
      });
      const data = (await res.json()) as { error?: string; ok?: boolean };
      if (!res.ok) {
        setMountMsg(data.error || "Randevu kaydedilemedi");
        return;
      }
      setMountMsg("Randevu talebi kaydedildi. Ekibimiz teyit için arayacak.");
      setResult((r) =>
        r
          ? {
              ...r,
              mountAt: mountDate ? new Date(mountDate).toISOString() : null,
              mountNote,
            }
          : r
      );
    } catch {
      setMountMsg("Bağlantı hatası");
    }
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          Randevularım
        </h1>
        <p className="text-muted text-sm mb-8">
          Randevu / teklif numaranız ve telefon numaranız ile teklif, fatura ve
          randevu durumunuzu yönetin.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 admin-card p-6">
          <div>
            <label className="block text-xs text-muted mb-1" htmlFor="lookup-phone">
              Telefon
            </label>
            <input
              id="lookup-phone"
              className="admin-input"
              placeholder="0 (5xx) xxx xx xx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1" htmlFor="lookup-order">
              Sipariş / teklif no
            </label>
            <input
              id="lookup-order"
              className="admin-input"
              placeholder="ZC-…"
              value={orderNo}
              onChange={(e) => setOrderNo(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange text-black font-semibold uppercase tracking-wider hover:bg-orange-dark disabled:opacity-50 rounded-lg"
          >
            {loading ? "Sorgulanıyor…" : "Sorgula"}
          </button>
        </form>

        {result && (
          <div className="mt-8 admin-card p-6 space-y-6">
            <div>
              <h2 className="font-display text-xl font-bold text-white">
                {result.orderNo}
              </h2>
              <p className="text-sm text-muted mt-1">{result.name}</p>
              {result.invoiceNo && (
                <p className="text-xs text-orange mt-1">
                  Fatura no: {result.invoiceNo}
                </p>
              )}
            </div>

            <div className="text-sm space-y-1">
              <p>
                <span className="text-muted">Durum:</span>{" "}
                {STATUS_LABEL[result.status] || result.status}
              </p>
              <p>
                <span className="text-muted">Randevu durumu:</span>{" "}
                {workflowLabel(result.workflow)}
              </p>
              <p>
                <span className="text-muted">Ödeme:</span>{" "}
                {PAYMENT_LABEL[result.paymentStatus] || result.paymentStatus}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <SiteLink
                href={`/teklif/${encodeURIComponent(result.orderNo)}/yazdir?phone=${encodeURIComponent(phone)}`}
                className="text-xs px-3 py-2 border border-border rounded-lg text-orange hover:border-orange"
              >
                Teklif PDF / Yazdır
              </SiteLink>
              <SiteLink
                href={`/teklif/${encodeURIComponent(result.orderNo)}/fatura?phone=${encodeURIComponent(phone)}`}
                className="text-xs px-3 py-2 border border-border rounded-lg text-orange hover:border-orange"
              >
                Fatura taslağı
              </SiteLink>
              <SiteLink
                href={`/odeme?orderNo=${encodeURIComponent(result.orderNo)}&phone=${encodeURIComponent(phone)}`}
                className="text-xs px-3 py-2 border border-orange/50 rounded-lg text-orange hover:bg-orange/10"
              >
                Ödeme bilgisi
              </SiteLink>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-3">
                Randevu durumu
              </h3>
              <OrderTimeline current={result.workflow} compact />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Kalemler</h3>
              <ul className="space-y-2 text-sm">
                {result.items.map((item, i) => {
                  const dims = [
                    item.widthCm != null
                      ? `${item.widthCm}×${item.heightCm ?? "?"} cm`
                      : null,
                    item.color || null,
                  ]
                    .filter(Boolean)
                    .join(" · ");
                  return (
                    <li key={i} className="flex justify-between gap-4">
                      <span>
                        {item.productName} × {item.quantity}
                        {dims && (
                          <span className="block text-xs text-muted">{dims}</span>
                        )}
                      </span>
                      <span className="text-orange shrink-0">
                        {formatPrice(item.lineTotal)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold">
                <span>Toplam</span>
                <span className="text-orange">{formatPrice(result.total)}</span>
              </div>
            </div>

            <form onSubmit={requestMount} className="space-y-3 border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-white">
                Randevu talebi
              </h3>
              <input
                type="datetime-local"
                className="admin-input"
                value={mountDate}
                onChange={(e) => setMountDate(e.target.value)}
                required
              />
              <textarea
                className="admin-input min-h-[70px]"
                placeholder="Not / tercih (gün, saat, program)"
                value={mountNote}
                onChange={(e) => setMountNote(e.target.value)}
              />
              {mountMsg && <p className="text-xs text-muted">{mountMsg}</p>}
              <button
                type="submit"
                className="w-full py-2.5 border border-orange text-orange text-sm rounded-lg hover:bg-orange/10"
              >
                Randevu talep et
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
