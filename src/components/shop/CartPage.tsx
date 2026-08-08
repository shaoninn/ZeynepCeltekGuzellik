"use client";

import { useState, type FormEvent } from "react";
import { SiteLink } from "@/components/ui/SiteLink";
import Image from "next/image";
import { Trash2, Minus, Plus, ShoppingBag, CheckCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
  updateQuantity,
  updateLineOptions,
  clearCart,
} from "@/store/cartSlice";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { CartStepper } from "@/components/shop/CartStepper";

export function CartPage({ whatsappUrl }: { whatsappUrl: string }) {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [wantPayment, setWantPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderNo, setOrderNo] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  function payloadItems() {
    return items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      widthCm: i.widthCm ?? null,
      heightCm: i.heightCm ?? null,
      color: i.color ?? null,
      optionsNote: i.optionsNote ?? null,
    }));
  }

  async function createOrder(source: "WEB" | "WHATSAPP") {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        email,
        address,
        note,
        kvkkAccepted,
        wantPayment,
        source,
        items: payloadItems(),
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Sipariş oluşturulamadı");
    return data as {
      order: { orderNo: string };
      emailSent?: boolean;
    };
  }

  if (orderNo) {
    const waText = encodeURIComponent(
      `Merhaba, ${orderNo} numaralı teklif talebimi teyit etmek istiyorum.\nAd: ${name}\nTelefon: ${phone}`
    );
    const printUrl = `/teklif/${encodeURIComponent(orderNo)}/yazdir?phone=${encodeURIComponent(phone)}`;
    return (
      <div className="text-center py-16 max-w-lg mx-auto">
        <CartStepper current={3} />
        <CheckCircle size={64} className="mx-auto text-orange mb-4 mt-8" />
        <h2 className="font-display text-2xl font-bold text-white mb-2">
          Teklif Talebiniz Alındı
        </h2>
        <p className="text-muted mb-2">
          Talep numaranız:{" "}
          <span className="text-orange font-semibold">{orderNo}</span>
        </p>
        <p className="text-sm text-muted mb-2">
          Online ödeme henüz aktif değil; kaydınız teklif talebi olarak alındı.
          İleride havale / sanal POS buradan bağlanacak.
        </p>
        {emailSent && (
          <p className="text-sm text-orange mb-4">
            Özet e-posta adresinize gönderildi.
          </p>
        )}
        <div className="rounded-xl border border-border bg-card p-4 text-left text-sm text-muted mb-6 space-y-1">
          <p className="text-white font-semibold">Ödeme durumu</p>
          <p>Ödenmedi (teklif aşaması)</p>
          <p className="text-xs">
            Onay sonrası size havale bilgisi veya güvenli ödeme linki
            iletilecek.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
          <a
            href={`${whatsappUrl}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary justify-center"
          >
            WhatsApp ile Teyit Et
          </a>
          <Button href={`/odeme?orderNo=${encodeURIComponent(orderNo)}&phone=${encodeURIComponent(phone)}`} variant="outline">
            Ödeme bilgisi
          </Button>
          <Button href={printUrl} variant="outline">
            PDF / Yazdır
          </Button>
          <Button href="/tekliflerim" variant="outline">
            Tekliflerim
          </Button>
          <Button href="/hizmetler" variant="outline">
            Alışverişe Devam
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag size={64} className="mx-auto text-muted mb-4" />
        <h2 className="font-display text-2xl font-bold text-white mb-2">
          Teklif Listeniz Boş
        </h2>
        <p className="text-muted mb-6">
          Henüz listeye ürün eklemediniz.
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
      setOrderNo(data.order.orderNo);
      setEmailSent(Boolean(data.emailSent));
      dispatch(clearCart());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sipariş oluşturulamadı");
    } finally {
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
        `Merhaba, ${orderNoValue} numaralı teklif talebim:\n\n${items
          .map((i) => {
            const dims = [
              i.widthCm ? `${i.widthCm}cm` : null,
              i.heightCm ? `${i.heightCm}cm` : null,
              i.color || null,
            ]
              .filter(Boolean)
              .join(" ");
            return `- ${i.name} x${i.quantity}${dims ? ` (${dims})` : ""}`;
          })
          .join("\n")}\n\nAd: ${name}\nTel: ${phone}\nToplam (tahmini): ${formatPrice(total)}`
      );
      dispatch(clearCart());
      window.open(`${whatsappUrl}?text=${waText}`, "_blank", "noopener,noreferrer");
      setOrderNo(orderNoValue);
      setEmailSent(Boolean(data.emailSent));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt oluşturulamadı");
    } finally {
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
                        <span className="text-xs text-orange/30 font-bold">GR</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <SiteLink
                      href={`/urun/${item.slug}`}
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
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="number"
                        min={1}
                        step="0.1"
                        inputMode="decimal"
                        placeholder="En (cm)"
                        className="admin-input text-sm"
                        value={item.widthCm ?? ""}
                        onChange={(e) =>
                          dispatch(
                            updateLineOptions({
                              lineId: item.lineId,
                              widthCm: e.target.value
                                ? Number(e.target.value)
                                : null,
                              heightCm: item.heightCm,
                              color: item.color,
                            })
                          )
                        }
                      />
                      <input
                        type="number"
                        min={1}
                        step="0.1"
                        inputMode="decimal"
                        placeholder="Boy (cm)"
                        className="admin-input text-sm"
                        value={item.heightCm ?? ""}
                        onChange={(e) =>
                          dispatch(
                            updateLineOptions({
                              lineId: item.lineId,
                              widthCm: item.widthCm,
                              heightCm: e.target.value
                                ? Number(e.target.value)
                                : null,
                              color: item.color,
                            })
                          )
                        }
                      />
                      <input
                        placeholder="Renk / RAL"
                        className="admin-input text-sm"
                        value={item.color ?? ""}
                        onChange={(e) =>
                          dispatch(
                            updateLineOptions({
                              lineId: item.lineId,
                              widthCm: item.widthCm,
                              heightCm: item.heightCm,
                              color: e.target.value || null,
                            })
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
                    <button
                      onClick={() => dispatch(removeFromCart(item.lineId))}
                      className="text-muted hover:text-red-400 transition-colors"
                      aria-label="Kaldır"
                      type="button"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="flex items-center border border-border">
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              lineId: item.lineId,
                              quantity: item.quantity - 1,
                            })
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center text-muted hover:text-orange"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              lineId: item.lineId,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center text-muted hover:text-orange"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => dispatch(clearCart())}
                  className="text-sm text-muted hover:text-red-400 transition-colors"
                >
                  Listeyi Temizle
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-lg bg-orange text-black font-semibold text-sm hover:bg-orange-dark transition-colors"
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
                className="text-sm text-orange hover:underline"
              >
                ← Listeye dön
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 bg-card border border-border sticky top-24 rounded-xl">
            <h3 className="font-display text-lg font-bold text-white mb-4">
              Teklif Özeti
            </h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Ara Toplam</span>
                <span className="text-white">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Randevu / başlangıç</span>
                <span className="text-white">Teklif ile</span>
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
                className="w-full py-3 bg-orange text-black text-center font-semibold uppercase tracking-wider hover:bg-orange-dark transition-colors rounded-lg"
              >
                Devam — Bilgiler
              </button>
            ) : (
              <form onSubmit={submitOrder} className="space-y-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-orange hover:underline mb-1"
                >
                  ← Listeye dön
                </button>
                <p className="text-xs text-muted mb-2">
                  Teklif listesi kaydı (online ödeme yok). E-posta verirseniz özet
                  gönderilir.
                </p>
                {error && (
                  <p className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 p-2">
                    {error}
                  </p>
                )}
                <div>
                  <label
                    className="block text-xs text-muted mb-1"
                    htmlFor="o-name"
                  >
                    Ad Soyad *
                  </label>
                  <input
                    id="o-name"
                    className="admin-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-xs text-muted mb-1"
                    htmlFor="o-phone"
                  >
                    Telefon *
                  </label>
                  <input
                    id="o-phone"
                    className="admin-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-xs text-muted mb-1"
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
                    className="block text-xs text-muted mb-1"
                    htmlFor="o-address"
                  >
                    Adres (opsiyonel)
                  </label>
                  <input
                    id="o-address"
                    className="admin-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className="block text-xs text-muted mb-1"
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
            <label className="flex items-start gap-2 text-xs text-muted cursor-pointer">
              <input
                type="checkbox"
                checked={wantPayment}
                onChange={(e) => setWantPayment(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                Onay sonrası havale / ödeme bilgisini de istiyorum (ödeme durumu
                “bekleniyor” olur).
              </span>
            </label>
            <label className="flex items-start gap-2 text-xs text-muted cursor-pointer">
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
                okudum, teklif iletişimi için verilerimin işlenmesini kabul
                ediyorum.
              </span>
            </label>
                <button
                  type="submit"
                  disabled={loading || !kvkkAccepted}
                  className="w-full py-3 bg-orange text-black text-center font-semibold uppercase tracking-wider hover:bg-orange-dark transition-colors disabled:opacity-50 rounded-lg"
                >
                  {loading ? "Kaydediliyor..." : "Teklif Talebi Oluştur"}
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={submitWhatsApp}
                  className="block w-full py-3 border border-border text-center text-sm text-muted hover:text-orange hover:border-orange transition-colors disabled:opacity-50 rounded-lg"
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
