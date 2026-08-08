import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin, isUnauthorized } from "@/lib/api";
import { WORKFLOW_STEPS } from "@/lib/order-workflow";

const workflowIds = WORKFLOW_STEPS.map((s) => s.id) as [string, ...string[]];

const updateSchema = z
  .object({
    status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]).optional(),
    workflow: z.enum(workflowIds).optional(),
    productionNotes: z.string().max(5000).optional().nullable(),
    productionFile: z.string().max(2000).optional().nullable(),
    paymentStatus: z
      .enum(["UNPAID", "PENDING", "PAID", "REFUNDED"])
      .optional(),
    mountAt: z.string().optional().nullable(),
    mountNote: z.string().max(2000).optional().nullable(),
  })
  .refine(
    (d) =>
      d.status != null ||
      d.workflow != null ||
      d.productionNotes !== undefined ||
      d.productionFile !== undefined ||
      d.paymentStatus != null ||
      d.mountAt !== undefined ||
      d.mountNote !== undefined,
    { message: "Güncellenecek alan gerekli" }
  );

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) {
    return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const { id } = await params;
    const body = await request.json();
    const data = updateSchema.parse(body);

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(data.status != null ? { status: data.status } : {}),
        ...(data.workflow != null ? { workflow: data.workflow } : {}),
        ...(data.productionNotes !== undefined
          ? { productionNotes: data.productionNotes }
          : {}),
        ...(data.productionFile !== undefined
          ? { productionFile: data.productionFile }
          : {}),
        ...(data.paymentStatus != null
          ? { paymentStatus: data.paymentStatus }
          : {}),
        ...(data.mountAt !== undefined
          ? {
              mountAt:
                data.mountAt && data.mountAt.length > 0
                  ? new Date(data.mountAt)
                  : null,
            }
          : {}),
        ...(data.mountNote !== undefined ? { mountNote: data.mountNote } : {}),
      },
      include: { items: true },
    });
    return NextResponse.json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Sipariş güncellenemedi" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const { id } = await params;
    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Sipariş silinemedi" }, { status: 500 });
  }
}
