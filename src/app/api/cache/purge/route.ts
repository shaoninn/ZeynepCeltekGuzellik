import { NextRequest, NextResponse } from "next/server";
import {
  purgeAllMemoryCaches,
  revalidateBlog,
  revalidateCategories,
  revalidateContent,
  revalidateNav,
  revalidateProjects,
  revalidateSiteSettings,
} from "@/lib/revalidate";

export const dynamic = "force-dynamic";

/**
 * One-shot cache purge after seed/deploy.
 * POST /api/cache/purge  Header: x-purge-secret: <JWT_SECRET or PURGE_SECRET>
 */
export async function POST(request: NextRequest) {
  const secret = process.env.PURGE_SECRET || process.env.JWT_SECRET || "";
  const provided =
    request.headers.get("x-purge-secret") ||
    request.nextUrl.searchParams.get("secret") ||
    "";

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  purgeAllMemoryCaches();
  revalidateSiteSettings();
  revalidateNav();
  revalidateProjects();
  revalidateCategories();
  revalidateBlog();
  revalidateContent();

  return NextResponse.json({ ok: true, purged: true });
}
