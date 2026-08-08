import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { revalidateContent } from "@/lib/revalidate";

const contentSchema = z.object({
  /** Empty allowed for clearing optional image URLs. */
  content: z.string(),
  title: z.string().optional(),
});

export async function GET() {
  const contents = await prisma.siteContent.findMany({
    orderBy: { key: "asc" },
  });
  return NextResponse.json(contents);
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { key, content, title } = body;

    if (!key) {
      return NextResponse.json({ error: "Key gerekli" }, { status: 400 });
    }

    const data = contentSchema.parse({ content, title });

    const updated = await prisma.siteContent.upsert({
      where: { key },
      update: data,
      create: { key, ...data },
    });

    revalidateContent();
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "İçerik güncellenemedi" }, { status: 500 });
  }
}
