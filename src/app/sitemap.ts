import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { memoryCache } from "@/lib/memory-cache";
import { getSiteUrl } from "@/lib/seo";
import { PACKAGES } from "@/lib/constants";

/** Cached sitemap — avoid force-dynamic crawler storms on Hostinger. */
export const revalidate = 3600;

async function buildSitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/hakkimizda",
    "/hizmetler",
    "/paketler",
    "/kampanyalar",
    "/projeler",
    "/blog",
    "/iletisim",
    "/randevu/lazer-epilasyon-adana",
    "/randevu/cilt-bakimi-adana",
    "/randevu/alex-lazer-adana",
    "/randevu/bolgesel-incelme-adana",
    "/randevu/kirpik-lifting-adana",
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
        : path === "/hizmetler" ||
            path === "/paketler" ||
            path === "/kampanyalar" ||
            path === "/projeler" ||
            path === "/iletisim" ||
            path.startsWith("/randevu/")
          ? 0.9
          : path === "/kvkk" ||
              path === "/gizlilik-politikasi" ||
              path === "/kullanim-kosullari" ||
              path === "/mesafeli-satis" ||
              path === "/iade-politikasi" ||
              path === "/teslimat" ||
              path === "/cerez-politikasi"
            ? 0.3
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
      ...PACKAGES.map((p) => ({
        url: `${base}/paketler/${p.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.75,
      })),
      ...categories.map((c) => ({
        url: `${base}/hizmetler/${c.slug}`,
        lastModified: c.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...products.map((p) => ({
        url: `${base}/hizmet/${p.slug}`,
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
    return [
      ...staticRoutes,
      ...PACKAGES.map((p) => ({
        url: `${base}/paketler/${p.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.75,
      })),
    ];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return memoryCache("sitemap:full", buildSitemap, {
    ttlMs: 3_600_000,
    skipEmpty: true,
  });
}
