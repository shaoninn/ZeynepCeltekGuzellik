import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, isUnauthorized } from "@/lib/api";

export async function GET() {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json(logs);
}
