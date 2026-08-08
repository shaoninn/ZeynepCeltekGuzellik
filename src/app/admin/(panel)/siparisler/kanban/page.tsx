import Link from "next/link";
import { prisma } from "@/lib/db";
import { OrderKanban } from "@/components/admin/OrderKanban";

export const dynamic = "force-dynamic";

export default async function AdminOrdersKanbanPage() {
  const orders = await prisma.order.findMany({
    where: { status: { not: "CANCELLED" } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNo: true,
      name: true,
      phone: true,
      workflow: true,
      status: true,
      total: true,
      createdAt: true,
    },
  });

  const initial = orders.map((o) => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
  }));

  return (
    <div>
      <Link
        href="/admin/siparisler"
        className="text-sm text-orange hover:underline mb-4 inline-block"
      >
        ← Liste görünümü
      </Link>
      <h1 className="font-display text-3xl font-bold mb-2">
        Sipariş Panosu (Kanban)
      </h1>
      <p className="text-sm text-[#888] mb-6">
        Teklif / siparişleri üretim aşamalarına göre sütunlarda yönetin. İleri
        / geri ile aşama değiştirin.
      </p>
      <OrderKanban initialOrders={initial} />
    </div>
  );
}
