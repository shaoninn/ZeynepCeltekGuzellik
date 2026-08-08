import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, isUnauthorized } from "@/lib/api";

export async function GET() {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(messages);
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const body = await request.json() as { id: string; isRead: boolean };
    if (!body.id) {
      return NextResponse.json({ error: "Mesaj ID gerekli" }, { status: 400 });
    }

    const message = await prisma.contactMessage.update({
      where: { id: body.id },
      data: { isRead: body.isRead },
    });
    return NextResponse.json(message);
  } catch {
    return NextResponse.json({ error: "Mesaj güncellenemedi" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Mesaj ID gerekli" }, { status: 400 });
    }
    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Mesaj silinemedi" }, { status: 500 });
  }
}
