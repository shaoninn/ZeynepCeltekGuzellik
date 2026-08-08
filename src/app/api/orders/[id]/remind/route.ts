import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, isUnauthorized } from "@/lib/api";
import { sendCrmReminder } from "@/lib/mail";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "Sipariş yok" }, { status: 404 });
  }

  const mail = await sendCrmReminder({
    orderNo: order.orderNo,
    name: order.name,
    phone: order.phone,
    email: order.email,
    total: order.total,
  });

  await prisma.order.update({
    where: { id },
    data: { reminderSent: true, reminderAt: new Date() },
  });

  return NextResponse.json({ ok: true, mail });
}
