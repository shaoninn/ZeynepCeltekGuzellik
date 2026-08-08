import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { revalidateCategories } from "@/lib/revalidate";

async function requireAuth() {
  const session = await getSession();
  if (!session) {
    return null;
  }
  return session;
}

const categorySchema = z.object({
  name: z.string().min(2, "Kategori adı en az 2 karakter"),
  slug: z.string().min(2, "Slug en az 2 karakter"),
  description: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  const session = await getSession();
  const categories = await prisma.category.findMany({
    where: session ? undefined : { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = categorySchema.parse(body);

    const existing = await prisma.category.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Bu slug zaten kullanılıyor. Farklı bir slug deneyin." },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({ data });
    revalidateCategories();
    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Kategori oluşturulamadı" }, { status: 500 });
  }
}
