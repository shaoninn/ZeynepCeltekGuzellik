"use client";

import { useState, type FormEvent } from "react";
import { SiteLink } from "@/components/ui/SiteLink";
import Image from "next/image";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { CartStepper } from "@/components/shop/CartStepper";
import {
  BRANCH_OPTIONS,
  branchLabel,
  branchWhatsAppUrl,
} from "@/lib/constants";
import { captureUtm, readStoredUtm } from "@/lib/analytics";

const DAY_OPTIONS = [
  { value: "", label: "Farketmez" },
  { value: "Bugün", label: "Bugün" },
  { value: "Yarın", label: "Yarın" },
  { value: "Hafta içi", label: "Hafta içi" },
  { value: "Hafta sonu", label: "Hafta sonu" },
] as const;

const TIME_OPTIONS = [
  { value: "", label: "Farketmez" },
  { value: "09:00–12:00", label: "09:00–12:00" },
  { value: "12:00–15:00", label: "12:00–15:00" },
  { value: "15:00–19:00", label: "15:00–19:00" },
] as const;

const SLOT_CHIPS = [
  { day: "Bugün", label: "Bugün" },
  { day: "Yarın", label: "Yarın" },
  { day: "Hafta sonu", label: "Hafta sonu" },
] as const;

function buildAppointmentNote(input: {
  branchId: string;
  preferredDay: string;
  preferredTime: string;
  note: string;
}): string {
  return [
    `Şube: ${branchLabel(input.branchId)}`,
    input.preferredDay ? `Tercih gün: ${input.preferredDay}` : null,
    input.preferredTime ? `Tercih saat: ${input.preferredTime}` : null,
    input.note.trim() || null,
  ]
    .filter(Boolean)
    .join("\n");
}

export function CartPage({ whatsappUrl }: { whatsappUrl: string }) {
  const {
    items,
    total,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [branchId, setBranchId] = useState("turgutozal");
  const [preferredDay, setPreferredDay] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [note, setNote] = useState("");
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [wantPayment, setWantPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function payloadItems() {
    return items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      widthCm: null,
      heightCm: null,
      color: null,
      optionsNote: i.optionsNote ?? null,
    }));
  }

  async function createOrder(source: "WEB" | "WHATSAPP") {
    captureUtm();
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        email,
        address: null,
        note: buildAppointmentNote({
          branchId,
          preferredDay,
          preferredTime,
          note,
        }),
        kvkkAccepted,
        wantPayment,
        source,
        branch: branchId,
        preferredDay,
        preferredTime,
        utm: readStoredUtm(),
        items: payloadItems(),
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Talep oluşturulamadı");
    return data as {
      order: { orderNo: string };
      emailSent?: boolean;
    };
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag size={64} className="mx-auto text-muted mb-4" />
        <h2 className="font-display text-2xl font-bold text-white mb-2">
          Randevu Listeniz Boş
        </h2>
        <p className="text-muted mb-6">
          Henüz listeye hizmet veya paket eklemediniz.
        </p>
        <Button href="/hizmetler">Hizmetleri İncele</Button>
      </div>
    );
  }

  async function submitOrder(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await createOrder("WEB");
      window.location.assign(
        `/tesekkur/teklif?orderNo=${encodeURIComponent(data.order.orderNo)}&branch=${encodeURIComponent(branchId)}`
      );
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Talep oluşturulamadı");
      setLoading(false);
    }
  }

  async function submitWhatsApp() {
    if (!kvkkAccepted) {
      setError("Devam etmek için KVKK onayını işaretleyin.");
      return;
    }
    if (name.trim().length < 2 || phone.trim().length < 10) {
      setError("WhatsApp kaydı için ad ve telefon gerekli.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await createOrder("WHATSAPP");
      const orderNoValue = data.order.orderNo;
      const waText = encodeURIComponent(
        `Merhaba, ${orderNoValue} numaralı randevu talebim:\n\n${items
          .map((i) => `- ${i.name} x${i.quantity}`)
          .join("\n")}\n\nAd: ${name}\nTel: ${phone}\nŞube: ${branchLabel(branchId)}\nToplam (tahmini): ${formatPrice(total)}`
      );
      clearCart();
      window.open(
        `${branchWhatsAppUrl(branchId)}?text=${waText}`,
        "_blank",
        "noopener,noreferrer"
      );
      window.location.assign(
        `/tesekkur/teklif?orderNo=${encodeURIComponent(orderNoValue)}&branch=${encodeURIComponent(branchId)}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt oluşturulamadı");
      setLoading(false);
    }
  }

  return (
    <div>
      <CartStepper current={step === 1 ? 1 : 2} />
      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-4">
          {step === 1 && (
            <>
              {items.map((item) => (
                <div
                  key={item.lineId}
                  className="flex flex-col sm:flex-row gap-4 p-4 bg-card border border-border rounded-xl"
                >
                  <div className="relative w-20 h-20 flex-shrink-0 bg-black rounded-lg overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs text-orange/30 font-bold">ZC</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <SiteLink
                      href={
                        item.productId.startsWith("package:")
                          ? `/paketler/${item.slug}`
                          : `/hizmet/${item.slug}`
                      }
                      className="text-sm font-semibold text-white hover:text-orange transition-colors"
                    >
                      {item.name}
                    </SiteLink>
                    {item.categoryName && (
                      <p className="text-xs text-muted">{item.categoryName}</p>
                    )}
                    <p className="text-orange font-semibold">
                      {formatPrice(item.price)}
                    </p>
                    {item.optionsNote && (
                      <p className="text-[11px] text-muted break-anywhere line-clamp-3">
                        {item.optionsNote}
                      </p>
                    )}
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
                    <button
                      onClick={() => removeFromCart(item.lineId)}
                      className="min-w-11 min-h-11 flex items-center justify-center text-muted hover:text-red-400 transition-colors"
                      aria-label="Kaldır"
                      type="button"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="flex items-center border border-border">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.lineId, item.quantity - 1)
                        }
                        className="min-w-11 min-h-11 flex items-center justify-center text-muted hover:text-orange"
                        aria-label="Azalt"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.lineId, item.quantity + 1)
                        }
                        className="min-w-11 min-h-11 flex items-center justify-center text-muted hover:text-orange"
                        aria-label="Artır"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => clearCart()}
                  className="min-h-11 text-sm text-muted hover:text-red-400 transition-colors"
                >
                  Listeyi Temizle
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="min-h-11 px-5 py-2.5 rounded-lg bg-orange text-black font-semibold text-sm hover:bg-orange-dark transition-colors"
                >
                  Bilgilere geç
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="p-6 bg-card border border-border rounded-xl space-y-3 lg:hidden">
              <p className="text-sm text-muted">
                {items.length} kalem · Tahmini {formatPrice(total)}
              </p>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="min-h-11 text-sm text-orange hover:underline"
              >
                ← Listeye dön
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 bg-card border border-border lg:sticky lg:top-[calc(3.5rem+0.5rem)] rounded-xl">
            <h3 className="font-display text-lg font-bold text-white mb-4">
              Randevu özeti
            </h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Ara Toplam</span>
                <span className="text-white">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Randevu</span>
                <span className="text-white">Onay ile</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Ödeme</span>
                <span className="text-white">Onay sonrası</span>
              </div>
            </div>
            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-semibold text-white">Tahmini toplam</span>
                <span className="font-display text-xl font-bold text-orange">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {step === 1 ? (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full min-h-11 py-3 bg-orange text-black text-center font-semibold uppercase tracking-wider hover:bg-orange-dark transition-colors rounded-lg"
              >
                Devam — Bilgiler
              </button>
            ) : (
              <form onSubmit={submitOrder} className="space-y-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-orange hover:underline mb-1 min-h-11"
                >
                  ← Listeye dön
                </button>
                <p className="text-xs text-muted mb-2">
                  Randevu kaydı (online ödeme yok). E-posta verirseniz özet
                  gönderilir.
                </p>
                {error && (
                  <p className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 p-2">
                    {error}
                  </p>
                )}
                <div>
                  <label
                    className="block text-sm text-muted mb-2"
                    htmlFor="o-name"
                  >
                    Ad Soyad *
                  </label>
                  <input
                    id="o-name"
                    className="admin-input"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm text-muted mb-2"
                    htmlFor="o-phone"
                  >
                    Telefon *
                  </label>
                  <input
                    id="o-phone"
                    className="admin-input"
                    type="tel"
                    name="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm text-muted mb-2"
                    htmlFor="o-branch"
                  >
                    Şube *
                  </label>
                  <select
                    id="o-branch"
                    className="admin-input"
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    required
                  >
                    {BRANCH_OPTIONS.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SLOT_CHIPS.map((chip) => (
                    <button
                      key={chip.day}
                      type="button"
                      onClick={() => setPreferredDay(chip.day)}
                      className={`min-h-11 px-3 text-sm border rounded-sm transition-colors ${
                        preferredDay === chip.day
                          ? "border-orange bg-orange text-ink"
                          : "border-border text-muted hover:text-orange hover:border-orange"
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label
                      className="block text-sm text-muted mb-2"
                      htmlFor="o-day"
                    >
                      Tercih gün
                    </label>
                    <select
                      id="o-day"
                      className="admin-input"
                      value={preferredDay}
                      onChange={(e) => setPreferredDay(e.target.value)}
                    >
                      {DAY_OPTIONS.map((d) => (
                        <option key={d.label} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      className="block text-sm text-muted mb-2"
                      htmlFor="o-time"
                    >
                      Saat aralığı
                    </label>
                    <select
                      id="o-time"
                      className="admin-input"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                    >
                      {TIME_OPTIONS.map((t) => (
                        <option key={t.label} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label
                    className="block text-sm text-muted mb-2"
                    htmlFor="o-email"
                  >
                    E-posta (özet için önerilir)
                  </label>
                  <input
                    id="o-email"
                    className="admin-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm text-muted mb-2"
                    htmlFor="o-note"
                  >
                    Ek not
                  </label>
                  <textarea
                    id="o-note"
                    className="admin-input min-h-[80px]"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
                <label className="flex items-start gap-2 text-sm text-muted leading-relaxed cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wantPayment}
                    onChange={(e) => setWantPayment(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    Onay sonrası havale / ödeme bilgisini de istiyorum.
                  </span>
                </label>
                <label className="flex items-start gap-2 text-sm text-muted leading-relaxed cursor-pointer">
                  <input
                    type="checkbox"
                    checked={kvkkAccepted}
                    onChange={(e) => setKvkkAccepted(e.target.checked)}
                    className="mt-0.5"
                    required
                  />
                  <span>
                    <SiteLink
                      href="/kvkk"
                      className="text-orange hover:underline"
                    >
                      KVKK metnini
                    </SiteLink>{" "}
                    okudum, randevu iletişimi için verilerimin işlenmesini kabul
                    ediyorum.
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={loading || !kvkkAccepted}
                  className="w-full min-h-11 py-3 bg-orange text-black text-center font-semibold uppercase tracking-wider hover:bg-orange-dark transition-colors disabled:opacity-50 rounded-lg"
                >
                  {loading ? "Kaydediliyor..." : "Randevu Talebi Oluştur"}
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={submitWhatsApp}
                  className="block w-full min-h-11 py-3 border border-border text-center text-sm text-muted hover:text-orange hover:border-orange transition-colors disabled:opacity-50 rounded-lg"
                >
                  Kaydet ve WhatsApp ile aç
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
