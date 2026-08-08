"use client";

import { useId, useState, type DragEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";
import {
  AdminAlert,
  AdminButton,
  apiJson,
} from "@/components/admin/AdminForm";

interface Asset {
  id: string;
  filename: string;
  url: string;
  alt: string | null;
  createdAt: string;
}

export function MediaClient({ initial }: { initial: Asset[] }) {
  const router = useRouter();
  const inputId = useId();
  const [items, setItems] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (!list.length) return;
    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const uploaded: Asset[] = [];
      for (const file of list) {
        const form = new FormData();
        form.append("file", file);
        form.append("alt", file.name);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = (await res.json()) as Asset & { error?: string };
        if (!res.ok) throw new Error(data.error || "Yükleme başarısız");
        uploaded.push({
          id: data.id,
          filename: data.filename,
          url: data.url,
          alt: data.alt,
          createdAt:
            typeof data.createdAt === "string"
              ? data.createdAt
              : new Date().toISOString(),
        });
      }
      setItems((prev) => [...uploaded, ...prev]);
      setSuccess(
        uploaded.length === 1
          ? "Görsel yüklendi."
          : `${uploaded.length} görsel yüklendi.`
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme hatası");
    } finally {
      setUploading(false);
    }
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) void uploadFiles(e.target.files);
    e.target.value = "";
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (uploading) return;
    if (e.dataTransfer.files?.length) void uploadFiles(e.dataTransfer.files);
  }

  async function onDelete(id: string) {
    if (
      !confirm(
        "Bu görseli silmek istediğinize emin misiniz? Ürünlerde kullanılıyorsa bağlantı kırılır."
      )
    ) {
      return;
    }
    await apiJson(`/api/upload?id=${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
    router.refresh();
  }

  return (
    <div>
      {error && <AdminAlert type="error">{error}</AdminAlert>}
      {success && <AdminAlert type="success">{success}</AdminAlert>}

      <div className="admin-card p-4 sm:p-6 mb-8">
        <label
          htmlFor={inputId}
          onDragOver={(e) => {
            e.preventDefault();
            if (!uploading) setDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragOver(false);
          }}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-10 text-center cursor-pointer transition-colors ${
            uploading ? "opacity-60 cursor-wait" : "hover:border-orange hover:bg-orange/5"
          } ${
            dragOver ? "border-orange bg-orange/10" : "border-[#333] bg-black/30"
          }`}
        >
          <input
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            disabled={uploading}
            onChange={onChange}
            className="sr-only"
          />
          {uploading ? (
            <Loader2 className="text-orange animate-spin" size={32} />
          ) : (
            <Upload className={dragOver ? "text-orange" : "text-[#888]"} size={32} />
          )}
          <span className="text-sm font-semibold text-white">
            {uploading
              ? "Yükleniyor…"
              : dragOver
                ? "Bırakın, yüklensin"
                : "Görselleri buraya sürükleyin veya tıklayıp seçin"}
          </span>
          <span className="text-xs text-[#888]">
            JPG, PNG, WEBP veya GIF — en fazla 8 MB. Birden fazla seçebilirsiniz.
          </span>
        </label>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((asset) => (
          <div key={asset.id} className="admin-card overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset.url}
              alt={asset.alt || asset.filename}
              className="w-full h-40 object-cover bg-black"
            />
            <div className="p-3">
              <p className="text-xs text-[#888] truncate mb-2">{asset.filename}</p>
              <AdminButton
                variant="danger"
                className="!py-1.5 !px-2 text-xs"
                onClick={() => onDelete(asset.id)}
              >
                Sil
              </AdminButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
