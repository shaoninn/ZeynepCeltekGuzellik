import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin, isUnauthorized } from "@/lib/api";
import { revalidateSiteSettings } from "@/lib/revalidate";

const schema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  href: z.string().optional().nullable(),
  endsAt: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
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
    const row = await prisma.campaignOffer.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        image: data.image,
        href: data.href,
        endsAt: data.endsAt ? new Date(data.endsAt) : null,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
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
    return NextResponse.json({ error: "Kampanya güncellenemedi" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;
  const { id } = await params;
  await prisma.campaignOffer.delete({ where: { id } });
  revalidateSiteSettings();
  return NextResponse.json({ success: true });
}
