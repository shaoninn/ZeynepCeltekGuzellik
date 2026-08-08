import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  phone: z.string().min(10),
  orderNo: z.string().min(4),
  mountAt: z.string().min(8),
  mountNote: z.string().max(1000).optional().nullable(),
});

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const limited = rateLimit(`quote-mount:${ip}`, 8, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Çok fazla istek" }, { status: 429 });
  }

  try {
    const body = schema.parse(await request.json());
    const order = await prisma.order.findUnique({
      where: { orderNo: body.orderNo.trim() },
    });
    const phoneNorm = normalizePhone(body.phone);
    const orderPhone = order ? normalizePhone(order.phone) : "";
    const ok =
      order &&
      (orderPhone === phoneNorm ||
        orderPhone.endsWith(phoneNorm.slice(-10)) ||
        phoneNorm.endsWith(orderPhone.slice(-10)));
    if (!order || !ok) {
      return NextResponse.json({ error: "Teklif bulunamadı" }, { status: 404 });
    }

    const mountAt = new Date(body.mountAt);
    if (Number.isNaN(mountAt.getTime())) {
      return NextResponse.json({ error: "Geçersiz tarih" }, { status: 400 });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        mountAt,
        mountNote: body.mountNote?.trim() || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Kayıt başarısız" }, { status: 500 });
  }
}
