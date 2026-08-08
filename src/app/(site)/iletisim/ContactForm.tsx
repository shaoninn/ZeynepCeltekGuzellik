"use client";

import { useState } from "react";
import { SiteLink } from "@/components/ui/SiteLink";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";
import type { SiteSettingsMap } from "@/lib/site";
import {
  GOOGLE_MAPS_EMBED_QUERY,
} from "@/lib/constants";
import { EditableText } from "@/components/editor/EditableText";
import { EditableSetting } from "@/components/editor/EditableSetting";

export type ContactFormCopy = {
  cardTitle: string;
  callPrefix: string;
  whatsappLink: string;
  whatsappCta: string;
  whatsappPrefill: string;
  submitLabel: string;
  kvkkSuffix: string;
  mapLabel: string;
  mapOpen: string;
  success: string;
};

const DEFAULT_COPY: ContactFormCopy = {
  cardTitle: "Zeynep Çeltek Güzellik",
  callPrefix: "Ara:",
  whatsappLink: "WhatsApp ile yaz",
  whatsappCta: "WhatsApp ile Yazın",
  whatsappPrefill:
    "Merhaba, hizmetleriniz hakkında bilgi almak ve randevu oluşturmak istiyorum.",
  submitLabel: "Mesaj Gönder",
  kvkkSuffix:
    "okudum, kişisel verilerimin iletişim amacıyla işlenmesini kabul ediyorum.",
  mapLabel: "Konum — Google Haritalar",
  mapOpen: "Google'da aç",
  success: "Mesajınız alındı. En kısa sürede size dönüş yapacağız.",
};

export function ContactForm({
  settings,
  copy,
}: {
  settings: SiteSettingsMap;
  copy?: Partial<ContactFormCopy>;
}) {
  const c = { ...DEFAULT_COPY, ...copy };
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "Teklif",
    message: "",
    kvkkAccepted: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(
    GOOGLE_MAPS_EMBED_QUERY
  )}&z=17&hl=tr&output=embed`;
  const mapsOpenUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    GOOGLE_MAPS_EMBED_QUERY
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setError("Ad, telefon ve mesaj alanları zorunludur.");
      setStatus("error");
      return;
    }
    if (!form.kvkkAccepted) {
      setError("Devam etmek için KVKK onayını işaretleyin.");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Mesaj gönderilemedi.");
      }

      setStatus("success");
      setForm({
        name: "",
        phone: "",
        email: "",
        subject: "Teklif",
        message: "",
        kvkkAccepted: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
      setStatus("error");
    }
  };

  const fieldClass =
    "w-full px-4 py-3 text-base bg-black/40 border border-border text-white focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange";

  return (
    <div className="space-y-10">
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 lg:items-stretch">
        <div className="flex flex-col border border-border bg-card p-6 sm:p-8 min-h-[28rem]">
          <EditableText
            contentKey="contact_card_title"
            value={c.cardTitle}
            as="h2"
            block
            className="font-display text-lg font-bold text-white mb-6"
            help="İletişim kartı başlığı"
          />
          <ul className="space-y-4 flex-1">
            <li className="flex gap-3">
              <MapPin size={18} className="text-orange flex-shrink-0 mt-0.5" />
              <EditableSetting
                settingKey="address"
                value={settings.address}
                as="span"
                block
                multiline
                className="text-sm text-muted leading-relaxed"
                help="Adres (Ayarlar)"
              />
            </li>
            <li className="flex gap-3">
              <Phone size={18} className="text-orange flex-shrink-0" />
              <div className="flex flex-col gap-1">
                <a
                  href={`tel:+${settings.phoneRaw}`}
                  className="text-sm text-orange hover:underline inline-flex flex-wrap items-center gap-1"
                >
                  <EditableText
                    contentKey="contact_call_prefix"
                    value={c.callPrefix}
                    as="span"
                    help="Telefon satırı öneki (Ara:)"
                  />{" "}
                  <EditableSetting
                    settingKey="phone"
                    value={settings.phone}
                    as="span"
                    help="Telefon numarası (görünen)"
                  />
                </a>
                <a
                  href={settings.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted hover:text-orange"
                >
                  <EditableText
                    contentKey="contact_whatsapp_link"
                    value={c.whatsappLink}
                    as="span"
                    help="WhatsApp ikincil link metni"
                  />
                </a>
              </div>
            </li>
            <li className="flex gap-3">
              <Mail size={18} className="text-orange flex-shrink-0" />
              <EditableSetting
                settingKey="email"
                value={settings.email}
                as="span"
                className="text-sm text-muted hover:text-orange"
                help="E-posta adresi"
              />
            </li>
            <li className="flex gap-3">
              <Clock size={18} className="text-orange flex-shrink-0" />
              <div className="text-sm text-muted space-y-1">
                <EditableSetting
                  settingKey="work_hours_weekdays"
                  value={settings.workHoursWeekdays}
                  as="p"
                  block
                  help="Hafta içi çalışma saati"
                />
                <EditableSetting
                  settingKey="work_hours_sunday"
                  value={settings.workHoursSunday}
                  as="p"
                  block
                  help="Pazar / hafta sonu satırı"
                />
              </div>
            </li>
          </ul>

          <a
            href={`${settings.whatsappUrl}?text=${encodeURIComponent(
              c.whatsappPrefill
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 block w-full py-4 bg-orange text-white text-center font-display font-semibold uppercase tracking-wider hover:bg-orange-dark transition-colors"
          >
            <EditableText
              contentKey="contact_whatsapp_cta"
              value={c.whatsappCta}
              as="span"
              help="WhatsApp ana buton metni"
            />
          </a>
          <p className="mt-2 text-[11px] text-[#666]">
            Prefill:{" "}
            <EditableText
              contentKey="contact_whatsapp_prefill"
              value={c.whatsappPrefill}
              as="span"
              help="WhatsApp’a tıklanınca hazır mesaj"
            />
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col border border-border bg-card p-6 sm:p-8 min-h-[28rem] space-y-4"
        >
          <div>
            <label className="block text-sm text-muted mb-1" htmlFor="c-name">
              Ad Soyad <span className="text-orange">*</span>
            </label>
            <input
              id="c-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={fieldClass}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1" htmlFor="c-phone">
              Telefon <span className="text-orange">*</span>
            </label>
            <input
              id="c-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={fieldClass}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1" htmlFor="c-email">
              E-posta
            </label>
            <input
              id="c-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={fieldClass}
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1" htmlFor="c-subject">
              Konu
            </label>
            <select
              id="c-subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className={fieldClass}
            >
              <option value="Teklif">Teklif Talebi</option>
              <option value="Keşif">Ücretsiz Keşif</option>
              <option value="Bilgi">Bilgi Alma</option>
              <option value="Diğer">Diğer</option>
            </select>
          </div>
          <div className="flex-1 flex flex-col">
            <label className="block text-sm text-muted mb-1" htmlFor="c-message">
              Mesajınız <span className="text-orange">*</span>
            </label>
            <textarea
              id="c-message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              maxLength={800}
              className={`${fieldClass} resize-none flex-1 min-h-[6rem]`}
              required
            />
            <p className="text-xs text-muted mt-1">{form.message.length}/800</p>
          </div>

          <label className="flex items-start gap-2 text-xs text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={form.kvkkAccepted}
              onChange={(e) =>
                setForm({ ...form, kvkkAccepted: e.target.checked })
              }
              className="mt-0.5"
              required
            />
            <span>
              <SiteLink href="/kvkk" className="text-orange hover:underline">
                KVKK aydınlatma metnini
              </SiteLink>{" "}
              <EditableText
                contentKey="contact_kvkk_suffix"
                value={c.kvkkSuffix}
                as="span"
                help="KVKK onay cümlesinin devamı"
              />
            </span>
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {status === "success" && (
            <EditableText
              contentKey="contact_success"
              value={c.success}
              as="p"
              block
              className="text-sm text-green-400"
              help="Form başarı mesajı"
            />
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-4 bg-orange text-white font-display font-semibold uppercase tracking-wider hover:bg-orange-dark transition-colors disabled:opacity-50 mt-auto"
          >
            {status === "loading" ? (
              "Gönderiliyor..."
            ) : (
              <EditableText
                contentKey="contact_submit_label"
                value={c.submitLabel}
                as="span"
                help="Form gönder butonu"
              />
            )}
          </button>
        </form>
      </div>

      <div className="border border-border overflow-hidden bg-card">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border">
          <EditableText
            contentKey="contact_map_label"
            value={c.mapLabel}
            as="p"
            className="text-sm text-muted"
            help="Harita bölümü başlığı"
          />
          <a
            href={mapsOpenUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-orange hover:underline"
          >
            <EditableText
              contentKey="contact_map_open"
              value={c.mapOpen}
              as="span"
              help="Harita dış link metni"
            />
            <ExternalLink size={12} />
          </a>
        </div>
        <iframe
          title="Zeynep Çeltek Güzellik konumu — Adana"
          src={mapsEmbed}
          className="w-full h-[240px] sm:h-[320px] md:h-[400px] grayscale-[20%] contrast-110"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}
