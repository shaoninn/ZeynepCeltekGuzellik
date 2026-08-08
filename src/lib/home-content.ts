import { getContentMap } from "@/lib/site-content";
import {
  getActiveCategories,
  getFeaturedProducts,
  getFeaturedProjects,
  getRecentProductPool,
} from "@/lib/catalog";
import { getSiteSettings } from "@/lib/site";
import { buildStats, buildValueProps } from "@/lib/page-content";
import { INSTAGRAM, FEATURE_BAR } from "@/lib/constants";
import { getInstagramFeed } from "@/lib/instagram";
import { styleContentKey } from "@/lib/text-style";
import { toWebpSrc } from "@/lib/image-optimize";

const DEFAULT_HERO_IMAGE = "/images/hero/hero-1.jpg";

/** Never stall homepage HTML on Instagram Graph (cold workers / 12s abort). */
async function getInstagramForHome(fallbackUrl: string) {
  try {
    return await Promise.race([
      getInstagramFeed(),
      new Promise<Awaited<ReturnType<typeof getInstagramFeed>>>((_, reject) => {
        setTimeout(() => reject(new Error("instagram-budget")), 350);
      }),
    ]);
  } catch {
    // Warm cache in background for the next request.
    void getInstagramFeed();
    return { posts: [], profileUrl: fallbackUrl || INSTAGRAM, live: false };
  }
}

const HOME_CONTENT_KEYS = [
  "hero_title",
  "hero_subtitle",
  "hero_body",
  "hero_image",
  "works_eyebrow",
  "works_title",
  "services_intro",
  "services_section_title",
  "featured_products_title",
  "shipping_banner_title",
  "why_us_title",
  "why_us_1",
  "why_us_2",
  "why_us_3",
  "why_us_4",
  "why_us_5",
  "why_us_6",
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
  "cta_title",
  "cta_button_label",
  "cta_banner_1",
  "cta_banner_2",
  "cta_banner_3",
  "cta_banner_4",
  "process_section_eyebrow",
  "process_section_title",
  "process_section_desc",
  "process_1_number",
  "process_1_title",
  "process_1_desc",
  "process_2_number",
  "process_2_title",
  "process_2_desc",
  "process_3_number",
  "process_3_title",
  "process_3_desc",
  "process_4_number",
  "process_4_title",
  "process_4_desc",
  "faq_section_eyebrow",
  "faq_section_title",
  "faq_1_q",
  "faq_1_a",
  "faq_2_q",
  "faq_2_a",
  "faq_3_q",
  "faq_3_a",
  "faq_4_q",
  "faq_4_a",
  "testimonial_section_eyebrow",
  "testimonial_section_title",
  "testimonial_section_desc",
  "google_reviews_link_label",
  "testimonial_1_quote",
  "testimonial_1_name",
  "testimonial_1_place",
  "testimonial_2_quote",
  "testimonial_2_name",
  "testimonial_2_place",
  "testimonial_3_quote",
  "testimonial_3_name",
  "testimonial_3_place",
  "value_prop_1_title",
  "value_prop_1_desc",
  "value_prop_1_icon",
  "value_prop_1_icon_size",
  "value_prop_2_title",
  "value_prop_2_desc",
  "value_prop_2_icon",
  "value_prop_2_icon_size",
  "value_prop_3_title",
  "value_prop_3_desc",
  "value_prop_3_icon",
  "value_prop_3_icon_size",
  "value_prop_4_title",
  "value_prop_4_desc",
  "value_prop_4_icon",
  "value_prop_4_icon_size",
  "stat_1_value",
  "stat_1_label",
  "stat_2_value",
  "stat_2_label",
  "stat_3_value",
  "stat_3_label",
  "stat_4_value",
  "stat_4_label",
] as const;

/** Style companion keys for commonly edited homepage texts. */
const STYLE_BASE_KEYS = [
  "hero_title",
  "hero_subtitle",
  "hero_body",
  "services_section_title",
  "cta_title",
  "cta_button_label",
  "process_section_eyebrow",
  "process_section_title",
  "process_section_desc",
  "process_1_number",
  "process_2_number",
  "process_3_number",
  "process_4_number",
  "faq_section_eyebrow",
  "faq_section_title",
  "testimonial_section_eyebrow",
  "testimonial_section_title",
  "google_reviews_link_label",
  "featured_products_title",
  "shipping_banner_title",
] as const;

const HOME_KEYS = [
  ...HOME_CONTENT_KEYS,
  ...STYLE_BASE_KEYS.map((k) => styleContentKey(k)),
] as const;

const DEFAULT_HERO_TITLE = "Güzelliği bilimle, sanata dönüştürüyoruz.";
const DEFAULT_HERO_SUBTITLE = "";

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
    const [map, projects, settings, categories, products, recentPool] =
      await Promise.all([
        getContentMap([...HOME_KEYS]),
        getFeaturedProjects(),
        getSiteSettings(),
        getActiveCategories(),
        getFeaturedProducts(),
        getRecentProductPool(),
      ]);

    const ig = await getInstagramForHome(settings.instagram || INSTAGRAM);

    const processSteps = [1, 2, 3, 4].map((n) => ({
      n: map[`process_${n}_number`] || "",
      title: map[`process_${n}_title`] || "",
      desc: map[`process_${n}_desc`] || "",
    }));

    const faqs = [1, 2, 3, 4].map((n) => ({
      q: map[`faq_${n}_q`] || "",
      a: map[`faq_${n}_a`] || "",
    }));

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
      "process_1_title",
      "process_1_desc",
      "process_2_title",
      "process_2_desc",
      "process_3_title",
      "process_3_desc",
      "process_4_title",
      "process_4_desc",
      "faq_1_q",
      "faq_1_a",
      "testimonial_1_quote",
      "feature_bar_1_title",
      "feature_bar_1_desc",
      "value_prop_1_title",
      "value_prop_1_desc",
      "value_prop_2_title",
      "value_prop_2_desc",
      "value_prop_3_title",
      "value_prop_3_desc",
      "value_prop_4_title",
      "value_prop_4_desc",
    ]);

    return {
      heroTitle: map.hero_title || DEFAULT_HERO_TITLE,
      heroSubtitle: map.hero_subtitle || DEFAULT_HERO_SUBTITLE,
      heroBody: map.hero_body || undefined,
      heroImage: toWebpSrc(map.hero_image || DEFAULT_HERO_IMAGE),
      worksEyebrow: map.works_eyebrow || undefined,
      worksTitle: map.works_title || undefined,
      servicesIntro: map.services_intro || undefined,
      servicesTitle: map.services_section_title || undefined,
      featuredProductsTitle: map.featured_products_title || undefined,
      shippingBannerTitle: map.shipping_banner_title || undefined,
      ctaTitle: map.cta_title || undefined,
      ctaButtonLabel: map.cta_button_label || undefined,
      ctaBanners: [1, 2, 3, 4].map((n) =>
        toWebpSrc(map[`cta_banner_${n}`] || "")
      ),
      processEyebrow: map.process_section_eyebrow || undefined,
      processTitle: map.process_section_title || undefined,
      processDesc: map.process_section_desc || undefined,
      processSteps,
      faqEyebrow: map.faq_section_eyebrow || undefined,
      faqTitle: map.faq_section_title || undefined,
      faqs,
      testimonialEyebrow: map.testimonial_section_eyebrow || undefined,
      testimonialTitle: map.testimonial_section_title || undefined,
      testimonialDesc: map.testimonial_section_desc || undefined,
      googleReviewsLinkLabel: map.google_reviews_link_label || undefined,
      testimonials,
      featureBarItems,
      valueProps: buildValueProps(map),
      stats: buildStats(map),
      styles,
      sectionCategoriesOffset: settings.sectionCategoriesOffset,
      sectionCtaOffset: settings.sectionCtaOffset,
      sectionFeatureBarOffset: settings.sectionFeatureBarOffset,
      projects,
      categories,
      products,
      recentPool,
      googleReviewsUrl: settings.googleReviewsUrl,
      instagramUrl: ig.profileUrl || settings.instagram || INSTAGRAM,
      instagramPosts: ig.posts,
      instagramLive: ig.live,
    };
  } catch (error) {
    console.error("loadHomePageData failed:", error);
    return {
      heroTitle: DEFAULT_HERO_TITLE,
      heroSubtitle: DEFAULT_HERO_SUBTITLE,
      heroBody: undefined,
      heroImage: undefined,
      worksEyebrow: undefined,
      worksTitle: undefined,
      servicesIntro: undefined,
      servicesTitle: undefined,
      featuredProductsTitle: undefined,
      shippingBannerTitle: undefined,
      ctaTitle: undefined,
      ctaButtonLabel: undefined,
      ctaBanners: ["", "", "", ""],
      processEyebrow: undefined,
      processTitle: undefined,
      processDesc: undefined,
      processSteps: undefined,
      faqEyebrow: undefined,
      faqTitle: undefined,
      faqs: undefined,
      testimonialEyebrow: undefined,
      testimonialTitle: undefined,
      testimonialDesc: undefined,
      googleReviewsLinkLabel: undefined,
      testimonials: undefined,
      featureBarItems: undefined,
      valueProps: buildValueProps({}),
      stats: buildStats({}),
      styles: {} as Record<string, string>,
      sectionCategoriesOffset: "0",
      sectionCtaOffset: "0",
      sectionFeatureBarOffset: "0",
      projects: [],
      categories: [],
      products: [],
      recentPool: [],
      googleReviewsUrl: "",
      instagramUrl: INSTAGRAM,
      instagramPosts: [],
      instagramLive: false,
    };
  }
}
