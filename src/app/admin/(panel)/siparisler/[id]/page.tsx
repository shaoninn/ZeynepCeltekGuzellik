import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { WHATSAPP_URL } from "@/lib/constants";
import { buildAdminWhatsAppMessage } from "@/lib/order-workflow";
import { OrderTimeline } from "@/components/admin/OrderTimeline";
import { OrderStatusActions } from "./OrderStatusActions";
import { OrderProductionPanel } from "./OrderProductionPanel";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  PENDING: "Beklemede",
  CONFIRMED: "Onaylandı",
  CANCELLED: "İptal",
};

const paymentLabel: Record<string, string> = {
  UNPAID: "Ödenmedi",
  PENDING: "Ödeme bekleniyor",
  PAID: "Ödendi",
  REFUNDED: "İade",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  const waText = encodeURIComponent(
    buildAdminWhatsAppMessage({
      orderNo: order.orderNo,
      name: order.name,
      phone: order.phone,
      total: order.total,
      items: order.items,
    })
  );
  const phoneDigits = order.phone.replace(/\D/g, "");
  const waTo = phoneDigits.startsWith("90")
    ? phoneDigits
    : phoneDigits.startsWith("0")
      ? `90${phoneDigits.slice(1)}`
      : phoneDigits.length === 10
        ? `90${phoneDigits}`
        : phoneDigits;
  const waHref = `https://wa.me/${waTo || WHATSAPP_URL.replace(/\D/g, "")}?text=${waText}`;

  return (
    <div>
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <Link
          href="/admin/siparisler"
          className="text-sm text-orange hover:underline"
        >
          ← Siparişlere dön
        </Link>
        <Link
          href="/admin/siparisler/kanban"
          className="text-sm text-[#888] hover:text-orange"
        >
          Sipariş Panosu
        </Link>
        <Link
          href={`/admin/siparisler/${order.id}/yazdir`}
          className="text-sm text-[#888] hover:text-orange"
        >
          Yazdır / PDF
        </Link>
      </div>
      <h1 className="font-display text-3xl font-bold mb-2">{order.orderNo}</h1>
      <p className="text-sm text-[#888] mb-4">
        Durum:{" "}
        <strong className="text-white">
          {statusLabel[order.status] || order.status}
        </strong>
        {" · "}
        Ödeme:{" "}
        <strong className="text-white">
          {paymentLabel[order.paymentStatus] || order.paymentStatus}
        </strong>
      </p>

      <div className="admin-card p-5 mb-6">
        <h2 className="font-semibold mb-3 text-sm uppercase tracking-wider text-[#888]">
          Üretim süreci
        </h2>
        <OrderTimeline current={order.workflow} />
      </div>

      <div className="admin-warning mb-6">
        Bu kayıt teklif talebidir. Online ödeme iskeleti hazır; sanal POS
        bağlanınca paymentStatus güncellenecek. Şimdilik müşteriyle telefon veya
        WhatsApp üzerinden iletişime geçin.
      </div>

      <div className="mb-6">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2.5 rounded-lg bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] text-sm font-semibold hover:bg-[#25D366]/25 transition-colors"
        >
          WhatsApp şablon mesajı aç
        </a>
      </div>

      <div className="admin-card p-5 mb-6 space-y-2 text-sm">
        <p>
          <span className="text-[#888]">Ad:</span> {order.name}
        </p>
        <p>
          <span className="text-[#888]">Telefon:</span> {order.phone}
        </p>
        {order.email && (
          <p>
            <span className="text-[#888]">E-posta:</span> {order.email}
          </p>
        )}
        {order.address && (
          <p>
            <span className="text-[#888]">Adres:</span> {order.address}
          </p>
        )}
        {order.note && (
          <p>
            <span className="text-[#888]">Not:</span> {order.note}
          </p>
        )}
        <p>
          <span className="text-[#888]">Kaynak:</span>{" "}
          {order.source === "WHATSAPP" ? "WhatsApp" : "Web form"}
        </p>
      </div>

      <div className="admin-card p-5 mb-6">
        <h2 className="font-semibold mb-3">Kalemler</h2>
        <ul className="space-y-2 text-sm">
          {order.items.map((item) => {
            const dims = [
              item.widthCm != null ? `En ${item.widthCm} cm` : null,
              item.heightCm != null ? `Boy ${item.heightCm} cm` : null,
              item.color || null,
            ]
              .filter(Boolean)
              .join(" · ");
            return (
              <li key={item.id} className="flex justify-between gap-4">
                <span>
                  {item.productName} × {item.quantity}
                  {dims ? (
                    <span className="block text-xs text-[#888]">{dims}</span>
                  ) : null}
                  {item.optionsNote ? (
                    <span className="block text-xs text-[#666] break-all">
                      {item.optionsNote}
                    </span>
                  ) : null}
                </span>
                <span className="text-orange shrink-0">
                  {formatPrice(item.lineTotal)}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="border-t border-[#333] mt-4 pt-4 flex justify-between font-bold">
          <span>Toplam</span>
          <span className="text-orange">{formatPrice(order.total)}</span>
        </div>
      </div>

      <OrderProductionPanel
        id={order.id}
        workflow={order.workflow}
        productionNotes={order.productionNotes}
        productionFile={order.productionFile}
        paymentStatus={order.paymentStatus}
        mountAt={order.mountAt?.toISOString() ?? null}
        mountNote={order.mountNote}
      />

      <div className="mt-6">
        <OrderStatusActions id={order.id} status={order.status} />
      </div>
    </div>
  );
}
