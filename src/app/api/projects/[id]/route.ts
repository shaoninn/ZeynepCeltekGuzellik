import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin, isUnauthorized } from "@/lib/api";
import { revalidateProjects } from "@/lib/revalidate";

const projectSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  imageBefore: z.string().optional().nullable(),
  images: z.string().optional(),
  location: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  categoryId: z.string().optional().nullable(),
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
    const data = projectSchema.parse(body);

    const slugTaken = await prisma.project.findFirst({
      where: { slug: data.slug, NOT: { id } },
    });
    if (slugTaken) {
      return NextResponse.json(
        { error: "Bu slug başka bir projede kullanılıyor." },
        { status: 400 }
      );
    }

    const project = await prisma.project.update({ where: { id }, data });
    revalidateProjects();
    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Proje güncellenemedi" }, { status: 500 });
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
    await prisma.project.delete({ where: { id } });
    revalidateProjects();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Proje silinemedi" }, { status: 500 });
  }
}
