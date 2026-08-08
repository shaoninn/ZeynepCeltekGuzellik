import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, isUnauthorized } from "@/lib/api";

export async function GET() {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const customers = await prisma.customer.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(customers);
}
