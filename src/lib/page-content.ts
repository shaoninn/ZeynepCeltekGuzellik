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
    intro: map.about_intro || "",
    philosophy: map.about_philosophy || "",
    mission: map.mission || "",
    vision: map.vision || "",
    values: VALUE_DEFS.map((v) => ({
      key: v.key,
      title: titles[v.key] || v.fallbackTitle,
      desc: map[v.key] || "",
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
