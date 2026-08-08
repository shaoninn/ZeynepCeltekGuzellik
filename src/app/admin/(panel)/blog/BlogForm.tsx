"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AdminAlert,
  AdminButton,
  AdminField,
  apiJson,
} from "@/components/admin/AdminForm";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { slugify } from "@/lib/utils";

interface BlogFormProps {
  initial?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    image: string | null;
    isPublished: boolean;
  };
}

export function BlogForm({ initial }: BlogFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt || "");
  const [content, setContent] = useState(initial?.content || "");
  const [image, setImage] = useState(initial?.image || "");
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        title,
        slug: slug || slugify(title),
        excerpt,
        content,
        image: image.trim() || null,
        isPublished,
      };
      if (initial) {
        await apiJson(`/api/blog/${initial.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiJson("/api/blog", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      router.push("/admin/blog");
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
        help="Yazının web adresi. Örn: protez-tirnak-egitimi → /blog/protez-tirnak-egitimi. Küçük harf ve tire; başlık yazılınca otomatik oluşur."
      >
        <input
          className="admin-input"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
      </AdminField>
      <AdminField label="Özet">
        <input
          className="admin-input"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />
      </AdminField>

      <ImageUploadField
        label="Kapak görseli"
        value={image}
        onChange={setImage}
        help="Yazının liste ve detay sayfasında görünen fotoğrafı."
      />

      <AdminField label="İçerik *" help="En az 10 karakter.">
        <textarea
          className="admin-input min-h-[200px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </AdminField>
      <label className="flex items-center gap-2 text-sm mb-6">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
        />
        Yayınla
      </label>
      <AdminButton type="submit" loading={loading}>
        Kaydet
      </AdminButton>
    </form>
  );
}
