"use client";

import { useState, type FormEvent } from "react";
import {
  AdminAlert,
  AdminButton,
  AdminField,
  apiJson,
} from "@/components/admin/AdminForm";

interface ContentItem {
  id: string;
  key: string;
  title: string | null;
  content: string;
}

export function ContentsClient({ initial }: { initial: ContentItem[] }) {
  const [items, setItems] = useState(initial);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function saveItem(item: ContentItem, e: FormEvent) {
    e.preventDefault();
    setSavingKey(item.key);
    setError(null);
    setSuccess(null);
    try {
      const updated = await apiJson<ContentItem>("/api/content", {
        method: "PUT",
        body: JSON.stringify({
          key: item.key,
          title: item.title,
          content: item.content,
        }),
      });
      setItems((prev) =>
        prev.map((p) => (p.key === updated.key ? { ...p, ...updated } : p))
      );
      setSuccess(`"${item.key}" kaydedildi.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt hatası");
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <div className="space-y-6">
      {error && <AdminAlert type="error">{error}</AdminAlert>}
      {success && <AdminAlert type="success">{success}</AdminAlert>}
      <div className="admin-warning">
        Bu yazılar ana sayfa, hakkımızda ve CTA bölümlerinde kullanılır. Yanlış
        kaydetmeden önce metni kontrol edin.
      </div>
      {items.map((item) => (
        <form
          key={item.key}
          onSubmit={(e) => saveItem(item, e)}
          className="admin-card p-5"
        >
          <p className="text-xs text-orange mb-2 font-mono">{item.key}</p>
          <AdminField label="Başlık (panelde görünür isim)">
            <input
              className="admin-input"
              value={item.title || ""}
              onChange={(e) =>
                setItems((prev) =>
                  prev.map((p) =>
                    p.key === item.key ? { ...p, title: e.target.value } : p
                  )
                )
              }
            />
          </AdminField>
          <AdminField label="İçerik">
            <textarea
              className="admin-input min-h-[100px]"
              value={item.content}
              onChange={(e) =>
                setItems((prev) =>
                  prev.map((p) =>
                    p.key === item.key ? { ...p, content: e.target.value } : p
                  )
                )
              }
            />
          </AdminField>
          <AdminButton type="submit" loading={savingKey === item.key}>
            Kaydet
          </AdminButton>
        </form>
      ))}
    </div>
  );
}
