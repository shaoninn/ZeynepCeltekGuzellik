"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AdminAlert,
  AdminButton,
  AdminField,
  apiJson,
} from "@/components/admin/AdminForm";
import {
  ImageGalleryField,
  ImageUploadField,
} from "@/components/admin/ImageUploadField";
import { slugify } from "@/lib/utils";

interface ProjectFormProps {
  categories: { id: string; name: string }[];
  initial?: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    image: string | null;
    imageBefore?: string | null;
    images?: string;
    location: string | null;
    isActive: boolean;
    isFeatured: boolean;
    categoryId: string | null;
  };
}

function parseGallery(json?: string, fallback?: string | null): string[] {
  try {
    const arr = JSON.parse(json || "[]") as string[];
    if (Array.isArray(arr) && arr.length) return arr.filter(Boolean);
  } catch {
    /* ignore */
  }
  return fallback ? [fallback] : [];
}

export function ProjectForm({ categories, initial }: ProjectFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [image, setImage] = useState(initial?.image || "");
  const [imageBefore, setImageBefore] = useState(initial?.imageBefore || "");
  const [gallery, setGallery] = useState(() =>
    parseGallery(initial?.images, initial?.image)
  );
  const [location, setLocation] = useState(initial?.location || "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId || "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const cover = image.trim() || gallery[0] || null;
      const payload = {
        title,
        slug: slug || slugify(title),
        description,
        image: cover,
        imageBefore: imageBefore.trim() || null,
        images: JSON.stringify(gallery.length ? gallery : cover ? [cover] : []),
        location: location || null,
        categoryId: categoryId || null,
        isActive,
        isFeatured,
      };
      if (initial) {
        await apiJson(`/api/projects/${initial.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiJson("/api/projects", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      router.push("/admin/projeler");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hata");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="admin-card p-4 sm:p-6 max-w-2xl w-full">
      {error && <AdminAlert type="error">{error}</AdminAlert>}
      <AdminField label="Başlık *">
        <input
          className="admin-input"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!initial) setSlug(slugify(e.target.value));
          }}
          required
        />
      </AdminField>
      <AdminField
        label="Slug (adres eki) *"
        help="Sayfa adresi için kısa kod. Örn: protez-tirnak-atolyesi → /projeler/protez-tirnak-atolyesi. Küçük harf, tire kullanın; Türkçe karakter ve boşluk yazmayın. Başlık yazınca otomatik dolar — gerekmedikçe değiştirmeyin."
      >
        <input
          className="admin-input"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
      </AdminField>
      <AdminField label="Konum" help="Örn: Adana">
        <input
          className="admin-input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </AdminField>

      <ImageUploadField
        label="Kapak görseli"
        value={image}
        onChange={setImage}
        help="Liste ve ana sayfada görünen ana fotoğraf (sonrası)."
      />

      <ImageUploadField
        label="Öncesi görseli (before/after)"
        value={imageBefore}
        onChange={setImageBefore}
        help="Doldurulursa proje sayfasında sürgülü önce/sonra karşılaştırma gösterilir."
      />

      <ImageGalleryField
        label="Galeri görselleri"
        value={gallery}
        onChange={setGallery}
        help="Aynı mekânın farklı fotoğrafları. Birden fazla seçebilirsiniz."
      />

      <AdminField label="Kategori">
        <select
          className="admin-input"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">— Seçiniz —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </AdminField>
      <AdminField label="Açıklama">
        <textarea
          className="admin-input min-h-[100px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </AdminField>
      <div className="flex flex-col gap-3 mb-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Aktif (sitede görünsün)
        </label>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          <span>
            Ana sayfada öne çıkar
            <span className="block text-xs text-[#888] mt-0.5">
              İşaretli projeler ana sayfadaki “Çalışmalar” kaydırmasında görünür.
            </span>
          </span>
        </label>
      </div>
      <AdminButton type="submit" loading={loading}>
        Kaydet
      </AdminButton>
    </form>
  );
}
