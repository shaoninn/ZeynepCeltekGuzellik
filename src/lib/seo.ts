import {
  ADDRESS,
  EMAIL,
  GOOGLE_BUSINESS_URL,
  INSTAGRAM_HANDLES,
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
  const hours = [
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
  ];
  const gazipasa = {
    "@type": "BeautySalon",
    "@id": `${url}/#gazipasa`,
    name: `${SITE_NAME} — Gazi Paşa`,
    url,
    telephone: "+905414570654",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Cemal Paşa Mh. Gazipaşa Bulvarı, 63003. Sk. Tek Apt Kat 4 No 41",
      addressLocality: "Seyhan",
      addressRegion: "Adana",
      postalCode: "01120",
      addressCountry: "TR",
    },
    openingHoursSpecification: hours,
    parentOrganization: { "@id": `${url}/#business` },
  };
  const turgut = {
    "@type": "BeautySalon",
    "@id": `${url}/#turgutozal`,
    name: `${SITE_NAME} — Turgut Özal`,
    url,
    telephone: ["+905454570656", "+903222325952"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Güzelyalı, Turgut Özal Blv. No:102",
      addressLocality: "Çukurova",
      addressRegion: "Adana",
      postalCode: "01170",
      addressCountry: "TR",
    },
    openingHoursSpecification: hours,
    parentOrganization: { "@id": `${url}/#business` },
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${url}/#business`,
        name: SITE_NAME,
        description: SITE_TAGLINE,
        url,
        telephone: ["+905414570654", "+905454570656", "+903222325952"],
        ...(EMAIL.trim() ? { email: EMAIL } : {}),
        image: `${url}/images/logo/logo-nobg.png`,
        logo: `${url}/images/logo/logo-nobg.png`,
        sameAs: [
          ...INSTAGRAM_HANDLES.map((h) => h.href),
          GOOGLE_BUSINESS_URL,
        ].filter(Boolean),
        department: [{ "@id": `${url}/#gazipasa` }, { "@id": `${url}/#turgutozal` }],
      },
      gazipasa,
      turgut,
    ],
  };
}

/** Helps Google understand primary site sections (sitelinks are still Google-decided). */
export function siteNavigationJsonLd() {
  const url = getSiteUrl();
  const items = [
    { name: "Hizmetler", path: "/hizmetler" },
    { name: "Paketler", path: "/paketler" },
    { name: "Galeriler", path: "/kampanyalar" },
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
    "@type": "Service",
    name: product.name,
    description: product.description || undefined,
    image: product.image
      ? product.image.startsWith("http")
        ? product.image
        : `${getSiteUrl()}${product.image}`
      : undefined,
    url: `${getSiteUrl()}/hizmet/${product.slug}`,
    provider: { "@id": `${getSiteUrl()}/#business` },
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      price: product.price,
      availability: "https://schema.org/LimitedAvailability",
      url: `${getSiteUrl()}/hizmet/${product.slug}`,
    },
  };
}

export { ADDRESS, WORK_HOURS };
