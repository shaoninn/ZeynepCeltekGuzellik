import { prisma } from "@/lib/db";
import type { AdminSession } from "@/lib/auth";

export async function writeAuditLog(input: {
  action: string;
  entity?: string;
  entityId?: string;
  meta?: Record<string, unknown>;
  ip?: string | null;
  actor?: AdminSession | null;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        action: input.action,
        entity: input.entity ?? null,
        entityId: input.entityId ?? null,
        meta: JSON.stringify(input.meta ?? {}),
        ip: input.ip ?? null,
        actorId: input.actor?.userId ?? null,
        actorEmail: input.actor?.email ?? null,
      },
    });
  } catch (e) {
    console.error("Audit log failed:", e);
  }
}
