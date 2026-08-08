import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import QRCode from "qrcode";
import { prisma } from "@/lib/db";
import { requireAdmin, isUnauthorized } from "@/lib/api";
import { createTotpSecret, totpUri, verifyTotpCode } from "@/lib/totp";
import { writeAuditLog } from "@/lib/audit";
import { clientIp } from "@/lib/rate-limit";
import { verifyPassword } from "@/lib/auth";

const enableSchema = z.object({
  secret: z.string().min(10),
  code: z.string().min(6),
});

const disableSchema = z.object({
  password: z.string().min(1),
  code: z.string().min(6),
});

export async function GET() {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const user = await prisma.adminUser.findUnique({
    where: { id: auth.userId },
    select: { totpEnabled: true, email: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Kullanıcı yok" }, { status: 404 });
  }

  if (user.totpEnabled) {
    return NextResponse.json({ enabled: true });
  }

  const secret = createTotpSecret();
  const uri = totpUri(user.email, secret);
  const qrDataUrl = await QRCode.toDataURL(uri);

  return NextResponse.json({
    enabled: false,
    secret,
    uri,
    qrDataUrl,
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const body = enableSchema.parse(await request.json());
    const ok = await verifyTotpCode(body.secret, body.code);
    if (!ok) {
      return NextResponse.json({ error: "Kod hatalı" }, { status: 400 });
    }
    await prisma.adminUser.update({
      where: { id: auth.userId },
      data: { totpSecret: body.secret, totpEnabled: true },
    });
    await writeAuditLog({
      action: "auth.2fa.enable",
      entity: "AdminUser",
      entityId: auth.userId,
      actor: auth,
      ip: clientIp(request),
    });
    return NextResponse.json({ success: true, enabled: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "2FA etkinleştirilemedi" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const body = disableSchema.parse(await request.json());
    const user = await prisma.adminUser.findUnique({
      where: { id: auth.userId },
    });
    if (!user?.totpSecret) {
      return NextResponse.json({ error: "2FA zaten kapalı" }, { status: 400 });
    }
    const pwOk = await verifyPassword(body.password, user.passwordHash);
    if (!pwOk) {
      return NextResponse.json({ error: "Şifre hatalı" }, { status: 401 });
    }
    const codeOk = await verifyTotpCode(user.totpSecret, body.code);
    if (!codeOk) {
      return NextResponse.json({ error: "Kod hatalı" }, { status: 401 });
    }
    await prisma.adminUser.update({
      where: { id: auth.userId },
      data: { totpSecret: null, totpEnabled: false },
    });
    await writeAuditLog({
      action: "auth.2fa.disable",
      entity: "AdminUser",
      entityId: auth.userId,
      actor: auth,
      ip: clientIp(request),
    });
    return NextResponse.json({ success: true, enabled: false });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "2FA kapatılamadı" }, { status: 500 });
  }
}
