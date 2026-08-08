import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat, Great_Vibes } from "next/font/google";
import "./globals.css";
import { getSiteUrl, localBusinessJsonLd, siteNavigationJsonLd, webSiteJsonLd } from "@/lib/seo";
import { Analytics } from "@/components/Analytics";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
};

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
  adjustFontFallback: true,
  preload: true,
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: true,
  preload: false,
});

const greatVibes = Great_Vibes({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
  adjustFontFallback: true,
  preload: false,
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Zeynep Çeltek Güzellik | Adana Güzellik Salonu",
    template: "%s | Zeynep Çeltek Güzellik",
  },
  description:
    "Adana'da Zeynep Çeltek Güzellik Salonu. Cilt bakımı, lazer epilasyon, bölgesel incelme ve Alex lazer paketleri. Randevu alın.",
  keywords: [
    "zeynep çeltek güzellik",
    "adana güzellik salonu",
    "cilt bakımı adana",
    "lazer epilasyon adana",
    "hydrafacial adana",
    "bölgesel incelme",
    "alex lazer",
  ],
  // Per-page canonical only — never set "/" here (inherits to all routes).
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/icon.png?v=2", type: "image/png", sizes: "192x192" },
      { url: "/favicon-32.png?v=2", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon.png?v=2", sizes: "180x180" }],
    shortcut: "/favicon.ico?v=2",
  },
  openGraph: {
    title: "Zeynep Çeltek Güzellik | Adana Güzellik Salonu",
    description: "Adana'da profesyonel güzellik hizmetleri.",
    locale: "tr_TR",
    type: "website",
    url: siteUrl,
    siteName: "Zeynep Çeltek Güzellik",
    images: [
      {
        url: "/images/logo/logo.png",
        width: 763,
        height: 117,
        alt: "Zeynep Çeltek Güzellik",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zeynep Çeltek Güzellik | Adana",
    description: "Adana'da profesyonel güzellik hizmetleri.",
    images: ["/images/logo/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = [localBusinessJsonLd(), webSiteJsonLd(), siteNavigationJsonLd()];

  return (
    <html
      lang="tr"
      className={`${montserrat.variable} ${cormorant.variable} ${greatVibes.variable}`}
    >
      <body className="antialiased font-sans">
        {jsonLd.map((data, index) => (
          <script
            key={`ld-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}
        {children}
        <Analytics />
      </body>
    </html>
  );
}
