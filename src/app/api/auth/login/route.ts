import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  verifyPassword,
  createToken,
  setSessionCookie,
} from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { verifyTotpCode } from "@/lib/totp";
import { writeAuditLog } from "@/lib/audit";
import { SignJWT, jwtVerify } from "jose";
import { getJwtSecretBytes } from "@/lib/jwt-secret";

const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta girin"),
  password: z.string().min(1, "Şifre gerekli"),
  totpCode: z.string().optional(),
  challenge: z.string().optional(),
});

async function createChallenge(userId: string): Promise<string> {
  return new SignJWT({ userId, purpose: "2fa" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(getJwtSecretBytes());
}

async function readChallenge(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretBytes());
    if (payload.purpose === "2fa" && typeof payload.userId === "string") {
      return payload.userId;
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const limited = rateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Çok fazla deneme. 15 dakika sonra tekrar deneyin." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const data = loginSchema.parse(body);

    if (data.challenge && data.totpCode) {
      const userId = await readChallenge(data.challenge);
      if (!userId) {
        return NextResponse.json(
          { error: "2FA oturumu süresi doldu. Tekrar giriş yapın." },
          { status: 401 }
        );
      }
      const user = await prisma.adminUser.findUnique({ where: { id: userId } });
      if (!user?.totpEnabled || !user.totpSecret) {
        return NextResponse.json({ error: "2FA aktif değil" }, { status: 400 });
      }
      const ok = await verifyTotpCode(user.totpSecret, data.totpCode);
      if (!ok) {
        return NextResponse.json({ error: "Doğrulama kodu hatalı" }, { status: 401 });
      }
      const token = await createToken({
        userId: user.id,
        email: user.email,
        name: user.name,
      });
      await setSessionCookie(token);
      await writeAuditLog({
        action: "auth.login",
        entity: "AdminUser",
        entityId: user.id,
        ip,
        actor: { userId: user.id, email: user.email, name: user.name },
      });
      return NextResponse.json({
        success: true,
        user: { name: user.name, email: user.email },
      });
    }

    const user = await prisma.adminUser.findUnique({ where: { email: data.email } });
    if (!user) {
      return NextResponse.json(
        { error: "E-posta veya şifre hatalı" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(data.password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "E-posta veya şifre hatalı" },
        { status: 401 }
      );
    }

    if (user.totpEnabled && user.totpSecret) {
      const challenge = await createChallenge(user.id);
      return NextResponse.json({
        success: false,
        requires2fa: true,
        challenge,
      });
    }

    const token = await createToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    await setSessionCookie(token);
    await writeAuditLog({
      action: "auth.login",
      entity: "AdminUser",
      entityId: user.id,
      ip,
      actor: { userId: user.id, email: user.email, name: user.name },
    });

    return NextResponse.json({
      success: true,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : "";
    if (
      message.includes("pool timeout") ||
      message.includes("acquireTimeout") ||
      message.includes("P2039") ||
      message.includes("45028")
    ) {
      console.error("[auth/login] DB pool timeout:", message);
      return NextResponse.json(
        {
          error:
            "Veritabanı geçici olarak yanıt vermiyor. Birkaç saniye sonra tekrar deneyin.",
        },
        { status: 503 }
      );
    }
    console.error("[auth/login] failed:", error);
    return NextResponse.json({ error: "Giriş başarısız" }, { status: 500 });
  }
}
