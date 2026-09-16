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
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
  href: string | null;
  endsAt: string | null;
  isActive: boolean;
  sortOrder: number;
};

export function CampaignsAdminClient({ initial }: { initial: Row[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<Row | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [href, setHref] = useState("");
  const [image, setImage] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function fill(row: Row | null) {
    setEditing(row);
    setTitle(row?.title ?? "");
    setSlug(row?.slug ?? "");
    setDescription(row?.description ?? "");
    setHref(row?.href ?? "");
    setImage(row?.image ?? "");
    setEndsAt(row?.endsAt ? row.endsAt.slice(0, 10) : "");
  }

  async function refresh() {
    const data = await apiJson<Row[]>("/api/campaigns");
    setItems(data);
    router.refresh();
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        title,
        slug: slug || slugify(title),
        description,
        href: href || "/paketler",
        image: image || null,
        endsAt: endsAt || null,
        isActive: true,
        sortOrder: editing?.sortOrder ?? items.length,
      };
      if (editing) {
        await apiJson(`/api/campaigns/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiJson("/api/campaigns", {
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
        <AdminField label="Başlık">
          <input className="admin-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </AdminField>
        <AdminField label="Slug">
          <input className="admin-input" value={slug} onChange={(e) => setSlug(e.target.value)} />
        </AdminField>
        <AdminField label="Açıklama">
          <textarea className="admin-input min-h-20" value={description} onChange={(e) => setDescription(e.target.value)} />
        </AdminField>
        <AdminField label="Bağlı paket / hizmet" help="URL veya slug, örn. /paketler/lazer">
          <input className="admin-input" value={href} onChange={(e) => setHref(e.target.value)} placeholder="/paketler/lazer" />
        </AdminField>
        <AdminField label="Görsel">
          <input className="admin-input" value={image} onChange={(e) => setImage(e.target.value)} />
        </AdminField>
        <AdminField label="Bitiş tarihi">
          <input className="admin-input" type="date" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
        </AdminField>
        <AdminButton disabled={loading}>{editing ? "Güncelle" : "Kampanya ekle"}</AdminButton>
      </form>
      <div className="space-y-2">
        {items.map((row) => (
          <div key={row.id} className="admin-card p-4 flex justify-between gap-3">
            <div>
              <p className="font-semibold">{row.title}</p>
              <p className="text-xs text-[#888]">{row.href}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="text-orange text-sm" onClick={() => fill(row)}>
                Düzenle
              </button>
              <button
                type="button"
                className="text-red-400 text-sm"
                onClick={async () => {
                  await apiJson(`/api/campaigns/${row.id}`, { method: "DELETE" });
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
