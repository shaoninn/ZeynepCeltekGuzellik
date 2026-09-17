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
import { productSeoScore } from "@/lib/catalog-meta";

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: CategoryOption[];
  initial?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    shortDesc: string | null;
    price: number;
    salePrice?: number | null;
    image: string | null;
    nightImage?: string | null;
    images: string;
    specs: string;
    sortOrder: number;
    isActive: boolean;
    inStock: boolean;
    isFeatured?: boolean;
    badgeNew?: boolean;
    badgeBestseller?: boolean;
    badgeSale?: boolean;
    shippingLabel?: string | null;
    campaignEndsAt?: string | Date | null;
    categoryId: string;
  };
}

function parseImagesJson(json?: string): string[] {
  try {
    const arr = JSON.parse(json || "[]") as string[];
    return Array.isArray(arr) ? arr.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function ProductForm({ categories, initial }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [name, setName] = useState(initial?.name || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [slugManual, setSlugManual] = useState(false);
  const [categoryId, setCategoryId] = useState(
    initial?.categoryId || categories[0]?.id || ""
  );
  const [price, setPrice] = useState(String(initial?.price ?? 0));
  const [salePrice, setSalePrice] = useState(
    initial?.salePrice != null ? String(initial.salePrice) : ""
  );
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [shortDesc, setShortDesc] = useState(initial?.shortDesc || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [image, setImage] = useState(initial?.image || "");
  const nightImage = initial?.nightImage || "";
  const [gallery, setGallery] = useState(() => parseImagesJson(initial?.images));
  const [campaignEndsAt, setCampaignEndsAt] = useState(() => {
    if (!initial?.campaignEndsAt) return "";
    const d = new Date(initial.campaignEndsAt);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 16);
  });
  const [specs, setSpecs] = useState(() => {
    try {
      return JSON.parse(initial?.specs || "{}") as Record<string, string>;
    } catch {
      return {};
    }
  });
  const shippingLabel = initial?.shippingLabel || "";
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [inStock, setInStock] = useState(initial?.inStock ?? true);
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [badgeNew, setBadgeNew] = useState(initial?.badgeNew ?? false);
  const [badgeBestseller, setBadgeBestseller] = useState(
    initial?.badgeBestseller ?? false
  );
  const [badgeSale, setBadgeSale] = useState(initial?.badgeSale ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const seo = productSeoScore({
    name,
    slug,
    shortDesc,
    description,
    image,
    specs: JSON.stringify(specs),
  });

  function onNameChange(value: string) {
    setName(value);
    if (!slugManual) setSlug(slugify(value));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const trimmedImage = image.trim();
      const payload = {
        name,
        slug,
        categoryId,
        price: Number(price) || 0,
        salePrice: salePrice.trim() === "" ? null : Number(salePrice) || 0,
        sortOrder: Number(sortOrder) || 0,
        shortDesc,
        description,
        image: trimmedImage.length > 0 ? trimmedImage : null,
        nightImage: nightImage.trim() || null,
        images: JSON.stringify(gallery.filter(Boolean)),
        specs: JSON.stringify(specs),
        shippingLabel: shippingLabel.trim() || null,
        campaignEndsAt: campaignEndsAt
          ? new Date(campaignEndsAt).toISOString()
          : null,
        isActive,
        inStock,
        isFeatured,
        badgeNew,
        badgeBestseller,
        badgeSale,
      };

      if (isEdit && initial) {
        await apiJson(`/api/products/${initial.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setSuccess("Hizmet güncellendi.");
        router.refresh();
      } else {
        await apiJson("/api/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        router.push("/admin/urunler");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="admin-card p-4 sm:p-6 max-w-2xl w-full">
      {error && <AdminAlert type="error">{error}</AdminAlert>}
      {success && <AdminAlert type="success">{success}</AdminAlert>}

      <AdminField label="Hizmet adı *" help="Müşterinin göreceği hizmet adı.">
        <input
          className="admin-input"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
        />
      </AdminField>

      <AdminField
        label="Slug (adres eki) *"
        help="Hizmetin web adresi. Örn: hydrafacial-bakim → /hizmet/…. Benzersiz olmalı. Küçük harf, tire; boşluk/Türkçe karakter yok. İsim yazınca otomatik dolar."
      >
        <input
          className="admin-input"
          value={slug}
          onChange={(e) => {
            setSlugManual(true);
            setSlug(e.target.value);
          }}
          required
        />
      </AdminField>

      <AdminField label="Kategori *" help="Hizmetin ait olduğu kategori.">
        <select
          className="admin-input"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </AdminField>

      <div className="grid sm:grid-cols-2 gap-4">
        <AdminField label="Fiyat (₺)" help="Liste fiyatı.">
          <input
            className="admin-input"
            type="number"
            min={0}
            step={1}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </AdminField>
        <AdminField
          label="İndirimli fiyat (₺)"
          help="Kampanya rozeti açıksa bu fiyat gösterilir."
        >
          <input
            className="admin-input"
            type="number"
            min={0}
            step={1}
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            placeholder="Opsiyonel"
          />
        </AdminField>
      </div>

      <AdminField
        label="Sıra numarası"
        help="Listede sıralama. Küçük sayı önce gelir (0, 1, 2…). Aynı kategoride hizmetleri bu sayıya göre dizer."
      >
        <input
          className="admin-input"
          type="number"
          step={1}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        />
      </AdminField>

      <AdminField label="Kısa Açıklama">
        <input
          className="admin-input"
          value={shortDesc}
          onChange={(e) => setShortDesc(e.target.value)}
        />
      </AdminField>

      <AdminField label="Detaylı Açıklama">
        <textarea
          className="admin-input min-h-[120px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </AdminField>

      <ImageUploadField
        label="Ana görsel"
        value={image}
        onChange={setImage}
        help="Liste ve hizmet sayfasında görünen kapak fotoğrafı. Mümkünse WebP kullanın (daha hızlı)."
      />

      <ImageGalleryField
        label="Galeri görselleri"
        value={gallery}
        onChange={setGallery}
        help="Ek fotoğraflar. WebP önerilir; arka plan kaldırma için Canva/remove.bg kullanabilirsiniz."
      />

      <AdminField
        label="Kampanya bitiş (indirim rozeti)"
        help="Doluysa bu tarihten sonra indirimli fiyat uygulanmaz."
      >
        <input
          type="datetime-local"
          className="admin-input"
          value={campaignEndsAt}
          onChange={(e) => setCampaignEndsAt(e.target.value)}
        />
      </AdminField>

      <div className="admin-card p-3 mb-4 border border-[#333]">
        <p className="text-sm text-white mb-1">
          SEO skoru:{" "}
          <span className="text-orange font-bold">{seo.score}/100</span>
        </p>
        {seo.tips.length > 0 && (
          <ul className="text-xs text-[#888] list-disc pl-4 space-y-0.5">
            {seo.tips.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {(
          [
            ["sure", "Süre"],
            ["seans", "Seans"],
            ["hazirlik", "Hazırlık"],
            ["kimlere", "Kimlere uygun"],
            ["malzeme", "Hizmet içeriği"],
            ["garanti", "Sertifika"],
            ["montaj", "Süre (eski)"],
            ["teslimat", "Kontenjan / başlangıç"],
            ["randevu", "Randevu"],
            ["konum", "Konum"],
          ] as const
        ).map(([key, label]) => (
          <AdminField key={key} label={label}>
            <input
              className="admin-input"
              value={specs[key] || ""}
              onChange={(e) =>
                setSpecs((s) => ({ ...s, [key]: e.target.value }))
              }
            />
          </AdminField>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <label className="flex items-center gap-2 text-sm text-[#ccc]">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Sitede aktif
        </label>
        <label className="flex items-center gap-2 text-sm text-[#ccc]">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          Randevuya açık
        </label>
        <label className="flex items-center gap-2 text-sm text-[#ccc]">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          Öne çıkan
        </label>
        <label className="flex items-center gap-2 text-sm text-[#ccc]">
          <input
            type="checkbox"
            checked={badgeNew}
            onChange={(e) => setBadgeNew(e.target.checked)}
          />
          Yeni
        </label>
        <label className="flex items-center gap-2 text-sm text-[#ccc]">
          <input
            type="checkbox"
            checked={badgeBestseller}
            onChange={(e) => setBadgeBestseller(e.target.checked)}
          />
          Çok satan
        </label>
        <label className="flex items-center gap-2 text-sm text-[#ccc]">
          <input
            type="checkbox"
            checked={badgeSale}
            onChange={(e) => setBadgeSale(e.target.checked)}
          />
          İndirim rozeti
        </label>
      </div>

      <div className="flex gap-3">
        <AdminButton type="submit" loading={loading}>
          {isEdit ? "Güncelle" : "Hizmet ekle"}
        </AdminButton>
        <AdminButton
          variant="ghost"
          onClick={() => router.push("/admin/urunler")}
        >
          İptal
        </AdminButton>
      </div>
    </form>
  );
}
