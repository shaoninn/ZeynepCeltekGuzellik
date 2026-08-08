import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { getSiteUrl } from "@/lib/seo";

/** Hostinger build ortamında MySQL yok; runtime’da üretilsin. */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/hakkimizda",
    "/hizmetler",
    "/projeler",
    "/blog",
    "/iletisim",
    "/kvkk",
    "/gizlilik-politikasi",
    "/kullanim-kosullari",
    "/mesafeli-satis",
    "/iade-politikasi",
    "/teslimat",
    "/cerez-politikasi",
    "/hizmet-bolgeleri",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority:
      path === ""
        ? 1
        : path === "/hizmetler" || path === "/projeler" || path === "/iletisim"
          ? 0.9
          : 0.6,
  }));

  try {
    const [categories, products, projects, posts] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.project.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.blogPost.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    return [
      ...staticRoutes,
      ...categories.map((c) => ({
        url: `${base}/hizmetler/${c.slug}`,
        lastModified: c.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...products.map((p) => ({
        url: `${base}/urun/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
      ...projects.map((p) => ({
        url: `${base}/projeler/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...posts.map((p) => ({
        url: `${base}/blog/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
    ];
  } catch (error) {
    console.error("sitemap: DB unavailable, returning static routes only", error);
    return staticRoutes;
  }
}
