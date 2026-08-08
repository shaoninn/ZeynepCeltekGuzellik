"use client";

import { useRouter } from "next/navigation";
import { apiJson } from "@/components/admin/AdminForm";

interface Msg {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export function MessagesClient({ initial }: { initial: Msg[] }) {
  const router = useRouter();

  async function markRead(id: string, isRead: boolean) {
    await apiJson("/api/messages", {
      method: "PUT",
      body: JSON.stringify({ id, isRead }),
    });
    router.refresh();
  }

  async function onDelete(id: string) {
    if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    await apiJson(`/api/messages?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {initial.length === 0 && (
        <p className="text-[#666]">Henüz mesaj yok.</p>
      )}
      {initial.map((m) => (
        <div
          key={m.id}
          className={`admin-card p-5 ${m.isRead ? "opacity-70" : "border-orange/30"}`}
        >
          <div className="flex justify-between gap-4 mb-2">
            <div>
              <p className="font-semibold text-white">
                {m.name}{" "}
                {!m.isRead && (
                  <span className="text-xs text-orange ml-2">Yeni</span>
                )}
              </p>
              <p className="text-xs text-[#666]">
                {m.phone}
                {m.email ? ` · ${m.email}` : ""} ·{" "}
                {new Date(m.createdAt).toLocaleString("tr-TR")}
              </p>
            </div>
            <div className="flex gap-2 text-sm shrink-0">
              <button
                type="button"
                className="text-orange"
                onClick={() => markRead(m.id, !m.isRead)}
              >
                {m.isRead ? "Okunmadı" : "Okundu"}
              </button>
              <button
                type="button"
                className="text-red-400"
                onClick={() => onDelete(m.id)}
              >
                Sil
              </button>
            </div>
          </div>
          {m.subject && (
            <p className="text-sm text-[#aaa] mb-1">Konu: {m.subject}</p>
          )}
          <p className="text-sm text-[#ccc] whitespace-pre-wrap">{m.message}</p>
        </div>
      ))}
    </div>
  );
}
