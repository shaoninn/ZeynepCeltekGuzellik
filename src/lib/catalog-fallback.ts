import { CATEGORIES, CATALOG_PRODUCTS } from "@/lib/constants";

const DESCRIPTIONS: Record<string, string> = {
  "cilt-bakimi":
    "Klasik ve medikal cilt bakımı, Hydrafacial, karbon maske ve cilt onarım protokolleri.",
  "kirpik-kas":
    "Kirpik lifting, kaş alma ve şekillendirme uygulamaları.",
  "bolgesel-incelme":
    "G5, Emslim, heykeltıraş ve G8 ile bölgesel incelme.",
  "lazer-bayan": "Bayan lazer epilasyon — tek seans ve paketler.",
  "lazer-erkek": "Erkek lazer epilasyon — bölge ve paketler.",
  "alex-lazer": "Soğuk hava üflemeli Alex lazer paketleri.",
};

const IMAGES: Record<string, string[]> = {
  "cilt-bakimi": [
    "/images/products/cilt-bakimi/1.jpg",
    "/images/products/cilt-bakimi/2.jpg",
    "/images/products/cilt-bakimi/3.jpg",
    "/images/products/cilt-bakimi/4.jpg",
  ],
  "kirpik-kas": [
    "/images/products/kirpik-kas/1.jpg",
    "/images/products/kirpik-kas/2.jpg",
  ],
  "bolgesel-incelme": [
    "/images/products/bolgesel-incelme/1.jpg",
    "/images/products/bolgesel-incelme/2.jpg",
  ],
  "lazer-bayan": [
    "/images/products/lazer-bayan/1.jpg",
    "/images/products/lazer-bayan/2.jpg",
  ],
  "lazer-erkek": [
    "/images/products/lazer-erkek/1.jpg",
    "/images/products/lazer-erkek/2.jpg",
  ],
  "alex-lazer": [
    "/images/products/alex-lazer/1.jpg",
    "/images/products/alex-lazer/2.jpg",
    "/images/products/alex-lazer/3.jpg",
  ],
};

export type FallbackCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: { products: number };
};

export type FallbackProduct = {
  id: string;
  name: string;
  slug: string;
  shortDesc: string | null;
  description: string | null;
  price: number;
  image: string | null;
  images: string;
  categoryId: string;
  sortOrder: number;
  isActive: boolean;
  inStock: boolean;
  isFeatured: boolean;
  badgeNew: boolean;
  badgeBestseller: boolean;
  badgeSale: boolean;
  salePrice: number | null;
  nightImage: string | null;
  campaignEndsAt: Date | null;
  specs: string;
  shippingLabel: string | null;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    image: string | null;
    sortOrder: number;
    isActive: boolean;
  };
};

function productCount(slug: string): number {
  return CATALOG_PRODUCTS.filter((p) => p.categorySlug === slug).length;
}

/** Used when MySQL is unreachable so /hizmetler is never empty. */
export function getFallbackCategories(): FallbackCategory[] {
  const now = new Date(0);
  return CATEGORIES.map((c, i) => ({
    id: `fallback-${c.slug}`,
    name: c.name,
    slug: c.slug,
    description: DESCRIPTIONS[c.slug] ?? null,
    icon: c.icon,
    image: IMAGES[c.slug]?.[0] ?? null,
    sortOrder: i,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    _count: { products: productCount(c.slug) },
  }));
}

export function getFallbackCategoryBySlug(slug: string) {
  return getFallbackCategories().find((c) => c.slug === slug) ?? null;
}

export function categoryTitleFromSlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? null;
}

export function getFallbackProductsByCategorySlug(slug: string): FallbackProduct[] {
  const cat = getFallbackCategoryBySlug(slug);
  if (!cat) return [];
  const pool = IMAGES[slug] ?? [cat.image || "/images/hero/hero-1.jpg"];
  const now = new Date(0);
  return CATALOG_PRODUCTS.filter((p) => p.categorySlug === slug).map(
    (p, i) => {
      const img = pool[i % pool.length]!;
      return {
        id: `fallback-product-${p.slug}`,
        name: p.name,
        slug: p.slug,
        shortDesc: p.shortDesc,
        description: `${p.name} — ${p.shortDesc}`,
        price: p.price,
        image: img,
        images: JSON.stringify(pool),
        categoryId: cat.id,
        sortOrder: i,
        isActive: true,
        inStock: true,
        isFeatured: i < 2,
        badgeNew: false,
        badgeBestseller: false,
        badgeSale: false,
        salePrice: null,
        nightImage: null,
        campaignEndsAt: null,
        specs: JSON.stringify({ randevu: "Zorunlu", konum: "Adana" }),
        shippingLabel: null,
        createdAt: now,
        updatedAt: now,
        category: {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          icon: cat.icon,
          image: cat.image,
          sortOrder: cat.sortOrder,
          isActive: cat.isActive,
        },
      };
    }
  );
}
