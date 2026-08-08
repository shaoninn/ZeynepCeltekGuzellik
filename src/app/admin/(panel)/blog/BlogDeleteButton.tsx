"use client";

import { useRouter } from "next/navigation";
import { apiJson } from "@/components/admin/AdminForm";

export function BlogDeleteButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="text-red-400"
      onClick={async () => {
        if (!confirm(`"${title}" yazısını silmek istediğinize emin misiniz?`)) return;
        await apiJson(`/api/blog/${id}`, { method: "DELETE" });
        router.refresh();
      }}
    >
      Sil
    </button>
  );
}
