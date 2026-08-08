import {
  ADDRESS,
  EMAIL,
  GOOGLE_BUSINESS_URL,
  INSTAGRAM_HANDLES,
  PHONE_RAW,
  SITE_NAME,
  SITE_TAGLINE,
  WORK_HOURS,
} from "@/lib/constants";

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    process.env.SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

export function localBusinessJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${url}/#business`,
    name: SITE_NAME,
    description: SITE_TAGLINE,
    url,
    telephone: `+${PHONE_RAW}`,
    ...(EMAIL.trim() ? { email: EMAIL } : {}),
    image: `${url}/images/logo/logo.png`,
    logo: `${url}/images/logo/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS,
      addressLocality: "Adana",
      addressRegion: "Adana",
      addressCountry: "TR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Adana",
    },
    sameAs: [
      ...INSTAGRAM_HANDLES.map((h) => h.href),
      GOOGLE_BUSINESS_URL,
    ].filter(Boolean),
    priceRange: "$$",
  };
}

/** Helps Google understand primary site sections (sitelinks are still Google-decided). */
export function siteNavigationJsonLd() {
  const url = getSiteUrl();
  const items = [
    { name: "Hizmetler", path: "/hizmetler" },
    { name: "Galeri", path: "/projeler" },
    { name: "Hakkımızda", path: "/hakkimizda" },
    { name: "Blog", path: "/blog" },
    { name: "İletişim", path: "/iletisim" },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "SiteNavigationElement",
      position: index + 1,
      name: item.name,
      url: `${url}${item.path}`,
    })),
  };
}

export function webSiteJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url,
    inLanguage: "tr-TR",
    publisher: { "@id": `${url}/#business` },
  };
}

export function productJsonLd(product: {
  name: string;
  description?: string | null;
  image?: string | null;
  slug: string;
  price: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    image: product.image
      ? product.image.startsWith("http")
        ? product.image
        : `${getSiteUrl()}${product.image}`
      : undefined,
    url: `${getSiteUrl()}/urun/${product.slug}`,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `${getSiteUrl()}/urun/${product.slug}`,
    },
  };
}

export { ADDRESS, WORK_HOURS };
