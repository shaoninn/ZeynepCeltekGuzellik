import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const lookupSchema = z.object({
  phone: z.string().min(10, "Geçerli bir telefon numarası girin"),
  orderNo: z.string().min(4, "Sipariş numarası gerekli"),
});

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const limited = rateLimit(`quote-lookup:${ip}`, 10, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { phone, orderNo } = lookupSchema.parse(body);

    const order = await prisma.order.findUnique({
      where: { orderNo: orderNo.trim() },
      include: { items: true },
    });

    const phoneNorm = normalizePhone(phone);
    const orderPhoneNorm = order ? normalizePhone(order.phone) : "";
    const phoneOk =
      order &&
      (orderPhoneNorm === phoneNorm ||
        orderPhoneNorm.endsWith(phoneNorm.slice(-10)) ||
        phoneNorm.endsWith(orderPhoneNorm.slice(-10)));

    if (!order || !phoneOk) {
      return NextResponse.json(
        { error: "Bu bilgilerle eşleşen teklif bulunamadı." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      orderNo: order.orderNo,
      name: order.name,
      status: order.status,
      workflow: order.workflow,
      paymentStatus: order.paymentStatus,
      invoiceNo: order.invoiceNo,
      mountAt: order.mountAt?.toISOString() ?? null,
      mountNote: order.mountNote,
      total: order.total,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
        widthCm: item.widthCm,
        heightCm: item.heightCm,
        color: item.color,
      })),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Sorgu yapılamadı" },
      { status: 500 }
    );
  }
}
