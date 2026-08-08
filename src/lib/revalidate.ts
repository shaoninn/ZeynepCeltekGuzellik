import { revalidatePath, revalidateTag } from "next/cache";
import { CACHE_TAGS, invalidateSiteMemoryCache } from "@/lib/site";
import { invalidateCatalogMemoryCache } from "@/lib/catalog";
import { memoryCacheInvalidate } from "@/lib/memory-cache";

/** Immediate expire so admin edits show on next public request. */
const IMMEDIATE = { expire: 0 } as const;

function bustPublicPages() {
  revalidatePath("/", "layout");
  revalidatePath("/hizmetler", "page");
  revalidatePath("/projeler", "page");
  revalidatePath("/blog", "page");
  revalidatePath("/hakkimizda", "page");
  revalidatePath("/iletisim", "page");
}

export function revalidateSiteSettings() {
  invalidateSiteMemoryCache();
  revalidateTag(CACHE_TAGS.settings, IMMEDIATE);
  bustPublicPages();
}

export function revalidateNav() {
  invalidateSiteMemoryCache();
  revalidateTag(CACHE_TAGS.nav, IMMEDIATE);
  bustPublicPages();
}

export function revalidateProjects() {
  invalidateCatalogMemoryCache();
  revalidateTag(CACHE_TAGS.projects, IMMEDIATE);
  bustPublicPages();
}

export function revalidateCategories() {
  invalidateCatalogMemoryCache();
  revalidateTag(CACHE_TAGS.categories, IMMEDIATE);
  bustPublicPages();
}

export function revalidateBlog() {
  invalidateCatalogMemoryCache();
  revalidateTag(CACHE_TAGS.blog, IMMEDIATE);
  bustPublicPages();
}

export function revalidateContent() {
  memoryCacheInvalidate("home:");
  memoryCacheInvalidate("content-map:");
  revalidateTag(CACHE_TAGS.content, IMMEDIATE);
  bustPublicPages();
}

export function purgeAllMemoryCaches() {
  memoryCacheInvalidate();
  invalidateSiteMemoryCache();
  invalidateCatalogMemoryCache();
  bustPublicPages();
}
