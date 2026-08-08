import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { requireAdmin, isUnauthorized } from "@/lib/api";
import { writeAuditLog } from "@/lib/audit";
import { clientIp } from "@/lib/rate-limit";

const createSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8, "Şifre en az 8 karakter"),
  role: z.enum(["ADMIN", "SUPER"]).optional(),
});

export async function GET() {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      totpEnabled: true,
      createdAt: true,
    },
  });
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const body = createSchema.parse(await request.json());
    const passwordHash = await hashPassword(body.password);
    const user = await prisma.adminUser.create({
      data: {
        email: body.email.toLowerCase(),
        name: body.name,
        passwordHash,
        role: body.role || "ADMIN",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        totpEnabled: true,
        createdAt: true,
      },
    });
    await writeAuditLog({
      action: "admin.create",
      entity: "AdminUser",
      entityId: user.id,
      actor: auth,
      ip: clientIp(request),
    });
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Kullanıcı oluşturulamadı (e-posta kullanılıyor olabilir)" },
      { status: 400 }
    );
  }
}
