"use client";

import { Camera, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HeroMedia } from "@/components/home/HeroMedia";
import { INSTAGRAM_HANDLES, STATS } from "@/lib/constants";
import { textStyleToCss, parseTextStyle } from "@/lib/text-style";

export const DEFAULT_HERO_IMAGE = "/images/hero/hero-1.jpg";
export const DEFAULT_HERO_BODY =
  "Kişiye özel çözümler ve uzman kadromuzla güzelliğinize değer katıyoruz. Cilt bakımı, lazer epilasyon ve bölgesel incelmede Adana’da yanınızdayız.";

export type HeroViewProps = {
  title: string;
  subtitle: string;
  body?: string;
  image?: string;
  styles?: Record<string, string>;
};

export function splitHeroTitle(title: string) {
  const marker = "değer";
  const lower = title.toLocaleLowerCase("tr-TR");
  const at = lower.indexOf(marker);
  const before = at >= 0 ? title.slice(0, at).trimEnd() : title;
  const scriptPart = at >= 0 ? title.slice(at).trim() : "Değer Veriyoruz";
  return { before, scriptPart };
}

export function heroStatsItems() {
  return [
    { value: STATS[0].value, label: STATS[0].label },
    { value: STATS[1].value, label: STATS[1].label },
    { value: STATS[2].value, label: STATS[2].label },
    { value: "Uzman", label: "Ekip" },
  ];
}

function HeroStatsAside({ items }: { items: ReturnType<typeof heroStatsItems> }) {
  return (
    <ul className="hidden lg:flex flex-col justify-center gap-6 shrink-0 pl-2 xl:pl-4 min-w-[5.5rem]">
      {items.map((s) => (
        <li key={s.label} className="text-left">
          <p className="font-display text-orange text-xl xl:text-2xl font-semibold leading-none drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
            {s.value}
          </p>
          <p className="text-[10px] text-cream/70 tracking-[0.14em] uppercase mt-1.5">
            {s.label}
          </p>
        </li>
      ))}
    </ul>
  );
}

/** Public hero — no Editable* / editor chrome in the bundle path. */
export function HeroPublic({
  title,
  subtitle,
  body,
  image,
  styles,
}: HeroViewProps) {
  const bg = image || DEFAULT_HERO_IMAGE;
  const { before, scriptPart } = splitHeroTitle(
    title || "Güzelliğinize Değer Veriyoruz"
  );
  const heroStats = heroStatsItems();

  return (
    <section className="relative bg-marble border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_45%,rgba(201,169,98,0.12),transparent_55%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-8 lg:gap-6 xl:gap-8 items-center py-8 sm:py-10 lg:py-6 lg:min-h-[min(34rem,calc(100svh-4.5rem))]">
          <div className="relative z-10 order-2 lg:order-1 min-w-0">
            <p
              className="animate-hero font-sans text-orange text-[10px] sm:text-[11px] font-semibold tracking-[0.28em] uppercase mb-3 sm:mb-4"
              style={textStyleToCss(parseTextStyle(styles?.hero_subtitle))}
            >
              {subtitle || "ZEYNEP ÇELTEK GÜZELLİK MERKEZİ"}
            </p>

            <h1
              className="animate-hero-delay mb-4 sm:mb-5"
              style={textStyleToCss(parseTextStyle(styles?.hero_title))}
            >
              <span className="font-display text-[2.35rem] leading-[1.08] sm:text-5xl lg:text-[3.35rem] font-semibold text-white tracking-tight">
                {before}
              </span>
              <span className="mt-1 block font-script text-orange text-[2.35rem] sm:text-5xl lg:text-[3.4rem] italic font-normal leading-[1.05]">
                {scriptPart}
              </span>
            </h1>

            <p
              className="animate-hero-delay-2 font-sans text-white/65 text-sm sm:text-[0.95rem] max-w-md mb-7 leading-relaxed"
              style={textStyleToCss(parseTextStyle(styles?.hero_body))}
            >
              {body || DEFAULT_HERO_BODY}
            </p>

            <div className="animate-hero-delay-2 flex flex-wrap gap-3 mb-8">
              <Button href="/hizmetler" variant="primary" size="lg">
                Hizmetlerimizi İncele
              </Button>
              <Button href="/iletisim" variant="outline" size="lg" className="gap-2">
                <Phone size={15} />
                Bize Ulaşın
              </Button>
            </div>

            <div className="animate-hero-delay-2 flex flex-wrap items-center gap-4 sm:gap-5">
              {INSTAGRAM_HANDLES.map((ig) => (
                <a
                  key={ig.handle}
                  href={ig.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/55 hover:text-orange transition-colors text-xs sm:text-sm"
                >
                  <Camera size={14} className="text-orange" />
                  <span>{ig.handle}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="relative order-1 lg:order-2 min-w-0 w-full">
            <div className="flex items-center justify-center lg:justify-end gap-3 xl:gap-5">
              <div className="relative w-full max-w-[28rem] lg:max-w-[min(100%,26rem)] xl:max-w-[28rem] aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] lg:h-[min(36rem,calc(100svh-5.5rem))] lg:aspect-auto">
                <div className="pointer-events-none absolute inset-[-4%] sm:inset-[-6%] rounded-full border border-orange/40" />
                <div className="pointer-events-none absolute inset-[2%] rounded-full border border-orange/15" />

                <div className="absolute inset-0 overflow-hidden rounded-full bg-card">
                  <HeroMedia
                    src={bg}
                    alt="Zeynep Çeltek Güzellik"
                    className="object-cover object-[center_20%]"
                    sizes="(max-width: 1024px) 90vw, 42vw"
                  />
                </div>
              </div>

              <HeroStatsAside items={heroStats} />
            </div>

            <ul className="lg:hidden mt-5 grid grid-cols-4 gap-2 text-center">
              {heroStats.map((s) => (
                <li key={s.label}>
                  <p className="font-display text-orange text-sm font-semibold">
                    {s.value}
                  </p>
                  <p className="text-[9px] text-cream/65 uppercase tracking-wide">
                    {s.label}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
