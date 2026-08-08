"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

type NavRow = {
  id: string;
  label: string;
  href: string;
  sortOrder: number;
  isActive: boolean;
};

export function NavEditorPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [items, setItems] = useState<NavRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/nav");
        const data = (await res.json()) as NavRow[];
        setItems(Array.isArray(data) ? data : []);
      } catch {
        setError("Menü yüklenemedi");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function saveRow(row: NavRow) {
    setSavingId(row.id);
    setError(null);
    try {
      const res = await fetch(`/api/nav/${row.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: row.label,
          href: row.href,
          sortOrder: row.sortOrder,
          isActive: row.isActive,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Kayıt başarısız");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Kapat"
        onClick={onClose}
      />
      <aside className="relative h-full w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="font-display text-lg font-bold text-white">Menüyü yönet</h2>
            <p className="text-xs text-muted mt-1">
              Üst menü etiketleri ve linkleri. Yeni öğe eklemek için Admin → Menüler.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-muted hover:text-white"
            aria-label="Kapat"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading && <p className="text-sm text-muted">Yükleniyor…</p>}
          {error && <p className="text-sm text-red-400">{error}</p>}
          {items.map((item) => (
            <div key={item.id} className="border border-border p-3 space-y-2 bg-black/30">
              <label className="block text-xs text-muted">
                Etiket
                <input
                  className="admin-input mt-1"
                  value={item.label}
                  onChange={(e) =>
                    setItems((rows) =>
                      rows.map((r) =>
                        r.id === item.id ? { ...r, label: e.target.value } : r
                      )
                    )
                  }
                />
              </label>
              <label className="block text-xs text-muted">
                Link (örn. /projeler)
                <input
                  className="admin-input mt-1"
                  value={item.href}
                  onChange={(e) =>
                    setItems((rows) =>
                      rows.map((r) =>
                        r.id === item.id ? { ...r, href: e.target.value } : r
                      )
                    )
                  }
                />
              </label>
              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-xs text-muted">
                  <input
                    type="checkbox"
                    checked={item.isActive}
                    onChange={(e) =>
                      setItems((rows) =>
                        rows.map((r) =>
                          r.id === item.id
                            ? { ...r, isActive: e.target.checked }
                            : r
                        )
                      )
                    }
                  />
                  Aktif
                </label>
                <button
                  type="button"
                  disabled={savingId === item.id}
                  onClick={() => void saveRow(item)}
                  className="px-3 py-1.5 bg-orange text-white text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
                >
                  {savingId === item.id ? "…" : "Kaydet"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
