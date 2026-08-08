import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin, isUnauthorized } from "@/lib/api";
import { revalidateNav } from "@/lib/revalidate";

const navSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
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
    const body = await request.json();
    const data = navSchema.parse(body);
    const item = await prisma.navItem.update({ where: { id }, data });
    revalidateNav();
    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Menü güncellenemedi" }, { status: 500 });
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
    const count = await prisma.navItem.count();
    if (count <= 1) {
      return NextResponse.json(
        { error: "En az bir menü öğesi kalmalıdır." },
        { status: 400 }
      );
    }
    await prisma.navItem.delete({ where: { id } });
    revalidateNav();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Menü silinemedi" }, { status: 500 });
  }
}
