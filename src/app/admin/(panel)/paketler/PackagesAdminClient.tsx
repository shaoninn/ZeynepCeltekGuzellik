"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AdminAlert,
  AdminButton,
  AdminField,
  apiJson,
} from "@/components/admin/AdminForm";
import { slugify } from "@/lib/utils";

type Row = {
  id: string;
  name: string;
  slug: string;
  price: number;
  sessions: string;
  featured: boolean;
  badge: string | null;
  image: string;
  shortDesc: string;
  items: string;
  sortOrder: number;
  isActive: boolean;
};

export function PackagesAdminClient({ initial }: { initial: Row[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<Row | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("0");
  const [sessions, setSessions] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [image, setImage] = useState("/images/products/cilt-bakimi/1.jpg");
  const [lines, setLines] = useState("");
  const [featured, setFeatured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function fill(row: Row | null) {
    setEditing(row);
    setName(row?.name ?? "");
    setSlug(row?.slug ?? "");
    setPrice(String(row?.price ?? 0));
    setSessions(row?.sessions ?? "");
    setShortDesc(row?.shortDesc ?? "");
    setImage(row?.image ?? "/images/products/cilt-bakimi/1.jpg");
    setLines(
      row ? (JSON.parse(row.items || "[]") as string[]).join("\n") : ""
    );
    setFeatured(row?.featured ?? false);
  }

  async function refresh() {
    const data = await apiJson<Row[]>("/api/packages");
    setItems(data);
    router.refresh();
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name,
        slug: slug || slugify(name),
        price: Number(price) || 0,
        sessions,
        shortDesc,
        image,
        items: lines.split("\n").map((s) => s.trim()).filter(Boolean),
        featured,
        isActive: true,
        sortOrder: editing?.sortOrder ?? items.length,
      };
      if (editing) {
        await apiJson(`/api/packages/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiJson("/api/packages", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      fill(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hata");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <form onSubmit={onSubmit} className="space-y-3 admin-card p-4">
        {error ? <AdminAlert type="error">{error}</AdminAlert> : null}
        <AdminField label="Ad">
          <input className="admin-input" value={name} onChange={(e) => setName(e.target.value)} required />
        </AdminField>
        <AdminField label="Slug">
          <input className="admin-input" value={slug} onChange={(e) => setSlug(e.target.value)} />
        </AdminField>
        <AdminField label="Fiyat">
          <input className="admin-input" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </AdminField>
        <AdminField label="Seans">
          <input className="admin-input" value={sessions} onChange={(e) => setSessions(e.target.value)} required />
        </AdminField>
        <AdminField label="Kısa açıklama">
          <textarea className="admin-input min-h-20" value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} />
        </AdminField>
        <AdminField label="Görsel yolu">
          <input className="admin-input" value={image} onChange={(e) => setImage(e.target.value)} />
        </AdminField>
        <AdminField label="İçerik (satır satır)">
          <textarea className="admin-input min-h-24" value={lines} onChange={(e) => setLines(e.target.value)} />
        </AdminField>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Öne çıkan
        </label>
        <AdminButton disabled={loading}>
          {editing ? "Güncelle" : "Paket ekle"}
        </AdminButton>
      </form>
      <div className="space-y-2">
        {items.map((row) => (
          <div key={row.id} className="admin-card p-4 flex justify-between gap-3">
            <div>
              <p className="font-semibold">{row.name}</p>
              <p className="text-xs text-[#888]">{row.slug} · {row.price} TL</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="text-orange text-sm" onClick={() => fill(row)}>
                Düzenle
              </button>
              <button
                type="button"
                className="text-red-400 text-sm"
                onClick={async () => {
                  await apiJson(`/api/packages/${row.id}`, { method: "DELETE" });
                  await refresh();
                }}
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
