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
    handle: "@zeynepceltek_ozal",
    href: "https://www.instagram.com/zeynepceltek_ozal/",
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

export const BRANCH_OPTIONS = [
  { id: "gazipasa", name: "Gazi Paşa Şube", waRaw: "905414570654" },
  { id: "turgutozal", name: "Turgut Özal Şube", waRaw: "905454570656" },
  { id: "any", name: "Farketmez", waRaw: "905454570656" },
] as const;

export function branchWhatsAppUrl(branchId: string): string {
  const match = BRANCH_OPTIONS.find((b) => b.id === branchId);
  return `https://wa.me/${match?.waRaw ?? PHONE_RAW}`;
}

export function branchLabel(branchId: string): string {
  return BRANCH_OPTIONS.find((b) => b.id === branchId)?.name ?? "Farketmez";
}

export type BranchInfo = {
  name: string;
  address: string;
  phones: string[];
  mapQuery: string;
};

function splitPhones(
  raw: string | undefined,
  fallback: readonly string[]
): string[] {
  if (!raw?.trim()) return [...fallback];
  return raw
    .split(/[·,|/]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function resolveBranches(overrides?: {
  gazipasaAddress?: string;
  gazipasaPhone?: string;
  turgutozalAddress?: string;
  turgutozalPhone?: string;
}): BranchInfo[] {
  return [
    {
      name: BRANCHES[0].name,
      address: overrides?.gazipasaAddress?.trim() || BRANCHES[0].address,
      phones: splitPhones(overrides?.gazipasaPhone, BRANCHES[0].phones),
      mapQuery: BRANCHES[0].mapQuery,
    },
    {
      name: BRANCHES[1].name,
      address: overrides?.turgutozalAddress?.trim() || BRANCHES[1].address,
      phones: splitPhones(overrides?.turgutozalPhone, BRANCHES[1].phones),
      mapQuery: BRANCHES[1].mapQuery,
    },
  ];
}

export const LEGAL_LINKS = [
  { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
  { href: "/kullanim-kosullari", label: "Kullanım Koşulları" },
  { href: "/kvkk", label: "KVKK" },
  { href: "/mesafeli-satis", label: "Mesafeli Hizmet" },
  { href: "/iade-politikasi", label: "İade Politikası" },
  { href: "/teslimat", label: "Randevu süreci" },
  { href: "/cerez-politikasi", label: "Çerez Politikası" },
] as const;

export const PRIMARY_NAV_HREFS = [
  "/",
  "/hizmetler",
  "/paketler",
  "/kampanyalar",
  "/hakkimizda",
  "/iletisim",
] as const;

export const PRIMARY_NAV_LINKS = [
  { href: "/", label: "ANA SAYFA" },
  { href: "/hizmetler", label: "HİZMETLERİMİZ" },
  { href: "/paketler", label: "PAKETLER" },
  { href: "/kampanyalar", label: "GALERİLER" },
  { href: "/hakkimizda", label: "HAKKIMIZDA" },
  { href: "/iletisim", label: "İLETİŞİM" },
] as const;

export const NAV_LINKS = [
  { href: "/", label: "ANA SAYFA" },
  { href: "/hizmetler", label: "HİZMETLERİMİZ" },
  { href: "/paketler", label: "PAKETLER" },
  { href: "/kampanyalar", label: "GALERİLER" },
  { href: "/hakkimizda", label: "HAKKIMIZDA" },
  { href: "/iletisim", label: "İLETİŞİM" },
  { href: "/sepet", label: "RANDEVU SEPETİ" },
] as const;

/** Ana sayfa popüler hizmet ikon sırası */
export const POPULAR_SERVICES = [
  {
    name: "Cilt Bakımı",
    slug: "cilt-bakimi",
    href: "/hizmetler/cilt-bakimi",
    description:
      "Hydrafacial, medikal bakım, karbon maske ve yüz-boyun toparlama.",
    icon: "droplet",
  },
  {
    name: "Lazer Epilasyon",
    slug: "lazer-bayan",
    href: "/hizmetler/lazer-bayan",
    description:
      "Kadın ve erkek için bölge bazlı seans ve paketler.",
    icon: "zap",
  },
  {
    name: "Bölgesel İncelme",
    slug: "bolgesel-incelme",
    href: "/hizmetler/bolgesel-incelme",
    description: "G5, Emslim, heykeltıraş ve G8 ile planlı şekillendirme.",
    icon: "waves",
  },
  {
    name: "Kirpik & Kaş",
    slug: "kirpik-kas",
    href: "/hizmetler/kirpik-kas",
    description: "Kirpik lifting ve kaş şekillendirme ile doğal bakış.",
    icon: "sparkles",
  },
  {
    name: "Epilyum Alex Lazer",
    slug: "alex-lazer",
    href: "/hizmetler/alex-lazer",
    description:
      "Soğutmalı Alexandrite; cilt-kıl analiziyle konforlu seanslar.",
    icon: "zap",
  },
  {
    name: "Tüm Hizmetler",
    slug: "hizmetler",
    href: "/hizmetler",
    description: "Tüm kategoriler ve güncel fiyat listesini inceleyin.",
    icon: "search",
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
    title: "SEANS SONRASI TAKİP",
    desc: "Her seans sonrası takip ve destek.",
  },
] as const;

export const STATS = [
  { value: "2", label: "Şube" },
  { value: "30+", label: "Yıl Deneyim" },
  { value: "6", label: "Hizmet Alanı" },
  { value: "WA", label: "WhatsApp randevu" },
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
  { name: "Kalıcı Makyaj", slug: "kalici-makyaj", icon: "quality" },
  { name: "Protez Tırnak", slug: "protez-tirnak", icon: "design" },
  { name: "Bölgesel İncelme", slug: "bolgesel-incelme", icon: "support" },
  { name: "Lazer Epilasyon (Bayan)", slug: "lazer-bayan", icon: "production" },
  { name: "Lazer Epilasyon (Erkek)", slug: "lazer-erkek", icon: "production" },
  {
    name: "Epilyum Alex Lazer",
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
  { name: "Epilyum Alex Lazer", slug: "alex-lazer", icon: "quality" },
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
    shortDesc:
      "Temizlik, peeling ve nemlendirme adımlarını içeren temel bakım protokolü. Düzenli bakım rutini oluşturmak ve cildi dengelemek isteyenler için uygundur.",
  },
  {
    categorySlug: "cilt-bakimi",
    name: "Hydrafacial",
    slug: "hydrafacial",
    price: 800,
    shortDesc:
      "Vakum destekli derin temizlik, ölü deri uzaklaştırma ve serum emilimi ile ışıltılı, nemli bir cilt görünümü hedeflenir. Makyaj öncesi veya bakım günü için idealdir.",
  },
  {
    categorySlug: "cilt-bakimi",
    name: "Medikal Cilt Bakımı",
    slug: "medikal-cilt-bakimi",
    price: 1250,
    shortDesc:
      "Cilt tipine göre seçilen aktif içeriklerle desteklenen profesyonel bakım. Lekelenme, gözenek ve yorgun görünüm gibi hedeflere yönelik planlanır.",
  },
  {
    categorySlug: "cilt-bakimi",
    name: "Vitamin Complex",
    slug: "vitamin-complex",
    price: 300,
    shortDesc:
      "Cilde vitamin ve antioksidan desteği sağlayan kısa süreli uygulama. Bakım seansını güçlendirmek veya ara destek olarak tercih edilir.",
  },
  {
    categorySlug: "cilt-bakimi",
    name: "10 Seans Yüz-Boyun Toparlama (Mikroplus)",
    slug: "10-seans-mikroplus-yuz-boyun",
    price: 8000,
    shortDesc:
      "Mikroplus ile 10 seanslık yüz ve boyun toparlama programı. Kontur kaybı, sarkma hissi ve yorgun görünüm için planlı, takip edilebilir bir protokoldür.",
  },
  {
    categorySlug: "cilt-bakimi",
    name: "3 Seans Karbon Maske",
    slug: "3-seans-karbon-maske",
    price: 2750,
    shortDesc:
      "Karbon partikülleriyle gözenek temizliği ve mat görünümün azaltılmasına odaklanan 3 seanslık giriş paketi. Yağlı ve karma ciltlerde sık tercih edilir.",
  },
  {
    categorySlug: "cilt-bakimi",
    name: "5 Seans Karbon Maske",
    slug: "5-seans-karbon-maske",
    price: 4500,
    shortDesc:
      "Düzenli aralıklarla uygulanan 5 seanslık karbon maske programı. Cilt temizliği, ışıltı ve bakım sürekliliği isteyenler için dengeli bir seçenektir.",
  },
  {
    categorySlug: "cilt-bakimi",
    name: "Cilt Onarımı",
    slug: "cilt-onarimi",
    price: 3500,
    shortDesc:
      "Hasar görmüş veya yorgun cildi destekleyen tek seanslık onarım protokolü. İçerik ve cihaz seçimi cilt değerlendirmesine göre belirlenir.",
  },
  {
    categorySlug: "cilt-bakimi",
    name: "3 Seans Cilt Onarımı",
    slug: "3-seans-cilt-onarimi",
    price: 9000,
    shortDesc:
      "Üç seanslık yoğun onarım programı. Bariyer desteği, yenilenme ve görünüm iyileştirmesi hedeflenir; seans aralıkları uzmanla planlanır.",
  },
  {
    categorySlug: "cilt-bakimi",
    name: "5 Seans Cilt Onarımı",
    slug: "5-seans-cilt-onarimi",
    price: 15000,
    shortDesc:
      "Beş seanslık kapsamlı cilt onarım paketi. Daha belirgin iyileşme ve sürdürülebilir bakım için uzun dönemli, takip edilen bir protokoldür.",
  },
  // Kirpik & kaş
  {
    categorySlug: "kirpik-kas",
    name: "Kirpik Lifting",
    slug: "kirpik-lifting",
    price: 0,
    shortDesc:
      "Doğal kirpiklere kıvrım, belirginlik ve etkileyici görünüm. Daha kalkık kirpikler, daha açık ve canlı bakışlar — doğal ama dikkat çekici sonuç.",
  },
  {
    categorySlug: "kirpik-kas",
    name: "İpek Kirpik Uygulaması",
    slug: "ipek-kirpik",
    price: 1250,
    shortDesc:
      "İpek kirpik uygulaması 1.250 TL’den başlayan fiyatlarla. Yoğunluğuna göre fiyat değişir; kişiye özel plan randevuda netleşir.",
  },
  {
    categorySlug: "kirpik-kas",
    name: "Kaş",
    slug: "kas",
    price: 300,
    shortDesc:
      "Yüz hatlarınıza uygun kaş alma ve şekillendirme. Simetri, kalınlık ve hat dengesi gözetilerek temiz ve net bir kaş formu oluşturulur.",
  },
  {
    categorySlug: "kirpik-kas",
    name: "Kaş Bıyık",
    slug: "kas-biyik",
    price: 350,
    shortDesc:
      "Kaş şekillendirme ile üst dudak (bıyık) bölgesinin birlikte düzenlenmesi. Tek seansda yüz çerçevesi netleştirilir.",
  },
  // Kalıcı makyaj
  {
    categorySlug: "kalici-makyaj",
    name: "Dudak Renklendirme",
    slug: "dudak-renklendirme",
    price: 6000,
    shortDesc:
      "Solgun dudaklara veda, doğal ve canlı tonlara merhaba. Doğal ton geçişleri, kişiye özel renk seçimi, bakımlı ve belirgin dudak görünümü. Kullanım süresi yaklaşık 3 yıl.",
  },
  {
    categorySlug: "kalici-makyaj",
    name: "Microblading & Kaş Pudralama",
    slug: "microblading-kas-pudralama",
    price: 5000,
    shortDesc:
      "Yüz hatlarınıza uygun, doğal ve dengeli kaş tasarımı. Microblading ile kıl görünümü; pudralama ile yumuşak ve dolgun etki. Kullanım süresi yaklaşık 3 yıl.",
  },
  {
    categorySlug: "kalici-makyaj",
    name: "Kalıcı Dipliner",
    slug: "kalici-dipliner",
    price: 2500,
    shortDesc:
      "Kirpik diplerinde doğal belirginlik, bakışlarda daha etkileyici ifade. Doğal ve zarif görünüm; her gün eyeliner derdine son. Kullanım süresi yaklaşık 3 yıl.",
  },
  {
    categorySlug: "kalici-makyaj",
    name: "Kalıcı Eyeliner",
    slug: "kalici-eyeliner",
    price: 3500,
    shortDesc:
      "Göz yapınıza özel kalıcı eyeliner ile makyajsızken bile gözleriniz ön planda. Net ve zarif görünüm, gün boyu bakımlı bakışlar. Kullanım süresi yaklaşık 3 yıl.",
  },
  // Protez tırnak
  {
    categorySlug: "protez-tirnak",
    name: "Protez Tırnak (Kampanya)",
    slug: "protez-tirnak-kampanya",
    price: 900,
    shortDesc:
      "Kampanyalı fiyat 900 TL. Profesyonel protez tırnak uygulaması; şekil ve bakım randevuda netleşir.",
  },
  // Bölgesel incelme
  {
    categorySlug: "bolgesel-incelme",
    name: "Popo Lift",
    slug: "popo-lift",
    price: 0,
    shortDesc:
      "Daha sıkı, daha toparlanmış ve daha şekilli bir görünüm. Popo Lift ile vücut hatlarını destekle, daha fit bir görünüm kazan. Fiyat için randevu / WhatsApp.",
  },
  {
    categorySlug: "bolgesel-incelme",
    name: "Göğüs Toparlama",
    slug: "gogus-toparlama",
    price: 0,
    shortDesc:
      "Daha sıkı, daha toparlanmış ve daha formda bir görünüm. Göğüs bölgesinin daha diri ve estetik görünümünü destekler. Fiyat için randevu / WhatsApp.",
  },
  {
    categorySlug: "bolgesel-incelme",
    name: "10 Seans G5 Masajı",
    slug: "10-seans-g5-masaji",
    price: 2500,
    shortDesc:
      "Titreşimli G5 masajıyla bölgesel dolaşım desteği ve selülit görünümüne yönelik 10 seanslık program. Kalça, basen ve bacak bölgelerinde sık tercih edilir.",
  },
  {
    categorySlug: "bolgesel-incelme",
    name: "10 Seans Emslim",
    slug: "10-seans-emslim",
    price: 2500,
    shortDesc:
      "Yoğun kas uyarımıyla bölgesel sıkılık ve şekillendirme hedefleyen 10 seanslık Emslim protokolü. Karın ve kalça odaklı planlamaya uygundur.",
  },
  {
    categorySlug: "bolgesel-incelme",
    name: "10 Seans Heykeltıraş",
    slug: "10-seans-heykeltiras",
    price: 2500,
    shortDesc:
      "Bölgesel kontur ve incelme için 10 seanslık heykeltıraş uygulaması. Hedef bölgeye göre seans planı oluşturulur; düzenli takip önerilir.",
  },
  {
    categorySlug: "bolgesel-incelme",
    name: "10 Seans G8",
    slug: "10-seans-g8",
    price: 3500,
    shortDesc:
      "Daha yoğun bölgesel protokol arayanlar için 10 seanslık G8 paketi. Selülit görünümü ve sıkılık hedeflerinde güçlendirilmiş bir seçenektir.",
  },
  // Lazer bayan — tek seans
  {
    categorySlug: "lazer-bayan",
    name: "Tüm Bacak + Genital + Kolaltı (Tek Seans)",
    slug: "lazer-bayan-bacak-genital-kolalti",
    price: 750,
    shortDesc:
      "Kadınlarda en sık tercih edilen üç bölge kombinasyonu. Tek seanslık uygulama; paket planına geçmeden önce deneme veya ara seans için uygundur.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "Tüm Kol (Tek Seans)",
    slug: "lazer-bayan-tum-kol",
    price: 400,
    shortDesc:
      "Kol bölgesine özel tek seans lazer epilasyon. Kıl yoğunluğu ve cilt tipine göre parametreler ayarlanır; hijyenik ortamda uygulanır.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "Tüm Bacak (Tek Seans)",
    slug: "lazer-bayan-tum-bacak",
    price: 500,
    shortDesc:
      "Bacak bölgesine yönelik tek seans lazer epilasyon. Kalıcı azalma için düzenli seans aralığı önerilir; bu seçenek tek bölge ihtiyacına yanıt verir.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "Tüm Sırt (Tek Seans)",
    slug: "lazer-bayan-tum-sirt",
    price: 400,
    shortDesc:
      "Sırt bölgesi için tek seans lazer epilasyon. Geniş alan uygulaması; seans süresi ve plan uzman yönlendirmesiyle netleşir.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "Tüm Göğüs-Göbek (Tek Seans)",
    slug: "lazer-bayan-gogus-gobek",
    price: 400,
    shortDesc:
      "Göğüs ve göbek hattına özel tek seans lazer epilasyon. Hassas bölge protokolüyle konfor ve güvenlik ön planda tutulur.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "Genital Özel Bölge (Tek Seans)",
    slug: "lazer-bayan-genital",
    price: 300,
    shortDesc:
      "Genital bölgeye özel tek seans lazer epilasyon. Hijyen, mahremiyet ve doğru parametre seçimiyle uygulanan hassas bir seanstır.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "Yüz Bölgesi (Tek Seans)",
    slug: "lazer-bayan-yuz",
    price: 300,
    shortDesc:
      "Yüz bölgesindeki istenmeyen tüyler için tek seans lazer. Cilt hassasiyeti dikkate alınarak düşük riskli, kontrollü uygulama yapılır.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "Kolaltı (Tek Seans)",
    slug: "lazer-bayan-kolalti",
    price: 250,
    shortDesc:
      "Kolaltı bölgesine özel hızlı tek seans. Ter ve sürtünme kaynaklı tahrişi azaltmaya yardımcı düzenli epilasyon planının parçası olabilir.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "Popo (Tek Seans)",
    slug: "lazer-bayan-popo",
    price: 250,
    shortDesc:
      "Kalça bölgesine yönelik tek seans lazer epilasyon. Paketlere ek bölge olarak veya tek ihtiyaç için tercih edilir.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "Bel Boşluğu (Tek Seans)",
    slug: "lazer-bayan-bel",
    price: 250,
    shortDesc:
      "Bel boşluğu hattına özel tek seans lazer. Dar alan uygulaması; diğer gövde seanslarıyla kombine edilebilir.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "Ense (Tek Seans)",
    slug: "lazer-bayan-ense",
    price: 250,
    shortDesc:
      "Ense bölgesindeki tüyler için tek seans lazer epilasyon. Kısa süreli, net hat odaklı bir uygulamadır.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "8 Seans Tepeden Tırnağa",
    slug: "lazer-bayan-8-tepeden-tirnaga",
    price: 7500,
    shortDesc:
      "Kadın tam vücut lazer epilasyon için 8 seanslık kapsamlı paket. Seans aralıkları kıl döngüsüne göre planlanır; uzun dönemli azalma hedeflenir.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "8 Seans 3 Bölge Lazer",
    slug: "lazer-bayan-8-3-bolge",
    price: 3500,
    shortDesc:
      "Üç bölge (tipik olarak bacak, kolaltı, genital) için 8 seanslık kadın lazer paketi. En çok tercih edilen giriş seviyesi paketlerden biridir.",
  },
  {
    categorySlug: "lazer-bayan",
    name: "8 Seans 4 Bölge Lazer",
    slug: "lazer-bayan-8-4-bolge",
    price: 2500,
    shortDesc:
      "Dört bölgeyi kapsayan 8 seanslık kadın lazer paketi. Bölge seçimi danışmanlıkta netleştirilir; planlı takip ile ilerlenir.",
  },
  // Lazer erkek
  {
    categorySlug: "lazer-erkek",
    name: "Gıdı (Erkek)",
    slug: "lazer-erkek-gidi",
    price: 300,
    shortDesc:
      "Erkek gıdı bölgesine özel lazer epilasyon seansı. Kalın kıl yapısına uygun parametrelerle net hat ve rahat tıraş hissi hedeflenir.",
  },
  {
    categorySlug: "lazer-erkek",
    name: "Ense (Erkek)",
    slug: "lazer-erkek-ense",
    price: 300,
    shortDesc:
      "Erkek ense bölgesi için tek seans lazer. Saç çizgisi ve yakalık hattını düzenli tutmak isteyenler için pratik bir uygulamadır.",
  },
  {
    categorySlug: "lazer-erkek",
    name: "Yanak (Erkek)",
    slug: "lazer-erkek-yanak",
    price: 250,
    shortDesc:
      "Yanak bölgesindeki istenmeyen tüyler için erkek lazer seansı. Cilt hassasiyeti gözetilerek kontrollü uygulama yapılır.",
  },
  {
    categorySlug: "lazer-erkek",
    name: "Tüm Göğüs (Erkek)",
    slug: "lazer-erkek-gogus",
    price: 600,
    shortDesc:
      "Erkek göğüs bölgesine yönelik tek seans lazer epilasyon. Yoğun kıl yapısında kalıcı azalma için düzenli seans paketi önerilir.",
  },
  {
    categorySlug: "lazer-erkek",
    name: "Tüm Sırt (Erkek)",
    slug: "lazer-erkek-sirt",
    price: 600,
    shortDesc:
      "Geniş alan sırt epilasyonu için tek seans. Erkeklerde sık tercih edilir; seans süresi bölge yoğunluğuna göre değişir.",
  },
  {
    categorySlug: "lazer-erkek",
    name: "Tüm Kol (Erkek)",
    slug: "lazer-erkek-kol",
    price: 500,
    shortDesc:
      "Erkek kol bölgesi lazer epilasyon seansı. Omuz ve önkol hattı dahil planlanabilir; paketlerle birleştirilebilir.",
  },
  {
    categorySlug: "lazer-erkek",
    name: "Omuz (Erkek)",
    slug: "lazer-erkek-omuz",
    price: 400,
    shortDesc:
      "Omuz bölgesine özel erkek lazer seansı. Sırt veya kol paketlerine ek bölge olarak da tercih edilir.",
  },
  {
    categorySlug: "lazer-erkek",
    name: "Tüm Bacak (Erkek)",
    slug: "lazer-erkek-bacak",
    price: 1000,
    shortDesc:
      "Erkek bacak bölgesi için tek seans lazer epilasyon. Geniş alan uygulaması; kalıcı sonuç için çoklu seans planı önerilir.",
  },
  {
    categorySlug: "lazer-erkek",
    name: "Kolaltı (Erkek)",
    slug: "lazer-erkek-kolalti",
    price: 400,
    shortDesc:
      "Erkek kolaltı lazer epilasyon seansı. Kısa süreli uygulama; günlük konfor ve hijyen için düzenli seanslarla desteklenir.",
  },
  {
    categorySlug: "lazer-erkek",
    name: "8 Seans Kemer Üstü + Bacak (Erkek)",
    slug: "lazer-erkek-8-kemer-ustu-bacak",
    price: 15000,
    shortDesc:
      "Kemer üstü (göğüs-sırt-karın hattı) ve bacak kombinasyonunu kapsayan 8 seanslık erkek paketi. Yoğun kıl yapısında planlı, uzun dönemli protokoldür.",
  },
  // Epilyum Alex (Alexandrite)
  {
    categorySlug: "alex-lazer",
    name: "Epilyum Alex 3 Bölge 5 Seans (Kadın)",
    slug: "alex-kadin-3-bolge-5",
    price: 4000,
    shortDesc:
      "Alexandrite + güçlü soğutma ile bacak, kolaltı ve genital bölgede 5 seans. Kamera destekli cilt-kıl analizi sonrası konforlu uygulama planlanır.",
  },
  {
    categorySlug: "alex-lazer",
    name: "Epilyum Alex 3 Bölge 10 Seans (Kadın)",
    slug: "alex-kadin-3-bolge-10",
    price: 8000,
    shortDesc:
      "Aynı üç bölge için 10 seanslık Epilyum Alex paketi. Daha yüksek kıl yoğunluğu veya uzun dönemli kalıcılık hedefleyenler için önerilir.",
  },
  {
    categorySlug: "alex-lazer",
    name: "Epilyum Alex Tepeden Tırnağa 10 Seans (Kadın)",
    slug: "alex-kadin-tepeden-tirnaga-10",
    price: 12000,
    shortDesc:
      "Kadın tam vücut Epilyum Alex programı — 10 seans. Soğutmalı Alexandrite teknolojisiyle geniş alanlarda konforlu ve planlı epilasyon.",
  },
  {
    categorySlug: "alex-lazer",
    name: "Epilyum Alex 4 Bölge 5 Seans (Kadın)",
    slug: "alex-kadin-4-bolge-5",
    price: 6000,
    shortDesc:
      "Bacak, kolaltı, genital ve kol bölgelerini kapsayan 5 seanslık Epilyum Alex paketi. Dört bölgede dengeli bir başlangıç programıdır.",
  },
  {
    categorySlug: "alex-lazer",
    name: "Epilyum Alex 4 Bölge Tek Seans (Kadın)",
    slug: "alex-kadin-4-bolge-tek",
    price: 1500,
    shortDesc:
      "Dört bölgede tek seans Epilyum Alex denemesi veya ara seans. Cihazı ve konforu deneyimlemek isteyenler için uygundur.",
  },
  {
    categorySlug: "alex-lazer",
    name: "Epilyum Alex 4 Bölge 10 Seans (Kadın)",
    slug: "alex-kadin-4-bolge-10",
    price: 10000,
    shortDesc:
      "Dört bölge için 10 seanslık Epilyum Alex paketi. Soğutmalı Alexandrite ile uzun dönemli azalma ve düzenli takip sunar.",
  },
  {
    categorySlug: "alex-lazer",
    name: "Epilyum Alex Kemer Üstü 5 Seans (Erkek)",
    slug: "alex-erkek-kemer-ustu-5",
    price: 7000,
    shortDesc:
      "Erkek kemer üstü (göğüs-sırt-karın hattı) için 5 seans Epilyum Alex. Kalın kıl yapısına uygun, soğutmalı Alexandrite protokolü.",
  },
  {
    categorySlug: "alex-lazer",
    name: "Epilyum Alex Kemer Üstü 10 Seans (Erkek)",
    slug: "alex-erkek-kemer-ustu-10",
    price: 10000,
    shortDesc:
      "Erkek kemer üstü bölgesinde 10 seanslık Epilyum Alex paketi. Yoğun kıl ve kalıcılık hedefi için güçlendirilmiş, planlı bir programdır.",
  },
];

export const PACKAGES = [
  {
    id: "baslangic",
    slug: "baslangic",
    name: "Başlangıç Paketi",
    price: 2750,
    sessions: "TOPLAM 3 SEANS",
    featured: false,
    image: "/images/campaigns/baslangic-paket.jpg",
    shortDesc:
      "Cilt bakımına ilk adım: 3 seanslık karbon maske protokolüyle gözenek temizliği, mat görünümün yumuşatılması ve cildin düzenli bakıma hazırlanması. Yeni başlayanlar için net bir giriş planı.",
    items: [
      "3 seans karbon maske uygulaması",
      "Cilt tipi değerlendirmesi ve bakım yönlendirmesi",
      "Seans aralığı planı ve randevu takibi",
    ],
  },
  {
    id: "guzellik-paketi",
    slug: "guzellik-paketi",
    name: "Güzellik Paketi",
    price: 8000,
    sessions: "TOPLAM 10 SEANS",
    featured: true,
    badge: "En Çok Tercih Edilen",
    image: "/images/campaigns/guzellik-paket.jpg",
    shortDesc:
      "Yoğun bakım arayanlar için 10 seanslık Mikroplus yüz ve boyun toparlama programı. Kontur kaybı, sarkma hissi ve yorgun görünüm hedeflenir; her adım uzman takibiyle planlanır.",
    items: [
      "10 seans Mikroplus yüz-boyun toparlama",
      "Kişiye özel seans aralığı ve uygulama planı",
      "Ara kontrol ile ilerleme takibi",
      "Seans sonrası bakım önerileri",
    ],
  },
  {
    id: "lazer",
    slug: "lazer",
    name: "Lazer Paket",
    price: 3500,
    sessions: "8 SEANS · 3 BÖLGE",
    featured: false,
    image: "/images/campaigns/lazer-paket.jpg",
    shortDesc:
      "Kadın 3 bölge lazer epilasyon için 8 seanslık planlı paket. Kalıcı azalma hedefiyle seans aralıkları kıl döngüsüne göre belirlenir; şeffaf fiyat ve hijyenik uygulama ortamı.",
    items: [
      "8 seans 3 bölge lazer epilasyon (kadın)",
      "Cilt-kıl değerlendirmesi ve seans planı",
      "Randevu takibi ve seans sonrası bilgilendirme",
    ],
  },
  {
    id: "vip",
    slug: "vip",
    name: "VIP Paket",
    price: 4500,
    sessions: "TOPLAM 5 SEANS",
    featured: false,
    image: "/images/campaigns/vip-paket.jpg",
    shortDesc:
      "2 seans cilt bakımı, karbon maske, yüz-boyun toparlama ve Vitamin Complex’i bir araya getiren 5 seanslık VIP program. Işıltı, temizlik ve toparlanma hedefleyen misafirler için.",
    items: [
      "2 seans cilt bakımı",
      "1 seans karbon maske",
      "1 seans yüz-boyun toparlama",
      "1 seans Vitamin Complex",
    ],
  },
] as const;

export type PackageItem = (typeof PACKAGES)[number];

export function getPackageBySlug(slug: string): PackageItem | undefined {
  return PACKAGES.find((p) => p.slug === slug);
}
