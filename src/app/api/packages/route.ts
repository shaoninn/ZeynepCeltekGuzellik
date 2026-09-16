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

export async function GET() {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;
  const rows = await prisma.servicePackage.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;
  try {
    const data = schema.parse(await request.json());
    const row = await prisma.servicePackage.create({
      data: {
        ...data,
        items: JSON.stringify(data.items ?? []),
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
    return NextResponse.json({ error: "Paket kaydedilemedi" }, { status: 500 });
  }
}
