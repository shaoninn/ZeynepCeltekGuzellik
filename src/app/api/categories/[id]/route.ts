import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin, isUnauthorized } from "@/lib/api";
import { revalidateCategories } from "@/lib/revalidate";

const categorySchema = z.object({
  name: z.string().min(2, "Kategori adı en az 2 karakter"),
  slug: z.string().min(2, "Slug en az 2 karakter"),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const { id } = await params;
    const body = await request.json();
    const data = categorySchema.parse(body);

    const slugTaken = await prisma.category.findFirst({
      where: { slug: data.slug, NOT: { id } },
    });
    if (slugTaken) {
      return NextResponse.json(
        { error: "Bu slug başka bir kategoride kullanılıyor." },
        { status: 400 }
      );
    }

    const category = await prisma.category.update({
      where: { id },
      data,
    });
    revalidateCategories();
    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Kategori güncellenemedi" }, { status: 500 });
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
    const count = await prisma.product.count({ where: { categoryId: id } });
    if (count > 0) {
      return NextResponse.json(
        {
          error: `Bu kategoride ${count} ürün var. Önce ürünleri başka kategoriye taşıyın veya silin.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });
    revalidateCategories();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Kategori silinemedi" }, { status: 500 });
  }
}
