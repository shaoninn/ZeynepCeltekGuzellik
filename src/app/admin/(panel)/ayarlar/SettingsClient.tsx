"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  AdminAlert,
  AdminButton,
  AdminField,
  apiJson,
} from "@/components/admin/AdminForm";

const FIELDS = [
  { key: "phone", label: "Telefon", help: "Sitede ve WhatsApp butonunda görünür." },
  { key: "whatsapp", label: "WhatsApp (ülke kodlu)", help: "Örn: 905454570656 — sadece rakam." },
  { key: "address", label: "Adres" },
  { key: "instagram", label: "Instagram URL", help: "https://www.instagram.com/zeynepceltek_adana/" },
  {
    key: "instagram_access_token",
    label: "Instagram Access Token",
    help: "Meta Graph / Instagram Basic Display long-lived token. Canlı feed için.",
  },
  {
    key: "instagram_user_id",
    label: "Instagram Business User ID",
    help: "Graph API için IG kullanıcı ID (opsiyonel; boşsa /me/media denenir).",
  },
  { key: "google_reviews_url", label: "Google işletme / yorum linki", help: "Örn: share.google/... veya maps profil linki." },
  { key: "work_hours_weekdays", label: "Hafta içi çalışma saati" },
  { key: "work_hours_sunday", label: "Pazar" },
  { key: "manufacturer_email", label: "Üretici / atölye e-posta", help: "Yeni teklifte üretim özeti buraya gider." },
  { key: "payment_enabled", label: "Ödeme paneli (1=açık)", help: "1 veya true yazınca /odeme banka bilgilerini vurgular." },
  { key: "bank_name", label: "Banka adı" },
  { key: "bank_iban", label: "IBAN" },
  { key: "bank_holder", label: "Hesap sahibi" },
  { key: "payment_note", label: "Ödeme notu" },
  { key: "price_per_cm2", label: "Fiyat: cm²", help: "Neon formül — örn. 0.35" },
  { key: "price_per_letter", label: "Fiyat: harf", help: "örn. 45" },
  { key: "price_per_cm", label: "Fiyat formülü (opsiyonel)", help: "Örn. saatlik/paket katsayısı" },
  { key: "price_base_mount", label: "Fiyat: kayıt tabanı", help: "örn. 250" },
  { key: "price_backboard", label: "Fiyat: backboard", help: "örn. 350" },
] as const;

export function SettingsClient({
  initial,
}: {
  initial: Record<string, string>;
}) {
  const [values, setValues] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);

  const [totpEnabled, setTotpEnabled] = useState(false);
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [totpQr, setTotpQr] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [totpPassword, setTotpPassword] = useState("");
  const [totpMsg, setTotpMsg] = useState<string | null>(null);
  const [totpErr, setTotpErr] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const data = await apiJson<{
          enabled: boolean;
          secret?: string;
          qrDataUrl?: string;
        }>("/api/auth/totp");
        setTotpEnabled(data.enabled);
        if (!data.enabled) {
          setTotpSecret(data.secret || null);
          setTotpQr(data.qrDataUrl || null);
        }
      } catch {
        /* ignore */
      }
    })();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await apiJson("/api/settings", {
        method: "PUT",
        body: JSON.stringify(values),
      });
      setSuccess("Ayarlar kaydedildi. Bazı değişiklikler ~1 dk içinde görünür.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hata");
    } finally {
      setLoading(false);
    }
  }

  async function onPassword(e: FormEvent) {
    e.preventDefault();
    setPwLoading(true);
    setPwError(null);
    setPwSuccess(null);
    try {
      await apiJson("/api/auth/password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setPwSuccess("Şifre güncellendi.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Hata");
    } finally {
      setPwLoading(false);
    }
  }

  async function enable2fa(e: FormEvent) {
    e.preventDefault();
    if (!totpSecret) return;
    setTotpErr(null);
    setTotpMsg(null);
    try {
      await apiJson("/api/auth/totp", {
        method: "POST",
        body: JSON.stringify({ secret: totpSecret, code: totpCode }),
      });
      setTotpEnabled(true);
      setTotpMsg("2FA etkin.");
      setTotpCode("");
      setTotpQr(null);
      setTotpSecret(null);
    } catch (err) {
      setTotpErr(err instanceof Error ? err.message : "Hata");
    }
  }

  async function disable2fa(e: FormEvent) {
    e.preventDefault();
    setTotpErr(null);
    setTotpMsg(null);
    try {
      await apiJson("/api/auth/totp", {
        method: "DELETE",
        body: JSON.stringify({ password: totpPassword, code: totpCode }),
      });
      setTotpEnabled(false);
      setTotpMsg("2FA kapatıldı.");
      setTotpPassword("");
      setTotpCode("");
      const data = await apiJson<{
        enabled: boolean;
        secret?: string;
        qrDataUrl?: string;
      }>("/api/auth/totp");
      setTotpSecret(data.secret || null);
      setTotpQr(data.qrDataUrl || null);
    } catch (err) {
      setTotpErr(err instanceof Error ? err.message : "Hata");
    }
  }

  return (
    <div className="space-y-8 max-w-xl">
      <form onSubmit={onSubmit} className="admin-card p-6">
        {error && <AdminAlert type="error">{error}</AdminAlert>}
        {success && <AdminAlert type="success">{success}</AdminAlert>}
        {FIELDS.map((f) => (
          <AdminField
            key={f.key}
            label={f.label}
            help={"help" in f ? f.help : undefined}
          >
            {f.key === "address" ? (
              <textarea
                className="admin-input min-h-[90px]"
                value={values[f.key] || ""}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [f.key]: e.target.value }))
                }
              />
            ) : (
              <input
                className="admin-input"
                value={values[f.key] || ""}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [f.key]: e.target.value }))
                }
              />
            )}
          </AdminField>
        ))}
        <AdminButton type="submit" loading={loading}>
          Ayarları Kaydet
        </AdminButton>
      </form>

      <form onSubmit={onPassword} className="admin-card p-6">
        <h2 className="font-display text-lg font-bold mb-4">Şifre Değiştir</h2>
        {pwError && <AdminAlert type="error">{pwError}</AdminAlert>}
        {pwSuccess && <AdminAlert type="success">{pwSuccess}</AdminAlert>}
        <AdminField label="Mevcut şifre">
          <input
            type="password"
            className="admin-input"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </AdminField>
        <AdminField label="Yeni şifre" help="En az 8 karakter">
          <input
            type="password"
            className="admin-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </AdminField>
        <AdminButton type="submit" loading={pwLoading}>
          Şifreyi Güncelle
        </AdminButton>
      </form>

      <div className="admin-card p-6">
        <h2 className="font-display text-lg font-bold mb-4">
          İki faktörlü doğrulama (2FA)
        </h2>
        {totpErr && <AdminAlert type="error">{totpErr}</AdminAlert>}
        {totpMsg && <AdminAlert type="success">{totpMsg}</AdminAlert>}
        {totpEnabled ? (
          <form onSubmit={disable2fa} className="space-y-3">
            <p className="text-sm text-[#aaa] mb-2">2FA şu an açık.</p>
            <AdminField label="Şifre">
              <input
                type="password"
                className="admin-input"
                value={totpPassword}
                onChange={(e) => setTotpPassword(e.target.value)}
                required
              />
            </AdminField>
            <AdminField label="Authenticator kodu">
              <input
                className="admin-input"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                required
              />
            </AdminField>
            <AdminButton type="submit">2FA Kapat</AdminButton>
          </form>
        ) : (
          <form onSubmit={enable2fa} className="space-y-3">
            <p className="text-sm text-[#aaa]">
              Authenticator uygulamasıyla QR kodu tarayın, ardından kodu girin.
            </p>
            {totpQr && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={totpQr} alt="2FA QR" className="w-40 h-40 bg-white p-2" />
            )}
            {totpSecret && (
              <p className="text-xs text-[#666] break-all">Manuel anahtar: {totpSecret}</p>
            )}
            <AdminField label="Doğrulama kodu">
              <input
                className="admin-input"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                required
              />
            </AdminField>
            <AdminButton type="submit">2FA Etkinleştir</AdminButton>
          </form>
        )}
      </div>
    </div>
  );
}
