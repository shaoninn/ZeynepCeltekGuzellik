import { prisma } from "@/lib/db";
import { OrdersClient } from "./OrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const initial = orders.map((o) => ({
    id: o.id,
    orderNo: o.orderNo,
    name: o.name,
    phone: o.phone,
    status: o.status,
    total: o.total,
    createdAt: o.createdAt.toISOString(),
    itemCount: o.items.length,
  }));

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-2">Siparişler</h1>
      <p className="text-sm text-[#888] mb-2">
        Ödeme henüz aktif değil. Bu kayıtlar teklif / sipariş talepleridir.
        Tarih ve durum ile filtreleyin; eski kayıtları silerek karışıklığı
        azaltın.
      </p>
      <p className="mb-6">
        <a
          href="/admin/siparisler/kanban"
          className="text-sm text-orange hover:underline"
        >
          Sipariş Panosu →
        </a>
      </p>
      <OrdersClient initial={initial} />
    </div>
  );
}
