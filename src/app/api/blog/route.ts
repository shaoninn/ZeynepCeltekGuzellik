import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin, isUnauthorized } from "@/lib/api";
import { revalidateBlog } from "@/lib/revalidate";

const blogSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(10, "İçerik en az 10 karakter"),
  image: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
});

export async function GET() {
  const auth = await requireAdmin();
  const isAdmin = !isUnauthorized(auth);

  const posts = await prisma.blogPost.findMany({
    where: isAdmin ? undefined : { isPublished: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const body = await request.json();
    const data = blogSchema.parse(body);

    const existing = await prisma.blogPost.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Bu slug zaten kullanılıyor." },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        ...data,
        publishedAt: data.isPublished ? new Date() : null,
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
    return NextResponse.json({ error: "Yazı oluşturulamadı" }, { status: 500 });
  }
}
