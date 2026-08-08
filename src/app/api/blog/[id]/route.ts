import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin, isUnauthorized } from "@/lib/api";
import { revalidateBlog } from "@/lib/revalidate";

const blogSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(10),
  image: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
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
    const data = blogSchema.parse(body);

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Yazı bulunamadı" }, { status: 404 });
    }

    const slugTaken = await prisma.blogPost.findFirst({
      where: { slug: data.slug, NOT: { id } },
    });
    if (slugTaken) {
      return NextResponse.json(
        { error: "Bu slug başka bir yazıda kullanılıyor." },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...data,
        publishedAt:
          data.isPublished && !existing.publishedAt
            ? new Date()
            : existing.publishedAt,
      },
    });
    revalidateBlog();
    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Yazı güncellenemedi" }, { status: 500 });
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
    await prisma.blogPost.delete({ where: { id } });
    revalidateBlog();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Yazı silinemedi" }, { status: 500 });
  }
}
