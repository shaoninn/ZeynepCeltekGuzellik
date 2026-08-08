import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { mysqlConnectionSummary } from "@/lib/db-url";
import { memoryCacheStats } from "@/lib/memory-cache";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Live counts — require secret in production. */
export async function GET(request: NextRequest) {
  const secret = process.env.PURGE_SECRET || process.env.JWT_SECRET || "";
  const provided =
    request.headers.get("x-purge-secret") ||
    request.nextUrl.searchParams.get("secret") ||
    "";

  if (process.env.NODE_ENV === "production" && (!secret || provided !== secret)) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const started = Date.now();
  try {
    const [projects, activeProjects, featured, categories, products, settings] =
      await Promise.all([
        prisma.project.count(),
        prisma.project.count({ where: { isActive: true } }),
        prisma.project.count({ where: { isActive: true, isFeatured: true } }),
        prisma.category.count({ where: { isActive: true } }),
        prisma.product.count({ where: { isActive: true } }),
        prisma.siteSetting.count(),
      ]);

    const sample = await prisma.project.findMany({
      where: { isActive: true },
      select: { title: true, slug: true },
      take: 3,
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({
      ok: true,
      ms: Date.now() - started,
      target: mysqlConnectionSummary(),
      memoryCache: memoryCacheStats(),
      counts: {
        projects,
        activeProjects,
        featured,
        categories,
        products,
        settings,
      },
      sample,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        ms: Date.now() - started,
        target: mysqlConnectionSummary(),
        error:
          error instanceof Error ? error.message.slice(0, 400) : String(error),
      },
      { status: 500 }
    );
  }
}
