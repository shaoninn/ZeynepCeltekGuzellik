import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin, isUnauthorized } from "@/lib/api";
import { revalidateCategories } from "@/lib/revalidate";

const rowSchema = z.object({
  id: z.string().min(1),
  price: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
  inStock: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  name: z.string().min(2).optional(),
});

const bodySchema = z.object({
  rows: z.array(rowSchema).min(1),
});

/** Inline toplu güncelleme (fiyat / stok / aktif / sıra) */
export async function PUT(request: NextRequest) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const body = bodySchema.parse(await request.json());
    let updated = 0;

    for (const row of body.rows) {
      const { id, ...patch } = row;
      const data: Record<string, unknown> = {};
      if (patch.price != null) data.price = patch.price;
      if (patch.isActive != null) data.isActive = patch.isActive;
      if (patch.inStock != null) data.inStock = patch.inStock;
      if (patch.sortOrder != null) data.sortOrder = patch.sortOrder;
      if (patch.name != null) data.name = patch.name;
      if (Object.keys(data).length === 0) continue;

      await prisma.product.update({ where: { id }, data });
      updated += 1;
    }

    revalidateCategories();
    return NextResponse.json({ updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Toplu güncelleme başarısız" },
      { status: 500 }
    );
  }
}
