import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import {
  isPaytrConfigured,
  requestPaytrIframeToken,
} from "@/lib/paytr";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  orderNo: z.string().min(4).max(64),
  phone: z.string().min(10).max(32),
});

/**
 * POST /api/payments/paytr/init
 * Body: { orderNo, phone } — creates PayTR iframe token for an existing order.
 */
export async function POST(request: NextRequest) {
  if (!isPaytrConfigured()) {
    return NextResponse.json(
      {
        error:
          "PayTR henüz yapılandırılmadı. Mağaza bilgileri eklendikten sonra kart ödemesi açılacak.",
        code: "not_configured",
      },
      { status: 503 }
    );
  }

  const ip = clientIp(request);
  const limited = rateLimit(`paytr-init:${ip}`, 12, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Çok fazla istek. Lütfen biraz sonra tekrar deneyin." },
      { status: 429 }
    );
  }

  try {
    const body = schema.parse(await request.json());
    const order = await prisma.order.findUnique({
      where: { orderNo: body.orderNo },
      include: { items: true },
    });
    if (!order) {
      return NextResponse.json({ error: "Talep bulunamadı" }, { status: 404 });
    }

    const norm = (s: string) => s.replace(/\D/g, "");
    const phoneOk =
      norm(order.phone).endsWith(norm(body.phone).slice(-10)) ||
      norm(body.phone).endsWith(norm(order.phone).slice(-10));
    if (!phoneOk) {
      return NextResponse.json({ error: "Telefon eşleşmedi" }, { status: 403 });
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json(
        { error: "Bu talep için ödeme zaten alınmış." },
        { status: 400 }
      );
    }
    if (order.status === "CANCELLED") {
      return NextResponse.json(
        { error: "İptal edilmiş talep için ödeme yapılamaz." },
        { status: 400 }
      );
    }

    const email =
      order.email?.trim() ||
      `${norm(order.phone).slice(-10)}@paytr.placeholder.local`;

    const result = await requestPaytrIframeToken({
      orderNo: order.orderNo,
      email,
      userName: order.name,
      userPhone: order.phone,
      userAddress: order.address || "Adana",
      userIp: ip === "unknown" ? "127.0.0.1" : ip,
      paymentAmountTl: order.total,
      basket:
        order.items.length > 0
          ? order.items.map((i) => ({
              name: i.productName,
              priceTl: i.unitPrice,
              quantity: i.quantity,
            }))
          : [
              {
                name: `Randevu ${order.orderNo}`,
                priceTl: order.total,
                quantity: 1,
              },
            ],
    });

    if (!result.ok) {
      return NextResponse.json(
        {
          error: "PayTR oturumu açılamadı.",
          code: result.reason,
          detail: result.detail,
        },
        { status: 502 }
      );
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "PENDING",
        paymentProvider: "PAYTR",
        paymentRef: result.merchantOid,
      },
    });

    return NextResponse.json({
      success: true,
      iframeToken: result.iframeToken,
      merchantOid: result.merchantOid,
      orderNo: order.orderNo,
      total: order.total,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: e.issues[0]?.message || "Geçersiz istek" },
        { status: 400 }
      );
    }
    console.error("[paytr/init]", e);
    return NextResponse.json({ error: "Ödeme başlatılamadı" }, { status: 500 });
  }
}
