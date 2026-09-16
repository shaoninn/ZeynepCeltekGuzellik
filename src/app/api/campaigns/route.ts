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

export async function GET() {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;
  const rows = await prisma.campaignOffer.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;
  try {
    const data = schema.parse(await request.json());
    const row = await prisma.campaignOffer.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        image: data.image,
        href: data.href,
        endsAt: data.endsAt ? new Date(data.endsAt) : null,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
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
    return NextResponse.json({ error: "Kampanya kaydedilemedi" }, { status: 500 });
  }
}
