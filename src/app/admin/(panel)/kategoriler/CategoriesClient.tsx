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

interface Cat {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
  _count: { products: number };
}

export function CategoriesClient({ initial }: { initial: Cat[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState<Cat | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    const data = await apiJson<Cat[]>("/api/categories");
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
        name,
        slug: slug || slugify(name),
        description,
        isActive: editing?.isActive ?? true,
        sortOrder: editing?.sortOrder ?? items.length,
        image: editing?.image || undefined,
      };
      if (editing) {
        await apiJson(`/api/categories/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setSuccess("Kategori güncellendi.");
      } else {
        await apiJson("/api/categories", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setSuccess("Kategori eklendi.");
      }
      setName("");
      setSlug("");
      setDescription("");
      setEditing(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hata");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(cat: Cat) {
    if (cat._count.products > 0) {
      alert(
        `Bu kategoride ${cat._count.products} ürün var. Önce ürünleri silin veya taşıyın.`
      );
      return;
    }
    if (!confirm(`"${cat.name}" kategorisini silmek istediğinize emin misiniz?`)) {
      return;
    }
    try {
      await apiJson(`/api/categories/${cat.id}`, { method: "DELETE" });
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Silinemedi");
    }
  }

  function startEdit(cat: Cat) {
    setEditing(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <h2 className="font-display text-xl font-bold mb-4">
          {editing ? "Kategori Düzenle" : "Yeni Kategori"}
        </h2>
        {error && <AdminAlert type="error">{error}</AdminAlert>}
        {success && <AdminAlert type="success">{success}</AdminAlert>}
        <form onSubmit={onSubmit} className="admin-card p-5">
          <AdminField label="Ad *">
            <input
              className="admin-input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editing) setSlug(slugify(e.target.value));
              }}
              required
            />
          </AdminField>
          <AdminField
            label="Slug (adres eki) *"
            help="Kategori sayfası adresi. Örn: kutu-harf-sistemleri → /hizmetler/…. Değiştirirseniz eski linkler kırılabilir — dikkatli olun."
          >
            <input
              className="admin-input"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </AdminField>
          <AdminField label="Açıklama">
            <textarea
              className="admin-input min-h-[80px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
                  setName("");
                  setSlug("");
                  setDescription("");
                }}
              >
                İptal
              </AdminButton>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-3">
        <h2 className="font-display text-xl font-bold mb-4">Mevcut Kategoriler</h2>
        {items.map((cat) => (
          <div key={cat.id} className="admin-card p-4 flex justify-between gap-3">
            <div>
              <p className="font-semibold text-white">{cat.name}</p>
              <p className="text-xs text-[#666]">
                /{cat.slug} · {cat._count.products} ürün
              </p>
            </div>
            <div className="flex gap-2 text-sm shrink-0">
              <button
                type="button"
                className="text-orange"
                onClick={() => startEdit(cat)}
              >
                Düzenle
              </button>
              <button
                type="button"
                className="text-red-400"
                onClick={() => onDelete(cat)}
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
