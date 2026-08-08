import { cache } from "react";
import { prisma } from "@/lib/db";
import { memoryCache, memoryCacheInvalidate } from "@/lib/memory-cache";
import {
  getFallbackCategories,
  getFallbackCategoryBySlug,
} from "@/lib/catalog-fallback";

const CATALOG_TTL_MS = 60_000;

export type ProjectListItem = Awaited<
  ReturnType<typeof loadActiveProjects>
>[number];

export type CategoryListItem = Awaited<
  ReturnType<typeof loadActiveCategories>
>[number];

export type BlogListItem = Awaited<ReturnType<typeof loadPublishedPosts>>[number];

async function loadActiveProjects() {
  return prisma.project.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { sortOrder: "asc" },
  });
}

async function loadFeaturedProjects() {
  return prisma.project.findMany({
    where: { isActive: true, isFeatured: true },
    include: { category: true },
    orderBy: { sortOrder: "asc" },
    take: 10,
  });
}

async function loadActiveCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

async function loadPublishedPosts() {
  return prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });
}

export const getActiveProjects = cache(async () => {
  try {
    return await memoryCache("catalog:projects", loadActiveProjects, {
      ttlMs: CATALOG_TTL_MS,
      skipEmpty: true,
    });
  } catch (error) {
    console.error("[catalog] getActiveProjects failed:", error);
    return [];
  }
});

export const getFeaturedProjects = cache(async () => {
  try {
    return await memoryCache("catalog:featured", loadFeaturedProjects, {
      ttlMs: CATALOG_TTL_MS,
      skipEmpty: true,
    });
  } catch (error) {
    console.error("[catalog] getFeaturedProjects failed:", error);
    return [];
  }
});

async function loadFeaturedProducts() {
  const featured = await prisma.product.findMany({
    where: { isActive: true, inStock: true, isFeatured: true },
    include: { category: true },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    take: 8,
  });
  if (featured.length > 0) return featured;
  return prisma.product.findMany({
    where: { isActive: true, inStock: true },
    include: { category: true },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    take: 8,
  });
}

export const getFeaturedProducts = cache(async () => {
  try {
    return await memoryCache("catalog:products:featured", loadFeaturedProducts, {
      ttlMs: CATALOG_TTL_MS,
      skipEmpty: true,
    });
  } catch (error) {
    console.error("[catalog] getFeaturedProducts failed:", error);
    return [];
  }
});

async function loadRecentProductPool() {
  return prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { updatedAt: "desc" },
    take: 40,
  });
}

/** Small pool for client-side recently-viewed matching — one cached query. */
export const getRecentProductPool = cache(async () => {
  try {
    return await memoryCache(
      "catalog:products:recent-pool",
      loadRecentProductPool,
      { ttlMs: CATALOG_TTL_MS, skipEmpty: true }
    );
  } catch (error) {
    console.error("[catalog] getRecentProductPool failed:", error);
    return [];
  }
});

export const getActiveCategories = cache(async () => {
  try {
    const rows = await memoryCache("catalog:categories", loadActiveCategories, {
      ttlMs: CATALOG_TTL_MS,
      skipEmpty: true,
    });
    if (rows.length === 0) return getFallbackCategories();
    return rows;
  } catch (error) {
    console.error("[catalog] getActiveCategories failed:", error);
    return getFallbackCategories();
  }
});

export const getPublishedPosts = cache(async () => {
  try {
    return await memoryCache("catalog:blog", loadPublishedPosts, {
      ttlMs: CATALOG_TTL_MS,
      skipEmpty: true,
    });
  } catch (error) {
    console.error("[catalog] getPublishedPosts failed:", error);
    return [];
  }
});

export const getProjectBySlug = cache(async (slug: string) => {
  try {
    return await memoryCache(
      `catalog:project:${slug}`,
      () =>
        prisma.project.findUnique({
          where: { slug },
          include: { category: true },
        }),
      { ttlMs: CATALOG_TTL_MS, skipEmpty: true }
    );
  } catch (error) {
    console.error("[catalog] getProjectBySlug failed:", error);
    return null;
  }
});

export const getCategoryBySlug = cache(async (slug: string) => {
  try {
    const row = await memoryCache(
      `catalog:category:${slug}`,
      () => prisma.category.findUnique({ where: { slug } }),
      { ttlMs: CATALOG_TTL_MS, skipEmpty: true }
    );
    if (row) return row;
    return getFallbackCategoryBySlug(slug);
  } catch (error) {
    console.error("[catalog] getCategoryBySlug failed:", error);
    return getFallbackCategoryBySlug(slug);
  }
});

export async function getProductsByCategoryId(categoryId: string) {
  if (categoryId.startsWith("fallback-")) return [];
  try {
    return await memoryCache(
      `catalog:products:${categoryId}`,
      () =>
        prisma.product.findMany({
          where: { categoryId, isActive: true },
          orderBy: { sortOrder: "asc" },
        }),
      { ttlMs: CATALOG_TTL_MS, skipEmpty: true }
    );
  } catch (error) {
    console.error("[catalog] getProductsByCategoryId failed:", error);
    return [];
  }
}

export const getPostBySlug = cache(async (slug: string) => {
  try {
    return await memoryCache(
      `catalog:blog:${slug}`,
      () => prisma.blogPost.findUnique({ where: { slug } }),
      { ttlMs: CATALOG_TTL_MS, skipEmpty: true }
    );
  } catch (error) {
    console.error("[catalog] getPostBySlug failed:", error);
    return null;
  }
});

export function invalidateCatalogMemoryCache(): void {
  memoryCacheInvalidate("catalog:");
}
