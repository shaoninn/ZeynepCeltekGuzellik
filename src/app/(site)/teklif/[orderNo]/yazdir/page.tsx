import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { workflowLabel } from "@/lib/order-workflow";
import { PrintActions } from "./PrintActions";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ orderNo: string }>;
  searchParams: Promise<{ phone?: string }>;
}

export default async function PublicQuotePrintPage({ params, searchParams }: Props) {
  const { orderNo } = await params;
  const { phone } = await searchParams;

  if (!phone?.trim()) {
    return (
      <section className="py-16">
        <div className="max-w-lg mx-auto px-4 text-center">
          <h1 className="font-display text-2xl font-bold text-white mb-4">
            Teklif Yazdır
          </h1>
          <p className="text-muted text-sm">
            Güvenlik için telefon numaranızı URL&apos;de{" "}
            <code className="text-orange">?phone=...</code> parametresi ile
            belirtmeniz gerekir.
          </p>
        </div>
      </section>
    );
  }

  const normalized = phone.replace(/\D/g, "");
  const order = await prisma.order.findFirst({
    where: {
      orderNo: orderNo.trim(),
      phone: { contains: normalized.slice(-10) },
    },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div className="min-h-screen bg-white text-black print:bg-white">
      <div className="max-w-3xl mx-auto px-6 py-10 print:py-6">
        <PrintActions />

        <header className="border-b border-gray-300 pb-6 mb-6">
          <h1 className="text-2xl font-bold">Zeynep Çeltek Güzellik — Teklif</h1>
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
          <p>
            <strong>Aşama:</strong> {workflowLabel(order.workflow)}
          </p>
        </section>

        <table className="w-full text-sm mb-6 border-collapse">
          <thead>
            <tr className="border-b border-gray-400">
              <th className="text-left py-2">Ürün</th>
              <th className="text-right py-2">Adet</th>
              <th className="text-right py-2">Tutar</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => {
              const dims = [
                item.widthCm != null ? `${item.widthCm}×${item.heightCm ?? "?"} cm` : null,
                item.color || null,
              ]
                .filter(Boolean)
                .join(" · ");
              return (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-2">
                    {item.productName}
                    {dims && (
                      <span className="block text-xs text-gray-500">{dims}</span>
                    )}
                  </td>
                  <td className="text-right py-2">{item.quantity}</td>
                  <td className="text-right py-2">{formatPrice(item.lineTotal)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-between font-bold text-lg border-t border-gray-400 pt-4">
          <span>Toplam</span>
          <span>{formatPrice(order.total)}</span>
        </div>

        <p className="text-xs text-gray-500 mt-8 print:mt-12">
          Bu belge tahmini tekliftir. Kesin fiyat ölçü teyidi sonrası belirlenir.
        </p>
      </div>
    </div>
  );
}
