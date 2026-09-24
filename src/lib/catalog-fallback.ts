import { CATEGORIES, CATALOG_PRODUCTS } from "@/lib/constants";

const DESCRIPTIONS: Record<string, string> = {
  "cilt-bakimi":
    "Cilt tipinize göre planlanan klasik ve medikal bakım, Hydrafacial derin temizlik, karbon maske, vitamin uygulamaları ve Mikroplus yüz-boyun toparlama. Adana’daki her iki şubemizde hijyenik ortamda, uzman kadroyla uygulanır.",
  "kirpik-kas":
    "Kirpik lifting, ipek kirpik ve kaş şekillendirme. Doğal bakış ve kişiye özel yoğunluk planı.",
  "kalici-makyaj":
    "Dudak renklendirme, microblading & kaş pudralama, kalıcı dipliner ve eyeliner. Yaklaşık 3 yıllık kullanım hedefiyle kişiye özel tasarım.",
  "protez-tirnak":
    "Kampanyalı protez tırnak uygulamaları. Şekil ve bakım randevuda netleşir.",
  "bolgesel-incelme":
    "Popo Lift, göğüs toparlama, G5, Emslim, heykeltıraş ve G8 ile bölgesel şekillendirme ve sıkılık.",
  "lazer-bayan":
    "Kadınlara özel lazer epilasyon: tek seans veya 8 seanslık paketler. Bölge seçimi ve seans aralığı cilt-kıl tipine göre belirlenir; hijyenik ortamda uygulanır.",
  "lazer-erkek":
    "Erkek cilt ve kıl yapısına uygun lazer epilasyon. Gıdı, göğüs, sırt, bacak ve kemer üstü paketleriyle net fiyat ve planlı seans takibi.",
  "alex-lazer":
    "Epilyum Alex Alexandrite teknolojisi: kamera destekli cilt-kıl analizi ve güçlü soğutma ile konforlu uygulama. Kadın ve erkek için 5–10 seanslık paket seçenekleri.",
};

const IMAGES: Record<string, string[]> = {
  "cilt-bakimi": [
    "/images/products/cilt-bakimi/1.jpg",
    "/images/products/cilt-bakimi/2.jpg",
    "/images/products/cilt-bakimi/3.jpg",
    "/images/products/cilt-bakimi/4.jpg",
  ],
  "kirpik-kas": [
    "/images/campaigns/ipek-kirpik.jpg",
    "/images/products/kirpik-kas/1.jpg",
    "/images/products/kirpik-kas/2.jpg",
  ],
  "kalici-makyaj": [
    "/images/campaigns/dudak-renklendirme.jpg",
    "/images/campaigns/kas-microblading-pudralama.jpg",
    "/images/campaigns/kalici-dipliner.jpg",
    "/images/campaigns/kalici-eyeliner.jpg",
  ],
  "protez-tirnak": ["/images/campaigns/protez-tirnak.jpg"],
  "bolgesel-incelme": [
    "/images/campaigns/popo-lift.jpg",
    "/images/campaigns/gogus-toparlama.jpg",
    "/images/products/bolgesel-incelme/1.jpg",
    "/images/products/bolgesel-incelme/2.jpg",
  ],
  "lazer-bayan": [
    "/images/campaigns/lazer-paket.jpg",
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

/** Slug → kampanya / özel görsel */
export const PRODUCT_CAMPAIGN_IMAGES: Record<string, string> = {
  "kirpik-lifting": "/images/products/kirpik-kas/1.jpg",
  "ipek-kirpik": "/images/campaigns/ipek-kirpik.jpg",
  "dudak-renklendirme": "/images/campaigns/dudak-renklendirme.jpg",
  "microblading-kas-pudralama": "/images/campaigns/kas-microblading-pudralama.jpg",
  "kalici-dipliner": "/images/campaigns/kalici-dipliner.jpg",
  "kalici-eyeliner": "/images/campaigns/kalici-eyeliner.jpg",
  "protez-tirnak-kampanya": "/images/campaigns/protez-tirnak.jpg",
  "popo-lift": "/images/campaigns/popo-lift.jpg",
  "gogus-toparlama": "/images/campaigns/gogus-toparlama.jpg",
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
      const img =
        PRODUCT_CAMPAIGN_IMAGES[p.slug] || pool[i % pool.length]!;
      return {
        id: `fallback-product-${p.slug}`,
        name: p.name,
        slug: p.slug,
        shortDesc: p.shortDesc,
        description: `${p.name}. ${p.shortDesc}`,
        price: p.price,
        image: img,
        images: JSON.stringify([img, ...pool.filter((x) => x !== img)]),
        categoryId: cat.id,
        sortOrder: i,
        isActive: true,
        inStock: p.price > 0,
        isFeatured: i < 2,
        badgeNew: false,
        badgeBestseller: false,
        badgeSale: p.slug.includes("kampanya") || p.slug === "protez-tirnak-kampanya",
        salePrice: null,
        nightImage: null,
        campaignEndsAt: null,
        specs: JSON.stringify({
          randevu: "Zorunlu",
          konum: "Adana — Gazi Paşa / Turgut Özal",
        }),
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
