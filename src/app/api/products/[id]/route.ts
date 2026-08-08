import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const productUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().optional().nullable(),
  shortDesc: z.string().optional().nullable(),
  price: z.number().min(0).optional(),
  salePrice: z.number().min(0).optional().nullable(),
  image: z.string().nullable().optional(),
  nightImage: z.string().nullable().optional(),
  images: z.string().optional(),
  specs: z.string().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  inStock: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  badgeNew: z.boolean().optional(),
  badgeBestseller: z.boolean().optional(),
  badgeSale: z.boolean().optional(),
  shippingLabel: z.string().max(120).optional().nullable(),
  campaignEndsAt: z.string().optional().nullable(),
  categoryId: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const data = productUpdateSchema.parse(body);
    const { campaignEndsAt, ...rest } = data;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(campaignEndsAt !== undefined
          ? {
              campaignEndsAt:
                campaignEndsAt && campaignEndsAt.length > 0
                  ? new Date(campaignEndsAt)
                  : null,
            }
          : {}),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Ürün güncellenemedi" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ürün silinemedi" }, { status: 500 });
  }
}
