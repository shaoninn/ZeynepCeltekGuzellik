"use client";

import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const AW_ID = process.env.NEXT_PUBLIC_AW_ID;

/**
 * GA4 + optional Google Ads — load after idle so LCP is not competing.
 * Ads DNS/AAAA sorunlarını gtag çözmez; bkz. SITE-TEMPLATE-BLUEPRINT DNS bölümü.
 */
export function Analytics() {
  if (!GA_ID && !AW_ID) return null;

  const configs = [
    GA_ID ? `gtag('config', '${GA_ID}', { anonymize_ip: true });` : "",
    AW_ID ? `gtag('config', '${AW_ID}');` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const primaryId = GA_ID || AW_ID;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
        strategy="lazyOnload"
      />
      <Script id="gtag-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${configs}
        `}
      </Script>
    </>
  );
}
