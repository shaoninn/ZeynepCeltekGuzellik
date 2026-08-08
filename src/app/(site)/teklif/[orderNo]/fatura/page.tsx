import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { SITE_NAME, ADDRESS, PHONE, EMAIL } from "@/lib/constants";
import { PrintActions } from "../yazdir/PrintActions";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ orderNo: string }>;
  searchParams: Promise<{ phone?: string }>;
}

export default async function InvoicePage({ params, searchParams }: Props) {
  const { orderNo } = await params;
  const { phone } = await searchParams;
  if (!phone) notFound();

  const order = await prisma.order.findUnique({
    where: { orderNo: decodeURIComponent(orderNo) },
    include: { items: true },
  });
  if (!order) notFound();

  const norm = (s: string) => s.replace(/\D/g, "");
  const ok =
    norm(order.phone).endsWith(norm(phone).slice(-10)) ||
    norm(phone).endsWith(norm(order.phone).slice(-10));
  if (!ok) notFound();

  return (
    <div className="min-h-screen bg-white text-black p-6 sm:p-10 print:p-0">
      <div className="max-w-3xl mx-auto">
        <PrintActions />
        <header className="border-b-2 border-black pb-4 mb-6">
          <h1 className="text-2xl font-bold">{SITE_NAME}</h1>
          <p className="text-sm">{ADDRESS}</p>
          <p className="text-sm">
            {PHONE} · {EMAIL}
          </p>
          <p className="mt-4 text-lg font-semibold">
            Fatura taslağı — {order.invoiceNo || order.orderNo}
          </p>
          <p className="text-xs text-neutral-600">
            Bu bir ön fatura / teklif dökümüdür; resmi e-fatura entegrasyonu
            sonradan bağlanır.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <p className="font-semibold">Müşteri</p>
            <p>{order.name}</p>
            <p>{order.phone}</p>
            {order.email && <p>{order.email}</p>}
            {order.address && <p>{order.address}</p>}
          </div>
          <div>
            <p>
              <span className="font-semibold">Teklif no:</span> {order.orderNo}
            </p>
            <p>
              <span className="font-semibold">Tarih:</span>{" "}
              {order.createdAt.toLocaleDateString("tr-TR")}
            </p>
            <p>
              <span className="font-semibold">Ödeme:</span> {order.paymentStatus}
            </p>
          </div>
        </div>

        <table className="w-full text-sm border-collapse mb-6">
          <thead>
            <tr className="border-b-2 border-black text-left">
              <th className="py-2">Kalem</th>
              <th className="py-2 text-center">Adet</th>
              <th className="py-2 text-right">Tutar</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-neutral-300">
                <td className="py-2">
                  {item.productName}
                  {(item.widthCm || item.color) && (
                    <span className="block text-xs text-neutral-600">
                      {[
                        item.widthCm != null ? `${item.widthCm}×${item.heightCm ?? "?"} cm` : null,
                        item.color,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  )}
                </td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-right">{formatPrice(item.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-right text-lg font-bold">
          Toplam: {formatPrice(order.total)}
        </p>
      </div>
    </div>
  );
}
