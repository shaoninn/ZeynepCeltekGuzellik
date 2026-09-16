import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { workflowLabel } from "@/lib/order-workflow";
import { AdminPrintButton } from "./AdminPrintButton";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderPrintPage({ params }: Props) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-6 print:hidden">
          <Link
            href={`/admin/siparisler/${order.id}`}
            className="text-sm text-orange hover:underline"
          >
            ← Sipariş detayı
          </Link>
          <AdminPrintButton />
        </div>

        <header className="border-b border-gray-300 pb-6 mb-6">
          <h1 className="text-2xl font-bold">Zeynep Çeltek Güzellik — Teklif (Admin)</h1>
          <p className="text-sm text-gray-600 mt-2">
            {order.orderNo} · {new Date(order.createdAt).toLocaleDateString("tr-TR")}
          </p>
        </header>

        <section className="mb-6 text-sm space-y-1">
          <p>
            <strong>Müşteri:</strong> {order.name}
          </p>
          <p>
            <strong>Telefon:</strong> {order.phone}
          </p>
          {order.email && (
            <p>
              <strong>E-posta:</strong> {order.email}
            </p>
          )}
          {order.address && (
            <p>
              <strong>Adres:</strong> {order.address}
            </p>
          )}
          {order.note && (
            <p>
              <strong>Not:</strong> {order.note}
            </p>
          )}
          <p>
            <strong>Durum:</strong> {order.status} · {workflowLabel(order.workflow)}
          </p>
          <p>
            <strong>Ödeme:</strong> {order.paymentStatus}
          </p>
        </section>

        <table className="w-full text-sm mb-6 border-collapse">
          <thead>
            <tr className="border-b border-gray-400">
              <th className="text-left py-2">Hizmet</th>
              <th className="text-right py-2">Adet</th>
              <th className="text-right py-2">Birim</th>
              <th className="text-right py-2">Tutar</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-2">
                    {item.productName}
                    {item.optionsNote ? (
                      <span className="block text-xs text-gray-500">
                        {item.optionsNote}
                      </span>
                    ) : null}
                  </td>
                  <td className="text-right py-2">{item.quantity}</td>
                  <td className="text-right py-2">{formatPrice(item.unitPrice)}</td>
                  <td className="text-right py-2">{formatPrice(item.lineTotal)}</td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="flex justify-between font-bold text-lg border-t border-gray-400 pt-4">
          <span>Toplam</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <style>{`
        @media print {
          nav, header, aside, .print\\:hidden { display: none !important; }
          body { background: white !important; color: black !important; }
        }
      `}</style>
    </div>
  );
}
