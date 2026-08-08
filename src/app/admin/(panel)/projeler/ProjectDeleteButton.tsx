"use client";

import { useRouter } from "next/navigation";
import { apiJson } from "@/components/admin/AdminForm";

export function ProjectDeleteButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="text-red-400"
      onClick={async () => {
        if (!confirm(`"${title}" projesini silmek istediğinize emin misiniz?`))
          return;
        try {
          await apiJson(`/api/projects/${id}`, { method: "DELETE" });
          router.refresh();
        } catch (err) {
          alert(err instanceof Error ? err.message : "Silinemedi");
        }
      }}
    >
      Sil
    </button>
  );
}
