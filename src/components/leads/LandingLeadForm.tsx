"use client";

import { useState, type FormEvent } from "react";
import { SiteLink } from "@/components/ui/SiteLink";
import { BRANCH_OPTIONS } from "@/lib/constants";
import { captureUtm, readStoredUtm } from "@/lib/analytics";

export function LandingLeadForm({
  subject,
}: {
  subject: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [branch, setBranch] = useState("turgutozal");
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      captureUtm();
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email: "",
          subject,
          message: `Landing: ${subject}\nŞube: ${BRANCH_OPTIONS.find((b) => b.id === branch)?.name ?? branch}`,
          kvkkAccepted,
          utm: readStoredUtm(),
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Mesaj gönderilemedi");
      window.location.assign(
        `/tesekkur/iletisim?branch=${encodeURIComponent(branch)}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="text-left border border-border bg-card p-5 space-y-3">
      <p className="text-sm font-semibold text-cream">Hızlı randevu formu</p>
      <input
        className="admin-input"
        placeholder="Ad Soyad"
        name="name"
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        minLength={2}
      />
      <input
        className="admin-input"
        placeholder="Telefon"
        type="tel"
        name="tel"
        autoComplete="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        minLength={10}
      />
      <select
        className="admin-input"
        value={branch}
        onChange={(e) => setBranch(e.target.value)}
        required
      >
        {BRANCH_OPTIONS.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>
      <label className="flex items-start gap-2 text-xs text-muted cursor-pointer">
        <input
          type="checkbox"
          checked={kvkkAccepted}
          onChange={(e) => setKvkkAccepted(e.target.checked)}
          required
          className="mt-0.5"
        />
        <span>
          <SiteLink href="/kvkk" className="text-orange hover:underline">
            KVKK
          </SiteLink>{" "}
          metnini okudum, iletişim için verilerimin işlenmesini kabul ediyorum.
        </span>
      </label>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <button
        type="submit"
        disabled={loading || !kvkkAccepted}
        className="w-full min-h-11 btn-primary justify-center disabled:opacity-50"
      >
        {loading ? "Gönderiliyor…" : "Randevu talebi gönder"}
      </button>
    </form>
  );
}
