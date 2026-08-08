import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin, isUnauthorized } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { createQuoteOrder } from "@/lib/orders";

const orderItemSchema = z.object({
  productId: z.string().min(1, "Ürün kimliği gerekli"),
  quantity: z.number().int().min(1).max(99),
  widthCm: z.number().positive().max(20000).optional().nullable(),
  heightCm: z.number().positive().max(20000).optional().nullable(),
  color: z.string().max(80).optional().nullable(),
  optionsNote: z.string().max(500).optional().nullable(),
});

const createOrderSchema = z.object({
  name: z.string().min(2, "Ad soyad en az 2 karakter"),
  phone: z.string().min(10, "Geçerli bir telefon girin"),
  email: z.string().email("Geçerli e-posta girin").optional().or(z.literal("")),
  address: z.string().optional(),
  note: z.string().optional(),
  source: z.enum(["WEB", "WHATSAPP"]).optional(),
  kvkkAccepted: z
    .boolean()
    .refine((v) => v === true, { message: "KVKK onayı gerekli" }),
  wantPayment: z.boolean().optional(),
  items: z.array(orderItemSchema).min(1, "Sepet boş olamaz"),
});

export async function GET() {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const limited = rateLimit(`orders:${ip}`, 8, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Çok fazla istek. Lütfen biraz sonra tekrar deneyin." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const data = createOrderSchema.parse(body);

    const { order, mail } = await createQuoteOrder({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      address: data.address || null,
      note: data.note || null,
      source: data.source || "WEB",
      items: data.items,
      ip,
      wantPayment: data.wantPayment,
    });

    return NextResponse.json({
      success: true,
      order,
      emailSent: mail.sent,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message },
        { status: 400 }
      );
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Sipariş oluşturulamadı" }, { status: 500 });
  }
}
