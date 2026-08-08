"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AdminAlert,
  AdminButton,
  AdminField,
  apiJson,
} from "@/components/admin/AdminForm";

interface NavRow {
  id: string;
  label: string;
  href: string;
  sortOrder: number;
  isActive: boolean;
}

export function NavClient({ initial }: { initial: NavRow[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [label, setLabel] = useState("");
  const [href, setHref] = useState("");
  const [editing, setEditing] = useState<NavRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    const data = await apiJson<NavRow[]>("/api/nav");
    setItems(data);
    router.refresh();
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        label,
        href,
        sortOrder: editing?.sortOrder ?? items.length,
        isActive: editing?.isActive ?? true,
      };
      if (editing) {
        await apiJson(`/api/nav/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setSuccess("Menü güncellendi. Site yenilenince görünür.");
      } else {
        await apiJson("/api/nav", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setSuccess("Menü eklendi.");
      }
      setLabel("");
      setHref("");
      setEditing(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hata");
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(item: NavRow) {
    await apiJson(`/api/nav/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({
        label: item.label,
        href: item.href,
        sortOrder: item.sortOrder,
        isActive: !item.isActive,
      }),
    });
    await refresh();
  }

  async function move(item: NavRow, dir: -1 | 1) {
    const idx = items.findIndex((i) => i.id === item.id);
    const swap = items[idx + dir];
    if (!swap) return;
    await Promise.all([
      apiJson(`/api/nav/${item.id}`, {
        method: "PUT",
        body: JSON.stringify({
          label: item.label,
          href: item.href,
          sortOrder: swap.sortOrder,
          isActive: item.isActive,
        }),
      }),
      apiJson(`/api/nav/${swap.id}`, {
        method: "PUT",
        body: JSON.stringify({
          label: swap.label,
          href: swap.href,
          sortOrder: item.sortOrder,
          isActive: swap.isActive,
        }),
      }),
    ]);
    await refresh();
  }

  async function onDelete(item: NavRow) {
    if (
      !confirm(
        `"${item.label}" menü öğesini silmek istediğinize emin misiniz?`
      )
    ) {
      return;
    }
    try {
      await apiJson(`/api/nav/${item.id}`, { method: "DELETE" });
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Silinemedi");
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <div className="admin-warning mb-4">
          Menü değişiklikleri Header ve Footer&apos;da görünür. Yanlış bir link
          site gezintisini bozar — kaydetmeden önce kontrol edin.
        </div>
        {error && <AdminAlert type="error">{error}</AdminAlert>}
        {success && <AdminAlert type="success">{success}</AdminAlert>}
        <form onSubmit={onSubmit} className="admin-card p-5">
          <h2 className="font-display text-lg font-bold mb-4">
            {editing ? "Menü Düzenle" : "Yeni Menü Öğesi"}
          </h2>
          <AdminField label="Etiket *" help="Örn: HAKKIMIZDA">
            <input
              className="admin-input"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />
          </AdminField>
          <AdminField label="Link *" help="Örn: /hakkimizda veya https://...">
            <input
              className="admin-input"
              value={href}
              onChange={(e) => setHref(e.target.value)}
              required
            />
          </AdminField>
          <div className="flex gap-2">
            <AdminButton type="submit" loading={loading}>
              {editing ? "Güncelle" : "Ekle"}
            </AdminButton>
            {editing && (
              <AdminButton
                variant="ghost"
                onClick={() => {
                  setEditing(null);
                  setLabel("");
                  setHref("");
                }}
              >
                İptal
              </AdminButton>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-3">
        <h2 className="font-display text-lg font-bold mb-2">Mevcut Menü</h2>
        {items.map((item) => (
          <div key={item.id} className="admin-card p-4">
            <div className="flex justify-between gap-3">
              <div>
                <p className="font-semibold text-white">
                  {item.label}{" "}
                  {!item.isActive && (
                    <span className="text-xs text-red-400">Pasif</span>
                  )}
                </p>
                <p className="text-xs text-[#666]">{item.href}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <button type="button" className="text-[#aaa]" onClick={() => move(item, -1)}>
                  ↑
                </button>
                <button type="button" className="text-[#aaa]" onClick={() => move(item, 1)}>
                  ↓
                </button>
                <button
                  type="button"
                  className="text-orange"
                  onClick={() => {
                    setEditing(item);
                    setLabel(item.label);
                    setHref(item.href);
                  }}
                >
                  Düzenle
                </button>
                <button
                  type="button"
                  className="text-[#aaa]"
                  onClick={() => toggleActive(item)}
                >
                  {item.isActive ? "Gizle" : "Göster"}
                </button>
                <button
                  type="button"
                  className="text-red-400"
                  onClick={() => onDelete(item)}
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
