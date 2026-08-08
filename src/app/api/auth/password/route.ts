import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  getSession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  currentPassword: z.string().min(1, "Mevcut şifre gerekli"),
  newPassword: z
    .string()
    .min(8, "Yeni şifre en az 8 karakter olmalı")
    .max(128),
});

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const ip = clientIp(request);
  const limited = rateLimit(`password:${session.userId}:${ip}`, 5, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Çok fazla deneme. Daha sonra tekrar deneyin." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const data = schema.parse(body);

    const user = await prisma.adminUser.findUnique({
      where: { id: session.userId },
    });
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    const ok = await verifyPassword(data.currentPassword, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: "Mevcut şifre hatalı" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(data.newPassword);
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Şifre güncellenemedi" }, { status: 500 });
  }
}
