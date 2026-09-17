import { getContentMap, getContentTitles } from "@/lib/site-content";
import { VALUE_PROPS, STATS } from "@/lib/constants";
import type { AboutPageData } from "@/components/about/AboutPageView";
import type { ContactPageData } from "@/components/contact/ContactPageView";
import type { StatItem } from "@/components/home/StatsBar";

const ABOUT_KEYS = [
  "about_headline",
  "about_intro",
  "about_philosophy",
  "mission",
  "vision",
  "about_why_us",
  "values_hygiene",
  "values_team",
  "values_products",
  "values_personal",
  "about_image_1",
  "about_image_2",
  "about_image_3",
  "about_image_4",
  "stat_1_value",
  "stat_1_label",
  "stat_2_value",
  "stat_2_label",
  "stat_3_value",
  "stat_3_label",
  "stat_4_value",
  "stat_4_label",
];

const VALUE_DEFS = [
  { key: "values_hygiene", fallbackTitle: "Hijyenik Ortam" },
  { key: "values_products", fallbackTitle: "Şeffaf Fiyat" },
  { key: "values_team", fallbackTitle: "Uzman Kadro" },
  { key: "values_personal", fallbackTitle: "Kişiye Özel" },
] as const;

const DEFAULT_ABOUT_IMAGES = [
  "/images/about/about-1.jpg",
  "/images/about/about-2.jpg",
  "/images/about/about-3.jpg",
  "/images/about/about-4.jpg",
];

export async function loadAboutPageData(): Promise<AboutPageData> {
  const [map, titles] = await Promise.all([
    getContentMap(ABOUT_KEYS),
    getContentTitles(VALUE_DEFS.map((v) => v.key)),
  ]);

  const stats: StatItem[] = STATS.map((fallback, i) => {
    const n = i + 1;
    return {
      value: map[`stat_${n}_value`] || fallback.value,
      label: map[`stat_${n}_label`] || fallback.label,
    };
  });

  return {
    headline:
      map.about_headline ||
      "GÜZELLİĞİ BİLİMLE,\nSANATA DÖNÜŞTÜRÜYORUZ",
    intro:
      map.about_intro ||
      "Zeynep Çeltek Güzellik; Adana’da Gazi Paşa (Seyhan) ve Turgut Özal (Çukurova) şubelerinde faaliyet gösteren, 30 yılı aşkın sektör tecrübesini modern cihaz parkı ve kişiye özel protokollerle birleştiren bir güzellik merkezidir. Cilt bakımı, lazer epilasyon, Epilyum Alex Alexandrite uygulamaları, bölgesel incelme ile kirpik ve kaş hizmetlerini aynı çatı altında, şeffaf fiyatlandırma ve hijyen odaklı bir anlayışla sunarız.\n\nBizim için güzellik tek seferlik bir işlem değil; doğru analiz, doğru uygulama ve takip edilebilir seans planından oluşan bir süreçtir. Her misafirimizin cilt tipi, kıl yapısı, yaşam temposu ve hedefleri farklıdır. Bu yüzden “herkese aynı paket” yaklaşımı yerine, ihtiyaca göre şekillenen bakım yolları öneririz.\n\nRandevu sürecini de sade tutarız: WhatsApp veya telefonla hızlı iletişim, sitedeki randevu sepeti ile net talep iletimi; onay sonrası PayTR ile güvenli kart ödemesi veya havale seçenekleri. Amacımız, Adana’da kendinizi güvende hissettiğiniz, neyin neden yapıldığını anladığınız ve sonucunu takip edebildiğiniz bir salon deneyimi sunmaktır.",
    philosophy:
      map.about_philosophy ||
      "Çalışma ilkelerimizin özeti nettir: acele etmeden dinlemek, abartısız önermek, uygularken açıklamak ve seans sonrasında da desteklemek.\n\nHer seansı standart bir “menü işlemi” gibi değil; planlı bir bakım adımı olarak görürüz. Randevu öncesinde beklentinizi ve varsa önceki uygulamalarınızı öğreniriz. Uygulama sırasında cihaz, ürün ve seans aralığı seçimini cilt-kıl değerlendirmesine göre yaparız. Seans sonrasında ise nelere dikkat etmeniz gerektiğini açıkça paylaşırız.\n\nHijyen, bilgilendirme ve kişiye özel yaklaşım bizim için slogan değil; günlük iş disiplinimizin parçasıdır. Misafirlerimize ne yapılacağını ve neden tercih edildiğini anlaşılır dilde anlatırız — böylece karar süreci şeffaf, sonuçlar ise daha sürdürülebilir olur.",
    mission:
      map.mission ||
      "Misyonumuz; misafirlerimizin kendilerini güvende, anlaşılmış ve özel hissettiği, klinik hijyen standartlarında profesyonel bir güzellik deneyimi sunmaktır.\n\nAdana’daki her iki şubemizde de aynı kalite çizgisini koruyarak doğru analizi, doğru uygulamayı ve takip edilebilir seans planını bir araya getirmek istiyoruz. Kısa vadeli vaatler yerine, ölçülebilir ilerleme ve dürüst bilgilendirme ile uzun soluklu memnuniyet yaratmayı hedefleriz.\n\nHer protokolde önceliğimiz: güvenli uygulama ortamı, uzman kontrolü ve misafirin bilgilendirilmiş onayıdır.",
    vision:
      map.vision ||
      "Vizyonumuz; Adana’da güvenilir güzellik bakımının referans adreslerinden biri olmak ve kişiye özel protokollerle kalıcı memnuniyet üreten bir marka olarak büyümektir.\n\nTeknolojiyi (güncel lazer ve bakım cihazları) uzman kadro deneyimiyle birleştirerek; hızlı ama yüzeysel çözümler yerine sürdürülebilir sonuçlara odaklanıyoruz. İki şubeli yapımızı, hizmet çeşitliliğimizi ve şeffaf iletişimimizi güçlendirerek hem yeni misafirlere hem de düzenli bakım planı olan misafirlerimize tutarlı bir standart sunmayı amaçlıyoruz.\n\nUzun vadede hedefimiz; “ne yapılırsa yapılsın” değil, “size ne uygunsa o yapılsın” anlayışının Adana’daki en bilinen temsilcilerinden biri olmaktır.",
    whyUs:
      map.about_why_us ||
      "Zeynep Çeltek’i tercih etmenizin birkaç somut nedeni vardır. Birincisi konum: Seyhan (Gazi Paşa) ve Çukurova (Turgut Özal) şubeleriyle şehrin iki yakasında aynı standartta hizmet veririz. İkincisi şeffaflık: güncel fiyat listesi, paket içerikleri ve seans planı nettir; sürpriz ücret yerine onaylı teklif sunarız.\n\nÜçüncüsü kapsam: cilt bakımı (Hydrafacial, medikal bakım, karbon maske, Mikroplus yüz-boyun toparlama), kadın ve erkek lazer epilasyon, Epilyum Alex soğutmalı Alexandrite paketleri, bölgesel incelme (G5, Emslim, heykeltıraş, G8) ile kirpik-kaş uygulamalarını tek çatı altında bulursunuz. Dördüncüsü süreç yönetimi: ihtiyacınızı dinler, abartısız önerir, randevuyu planlar ve sonuçları takip ederiz.\n\nKısaca; trendy vaatler yerine ölçülebilir bakım, hızlı satış yerine doğru protokol — Adana’da planlı güzellik bakımı arayanlar için tasarlanmış bir salon deneyimi.",
    values: VALUE_DEFS.map((v) => ({
      key: v.key,
      title: titles[v.key] || v.fallbackTitle,
      desc:
        map[v.key] ||
        (v.key === "values_hygiene"
          ? "Uygulama alanlarımızı klinik hijyen anlayışıyla yönetiriz. Her seans öncesi yüzey ve ekipman kontrolü, tek kullanımlık veya sterilize edilmiş malzemeler ve düzenli alan denetimi ile misafir güvenliğini önceliklendiririz. Temizlik bizim için ek hizmet değil, temel çalışma koşuludur."
          : v.key === "values_products"
            ? "Fiyatları güncel listede açıkça paylaşırız. Paket içerikleri, seans sayıları ve ödeme seçenekleri (PayTR güvenli kart ödemesi veya havale) randevu teyidinde netleşir. Sürpriz ek ücret yerine şeffaf teklif ve yazılı / mesajlı onay ile ilerleriz."
            : v.key === "values_team"
              ? "Deneyimli güzellik uzmanlarımız; cilt tipi, kıl yapısı ve hedefinize göre protokol seçer. Lazer parametrelerinden bakım ürünlerine kadar kararlar rastgele değil, değerlendirme sonrası alınır. Seans aralıkları ve ilerleme takibi de aynı özenle planlanır."
              : "Tek tip menü dayatmayız. Analiz sonrası sizin için en uygun adımları birlikte belirleriz: tek seans deneme, paket programı veya kombine bakım. Yaşam temposunuza ve bütçenize uygun, gerçekçi bir plan çıkarmak önceliğimizdir."),
    })),
    images: DEFAULT_ABOUT_IMAGES.map(
      (fallback, i) => map[`about_image_${i + 1}`] || fallback
    ),
    stats,
  };
}

export async function loadContactPageData(): Promise<ContactPageData> {
  const map = await getContentMap([
    "contact_eyebrow",
    "contact_title",
    "contact_intro",
    "contact_card_title",
    "contact_call_prefix",
    "contact_whatsapp_link",
    "contact_whatsapp_cta",
    "contact_whatsapp_prefill",
    "contact_submit_label",
    "contact_kvkk_suffix",
    "contact_map_label",
    "contact_map_open",
    "contact_success",
  ]);
  return {
    eyebrow: map.contact_eyebrow || "İletişim",
    title: map.contact_title || "Bize Ulaşın",
    intro:
      map.contact_intro ||
      "Hizmetler, randevu ve danışmanlık hakkında aklınıza takılan her şeyi sorabilirsiniz. En hızlı yanıt WhatsApp üzerinden gelir.",
    formCopy: {
      cardTitle: map.contact_card_title || "Zeynep Çeltek Güzellik",
      callPrefix: map.contact_call_prefix || "Ara:",
      whatsappLink: map.contact_whatsapp_link || "WhatsApp ile yaz",
      whatsappCta: map.contact_whatsapp_cta || "WhatsApp ile Yazın",
      whatsappPrefill:
        map.contact_whatsapp_prefill ||
        "Merhaba, hizmetleriniz hakkında bilgi almak ve randevu oluşturmak istiyorum.",
      submitLabel: map.contact_submit_label || "Mesaj Gönder",
      kvkkSuffix:
        map.contact_kvkk_suffix ||
        "okudum, kişisel verilerimin iletişim amacıyla işlenmesini kabul ediyorum.",
      mapLabel: map.contact_map_label || "Konum — Google Haritalar",
      mapOpen: map.contact_map_open || "Google'da aç",
      success:
        map.contact_success ||
        "Mesajınız alındı. En kısa sürede size dönüş yapacağız.",
    },
  };
}

export function buildValueProps(map: Record<string, string>) {
  return VALUE_PROPS.map((fallback, i) => {
    const n = i + 1;
    const sizeRaw = map[`value_prop_${n}_icon_size`];
    const iconSize = sizeRaw ? Number(sizeRaw) : undefined;
    return {
      icon: fallback.icon,
      title: map[`value_prop_${n}_title`] || fallback.title,
      desc: map[`value_prop_${n}_desc`] || fallback.desc,
      iconUrl: map[`value_prop_${n}_icon`] || undefined,
      iconSize:
        iconSize && Number.isFinite(iconSize) ? iconSize : undefined,
    };
  });
}

export function buildStats(map: Record<string, string>): StatItem[] {
  return STATS.map((fallback, i) => {
    const n = i + 1;
    return {
      value: map[`stat_${n}_value`] || fallback.value,
      label: map[`stat_${n}_label`] || fallback.label,
    };
  });
}
