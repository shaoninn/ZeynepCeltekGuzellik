import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { hashPassword } from "../src/lib/auth";
import { CATEGORIES, CATALOG_PRODUCTS } from "../src/lib/constants";
import { projectData } from "./projects-data";
import { SAMPLE_BLOG_POSTS } from "./blog-data";
import { resolveMysqlDatabaseUrl } from "../src/lib/db-url";

if (
  process.env.NODE_ENV === "production" &&
  process.env.ALLOW_PROD_SEED !== "true"
) {
  throw new Error(
    "Production'da seed yasak (tüm tabloları siler). Gerçekten gerekliyse ALLOW_PROD_SEED=true verin."
  );
}

const adapter = new PrismaMariaDb(resolveMysqlDatabaseUrl());
const prisma = new PrismaClient({ adapter });

const HERO = "/images/hero/hero-1.jpg";
const LOGO = "/images/logo/logo.png";

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
  "lazer-bayan":
    "Bayan lazer epilasyon — tek seans ve paket seçenekleri.",
  "lazer-erkek":
    "Erkek lazer epilasyon — bölge ve paket uygulamaları.",
  "alex-lazer":
    "Soğuk hava üflemeli Alex lazer paketleri — kadın ve erkek.",
};

function productDescription(name: string, shortDesc: string): string {
  return `${name} — ${shortDesc} Zeynep Çeltek Güzellik’te hijyenik ortamda ve uzman ellerde uygulanır. Randevu sepetine ekleyerek WhatsApp üzerinden rezervasyon talebi oluşturabilirsiniz; kesin saat telefon veya mesajla netleşir.`;
}

const siteContent = [
  {
    key: "hero_title",
    title: "Hero Başlık",
    content: "Güzelliğinize Değer Veriyoruz",
  },
  {
    key: "hero_subtitle",
    title: "Hero Alt Başlık",
    content: "ZEYNEP ÇELTEK GÜZELLİK MERKEZİ",
  },
  {
    key: "hero_body",
    title: "Hero Açıklama",
    content:
      "Kişiye özel çözümler ve uzman kadromuzla güzelliğinize değer katıyoruz. Cilt bakımı, lazer epilasyon ve bölgesel incelmede Adana’da yanınızdayız.",
  },
  {
    key: "hero_image",
    title: "Hero Görsel",
    content: HERO,
  },
  {
    key: "about_image_1",
    title: "Hakkımızda Görsel 1",
    content: "/images/about/about-1.jpg",
  },
  {
    key: "about_image_2",
    title: "Hakkımızda Görsel 2",
    content: "/images/about/about-2.jpg",
  },
  {
    key: "about_image_3",
    title: "Hakkımızda Görsel 3",
    content: "/images/about/about-3.jpg",
  },
  {
    key: "about_image_4",
    title: "Hakkımızda Görsel 4",
    content: "/images/about/about-4.jpg",
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
    key: "values_hygiene",
    title: "Hijyenik Ortam",
    content:
      "Klinik standartlarda temiz uygulama alanı; steril protokoller.",
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
  {
    key: "cta_title",
    title: "CTA Başlık",
    content: "Kendinizi şımartın, ışıldayın!",
  },
  {
    key: "cta_button_label",
    title: "CTA Buton",
    content: "Randevu Al",
  },
  {
    key: "services_section_title",
    title: "Hizmetler Başlık",
    content: "Popüler Hizmetlerimiz",
  },
  {
    key: "featured_products_title",
    title: "Öne Çıkan Uygulamalar",
    content: "Öne çıkan uygulamalar",
  },
  {
    key: "shipping_banner_title",
    title: "Bilgi Bandı",
    content: "WhatsApp ile hızlı randevu",
  },
  {
    key: "why_us_title",
    title: "Neden Biz Başlık",
    content: "Neden Zeynep Çeltek Güzellik?",
  },
  { key: "why_us_1", title: "Neden Biz 1", content: "Uzman Kadro" },
  { key: "why_us_2", title: "Neden Biz 2", content: "Hijyen Garantisi" },
  { key: "why_us_3", title: "Neden Biz 3", content: "Şeffaf Fiyatlandırma" },
  { key: "why_us_4", title: "Neden Biz 4", content: "Kişiye Özel Bakım" },
  { key: "why_us_5", title: "Neden Biz 5", content: "Modern Cihazlar" },
  { key: "why_us_6", title: "Neden Biz 6", content: "Kolay Randevu" },
  {
    key: "feature_bar_1_title",
    title: "Özellik 1",
    content: "Uzman Kadro",
  },
  {
    key: "feature_bar_1_desc",
    title: "Özellik 1 Açıklama",
    content: "Alanında deneyimli güzellik uzmanları.",
  },
  {
    key: "feature_bar_2_title",
    title: "Özellik 2",
    content: "Kişiye Özel",
  },
  {
    key: "feature_bar_2_desc",
    title: "Özellik 2 Açıklama",
    content: "Cilt ve ihtiyaca göre planlanan uygulamalar.",
  },
  {
    key: "feature_bar_3_title",
    title: "Özellik 3",
    content: "Hijyen Standardı",
  },
  {
    key: "feature_bar_3_desc",
    title: "Özellik 3 Açıklama",
    content: "Steril ortam ve güvenilir ürünler.",
  },
  {
    key: "feature_bar_4_title",
    title: "Özellik 4",
    content: "Memnuniyet",
  },
  {
    key: "feature_bar_4_desc",
    title: "Özellik 4 Açıklama",
    content: "Her seans sonrası takip ve destek.",
  },
  { key: "stat_1_value", title: "İstatistik 1", content: "4.677+" },
  { key: "stat_1_label", title: "İstatistik 1 Etiket", content: "Gönderi" },
  { key: "stat_2_value", title: "İstatistik 2", content: "1M+" },
  { key: "stat_2_label", title: "İstatistik 2 Etiket", content: "Takipçi" },
  { key: "stat_3_value", title: "İstatistik 3", content: "1.547+" },
  { key: "stat_3_label", title: "İstatistik 3 Etiket", content: "Takip" },
  { key: "stat_4_value", title: "İstatistik 4", content: "%98" },
  {
    key: "stat_4_label",
    title: "İstatistik 4 Etiket",
    content: "Memnuniyet",
  },
  {
    key: "stats_script",
    title: "İstatistik Script",
    content: "Kendinizi şımartın, ışıldayın!",
  },
  {
    key: "gallery_section_title",
    title: "Galeri Başlık",
    content: "Kampanyalar & Uygulamalarımız",
  },
  {
    key: "packages_section_title",
    title: "Paketler Başlık",
    content: "Paketlerimiz",
  },
  {
    key: "campaign_title",
    title: "Kampanya Başlık",
    content: "Bu Haftaya Özel: Alex 3 Bölge",
  },
  {
    key: "campaign_desc",
    title: "Kampanya Açıklama",
    content:
      "Soğuk hava üflemeli Alex — bacak, kolaltı ve genital 5 seans. Kontenjan sınırlıdır.",
  },
  {
    key: "campaign_price",
    title: "Kampanya Fiyat",
    content: "₺4.000",
  },
  {
    key: "faq_eyebrow",
    title: "SSS Üst",
    content: "Sıkça sorulanlar",
  },
  {
    key: "faq_title",
    title: "SSS Başlık",
    content: "Hizmetler hakkında",
  },
  {
    key: "faq_1_q",
    title: "SSS 1 Soru",
    content: "Randevu nasıl alınır?",
  },
  {
    key: "faq_1_a",
    title: "SSS 1 Cevap",
    content:
      "WhatsApp, telefon veya sitedeki randevu sepeti ile talebinizi iletebilirsiniz; saat teyidi mesajla yapılır.",
  },
  {
    key: "faq_2_q",
    title: "SSS 2 Soru",
    content: "Hangi hizmetleri sunuyorsunuz?",
  },
  {
    key: "faq_2_a",
    title: "SSS 2 Cevap",
    content:
      "Cilt bakımı, kirpik & kaş, bölgesel incelme, bayan/erkek lazer epilasyon ve soğuk hava üflemeli Alex paketleri.",
  },
  {
    key: "faq_3_q",
    title: "SSS 3 Soru",
    content: "Fiyatlar güncel mi?",
  },
  {
    key: "faq_3_a",
    title: "SSS 3 Cevap",
    content:
      "Sitedeki fiyat listesi salondaki güncel listeden aktarılmıştır. Kampanya ve paket detayları için bizi arayın.",
  },
  {
    key: "faq_4_q",
    title: "SSS 4 Soru",
    content: "Şubeleriniz nerede?",
  },
  {
    key: "faq_4_a",
    title: "SSS 4 Cevap",
    content:
      "Adana’da Özal ve Gazi Paşa şubelerimiz bulunmaktadır. Yol tarifi için iletişim sayfamızı veya WhatsApp hattımızı kullanın.",
  },
  {
    key: "testimonial_section_title",
    title: "Yorumlar Başlık",
    content: "Müşterilerimiz Ne Diyor?",
  },
  {
    key: "testimonial_section_desc",
    title: "Yorumlar Açıklama",
    content: "Misafirlerimizin deneyimlerinden notlar.",
  },
  {
    key: "testimonial_1_quote",
    title: "Yorum 1",
    content:
      "Cilt bakımı sonrası cildim gerçekten ferahladı. Ortam çok temiz, ekip ilgiliydi.",
  },
  {
    key: "testimonial_1_name",
    title: "Yorum 1 İsim",
    content: "Ayşe K.",
  },
  {
    key: "testimonial_1_place",
    title: "Yorum 1 Konum",
    content: "Adana",
  },
  {
    key: "testimonial_2_quote",
    title: "Yorum 2",
    content:
      "Lazer epilasyon seanslarım düzenli ilerledi. Fiyatlar net, iletişim hızlıydı.",
  },
  {
    key: "testimonial_2_name",
    title: "Yorum 2 İsim",
    content: "Elif Y.",
  },
  {
    key: "testimonial_2_place",
    title: "Yorum 2 Konum",
    content: "Adana",
  },
  {
    key: "testimonial_3_quote",
    title: "Yorum 3",
    content:
      "G5 ve Emslim paketimi tamamladım; sonuçtan memnunum. Randevu WhatsApp’tan çok kolaydı.",
  },
  {
    key: "testimonial_3_name",
    title: "Yorum 3 İsim",
    content: "Selin D.",
  },
  {
    key: "testimonial_3_place",
    title: "Yorum 3 Konum",
    content: "Adana",
  },
  {
    key: "footer_blurb",
    title: "Footer Açıklama",
    content:
      "Adana’da cilt bakımı, lazer epilasyon ve bölgesel incelme. Özal & Gazi Paşa şubeleri.",
  },
  {
    key: "value_prop_1_title",
    title: "Değer 1",
    content: "Uzman Kadro",
  },
  {
    key: "value_prop_1_desc",
    title: "Değer 1 Açıklama",
    content: "Deneyimli güzellik uzmanlarıyla kişiye özel protokol",
  },
  {
    key: "value_prop_2_title",
    title: "Değer 2",
    content: "Hijyen Garantisi",
  },
  {
    key: "value_prop_2_desc",
    title: "Değer 2 Açıklama",
    content: "Klinik standartlarda steril uygulama alanı",
  },
  {
    key: "value_prop_3_title",
    title: "Değer 3",
    content: "Şeffaf Fiyat",
  },
  {
    key: "value_prop_3_desc",
    title: "Değer 3 Açıklama",
    content: "Güncel fiyat listesiyle net bilgilendirme",
  },
  {
    key: "value_prop_4_title",
    title: "Değer 4",
    content: "Kolay Randevu",
  },
  {
    key: "value_prop_4_desc",
    title: "Değer 4 Açıklama",
    content: "WhatsApp ve telefon ile hızlı iletişim",
  },
];

const navItems = [
  { label: "ANA SAYFA", href: "/", sortOrder: 0 },
  { label: "HİZMETLERİMİZ", href: "/hizmetler", sortOrder: 1 },
  { label: "PAKETLER", href: "/#paketler", sortOrder: 2 },
  { label: "KAMPANYALAR", href: "/#kampanyalar", sortOrder: 3 },
  { label: "HAKKIMIZDA", href: "/hakkimizda", sortOrder: 4 },
  { label: "İLETİŞİM", href: "/iletisim", sortOrder: 5 },
];

async function main() {
  console.log("Seeding Zeynep Çeltek Güzellik...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.project.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.siteContent.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.navItem.deleteMany();
  await prisma.adminUser.deleteMany();

  const plainPassword = process.env.ADMIN_PASSWORD || "admin123";
  if (plainPassword.length < 6) {
    throw new Error("ADMIN_PASSWORD en az 6 karakter olmalı");
  }
  if (!process.env.ADMIN_PASSWORD) {
    console.warn(
      "⚠ ADMIN_PASSWORD tanımlı değil — geliştirme şifresi admin123 kullanılıyor. Canlıda değiştirin."
    );
  }
  const adminPassword = await hashPassword(plainPassword);
  await prisma.adminUser.create({
    data: {
      email: process.env.ADMIN_EMAIL || "admin@zeynepceltekguzellik.local",
      passwordHash: adminPassword,
      name: "Zeynep Çeltek Admin",
      role: "SUPER",
    },
  });

  for (const [index, cat] of CATEGORIES.entries()) {
    const products = CATALOG_PRODUCTS.filter((p) => p.categorySlug === cat.slug);
    const catImage = CATEGORY_IMAGES[cat.slug] || HERO;
    const productPool = PRODUCT_IMAGES[cat.slug] || [catImage];

    const category = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: categoryDescriptions[cat.slug] || "",
        icon: cat.icon,
        image: catImage,
        sortOrder: index,
        isActive: true,
      },
    });

    for (const [pIndex, product] of products.entries()) {
      const img = productPool[pIndex % productPool.length];
      await prisma.product.create({
        data: {
          name: product.name,
          slug: product.slug.slice(0, 180),
          shortDesc: product.shortDesc,
          description: productDescription(product.name, product.shortDesc),
          price: product.price,
          image: img,
          images: JSON.stringify(productPool),
          categoryId: category.id,
          sortOrder: pIndex,
          isActive: true,
          inStock: true,
          specs: JSON.stringify({
            randevu: "Zorunlu",
            konum: "Adana",
          }),
        },
      });
    }
  }

  const categories = await prisma.category.findMany();
  const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  for (const [index, project] of projectData.entries()) {
    await prisma.project.create({
      data: {
        title: project.title,
        slug: project.slug,
        location: project.location,
        description: project.description,
        image: project.image,
        images: JSON.stringify([...project.images]),
        categoryId: categoryMap[project.categorySlug] || null,
        sortOrder: index,
        isActive: true,
        isFeatured: index < 10,
      },
    });
  }

  for (const content of siteContent) {
    await prisma.siteContent.create({ data: content });
  }

  await prisma.navItem.createMany({
    data: navItems.map((n) => ({ ...n, isActive: true })),
  });

  await prisma.siteSetting.createMany({
    data: [
      { key: "phone", value: "0 (534) 080 98 73" },
      { key: "email", value: "" },
      {
        key: "address",
        value: "Adana — Özal & Gazi Paşa şubeleri",
      },
      { key: "instagram", value: "https://www.instagram.com/zeynepceltek_adana/" },
      { key: "whatsapp", value: "905340809873" },
      { key: "location_label", value: "Adana" },
      { key: "google_reviews_url", value: "" },
      {
        key: "work_hours_weekdays",
        value: "Pazartesi - Cumartesi 09:00-19:00",
      },
      { key: "work_hours_sunday", value: "Pazar: Kapalı" },
    ],
  });

  await prisma.blogPost.createMany({
    data: SAMPLE_BLOG_POSTS.map((post, i) => ({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      isPublished: true,
      publishedAt: new Date(Date.now() - i * 86_400_000),
    })),
  });

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
