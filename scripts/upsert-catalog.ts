/**
 * Non-destructive upsert: categories + products + about/mission content + contact settings.
 * Safe for Hostinger — does NOT wipe orders/admin.
 *
 *   ALLOW_PROD_SEED=true npx tsx scripts/upsert-catalog.ts
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { CATEGORIES, CATALOG_PRODUCTS } from "../src/lib/constants";
import { resolveMysqlDatabaseUrl } from "../src/lib/db-url";

const adapter = new PrismaMariaDb(resolveMysqlDatabaseUrl());
const prisma = new PrismaClient({ adapter });

const HERO = "/images/hero/hero-1.jpg";

const CATEGORY_IMAGES: Record<string, string> = {
  "cilt-bakimi": "/images/products/cilt-bakimi/1.jpg",
  "kirpik-kas": "/images/products/kirpik-kas/1.jpg",
  "bolgesel-incelme": "/images/products/bolgesel-incelme/1.jpg",
  "lazer-bayan": "/images/products/lazer-bayan/1.jpg",
  "lazer-erkek": "/images/products/lazer-erkek/1.jpg",
  "alex-lazer": "/images/products/alex-lazer/1.jpg",
};

const PRODUCT_IMAGES: Record<string, string[]> = {
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

const categoryDescriptions: Record<string, string> = {
  "cilt-bakimi":
    "Klasik ve medikal cilt bakımı, Hydrafacial, karbon maske ve cilt onarım protokolleri.",
  "kirpik-kas":
    "Kirpik lifting, kaş alma ve şekillendirme ile doğal bakışlarınızı öne çıkarın.",
  "bolgesel-incelme":
    "G5, Emslim, heykeltıraş ve G8 ile bölgesel incelme / selülit uygulamaları.",
  "lazer-bayan": "Bayan lazer epilasyon — tek seans ve paket seçenekleri.",
  "lazer-erkek": "Erkek lazer epilasyon — bölge ve paket uygulamaları.",
  "alex-lazer": "Soğuk hava üflemeli Alex lazer paketleri — kadın ve erkek.",
};

function productDescription(name: string, shortDesc: string): string {
  return `${name} — ${shortDesc} Zeynep Çeltek Güzellik’te hijyenik ortamda ve uzman ellerde uygulanır. Randevu sepetine ekleyerek WhatsApp üzerinden rezervasyon talebi oluşturabilirsiniz.`;
}

const CONTENT_UPSERTS: { key: string; title: string; content: string }[] = [
  {
    key: "mission",
    title: "Misyon",
    content:
      "Misafirlerimizin kendilerini güvende ve özel hissettiği, hijyenik ve profesyonel bir güzellik deneyimi sunmak.",
  },
  {
    key: "vision",
    title: "Vizyon",
    content:
      "Adana’da güvenilir güzellik bakımında referans salon olmak; kişiye özel protokollerle kalıcı memnuniyet yaratmak.",
  },
  {
    key: "about_intro",
    title: "Hakkımızda Giriş",
    content:
      "Zeynep Çeltek Güzellik, Adana’da Özal ve Gazi Paşa şubelerinde cilt bakımı, lazer epilasyon ve bölgesel incelme hizmetleri sunar.\n\nAmacımız herkese aynı uygulamayı yapmak değil; cilt tipinize ve ihtiyacınıza uygun protokolü birlikte seçmek. Şeffaf fiyat listesi, hijyenik ortam ve uzman kadro ile yanınızdayız.",
  },
  {
    key: "about_philosophy",
    title: "Çalışma İlkelerimiz",
    content:
      "Hijyen, şeffaflık ve kişiye özel bakım; her randevuda uyguladığımız somut kurallar.",
  },
  {
    key: "about_headline",
    title: "Hakkımızda Başlık",
    content: "GÜZELLİĞİ BİLİMLE,\nSANATA DÖNÜŞTÜRÜYORUZ",
  },
  {
    key: "values_hygiene",
    title: "Hijyenik Ortam",
    content: "Klinik standartlarda temiz uygulama alanı; steril protokoller.",
  },
  {
    key: "values_team",
    title: "Uzman Kadro",
    content: "Deneyimli güzellik uzmanlarıyla kişiye özel uygulama.",
  },
  {
    key: "values_products",
    title: "Şeffaf Fiyat",
    content: "Güncel fiyat listesiyle net bilgilendirme.",
  },
  {
    key: "values_personal",
    title: "Kişiye Özel",
    content: "Cilt ve ihtiyaca göre planlanan protokoller.",
  },
];

async function main() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_PROD_SEED !== "true"
  ) {
    throw new Error("ALLOW_PROD_SEED=true gerekli (production).");
  }

  console.log("Upserting categories + products + content…");

  for (const [index, cat] of CATEGORIES.entries()) {
    const catImage = CATEGORY_IMAGES[cat.slug] || HERO;
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: categoryDescriptions[cat.slug] || "",
        icon: cat.icon,
        image: catImage,
        sortOrder: index,
        isActive: true,
      },
      update: {
        name: cat.name,
        description: categoryDescriptions[cat.slug] || "",
        icon: cat.icon,
        image: catImage,
        sortOrder: index,
        isActive: true,
      },
    });

    const products = CATALOG_PRODUCTS.filter((p) => p.categorySlug === cat.slug);
    const pool = PRODUCT_IMAGES[cat.slug] || [catImage];

    for (const [pIndex, product] of products.entries()) {
      const img = pool[pIndex % pool.length]!;
      await prisma.product.upsert({
        where: { slug: product.slug.slice(0, 180) },
        create: {
          name: product.name,
          slug: product.slug.slice(0, 180),
          shortDesc: product.shortDesc,
          description: productDescription(product.name, product.shortDesc),
          price: product.price,
          image: img,
          images: JSON.stringify(pool),
          categoryId: category.id,
          sortOrder: pIndex,
          isActive: true,
          inStock: true,
          isFeatured: pIndex < 2,
          specs: JSON.stringify({ randevu: "Zorunlu", konum: "Adana" }),
        },
        update: {
          name: product.name,
          shortDesc: product.shortDesc,
          description: productDescription(product.name, product.shortDesc),
          price: product.price,
          image: img,
          images: JSON.stringify(pool),
          categoryId: category.id,
          sortOrder: pIndex,
          isActive: true,
          inStock: true,
        },
      });
    }
  }

  for (const row of CONTENT_UPSERTS) {
    await prisma.siteContent.upsert({
      where: { key: row.key },
      create: row,
      update: {
        title: row.title,
        content: row.content,
      },
    });
  }

  const settings = [
    { key: "email", value: "" },
    {
      key: "instagram",
      value: "https://www.instagram.com/zeynepceltek_adana/",
    },
    { key: "phone", value: "0 (534) 080 98 73" },
    { key: "whatsapp", value: "905340809873" },
    {
      key: "address",
      value: "Adana — Özal & Gazi Paşa şubeleri",
    },
  ];
  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      create: s,
      update: { value: s.value },
    });
  }

  const counts = {
    categories: await prisma.category.count(),
    products: await prisma.product.count(),
  };
  console.log("Done:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
