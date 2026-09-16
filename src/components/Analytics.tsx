"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { bindClickTracking, captureUtm, hasAnalyticsConsent } from "@/lib/analytics";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const AW_ID = process.env.NEXT_PUBLIC_AW_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function Analytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => setAllowed(hasAnalyticsConsent());
    sync();
    captureUtm();
    window.addEventListener("zc-consent", sync);
    return () => window.removeEventListener("zc-consent", sync);
  }, []);

  useEffect(() => {
    if (!allowed) return;
    return bindClickTracking();
  }, [allowed]);

  if (!allowed || (!GA_ID && !AW_ID && !PIXEL_ID)) return null;

  const configs = [
    GA_ID ? `gtag('config', '${GA_ID}', { anonymize_ip: true });` : "",
    AW_ID ? `gtag('config', '${AW_ID}');` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const primaryId = GA_ID || AW_ID;

  return (
    <>
      {primaryId ? (
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
      ) : null}
      {PIXEL_ID ? (
        <Script id="meta-pixel" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      ) : null}
    </>
  );
}
