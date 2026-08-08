import { CATEGORIES } from "@/lib/constants";

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

/** Used when MySQL is unreachable so /hizmetler is never a blank page. */
export function getFallbackCategories(): FallbackCategory[] {
  const now = new Date(0);
  const images: Record<string, string> = {
    "cilt-bakimi": "/images/products/cilt-bakimi/1.jpg",
    "kirpik-kas": "/images/products/kirpik-kas/1.jpg",
    "bolgesel-incelme": "/images/products/bolgesel-incelme/1.jpg",
    "lazer-bayan": "/images/products/lazer-bayan/1.jpg",
    "lazer-erkek": "/images/products/lazer-erkek/1.jpg",
    "alex-lazer": "/images/products/alex-lazer/1.jpg",
  };
  return CATEGORIES.map((c, i) => ({
    id: `fallback-${c.slug}`,
    name: c.name,
    slug: c.slug,
    description: DESCRIPTIONS[c.slug] ?? null,
    icon: c.icon,
    image: images[c.slug] ?? null,
    sortOrder: i,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    _count: { products: 0 },
  }));
}

export function getFallbackCategoryBySlug(slug: string) {
  return getFallbackCategories().find((c) => c.slug === slug) ?? null;
}

export function categoryTitleFromSlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? null;
}
