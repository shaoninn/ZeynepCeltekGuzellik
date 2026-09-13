export const SITE_NAME = "Zeynep Çeltek Güzellik";
export const SITE_OWNER = "Zeynep Çeltek";
export const SITE_TAGLINE = "Güzelliğinize değer veriyoruz.";
/** Primary public line — Turgut Özal WhatsApp (Instagram randevu hattı). */
export const PHONE = "0 (545) 457 06 56";
export const PHONE_RAW = "905454570656";
export const PHONE_ALT = "";
export const WHATSAPP_URL = `https://wa.me/${PHONE_RAW}`;
export const EMAIL = "";
export const ADDRESS =
  "Gazi Paşa (Seyhan) ve Turgut Özal (Çukurova) şubeleri, Adana";
export const LOCATION_LABEL = "Adana";
export const INSTAGRAM = "https://www.instagram.com/zeynepceltek_adana/";
export const INSTAGRAM_HANDLES = [
  {
    handle: "@zeynepceltek_adana",
    href: "https://www.instagram.com/zeynepceltek_adana/",
  },
  {
    handle: "@zeynepceltek_t.ozal",
    href: "https://www.instagram.com/zeynepceltek_t.ozal/",
  },
] as const;
/** Google İşletme Profili — domain ile birlikte sonra */
export const GOOGLE_BUSINESS_URL = "";
export const GOOGLE_MAPS_EMBED_QUERY = "Zeynep Çeltek Güzellik, Adana";
export const LEGACY_SITE_URL = "";
export const WORK_HOURS = {
  weekdays: "Pazartesi - Cumartesi 09:00-19:00",
  sunday: "Pazar: Kapalı",
};

export const BRANCHES = [
  {
    name: "Gazi Paşa Şube",
    address:
      "CarrefourSA Expres Market Üstü, Cemal Paşa Mh. Gazipaşa Bulvarı, 63003. Sk. Tek Apt Kat 4 No 41, 01120 Seyhan/Adana",
    phones: ["0 (541) 457 06 54"],
    mapQuery:
      "Cemal Paşa Mahallesi Gazipaşa Bulvarı 63003. Sokak Tek Apt Kat 4 No 41 Seyhan Adana",
  },
  {
    name: "Turgut Özal Şube",
    address: "Güzelyalı, Turgut Özal Blv. No:102, 01170 Çukurova/Adana",
    phones: ["0 (545) 457 06 56", "0 (322) 232 59 52"],
    mapQuery: "Güzelyalı Turgut Özal Bulvarı No 102 Çukurova Adana",
  },
] as const;

export const LEGAL_LINKS = [
  { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
  { href: "/kullanim-kosullari", label: "Kullanım Koşulları" },
  { href: "/kvkk", label: "KVKK" },
  { href: "/mesafeli-satis", label: "Mesafeli Satış" },
  { href: "/iade-politikasi", label: "İade Politikası" },
  { href: "/teslimat", label: "Teslimat" },
  { href: "/cerez-politikasi", label: "Çerez Politikası" },
] as const;

export const PRIMARY_NAV_HREFS = [
  "/",
  "/hizmetler",
  "/#paketler",
  "/#kampanyalar",
  "/hakkimizda",
  "/iletisim",
] as const;

export const PRIMARY_NAV_LINKS = [
  { href: "/", label: "ANA SAYFA" },
  { href: "/hizmetler", label: "HİZMETLERİMİZ" },
  { href: "/#paketler", label: "PAKETLER" },
  { href: "/#kampanyalar", label: "KAMPANYALAR" },
  { href: "/hakkimizda", label: "HAKKIMIZDA" },
  { href: "/iletisim", label: "İLETİŞİM" },
] as const;

export const NAV_LINKS = [
  { href: "/", label: "ANA SAYFA" },
  { href: "/hizmetler", label: "HİZMETLERİMİZ" },
  { href: "/#paketler", label: "PAKETLER" },
  { href: "/#kampanyalar", label: "KAMPANYALAR" },
  { href: "/hakkimizda", label: "HAKKIMIZDA" },
  { href: "/iletisim", label: "İLETİŞİM" },
  { href: "/sepet", label: "RANDEVU SEPETİ" },
] as const;

/** Ana sayfa popüler hizmet ikon sırası (mockup) */
export const POPULAR_SERVICES = [
  {
    name: "Eğitimlerimiz",
    slug: "cilt-bakimi",
    href: "/hizmetler",
    description: "Uzman kadro ile uygulamalı güzellik eğitimleri.",
    icon: "graduation",
  },
  {
    name: "İnceleme",
    slug: "cilt-bakimi",
    href: "/iletisim",
    description: "Ücretsiz cilt ve ihtiyaç analizi.",
    icon: "search",
  },
  {
    name: "Cilt Bakımı",
    slug: "cilt-bakimi",
    href: "/hizmetler/cilt-bakimi",
    description: "Hydrafacial, medikal bakım ve onarım.",
    icon: "droplet",
  },
  {
    name: "Yüz-Boyun Toparlama",
    slug: "cilt-bakimi",
    href: "/hizmetler/cilt-bakimi",
    description: "Mikroplus ile yüz ve boyun toparlama.",
    icon: "sparkles",
  },
  {
    name: "Lazer Epilasyon",
    slug: "lazer-bayan",
    href: "/hizmetler/lazer-bayan",
    description: "Bayan ve erkek lazer paketleri.",
    icon: "zap",
  },
  {
    name: "Bölgesel İncelme",
    slug: "bolgesel-incelme",
    href: "/hizmetler/bolgesel-incelme",
    description: "G5, Emslim, heykeltıraş ve G8.",
    icon: "waves",
  },
] as const;

export const VALUE_PROPS = [
  {
    icon: "quality",
    title: "Uzman Kadro",
    desc: "Deneyimli güzellik uzmanlarıyla kişiye özel protokol",
  },
  {
    icon: "design",
    title: "Hijyen Garantisi",
    desc: "Klinik standartlarda steril uygulama alanı",
  },
  {
    icon: "clock",
    title: "Şeffaf Fiyat",
    desc: "Güncel fiyat listesiyle net bilgilendirme",
  },
  {
    icon: "support",
    title: "Kolay Randevu",
    desc: "WhatsApp ve telefon ile hızlı iletişim",
  },
] as const;

export const FEATURE_BAR = [
  {
    icon: "search",
    title: "UZMAN KADRO",
    desc: "Deneyimli güzellik uzmanları.",
  },
  {
    icon: "design",
    title: "GÜVENLİ & HİJYENİK",
    desc: "Klinik standartlarda steril ortam.",
  },
  {
    icon: "production",
    title: "KİŞİYE ÖZEL ÇÖZÜMLER",
    desc: "İhtiyaca göre planlanan protokoller.",
  },
  {
    icon: "support",
    title: "MEMNUNİYET GARANTİSİ",
    desc: "Her seans sonrası takip ve destek.",
  },
] as const;

export const STATS = [
  { value: "4.677+", label: "Gönderi" },
  { value: "1M+", label: "Takipçi" },
  { value: "1.547+", label: "Takip" },
  { value: "%98", label: "Memnuniyet" },
] as const;

export const WHY_US = [
  "Uzman Kadro",
  "Hijyen Garantisi",
  "Şeffaf Fiyatlandırma",
  "Kişiye Özel Bakım",
  "Modern Cihazlar",
  "Kolay Randevu",
] as const;

/** Hizmet kategorileri — el yazması fiyat listeleri */
export const CATEGORIES = [
  { name: "Cilt Bakımı", slug: "cilt-bakimi", icon: "design" },
  { name: "Kirpik & Kaş", slug: "kirpik-kas", icon: "design" },
  { name: "Bölgesel İncelme", slug: "bolgesel-incelme", icon: "support" },
  { name: "Lazer Epilasyon (Bayan)", slug: "lazer-bayan", icon: "production" },
  { name: "Lazer Epilasyon (Erkek)", slug: "lazer-erkek", icon: "production" },
  {
    name: "Alex Lazer Paketleri",
    slug: "alex-lazer",
    icon: "quality",
  },
] as const;

export const SERVICE_GRID = [
  { name: "Cilt Bakımı", slug: "cilt-bakimi", icon: "design" },
  { name: "Kirpik & Kaş", slug: "kirpik-kas", icon: "design" },
  { name: "Yüz-Boyun Toparlama", slug: "cilt-bakimi", icon: "quality" },
  { name: "Bölgesel İncelme", slug: "bolgesel-incelme", icon: "support" },
  { name: "Lazer Epilasyon", slug: "lazer-bayan", icon: "production" },
  { name: "Alex Lazer", slug: "alex-lazer", icon: "quality" },
] as const;

/** Seed / vitrin — yüklenen el yazması fiyat listelerinden (TL) */
export const CATALOG_PRODUCTS: {
  categorySlug: string;
  name: string;
  slug: string;
  price: number;
  shortDesc: string;
}[] = [
  // Cilt & bakım
  {
    categorySlug: "cilt-bakimi",
    name: "Klasik Cilt Bakımı",
    slug: "klasik-cilt-bakimi",
    price: 800,
    shortDesc: "Temel cilt temizliği ve bakım protokolü.",
  },
  {
    categorySlug: "cilt-bakimi",
    name: "Hydrafacial",
    slug: "hydrafacial",
    price: 800,
    shortDesc: "Derin temizlik ve nemlendirme.",
  },
  {
    categorySlug: "cilt-bakimi",
    name: "Medikal Cilt Bakımı",
    slug: "medikal-cilt-bakimi",
    price: 1250,
    shortDesc: "Medikal destekli cilt bakım uygulaması.",
  },
  {
    categorySlug: "cilt-bakimi",
    name: "Vitamin Complex",
    slug: "vitamin-complex",
    price: 300,
    shortDesc: "Vitamin destekli cilt uygulaması.",
  },
  {
    categorySlug: "cilt-bakimi",
    name: "10 Seans Yüz-Boyun Toparlama (Mikroplus)",
    slug: "10-seans-mikroplus-yuz-boyun",
    price: 8000,
    shortDesc: "10 seans yüz ve boyun toparlama — Mikroplus.",
  },
  {
    categorySlug: "cilt-bakimi",
    name: "3 Seans Karbon Maske",
    slug: "3-seans-karbon-maske",
    price: 2750,
    shortDesc: "3 seanslık karbon maske paketi.",
  },
  {
    categorySlug: "cilt-bakimi",
    name: "5 Seans Karbon Maske",
    slug: "5-seans-karbon-maske",
    price: 4500,
    shortDesc: "5 seanslık karbon maske paketi.",
  },
  {
    categorySlug: "cilt-bakimi",
    name: "Cilt Onarımı",
    slug: "cilt-onarimi",
    price: 3500,
    shortDesc: "Tek seans cilt onarım uygulaması.",
  },
  {
    categorySlug: "cilt-bakimi",
    name: "3 Seans Cilt Onarımı",
    slug: "3-seans-cilt-onarimi",
    price: 9000,
    shortDesc: "3 seanslık cilt onarım paketi.",
  },
  {
    categorySlug: "cilt-bakimi",
    name: "5 Seans Cilt Onarımı",
    slug: "5-seans-cilt-onarimi",
    price: 15000,
    shortDesc: "5 seanslık cilt onarım paketi.",
  },
  // Kirpik & kaş
  {
    categorySlug: "kirpik-kas",
    name: "Kirpik Lifting",
    slug: "kirpik-lifting",
    price: 750,
    shortDesc: "Kirpik lifting uygulaması.",
  },
  {
    categorySlug: "kirpik-kas",
    name: "Kaş",
    slug: "kas",
    price: 300,
    shortDesc: "Kaş alma / şekillendirme.",
  },
  {
    categorySlug: "kirpik-kas",
    name: "Kaş Bıyık",
    slug: "kas-biyik",
    price: 350,
    shortDesc: "Kaş ve bıyık bölgesi birlikte.",
  },
  // Bölgesel incelme
  {
    categorySlug: "bolgesel-incelme",
    name: "10 Seans G5 Masajı",
    slug: "10-seans-g5-masaji",
    price: 2500,
    shortDesc: "Bölgesel incelme / selülit — 10 seans.",
  },
  {
    categorySlug: "bolgesel-incelme",
    name: "10 Seans Emslim",
    slug: "10-seans-emslim",
    price: 2500,
    shortDesc: "10 seans Emslim uygulaması.",
  },
  {
    categorySlug: "bolgesel-incelme",
    name: "10 Seans Heykeltıraş",
    slug: "10-seans-heykeltiras",
    price: 2500,
    shortDesc: "10 seans heykeltıraş uygulaması.",
  },
  {
    categorySlug: "bolgesel-incelme",
    name: "10 Seans G8",
    slug: "10-seans-g8",
    price: 3500,
    shortDesc: "10 seans G8 uygulaması.",
  },
  // Lazer bayan — tek seans
  {
    categorySlug: "lazer-bayan",
    name: "Tüm Bacak + Genital + Kolaltı (Tek Seans)",
    slug: "lazer-bayan-bacak-genital-kolalti",
    price: 750,
    shortDesc: "Bayan lazer — tek seans ücreti.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "Tüm Kol (Tek Seans)",
    slug: "lazer-bayan-tum-kol",
    price: 400,
    shortDesc: "Bayan lazer — tek seans.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "Tüm Bacak (Tek Seans)",
    slug: "lazer-bayan-tum-bacak",
    price: 500,
    shortDesc: "Bayan lazer — tek seans.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "Tüm Sırt (Tek Seans)",
    slug: "lazer-bayan-tum-sirt",
    price: 400,
    shortDesc: "Bayan lazer — tek seans.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "Tüm Göğüs-Göbek (Tek Seans)",
    slug: "lazer-bayan-gogus-gobek",
    price: 400,
    shortDesc: "Bayan lazer — tek seans.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "Genital Özel Bölge (Tek Seans)",
    slug: "lazer-bayan-genital",
    price: 300,
    shortDesc: "Bayan lazer — tek seans.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "Yüz Bölgesi (Tek Seans)",
    slug: "lazer-bayan-yuz",
    price: 300,
    shortDesc: "Bayan lazer — tek seans.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "Kolaltı (Tek Seans)",
    slug: "lazer-bayan-kolalti",
    price: 250,
    shortDesc: "Bayan lazer — tek seans.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "Popo (Tek Seans)",
    slug: "lazer-bayan-popo",
    price: 250,
    shortDesc: "Bayan lazer — tek seans.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "Bel Boşluğu (Tek Seans)",
    slug: "lazer-bayan-bel",
    price: 250,
    shortDesc: "Bayan lazer — tek seans.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "Ense (Tek Seans)",
    slug: "lazer-bayan-ense",
    price: 250,
    shortDesc: "Bayan lazer — tek seans.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "8 Seans Tepeden Tırnağa",
    slug: "lazer-bayan-8-tepeden-tirnaga",
    price: 7500,
    shortDesc: "8 seans tam vücut lazer — bayan.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "8 Seans 3 Bölge Lazer",
    slug: "lazer-bayan-8-3-bolge",
    price: 2000,
    shortDesc: "8 seans 3 bölge — bayan.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "8 Seans 4 Bölge Lazer",
    slug: "lazer-bayan-8-4-bolge",
    price: 2500,
    shortDesc: "8 seans 4 bölge — bayan.",
  },
  // Lazer erkek
  {
    categorySlug: "lazer-erkek",
    name: "Gıdı (Erkek)",
    slug: "lazer-erkek-gidi",
    price: 300,
    shortDesc: "Erkek lazer — seans.",
  },
  {
    categorySlug: "lazer-erkek",
    name: "Ense (Erkek)",
    slug: "lazer-erkek-ense",
    price: 300,
    shortDesc: "Erkek lazer — seans.",
  },
  {
    categorySlug: "lazer-erkek",
    name: "Yanak (Erkek)",
    slug: "lazer-erkek-yanak",
    price: 250,
    shortDesc: "Erkek lazer — seans.",
  },
  {
    categorySlug: "lazer-erkek",
    name: "Tüm Göğüs (Erkek)",
    slug: "lazer-erkek-gogus",
    price: 600,
    shortDesc: "Erkek lazer — seans.",
  },
  {
    categorySlug: "lazer-erkek",
    name: "Tüm Sırt (Erkek)",
    slug: "lazer-erkek-sirt",
    price: 600,
    shortDesc: "Erkek lazer — seans.",
  },
  {
    categorySlug: "lazer-erkek",
    name: "Tüm Kol (Erkek)",
    slug: "lazer-erkek-kol",
    price: 500,
    shortDesc: "Erkek lazer — seans.",
  },
  {
    categorySlug: "lazer-erkek",
    name: "Omuz (Erkek)",
    slug: "lazer-erkek-omuz",
    price: 400,
    shortDesc: "Erkek lazer — seans.",
  },
  {
    categorySlug: "lazer-erkek",
    name: "Tüm Bacak (Erkek)",
    slug: "lazer-erkek-bacak",
    price: 1000,
    shortDesc: "Erkek lazer — seans.",
  },
  {
    categorySlug: "lazer-erkek",
    name: "Kolaltı (Erkek)",
    slug: "lazer-erkek-kolalti",
    price: 400,
    shortDesc: "Erkek lazer — seans.",
  },
  {
    categorySlug: "lazer-erkek",
    name: "8 Seans Kemer Üstü + Bacak (Erkek)",
    slug: "lazer-erkek-8-kemer-ustu-bacak",
    price: 15000,
    shortDesc: "8 seans kemer üstü + bacak.",
  },
  // Soğuk hava üflemeli Alex
  {
    categorySlug: "alex-lazer",
    name: "Alex 3 Bölge 5 Seans (Kadın)",
    slug: "alex-kadin-3-bolge-5",
    price: 4000,
    shortDesc: "Bacak + kolaltı + genital — 5 seans.",
  },
  {
    categorySlug: "alex-lazer",
    name: "Alex 3 Bölge 10 Seans (Kadın)",
    slug: "alex-kadin-3-bolge-10",
    price: 8000,
    shortDesc: "Bacak + kolaltı + genital — 10 seans.",
  },
  {
    categorySlug: "alex-lazer",
    name: "Alex Tepeden Tırnağa 10 Seans (Kadın)",
    slug: "alex-kadin-tepeden-tirnaga-10",
    price: 12000,
    shortDesc: "Tam vücut — 10 seans.",
  },
  {
    categorySlug: "alex-lazer",
    name: "Alex 4 Bölge 5 Seans (Kadın)",
    slug: "alex-kadin-4-bolge-5",
    price: 6000,
    shortDesc: "Bacak + kolaltı + genital + kol — 5 seans.",
  },
  {
    categorySlug: "alex-lazer",
    name: "Alex 4 Bölge Tek Seans (Kadın)",
    slug: "alex-kadin-4-bolge-tek",
    price: 1500,
    shortDesc: "4 bölge — tek seans.",
  },
  {
    categorySlug: "alex-lazer",
    name: "Alex 4 Bölge 10 Seans (Kadın)",
    slug: "alex-kadin-4-bolge-10",
    price: 10000,
    shortDesc: "4 bölge — 10 seans.",
  },
  {
    categorySlug: "alex-lazer",
    name: "Alex Kemer Üstü 5 Seans (Erkek)",
    slug: "alex-erkek-kemer-ustu-5",
    price: 7000,
    shortDesc: "Erkek Alex — 5 seans kemer üstü.",
  },
  {
    categorySlug: "alex-lazer",
    name: "Alex Kemer Üstü 10 Seans (Erkek)",
    slug: "alex-erkek-kemer-ustu-10",
    price: 10000,
    shortDesc: "Erkek Alex — 10 seans kemer üstü.",
  },
];

export const PACKAGES = [
  {
    id: "baslangic",
    name: "Başlangıç Paketi",
    price: 2750,
    sessions: "TOPLAM 3 SEANS",
    featured: false,
    image: "/images/products/cilt-bakimi/1.jpg",
    items: ["3 seans karbon maske", "Cilt temizliği", "Randevu planı"],
  },
  {
    id: "guzellik-paketi",
    name: "Güzellik Paketi",
    price: 8000,
    sessions: "TOPLAM 10 SEANS",
    featured: true,
    badge: "En Çok Tercih Edilen",
    image: "/images/products/cilt-bakimi/2.jpg",
    items: [
      "10 seans yüz-boyun toparlama",
      "Mikroplus işlemi",
      "Kontrol seansı planı",
    ],
  },
  {
    id: "vip",
    name: "VIP Paket",
    price: 4500,
    sessions: "TOPLAM 5 SEANS",
    featured: false,
    image: "/images/products/cilt-bakimi/4.jpg",
    items: ["5 seans karbon maske", "Cilt bakımı", "Seans takibi"],
  },
  {
    id: "lazer",
    name: "Lazer Paket",
    price: 2000,
    sessions: "8 SEANS · 3 BÖLGE",
    featured: false,
    image: "/images/products/lazer-bayan/1.jpg",
    items: ["8 seans 3 bölge lazer", "Bayan paket", "Seans takibi"],
  },
] as const;
