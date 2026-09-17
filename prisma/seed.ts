import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { hashPassword } from "../src/lib/auth";
import { CATEGORIES, CATALOG_PRODUCTS, PACKAGES } from "../src/lib/constants";
import { SALON_FAQS } from "../src/lib/faq";
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
const LOGO = "/images/logo/logo-nobg.png";

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
    "Cilt tipinize göre planlanan klasik ve medikal bakım, Hydrafacial derin temizlik, karbon maske, vitamin uygulamaları ve Mikroplus yüz-boyun toparlama. Adana’daki her iki şubemizde hijyenik ortamda, uzman kadroyla uygulanır.",
  "kirpik-kas":
    "Kirpik lifting ile doğal kıvrım ve bakış açıklığı; kaş alma ve şekillendirme ile yüz hatlarınıza uygun form. Hızlı, hassas ve bakımlı bir görünüm odaklı uygulamalar.",
  "bolgesel-incelme":
    "Selülit görünümü, bölgesel yağ ve sıkılık için G5 masajı, Emslim, heykeltıraş ve G8 protokolleri. 10 seanslık paketlerle ölçülebilir, takip edilen bir plan sunarız.",
  "lazer-bayan":
    "Kadınlara özel lazer epilasyon: tek seans veya 8 seanslık paketler. Bölge seçimi ve seans aralığı cilt-kıl tipine göre belirlenir; hijyenik ortamda uygulanır.",
  "lazer-erkek":
    "Erkek cilt ve kıl yapısına uygun lazer epilasyon. Gıdı, göğüs, sırt, bacak ve kemer üstü paketleriyle net fiyat ve planlı seans takibi.",
  "alex-lazer":
    "Epilyum Alex Alexandrite teknolojisi: kamera destekli cilt-kıl analizi ve güçlü soğutma ile konforlu uygulama. Kadın ve erkek için 5–10 seanslık paket seçenekleri.",
};

function productDescription(name: string, shortDesc: string): string {
  return `${name}. ${shortDesc} Zeynep Çeltek Güzellik’te (Adana — Gazi Paşa ve Turgut Özal) hijyenik ortamda, uzman kadroyla uygulanır. Randevu sepetine ekleyerek talep oluşturabilir; kesin saat WhatsApp veya telefonla netleşir.`;
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
    key: "about_headline",
    title: "Hakkımızda Başlık",
    content: "GÜZELLİĞİ BİLİMLE,\nSANATA DÖNÜŞTÜRÜYORUZ",
  },
  {
    key: "about_intro",
    title: "Hakkımızda Giriş",
    content:
      "Zeynep Çeltek Güzellik; Adana’da Gazi Paşa (Seyhan) ve Turgut Özal (Çukurova) şubelerinde faaliyet gösteren, 30 yılı aşkın sektör tecrübesini modern cihaz parkı ve kişiye özel protokollerle birleştiren bir güzellik merkezidir. Cilt bakımı, lazer epilasyon, Epilyum Alex Alexandrite uygulamaları, bölgesel incelme ile kirpik ve kaş hizmetlerini aynı çatı altında, şeffaf fiyatlandırma ve hijyen odaklı bir anlayışla sunarız.\n\nBizim için güzellik tek seferlik bir işlem değil; doğru analiz, doğru uygulama ve takip edilebilir seans planından oluşan bir süreçtir. Her misafirimizin cilt tipi, kıl yapısı, yaşam temposu ve hedefleri farklıdır. Bu yüzden “herkese aynı paket” yaklaşımı yerine, ihtiyaca göre şekillenen bakım yolları öneririz.\n\nRandevu sürecini de sade tutarız: WhatsApp veya telefonla hızlı iletişim, sitedeki randevu sepeti ile net talep iletimi; onay sonrası PayTR ile güvenli kart ödemesi veya havale seçenekleri. Amacımız, Adana’da kendinizi güvende hissettiğiniz, neyin neden yapıldığını anladığınız ve sonucunu takip edebildiğiniz bir salon deneyimi sunmaktır.",
  },
  {
    key: "about_philosophy",
    title: "Çalışma İlkelerimiz",
    content:
      "Çalışma ilkelerimizin özeti nettir: acele etmeden dinlemek, abartısız önermek, uygularken açıklamak ve seans sonrasında da desteklemek.\n\nHer seansı standart bir “menü işlemi” gibi değil; planlı bir bakım adımı olarak görürüz. Randevu öncesinde beklentinizi ve varsa önceki uygulamalarınızı öğreniriz. Uygulama sırasında cihaz, ürün ve seans aralığı seçimini cilt-kıl değerlendirmesine göre yaparız. Seans sonrasında ise nelere dikkat etmeniz gerektiğini açıkça paylaşırız.\n\nHijyen, bilgilendirme ve kişiye özel yaklaşım bizim için slogan değil; günlük iş disiplinimizin parçasıdır. Misafirlerimize ne yapılacağını ve neden tercih edildiğini anlaşılır dilde anlatırız — böylece karar süreci şeffaf, sonuçlar ise daha sürdürülebilir olur.",
  },
  {
    key: "mission",
    title: "Misyon",
    content:
      "Misyonumuz; misafirlerimizin kendilerini güvende, anlaşılmış ve özel hissettiği, klinik hijyen standartlarında profesyonel bir güzellik deneyimi sunmaktır.\n\nAdana’daki her iki şubemizde de aynı kalite çizgisini koruyarak doğru analizi, doğru uygulamayı ve takip edilebilir seans planını bir araya getirmek istiyoruz. Kısa vadeli vaatler yerine, ölçülebilir ilerleme ve dürüst bilgilendirme ile uzun soluklu memnuniyet yaratmayı hedefleriz.\n\nHer protokolde önceliğimiz: güvenli uygulama ortamı, uzman kontrolü ve misafirin bilgilendirilmiş onayıdır.",
  },
  {
    key: "vision",
    title: "Vizyon",
    content:
      "Vizyonumuz; Adana’da güvenilir güzellik bakımının referans adreslerinden biri olmak ve kişiye özel protokollerle kalıcı memnuniyet üreten bir marka olarak büyümektir.\n\nTeknolojiyi (güncel lazer ve bakım cihazları) uzman kadro deneyimiyle birleştirerek; hızlı ama yüzeysel çözümler yerine sürdürülebilir sonuçlara odaklanıyoruz. İki şubeli yapımızı, hizmet çeşitliliğimizi ve şeffaf iletişimimizi güçlendirerek hem yeni misafirlere hem de düzenli bakım planı olan misafirlerimize tutarlı bir standart sunmayı amaçlıyoruz.\n\nUzun vadede hedefimiz; “ne yapılırsa yapılsın” değil, “size ne uygunsa o yapılsın” anlayışının Adana’daki en bilinen temsilcilerinden biri olmaktır.",
  },
  {
    key: "about_why_us",
    title: "Neden Zeynep Çeltek",
    content:
      "Zeynep Çeltek’i tercih etmenizin birkaç somut nedeni vardır. Birincisi konum: Seyhan (Gazi Paşa) ve Çukurova (Turgut Özal) şubeleriyle şehrin iki yakasında aynı standartta hizmet veririz. İkincisi şeffaflık: güncel fiyat listesi, paket içerikleri ve seans planı nettir; sürpriz ücret yerine onaylı teklif sunarız.\n\nÜçüncüsü kapsam: cilt bakımı (Hydrafacial, medikal bakım, karbon maske, Mikroplus yüz-boyun toparlama), kadın ve erkek lazer epilasyon, Epilyum Alex soğutmalı Alexandrite paketleri, bölgesel incelme (G5, Emslim, heykeltıraş, G8) ile kirpik-kaş uygulamalarını tek çatı altında bulursunuz. Dördüncüsü süreç yönetimi: ihtiyacınızı dinler, abartısız önerir, randevuyu planlar ve sonuçları takip ederiz.\n\nKısaca; trendy vaatler yerine ölçülebilir bakım, hızlı satış yerine doğru protokol — Adana’da planlı güzellik bakımı arayanlar için tasarlanmış bir salon deneyimi.",
  },
  {
    key: "values_hygiene",
    title: "Hijyenik Ortam",
    content:
      "Uygulama alanlarımızı klinik hijyen anlayışıyla yönetiriz. Her seans öncesi yüzey ve ekipman kontrolü, tek kullanımlık veya sterilize edilmiş malzemeler ve düzenli alan denetimi ile misafir güvenliğini önceliklendiririz. Temizlik bizim için ek hizmet değil, temel çalışma koşuludur.",
  },
  {
    key: "values_team",
    title: "Uzman Kadro",
    content:
      "Deneyimli güzellik uzmanlarımız; cilt tipi, kıl yapısı ve hedefinize göre protokol seçer. Lazer parametrelerinden bakım ürünlerine kadar kararlar rastgele değil, değerlendirme sonrası alınır. Seans aralıkları ve ilerleme takibi de aynı özenle planlanır.",
  },
  {
    key: "values_products",
    title: "Şeffaf Fiyat",
    content:
      "Fiyatları güncel listede açıkça paylaşırız. Paket içerikleri, seans sayıları ve ödeme seçenekleri (PayTR güvenli kart ödemesi veya havale) randevu teyidinde netleşir. Sürpriz ek ücret yerine şeffaf teklif ve yazılı / mesajlı onay ile ilerleriz.",
  },
  {
    key: "values_personal",
    title: "Kişiye Özel",
    content:
      "Tek tip menü dayatmayız. Analiz sonrası sizin için en uygun adımları birlikte belirleriz: tek seans deneme, paket programı veya kombine bakım. Yaşam temposunuza ve bütçenize uygun, gerçekçi bir plan çıkarmak önceliğimizdir.",
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
    content: "SEANS SONRASI TAKİP",
  },
  {
    key: "feature_bar_4_desc",
    title: "Özellik 4 Açıklama",
    content: "Her seans sonrası takip ve destek.",
  },
  { key: "stat_1_value", title: "İstatistik 1", content: "2" },
  { key: "stat_1_label", title: "İstatistik 1 Etiket", content: "Şube" },
  { key: "stat_2_value", title: "İstatistik 2", content: "30+" },
  { key: "stat_2_label", title: "İstatistik 2 Etiket", content: "Yıl Deneyim" },
  { key: "stat_3_value", title: "İstatistik 3", content: "6" },
  { key: "stat_3_label", title: "İstatistik 3 Etiket", content: "Hizmet Alanı" },
  { key: "stat_4_value", title: "İstatistik 4", content: "WA" },
  {
    key: "stat_4_label",
    title: "İstatistik 4 Etiket",
    content: "WhatsApp randevu",
  },
  {
    key: "stats_script",
    title: "İstatistik Script",
    content: "Kendinizi şımartın, ışıldayın!",
  },
  {
    key: "gallery_section_title",
    title: "Galeri Başlık",
    content: "Galerilerimiz",
  },
  {
    key: "campaigns_page_eyebrow",
    title: "Galeriler Üst",
    content: "Galeriler",
  },
  {
    key: "campaigns_page_title",
    title: "Galeriler Başlık",
    content: "Salonumuzdan Kareler",
  },
  {
    key: "campaigns_page_intro",
    title: "Galeriler Açıklama",
    content:
      "Uygulama alanlarımızdan ve bakım süreçlerimizden bir seçki. Öne çıkan hizmet ve paket önerilerine de buradan ulaşabilirsiniz.",
  },
  {
    key: "packages_section_title",
    title: "Paketler Başlık",
    content: "Paketlerimiz",
  },
  {
    key: "campaign_title",
    title: "Kampanya Başlık",
    content: "Bu Haftaya Özel: Epilyum Alex 3 Bölge",
  },
  {
    key: "campaign_desc",
    title: "Kampanya Açıklama",
    content:
      "Epilyum Alex — bacak, kolaltı ve genital 5 seans. Kontenjan sınırlıdır.",
  },
  {
    key: "campaign_price",
    title: "Kampanya Fiyat",
    content: "₺4.000",
  },
  {
    key: "faq_eyebrow",
    title: "SSS Üst",
    content: "SSS",
  },
  {
    key: "faq_title",
    title: "SSS Başlık",
    content: "Sık sorulan sorular",
  },
  {
    key: "faq_section_eyebrow",
    title: "SSS Üst (bölüm)",
    content: "SSS",
  },
  {
    key: "faq_section_title",
    title: "SSS Başlık (bölüm)",
    content: "Sık sorulan sorular",
  },
  ...SALON_FAQS.flatMap((item, i) => {
    const n = i + 1;
    return [
      {
        key: `faq_${n}_q`,
        title: `SSS ${n} Soru`,
        content: item.q,
      },
      {
        key: `faq_${n}_a`,
        title: `SSS ${n} Cevap`,
        content: item.a,
      },
    ];
  }),
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
  { label: "GALERİLER", href: "/#galeriler", sortOrder: 3 },
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
            konum: "Adana — Gazi Paşa / Turgut Özal",
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
      { key: "phone", value: "0 (545) 457 06 56" },
      { key: "email", value: "" },
      {
        key: "address",
        value:
          "Gazi Paşa: CarrefourSA Expres Market Üstü, Cemal Paşa Mh. Gazipaşa Bulvarı, 63003. Sk. Tek Apt Kat 4 No 41, 01120 Seyhan/Adana · Turgut Özal: Güzelyalı, Turgut Özal Blv. No:102, 01170 Çukurova/Adana",
      },
      { key: "instagram", value: "https://www.instagram.com/zeynepceltek_adana/" },
      { key: "whatsapp", value: "905454570656" },
      { key: "location_label", value: "Adana" },
      { key: "google_reviews_url", value: "" },
      { key: "branch_gazipasa_phone", value: "0 (541) 457 06 54" },
      {
        key: "branch_gazipasa_address",
        value:
          "CarrefourSA Expres Market Üstü, Cemal Paşa Mh. Gazipaşa Bulvarı, 63003. Sk. Tek Apt Kat 4 No 41, 01120 Seyhan/Adana",
      },
      { key: "branch_turgutozal_phone", value: "0 (545) 457 06 56" },
      {
        key: "branch_turgutozal_address",
        value: "Güzelyalı, Turgut Özal Blv. No:102, 01170 Çukurova/Adana",
      },
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

  for (const [index, pkg] of PACKAGES.entries()) {
    await prisma.servicePackage.upsert({
      where: { slug: pkg.slug },
      create: {
        slug: pkg.slug,
        name: pkg.name,
        price: pkg.price,
        sessions: pkg.sessions,
        featured: pkg.featured,
        badge: "badge" in pkg ? pkg.badge : null,
        image: pkg.image,
        shortDesc: pkg.shortDesc,
        items: JSON.stringify([...pkg.items]),
        sortOrder: index,
        isActive: true,
      },
      update: {
        name: pkg.name,
        price: pkg.price,
        sessions: pkg.sessions,
        featured: pkg.featured,
        badge: "badge" in pkg ? pkg.badge : null,
        image: pkg.image,
        shortDesc: pkg.shortDesc,
        items: JSON.stringify([...pkg.items]),
        sortOrder: index,
        isActive: true,
      },
    });
  }

  await prisma.campaignOffer.upsert({
    where: { slug: "guzellik-paketi-one-cikan" },
    create: {
      title: "Güzellik Paketi",
      slug: "guzellik-paketi-one-cikan",
      description:
        "10 seanslık yüz-boyun toparlama paketi. Güncel fiyat paket sayfasındadır.",
      href: "/paketler/guzellik-paketi",
      image: "/images/products/cilt-bakimi/2.jpg",
      isActive: true,
      sortOrder: 0,
    },
    update: {},
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
