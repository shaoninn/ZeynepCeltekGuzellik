import { NextResponse } from "next/server";
import { getSession, type AdminSession } from "@/lib/auth";

export async function requireAdmin(): Promise<
  AdminSession | NextResponse
> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim. Lütfen giriş yapın." }, { status: 401 });
  }
  return session;
}

export function isUnauthorized(
  result: AdminSession | NextResponse
): result is NextResponse {
  return result instanceof NextResponse;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function generateOrderNo(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `GR-${date}-${rand}`;
}
