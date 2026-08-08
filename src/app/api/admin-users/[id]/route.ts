import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { requireAdmin, isUnauthorized } from "@/lib/api";
import { writeAuditLog } from "@/lib/audit";
import { clientIp } from "@/lib/rate-limit";

const patchSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(["ADMIN", "SUPER"]).optional(),
  password: z.string().min(8).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;
  const { id } = await params;

  try {
    const body = patchSchema.parse(await request.json());
    const data: {
      name?: string;
      role?: string;
      passwordHash?: string;
    } = {};
    if (body.name) data.name = body.name;
    if (body.role) data.role = body.role;
    if (body.password) data.passwordHash = await hashPassword(body.password);

    const user = await prisma.adminUser.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        totpEnabled: true,
      },
    });
    await writeAuditLog({
      action: "admin.update",
      entity: "AdminUser",
      entityId: id,
      actor: auth,
      ip: clientIp(request),
      meta: { fields: Object.keys(body) },
    });
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Güncellenemedi" }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;
  const { id } = await params;

  if (auth.userId === id) {
    return NextResponse.json(
      { error: "Kendi hesabınızı silemezsiniz" },
      { status: 400 }
    );
  }

  const count = await prisma.adminUser.count();
  if (count <= 1) {
    return NextResponse.json(
      { error: "Son admin silinemez" },
      { status: 400 }
    );
  }

  await prisma.adminUser.delete({ where: { id } });
  await writeAuditLog({
    action: "admin.delete",
    entity: "AdminUser",
    entityId: id,
    actor: auth,
    ip: clientIp(request),
  });
  return NextResponse.json({ success: true });
}
