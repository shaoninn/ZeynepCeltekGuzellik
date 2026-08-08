"use client";

import { useRouter } from "next/navigation";
import { AdminButton, apiJson } from "@/components/admin/AdminForm";

export function OrderStatusActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();

  async function setStatus(next: string) {
    if (
      next === "CANCELLED" &&
      !confirm("Siparişi iptal etmek istediğinize emin misiniz?")
    ) {
      return;
    }
    await apiJson(`/api/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: next }),
    });
    router.refresh();
  }

  async function remove() {
    if (
      !confirm(
        "Bu siparişi kalıcı olarak silmek istediğinize emin misiniz? Geri alınamaz."
      )
    ) {
      return;
    }
    await apiJson(`/api/orders/${id}`, { method: "DELETE" });
    router.push("/admin/siparisler");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-3">
      <AdminButton
        variant={status === "CONFIRMED" ? "primary" : "ghost"}
        onClick={() => setStatus("CONFIRMED")}
      >
        Onayla
      </AdminButton>
      <AdminButton
        variant={status === "PENDING" ? "primary" : "ghost"}
        onClick={() => setStatus("PENDING")}
      >
        Beklemede
      </AdminButton>
      <AdminButton variant="danger" onClick={() => setStatus("CANCELLED")}>
        İptal Et
      </AdminButton>
      <AdminButton variant="danger" onClick={() => void remove()}>
        Siparişi sil
      </AdminButton>
    </div>
  );
}
