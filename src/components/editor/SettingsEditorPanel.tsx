"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useEditor } from "@/components/editor/EditorProvider";

const FIELDS = [
  {
    key: "phone",
    label: "Telefon",
    help: "Sitede ve WhatsApp butonunda görünür.",
  },
  {
    key: "whatsapp",
    label: "WhatsApp (ülke kodlu)",
    help: "Örn: 905327359884 — sadece rakam.",
  },
  {
    key: "whatsapp_label",
    label: "WhatsApp yazısı",
    help: "Üst bardaki WhatsApp bağlantı metni.",
  },
  {
    key: "location_label",
    label: "Konum yazısı",
    help: "Üst sol: Adana vb.",
  },
  { key: "email", label: "E-posta", help: "İletişim formu ve footer." },
  { key: "address", label: "Adres", help: "İletişim sayfası ve harita sorgusu." },
  {
    key: "instagram",
    label: "Instagram URL",
    help: "Footer sosyal linki.",
  },
  {
    key: "google_reviews_url",
    label: "Google işletme linki",
    help: "İletişim sayfasındaki “Google’da aç”.",
  },
  {
    key: "work_hours_weekdays",
    label: "Hafta içi çalışma saati",
    help: "Örn: Pazartesi - Cumartesi: 09:00 - 19:00",
  },
  {
    key: "work_hours_sunday",
    label: "Pazar",
    help: "Örn: Pazar: Kapalı",
  },
] as const;

export function SettingsEditorPanel({ onClose }: { onClose: () => void }) {
  const { saveSetting } = useEditor();
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/settings");
        const data = (await res.json()) as Record<string, string>;
        setValues(data || {});
      } catch {
        setError("Ayarlar yüklenemedi");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function applyOne(key: string) {
    setSavingKey(key);
    setError(null);
    const ok = await saveSetting(key, values[key] ?? "");
    if (!ok) setError("Uygulanamadı");
    setSavingKey(null);
  }

  return (
    <div className="fixed inset-0 z-[90] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Kapat"
        onClick={onClose}
      />
      <aside className="relative h-full w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="font-display text-lg font-bold text-white">
              İletişim bilgileri
            </h2>
            <p className="text-xs text-muted mt-1">
              Uygula taslağa yazar. Yayınlamak için üstteki{" "}
              <strong className="text-white">Kaydet</strong> gerekir.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-muted hover:text-white"
            aria-label="Kapat"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading && <p className="text-sm text-muted">Yükleniyor…</p>}
          {error && <p className="text-sm text-red-400">{error}</p>}
          {FIELDS.map((field) => (
            <div key={field.key} className="space-y-1">
              <label className="block text-xs text-muted">
                {field.label}
                <input
                  className="admin-input mt-1"
                  value={values[field.key] || ""}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [field.key]: e.target.value }))
                  }
                />
              </label>
              <p className="text-[11px] text-[#666]">{field.help}</p>
              <button
                type="button"
                disabled={savingKey === field.key}
                onClick={() => void applyOne(field.key)}
                className="px-3 py-1.5 bg-orange text-white text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
              >
                {savingKey === field.key ? "…" : "Uygula"}
              </button>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
