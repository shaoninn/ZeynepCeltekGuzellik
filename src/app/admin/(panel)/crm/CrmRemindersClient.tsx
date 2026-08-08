"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { AdminButton, apiJson } from "@/components/admin/AdminForm";

export type ReminderOrder = {
  id: string;
  orderNo: string;
  name: string;
  phone: string;
  email: string | null;
  total: number;
  status: string;
  reminderAt: string | null;
  reminderSent: boolean;
  createdAt: string;
};

export function CrmRemindersClient({ initial }: { initial: ReminderOrder[] }) {
  const [rows, setRows] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function sendReminder(id: string) {
    setBusy(id);
    setMsg(null);
    try {
      await apiJson(`/api/orders/${id}/remind`, { method: "POST" });
      setRows((list) =>
        list.map((o) =>
          o.id === id ? { ...o, reminderSent: true } : o
        )
      );
      setMsg("Hatırlatma işlendi (e-posta yapılandırması varsa gönderildi).");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Hata");
    } finally {
      setBusy(null);
    }
  }

  function waUrl(phone: string, orderNo: string, name: string) {
    const digits = phone.replace(/\D/g, "");
    const to = digits.startsWith("90")
      ? digits
      : digits.startsWith("0")
        ? `90${digits.slice(1)}`
        : `90${digits}`;
    const text = encodeURIComponent(
      `Merhaba ${name}, ${orderNo} numaralı teklifiniz için kısa bir teyit görüşmesi yapabilir miyiz? — Zeynep Çeltek Güzellik`
    );
    return `https://wa.me/${to}?text=${text}`;
  }

  return (
    <div>
      {msg && <p className="text-sm text-[#888] mb-4">{msg}</p>}
      <div className="space-y-3">
        {rows.length === 0 && (
          <p className="text-sm text-[#888]">Hatırlatılacak teklif yok.</p>
        )}
        {rows.map((o) => (
          <div
            key={o.id}
            className="admin-card p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between"
          >
            <div className="min-w-0">
              <Link
                href={`/admin/siparisler/${o.id}`}
                className="text-orange font-semibold hover:underline"
              >
                {o.orderNo}
              </Link>
              <p className="text-sm text-white truncate">{o.name}</p>
              <p className="text-xs text-[#888]">
                {o.phone} · {formatPrice(o.total)} ·{" "}
                {o.reminderSent ? "Hatırlatıldı" : "Bekliyor"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <a
                href={waUrl(o.phone, o.orderNo, o.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs border border-[#25D366]/40 text-[#25D366] rounded"
              >
                WhatsApp 24s
              </a>
              <AdminButton
                loading={busy === o.id}
                onClick={() => void sendReminder(o.id)}
              >
                E-posta hatırlat
              </AdminButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
