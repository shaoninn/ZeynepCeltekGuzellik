import { getContentMap } from "@/lib/site-content";
import { getFeaturedProjects } from "@/lib/catalog";
import { getSiteSettings } from "@/lib/site";
import { buildStats } from "@/lib/page-content";
import { FEATURE_BAR } from "@/lib/constants";
import { styleContentKey } from "@/lib/text-style";
import { toWebpSrc } from "@/lib/image-optimize";

const DEFAULT_HERO_IMAGE = "/images/hero/hero-1.jpg";
const DEFAULT_HERO_TITLE = "Güzelliği bilimle, sanata dönüştürüyoruz.";
const DEFAULT_HERO_SUBTITLE = "";

/** Only keys rendered by HomePageView (mockup home). */
const HOME_CONTENT_KEYS = [
  "hero_title",
  "hero_subtitle",
  "hero_body",
  "hero_image",
  "services_section_title",
  "feature_bar_1_title",
  "feature_bar_1_desc",
  "feature_bar_1_icon",
  "feature_bar_1_icon_size",
  "feature_bar_2_title",
  "feature_bar_2_desc",
  "feature_bar_2_icon",
  "feature_bar_2_icon_size",
  "feature_bar_3_title",
  "feature_bar_3_desc",
  "feature_bar_3_icon",
  "feature_bar_3_icon_size",
  "feature_bar_4_title",
  "feature_bar_4_desc",
  "feature_bar_4_icon",
  "feature_bar_4_icon_size",
  "feature_bar_5_title",
  "feature_bar_5_desc",
  "feature_bar_5_icon",
  "feature_bar_5_icon_size",
  "testimonial_section_title",
  "testimonial_1_quote",
  "testimonial_1_name",
  "testimonial_1_place",
  "testimonial_2_quote",
  "testimonial_2_name",
  "testimonial_2_place",
  "testimonial_3_quote",
  "testimonial_3_name",
  "testimonial_3_place",
  "stat_1_value",
  "stat_1_label",
  "stat_2_value",
  "stat_2_label",
  "stat_3_value",
  "stat_3_label",
  "stat_4_value",
  "stat_4_label",
] as const;

const STYLE_BASE_KEYS = [
  "hero_title",
  "hero_subtitle",
  "hero_body",
  "services_section_title",
  "feature_bar_1_title",
  "feature_bar_1_desc",
  "testimonial_section_title",
  "testimonial_1_quote",
] as const;

const HOME_KEYS = [
  ...HOME_CONTENT_KEYS,
  ...STYLE_BASE_KEYS.map((k) => styleContentKey(k)),
] as const;

function pickStyles(
  map: Record<string, string>,
  keys: readonly string[]
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of keys) {
    const sk = styleContentKey(k);
    if (map[sk]) out[k] = map[sk]!;
  }
  return out;
}

export async function loadHomePageData() {
  try {
    const [map, projects, settings] = await Promise.all([
      getContentMap([...HOME_KEYS]),
      getFeaturedProjects(),
      getSiteSettings(),
    ]);

    const testimonials = [1, 2, 3].map((n) => ({
      quote: map[`testimonial_${n}_quote`] || "",
      name: map[`testimonial_${n}_name`] || "",
      place: map[`testimonial_${n}_place`] || "",
    }));

    const featureBarItems = FEATURE_BAR.map((_, i) => {
      const n = i + 1;
      const sizeRaw = map[`feature_bar_${n}_icon_size`];
      const iconSize = sizeRaw ? Number(sizeRaw) : undefined;
      return {
        title: map[`feature_bar_${n}_title`] || "",
        desc: map[`feature_bar_${n}_desc`] || "",
        iconUrl: map[`feature_bar_${n}_icon`] || undefined,
        iconSize:
          iconSize && Number.isFinite(iconSize) ? iconSize : undefined,
      };
    });

    const styles = pickStyles(map, [
      ...STYLE_BASE_KEYS,
      "feature_bar_2_title",
      "feature_bar_2_desc",
      "feature_bar_3_title",
      "feature_bar_3_desc",
      "feature_bar_4_title",
      "feature_bar_4_desc",
      "feature_bar_5_title",
      "feature_bar_5_desc",
    ]);

    return {
      heroTitle: map.hero_title || DEFAULT_HERO_TITLE,
      heroSubtitle: map.hero_subtitle || DEFAULT_HERO_SUBTITLE,
      heroBody: map.hero_body || undefined,
      heroImage: toWebpSrc(map.hero_image || DEFAULT_HERO_IMAGE),
      servicesTitle: map.services_section_title || undefined,
      testimonialTitle: map.testimonial_section_title || undefined,
      testimonials,
      featureBarItems,
      stats: buildStats(map),
      styles,
      sectionFeatureBarOffset: settings.sectionFeatureBarOffset,
      googleReviewsUrl: settings.googleReviewsUrl,
      whatsappUrl: settings.whatsappUrl,
      projects,
    };
  } catch (error) {
    console.error("loadHomePageData failed:", error);
    return {
      heroTitle: DEFAULT_HERO_TITLE,
      heroSubtitle: DEFAULT_HERO_SUBTITLE,
      heroBody: undefined,
      heroImage: undefined,
      servicesTitle: undefined,
      testimonialTitle: undefined,
      testimonials: undefined,
      featureBarItems: undefined,
      stats: buildStats({}),
      styles: {} as Record<string, string>,
      sectionFeatureBarOffset: "0",
      googleReviewsUrl: "",
      whatsappUrl: "",
      projects: [],
    };
  }
}
