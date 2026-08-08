import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin, isUnauthorized } from "@/lib/api";
import { revalidateProjects } from "@/lib/revalidate";

const projectSchema = z.object({
  title: z.string().min(2, "Başlık en az 2 karakter"),
  slug: z.string().min(2, "Slug en az 2 karakter"),
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

export async function GET() {
  const auth = await requireAdmin();
  const isAdmin = !isUnauthorized(auth);

  const projects = await prisma.project.findMany({
    where: isAdmin ? undefined : { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { category: true },
  });
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const body = await request.json();
    const data = projectSchema.parse(body);

    const existing = await prisma.project.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Bu slug zaten kullanılıyor." },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({ data });
    revalidateProjects();
    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Proje oluşturulamadı" }, { status: 500 });
  }
}
