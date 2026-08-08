"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Download, Upload, Save } from "lucide-react";
import { ProductDeleteButton } from "./ProductDeleteButton";

export type ProductAdminRow = {
  id: string;
  name: string;
  categoryName: string;
  price: number;
  inStock: boolean;
  isActive: boolean;
  sortOrder: number;
};

export function ProductsAdminClient({
  initial,
}: {
  initial: ProductAdminRow[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    setRows(initial);
  }, [initial]);

  const dirty = useMemo(() => {
    const map = Object.fromEntries(initial.map((r) => [r.id, r]));
    return rows.filter((r) => {
      const orig = map[r.id];
      if (!orig) return true;
      return (
        orig.price !== r.price ||
        orig.inStock !== r.inStock ||
        orig.isActive !== r.isActive ||
        orig.sortOrder !== r.sortOrder ||
        orig.name !== r.name
      );
    });
  }, [rows, initial]);

  const visible = useMemo(() => {
    if (!q.trim()) return rows;
    const needle = q.trim().toLowerCase();
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.categoryName.toLowerCase().includes(needle)
    );
  }, [rows, q]);

  function patch(id: string, next: Partial<ProductAdminRow>) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...next } : r))
    );
  }

  async function saveBulk() {
    if (dirty.length === 0) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/products/bulk", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows: dirty.map((r) => ({
            id: r.id,
            name: r.name,
            price: r.price,
            inStock: r.inStock,
            isActive: r.isActive,
            sortOrder: r.sortOrder,
          })),
        }),
      });
      const data = (await res.json()) as { updated?: number; error?: string };
      if (!res.ok) throw new Error(data.error || "Kayıt başarısız");
      setMessage(`${data.updated ?? dirty.length} ürün güncellendi.`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Toplu kayıt hatası");
    } finally {
      setSaving(false);
    }
  }

  async function onImport(file: File) {
    setImporting(true);
    setError(null);
    setMessage(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/products/import", {
        method: "POST",
        body: form,
      });
      const data = (await res.json()) as {
        created?: number;
        updated?: number;
        errors?: string[];
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || "İçe aktarma başarısız");
      const errCount = data.errors?.length ?? 0;
      setMessage(
        `Excel: ${data.created ?? 0} yeni, ${data.updated ?? 0} güncellendi` +
          (errCount ? ` · ${errCount} satır uyarısı` : "")
      );
      if (data.errors?.length) {
        setError(data.errors.slice(0, 5).join(" · "));
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Excel hatası");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="admin-card p-4 flex flex-col lg:flex-row gap-3 lg:items-center">
        <input
          className="admin-input flex-1"
          placeholder="Ürün veya kategori ara…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          <a
            href="/api/products/import"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-[#333] text-[#ccc] hover:text-white rounded-lg"
          >
            <Download size={16} /> Excel indir
          </a>
          <label className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-[#333] text-[#ccc] hover:text-white rounded-lg cursor-pointer">
            <Upload size={16} />
            {importing ? "Yükleniyor…" : "Excel yükle"}
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="sr-only"
              disabled={importing}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onImport(f);
                e.target.value = "";
              }}
            />
          </label>
          <button
            type="button"
            disabled={saving || dirty.length === 0}
            onClick={() => void saveBulk()}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-orange text-white rounded-lg hover:bg-orange-dark disabled:opacity-40"
          >
            <Save size={16} />
            Toplu kaydet ({dirty.length})
          </button>
        </div>
      </div>

      <p className="text-xs text-[#666]">
        Excel sütunları: id, name, slug, categorySlug, price, shortDesc,
        description, image, sortOrder, isActive, inStock. id veya slug eşleşirse
        güncellenir; yoksa yeni ürün oluşur.
      </p>

      {message && <p className="text-sm text-green-400">{message}</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="border-b border-[#333] text-left text-[#888]">
              <th className="p-3">Ürün</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Fiyat</th>
              <th className="p-3">Sıra</th>
              <th className="p-3">Stok</th>
              <th className="p-3">Durum</th>
              <th className="p-3">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((p) => (
              <tr key={p.id} className="border-b border-[#222] hover:bg-white/5">
                <td className="p-2">
                  <input
                    className="admin-input py-1.5 text-sm"
                    value={p.name}
                    onChange={(e) => patch(p.id, { name: e.target.value })}
                  />
                </td>
                <td className="p-3 text-[#aaa] whitespace-nowrap">
                  {p.categoryName}
                </td>
                <td className="p-2 w-28">
                  <input
                    type="number"
                    min={0}
                    className="admin-input py-1.5 text-sm text-orange"
                    value={p.price}
                    onChange={(e) =>
                      patch(p.id, { price: Number(e.target.value) || 0 })
                    }
                  />
                  <p className="text-[10px] text-[#666] mt-0.5">
                    {formatPrice(p.price)}
                  </p>
                </td>
                <td className="p-2 w-20">
                  <input
                    type="number"
                    className="admin-input py-1.5 text-sm"
                    value={p.sortOrder}
                    onChange={(e) =>
                      patch(p.id, { sortOrder: Number(e.target.value) || 0 })
                    }
                  />
                </td>
                <td className="p-3">
                  <label className="inline-flex items-center gap-2 text-xs text-[#ccc] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={p.inStock}
                      onChange={(e) =>
                        patch(p.id, { inStock: e.target.checked })
                      }
                    />
                    Var
                  </label>
                </td>
                <td className="p-3">
                  <label className="inline-flex items-center gap-2 text-xs text-[#ccc] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={p.isActive}
                      onChange={(e) =>
                        patch(p.id, { isActive: e.target.checked })
                      }
                    />
                    Aktif
                  </label>
                </td>
                <td className="p-3 flex gap-2 whitespace-nowrap">
                  <Link
                    href={`/admin/urunler/${p.id}`}
                    className="text-orange hover:underline"
                  >
                    Detay
                  </Link>
                  <ProductDeleteButton id={p.id} name={p.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && (
          <p className="p-6 text-[#666] text-center">Ürün bulunamadı.</p>
        )}
      </div>
    </div>
  );
}
