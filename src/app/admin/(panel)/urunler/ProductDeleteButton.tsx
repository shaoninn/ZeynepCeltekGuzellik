"use client";

import { useRouter } from "next/navigation";
import { apiJson } from "@/components/admin/AdminForm";

export function ProductDeleteButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();

  async function onDelete() {
    if (
      !confirm(
        `"${name}" ürününü silmek istediğinize emin misiniz?\n\nBu işlem geri alınamaz.`
      )
    ) {
      return;
    }
    try {
      await apiJson(`/api/products/${id}`, { method: "DELETE" });
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Silinemedi");
    }
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      className="text-red-400 hover:underline"
    >
      Sil
    </button>
  );
}
