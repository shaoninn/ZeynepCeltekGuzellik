import { cache } from "react";
import { prisma } from "@/lib/db";
import { memoryCache, memoryCacheInvalidate } from "@/lib/memory-cache";
import {
  PHONE,
  PHONE_RAW,
  EMAIL,
  ADDRESS,
  INSTAGRAM,
  WORK_HOURS,
  NAV_LINKS,
  GOOGLE_BUSINESS_URL,
  LOCATION_LABEL,
} from "@/lib/constants";

export interface SiteSettingsMap {
  phone: string;
  phoneRaw: string;
  whatsapp: string;
  whatsappUrl: string;
  email: string;
  address: string;
  instagram: string;
  googleReviewsUrl: string;
  workHoursWeekdays: string;
  workHoursSunday: string;
  /** Header location strip (Adana) */
  locationLabel: string;
  /** WhatsApp link label in top bar */
  whatsappLabel: string;
  /** Vertical shift for entire header (px) */
  headerOffsetY: string;
  /** Logo drag/scale JSON */
  layoutLogo: string;
  /** Top-right phone box drag JSON */
  layoutPhoneBox: string;
  /** Primary nav horizontal shift (px) */
  layoutNavOffsetX: string;
  /** Homepage section vertical offsets (px) */
  sectionCategoriesOffset: string;
  sectionCtaOffset: string;
  sectionFeatureBarOffset: string;
}

export interface NavLinkItem {
  href: string;
  label: string;
}

export const CACHE_TAGS = {
  settings: "site-settings",
  nav: "site-nav",
  projects: "projects",
  categories: "categories",
  blog: "blog",
  content: "site-content",
} as const;

/** Cross-request TTL for hot layout data (remote MySQL RTT is expensive). */
const LAYOUT_TTL_MS = 120_000;

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function mapSettings(
  rows: { key: string; value: string }[]
): SiteSettingsMap {
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  const phone = map.phone || PHONE;
  let whatsapp = map.whatsapp || PHONE_RAW;
  whatsapp = digitsOnly(whatsapp);
  if (whatsapp.startsWith("0")) {
    whatsapp = `90${whatsapp.slice(1)}`;
  }
  if (!whatsapp.startsWith("90") && whatsapp.length === 10) {
    whatsapp = `90${whatsapp}`;
  }

  return {
    phone,
    phoneRaw: digitsOnly(phone).replace(/^0/, "90") || PHONE_RAW,
    whatsapp,
    whatsappUrl: `https://wa.me/${whatsapp}`,
    email: map.email || EMAIL,
    address: map.address || ADDRESS,
    instagram: map.instagram || INSTAGRAM,
    googleReviewsUrl: map.google_reviews_url || GOOGLE_BUSINESS_URL,
    workHoursWeekdays: map.work_hours_weekdays || WORK_HOURS.weekdays,
    workHoursSunday: map.work_hours_sunday || WORK_HOURS.sunday,
    locationLabel: map.location_label || LOCATION_LABEL,
    whatsappLabel: map.whatsapp_label || "WhatsApp",
    headerOffsetY: map.header_offset_y || "0",
    layoutLogo: map.layout_logo || "",
    layoutPhoneBox: map.layout_phone_box || "",
    layoutNavOffsetX: map.layout_nav_offset_x || "0",
    sectionCategoriesOffset: map.section_categories_offset || "0",
    sectionCtaOffset: map.section_cta_offset || "0",
    sectionFeatureBarOffset: map.section_feature_bar_offset || "0",
  };
}

const fallbackSettings = (): SiteSettingsMap => ({
  phone: PHONE,
  phoneRaw: PHONE_RAW,
  whatsapp: PHONE_RAW,
  whatsappUrl: `https://wa.me/${PHONE_RAW}`,
  email: EMAIL,
  address: ADDRESS,
  instagram: INSTAGRAM,
  googleReviewsUrl: GOOGLE_BUSINESS_URL,
  workHoursWeekdays: WORK_HOURS.weekdays,
  workHoursSunday: WORK_HOURS.sunday,
  locationLabel: LOCATION_LABEL,
  whatsappLabel: "WhatsApp",
  headerOffsetY: "0",
  layoutLogo: "",
  layoutPhoneBox: "",
  layoutNavOffsetX: "0",
  sectionCategoriesOffset: "0",
  sectionCtaOffset: "0",
  sectionFeatureBarOffset: "0",
});

async function loadSiteSettings(): Promise<SiteSettingsMap> {
  try {
    const rows = await prisma.siteSetting.findMany();
    return mapSettings(rows);
  } catch (error) {
    console.error("[site] getSiteSettings failed:", error);
    return fallbackSettings();
  }
}

async function loadNavLinks(): Promise<NavLinkItem[]> {
  try {
    const items = await prisma.navItem.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    if (items.length === 0) {
      return NAV_LINKS.map((l) => ({ href: l.href, label: l.label }));
    }
    return items.map((i) => ({ href: i.href, label: i.label }));
  } catch (error) {
    console.error("[site] getNavLinks failed:", error);
    return NAV_LINKS.map((l) => ({ href: l.href, label: l.label }));
  }
}

/** Request dedupe + 60s process memory cache (survives navigations on same worker). */
export const getSiteSettings = cache(async (): Promise<SiteSettingsMap> =>
  memoryCache("site:settings", loadSiteSettings, { ttlMs: LAYOUT_TTL_MS })
);

export const getNavLinks = cache(async (): Promise<NavLinkItem[]> =>
  memoryCache("site:nav", loadNavLinks, { ttlMs: LAYOUT_TTL_MS })
);

export function invalidateSiteMemoryCache(): void {
  memoryCacheInvalidate("site:");
}
