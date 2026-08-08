import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin, isUnauthorized } from "@/lib/api";
import { revalidateNav } from "@/lib/revalidate";

const navSchema = z.object({
  label: z.string().min(1, "Etiket gerekli"),
  href: z.string().min(1, "Link gerekli"),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  const items = await prisma.navItem.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const body = await request.json();
    const data = navSchema.parse(body);
    const item = await prisma.navItem.create({
      data: {
        label: data.label,
        href: data.href,
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });
    revalidateNav();
    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Menü eklenemedi" }, { status: 500 });
  }
}
