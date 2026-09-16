import { prisma } from "@/lib/db";
import { OrdersClient } from "./OrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
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
    branch: o.branch,
    total: o.total,
    createdAt: o.createdAt.toISOString(),
    itemCount: o.items.length,
  }));

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-2">Randevu talepleri</h1>
      <p className="text-sm text-[#888] mb-2">
        Ödeme henüz aktif değil. Bu kayıtlar randevu / teklif talepleridir.
        Tarih ve durum ile filtreleyin; eski kayıtları silerek karışıklığı
        azaltın.
      </p>
      <p className="mb-6">
        <a
          href="/admin/siparisler/kanban"
          className="text-sm text-orange hover:underline"
        >
          Talep panosu →
        </a>
      </p>
      <OrdersClient initial={initial} initialQ={q?.trim() || ""} />
    </div>
  );
}
