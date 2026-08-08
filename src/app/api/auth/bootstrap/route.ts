import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { writeAuditLog } from "@/lib/audit";

const bodySchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  name: z.string().min(2).optional(),
  secret: z.string().min(1).optional(),
});

/**
 * Creates the first admin only when AdminUser table is empty.
 * Protect with BOOTSTRAP_SECRET env (or omit secret if unset and DB empty — still rate-limited).
 */
export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const limited = rateLimit(`bootstrap:${ip}`, 5, 60 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Çok fazla deneme" }, { status: 429 });
  }

  try {
    const count = await prisma.adminUser.count();
    if (count > 0) {
      return NextResponse.json(
        { error: "Admin zaten var. Bu uç nokta yalnızca ilk kurulum içindir." },
        { status: 403 }
      );
    }

    const body = bodySchema.parse(await request.json().catch(() => ({})));
    const requiredSecret = process.env.BOOTSTRAP_SECRET?.trim();
    if (requiredSecret) {
      if (body.secret !== requiredSecret) {
        return NextResponse.json({ error: "Geçersiz bootstrap secret" }, { status: 401 });
      }
    }

    const email = (
      body.email ||
      process.env.ADMIN_EMAIL ||
      "admin@zeynepceltekguzellik.local"
    ).toLowerCase();
    const password =
      body.password || process.env.ADMIN_PASSWORD || "admin123";
    const name = body.name || "ZCA Admin";

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalı" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.adminUser.create({
      data: {
        email,
        passwordHash,
        name,
        role: "SUPER",
      },
      select: { id: true, email: true, name: true },
    });

    await writeAuditLog({
      action: "admin.bootstrap",
      entity: "AdminUser",
      entityId: user.id,
      ip,
      meta: { email: user.email },
    });

    return NextResponse.json({
      success: true,
      user,
      message: "İlk admin oluşturuldu. Hemen giriş yapıp şifreyi değiştirin.",
    });
  } catch (error) {
    console.error("bootstrap failed:", error);
    return NextResponse.json(
      { error: "Admin oluşturulamadı. DB bağlantısını kontrol edin." },
      { status: 500 }
    );
  }
}
