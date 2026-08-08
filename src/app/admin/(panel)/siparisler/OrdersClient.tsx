"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Trash2 } from "lucide-react";

export type OrderListItem = {
  id: string;
  orderNo: string;
  name: string;
  phone: string;
  status: string;
  total: number;
  createdAt: string;
  itemCount: number;
};

const statusLabel: Record<string, string> = {
  PENDING: "Beklemede",
  CONFIRMED: "Onaylandı",
  CANCELLED: "İptal",
};

function toDateInputValue(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function OrdersClient({ initial }: { initial: OrderListItem[] }) {
  const router = useRouter();
  const [status, setStatus] = useState("ALL");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return initial.filter((o) => {
      if (status !== "ALL" && o.status !== status) return false;
      const created = new Date(o.createdAt);
      if (from) {
        const start = new Date(`${from}T00:00:00`);
        if (created < start) return false;
      }
      if (to) {
        const end = new Date(`${to}T23:59:59.999`);
        if (created > end) return false;
      }
      if (q.trim()) {
        const needle = q.trim().toLowerCase();
        const hay = `${o.orderNo} ${o.name} ${o.phone}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [initial, status, from, to, q]);

  async function deleteOrder(id: string, orderNo: string) {
    if (
      !confirm(
        `${orderNo} silinsin mi? Bu işlem geri alınamaz (kalemler de silinir).`
      )
    ) {
      return;
    }
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Silinemedi");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Silme hatası");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteFilteredOlder() {
    const ids = filtered.map((o) => o.id);
    if (ids.length === 0) {
      setError("Filtrelenen sipariş yok.");
      return;
    }
    if (
      !confirm(
        `Filtrelenen ${ids.length} sipariş silinsin mi? Bu işlem geri alınamaz.`
      )
    ) {
      return;
    }
    setError(null);
    setBusyId("bulk");
    try {
      for (const id of ids) {
        const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          throw new Error(data.error || "Toplu silme başarısız");
        }
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Toplu silme hatası");
    } finally {
      setBusyId(null);
    }
  }

  function setLastDays(days: number) {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (days - 1));
    setFrom(toDateInputValue(start));
    setTo(toDateInputValue(end));
  }

  return (
    <div>
      <div className="admin-card p-4 mb-6 space-y-3">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-[#888] mb-1">Durum</label>
            <select
              className="admin-input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="ALL">Tümü</option>
              <option value="PENDING">Beklemede</option>
              <option value="CONFIRMED">Onaylandı</option>
              <option value="CANCELLED">İptal</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#888] mb-1">Başlangıç</label>
            <input
              type="date"
              className="admin-input"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-[#888] mb-1">Bitiş</label>
            <input
              type="date"
              className="admin-input"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-[#888] mb-1">Ara</label>
            <input
              className="admin-input"
              placeholder="No / ad / telefon"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            type="button"
            onClick={() => setLastDays(7)}
            className="px-3 py-1.5 text-xs border border-[#333] text-[#aaa] hover:text-white rounded"
          >
            Son 7 gün
          </button>
          <button
            type="button"
            onClick={() => setLastDays(30)}
            className="px-3 py-1.5 text-xs border border-[#333] text-[#aaa] hover:text-white rounded"
          >
            Son 30 gün
          </button>
          <button
            type="button"
            onClick={() => {
              setStatus("ALL");
              setFrom("");
              setTo("");
              setQ("");
            }}
            className="px-3 py-1.5 text-xs border border-[#333] text-[#aaa] hover:text-white rounded"
          >
            Filtreleri temizle
          </button>
          <span className="text-xs text-[#666] ml-auto">
            {filtered.length} / {initial.length} sipariş
          </span>
          <button
            type="button"
            disabled={busyId === "bulk" || filtered.length === 0}
            onClick={() => void deleteFilteredOlder()}
            className="px-3 py-1.5 text-xs border border-red-500/40 text-red-400 hover:bg-red-500/10 rounded disabled:opacity-40"
          >
            Filtrelenenleri sil
          </button>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-[#666]">Filtreye uyan sipariş yok.</p>
        )}
        {filtered.map((o) => (
          <div
            key={o.id}
            className="admin-card p-4 flex flex-col sm:flex-row sm:items-center gap-3"
          >
            <Link
              href={`/admin/siparisler/${o.id}`}
              className="flex-1 min-w-0 hover:opacity-90"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">{o.orderNo}</p>
                  <p className="text-sm text-[#aaa]">
                    {o.name} · {o.phone}
                  </p>
                  <p className="text-xs text-[#666] mt-1">
                    {o.itemCount} kalem ·{" "}
                    {new Date(o.createdAt).toLocaleString("tr-TR")}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-orange font-bold">{formatPrice(o.total)}</p>
                  <p className="text-xs mt-1">
                    {statusLabel[o.status] || o.status}
                  </p>
                </div>
              </div>
            </Link>
            <button
              type="button"
              disabled={busyId === o.id}
              onClick={() => void deleteOrder(o.id, o.orderNo)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-red-400 border border-red-500/30 rounded hover:bg-red-500/10 disabled:opacity-40 shrink-0"
              title="Sil"
            >
              <Trash2 size={14} />
              Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
