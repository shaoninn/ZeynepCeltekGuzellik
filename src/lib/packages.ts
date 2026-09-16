import { cache } from "react";
import { prisma } from "@/lib/db";
import { PACKAGES, type PackageItem } from "@/lib/constants";
import { parseJsonArray } from "@/lib/utils";

export type PackageRecord = {
  id: string;
  slug: string;
  name: string;
  price: number;
  sessions: string;
  featured: boolean;
  badge?: string;
  image: string;
  shortDesc: string;
  items: readonly string[] | string[];
};

function fromConstant(pkg: PackageItem): PackageRecord {
  return {
    id: pkg.id,
    slug: pkg.slug,
    name: pkg.name,
    price: pkg.price,
    sessions: pkg.sessions,
    featured: pkg.featured,
    badge: "badge" in pkg ? pkg.badge : undefined,
    image: pkg.image,
    shortDesc: pkg.shortDesc,
    items: pkg.items,
  };
}

const FALLBACK = PACKAGES.map(fromConstant);

export const getPackages = cache(async (): Promise<PackageRecord[]> => {
  try {
    const rows = await prisma.servicePackage.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) return FALLBACK;
    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      price: row.price,
      sessions: row.sessions,
      featured: row.featured,
      badge: row.badge || undefined,
      image: row.image,
      shortDesc: row.shortDesc,
      items: parseJsonArray<string>(row.items),
    }));
  } catch {
    return FALLBACK;
  }
});

export async function getPackageBySlug(
  slug: string
): Promise<PackageRecord | undefined> {
  const all = await getPackages();
  return all.find((p) => p.slug === slug);
}
