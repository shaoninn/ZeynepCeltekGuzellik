import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin, isUnauthorized } from "@/lib/api";
import { revalidateSiteSettings } from "@/lib/revalidate";

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  price: z.number().min(0),
  sessions: z.string().min(1),
  featured: z.boolean().optional(),
  badge: z.string().optional().nullable(),
  image: z.string().min(1),
  shortDesc: z.string().min(1),
  items: z.array(z.string()).optional(),
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
    const data = schema.parse(await request.json());
    const row = await prisma.servicePackage.update({
      where: { id },
      data: {
        ...data,
        items: data.items ? JSON.stringify(data.items) : undefined,
      },
    });
    revalidateSiteSettings();
    return NextResponse.json(row);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Paket güncellenemedi" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;
  const { id } = await params;
  await prisma.servicePackage.delete({ where: { id } });
  revalidateSiteSettings();
  return NextResponse.json({ success: true });
}
