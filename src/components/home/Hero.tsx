"use client";

import { Camera, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EditableText } from "@/components/editor/EditableText";
import { EditableImage } from "@/components/editor/EditableImage";
import { useEditor } from "@/components/editor/EditorProvider";
import { HeroMedia } from "@/components/home/HeroMedia";
import { INSTAGRAM_HANDLES, STATS } from "@/lib/constants";

interface HeroProps {
  title: string;
  subtitle: string;
  body?: string;
  image?: string;
  styles?: Record<string, string>;
}

export const DEFAULT_HERO_IMAGE = "/images/hero/hero-1.jpg";
const DEFAULT_BODY =
  "Kişiye özel çözümler ve uzman kadromuzla güzelliğinize değer katıyoruz. Cilt bakımı, lazer epilasyon ve bölgesel incelmede Adana’da yanınızdayız.";

export function Hero({ title, subtitle, body, image, styles }: HeroProps) {
  const { enabled } = useEditor();
  const bg = image || DEFAULT_HERO_IMAGE;

  // "Güzelliğinize Değer Veriyoruz" → serif + gold script from "Değer"
  const marker = "değer";
  const lower = title.toLocaleLowerCase("tr-TR");
  const at = lower.indexOf(marker);
  const before = at >= 0 ? title.slice(0, at).trimEnd() : title;
  const scriptPart = at >= 0 ? title.slice(at).trim() : "Değer Veriyoruz";

  const heroStats = [
    { value: STATS[0].value, label: STATS[0].label },
    { value: STATS[1].value, label: STATS[1].label },
    { value: STATS[2].value, label: STATS[2].label },
    { value: "Uzman", label: "Ekip" },
  ];

  return (
    <section className="relative overflow-hidden bg-marble border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_45%,rgba(201,169,98,0.12),transparent_55%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-6 xl:gap-10 items-center py-8 sm:py-10 lg:py-6 lg:min-h-[min(34rem,calc(100svh-4.5rem))]">
          {/* Copy */}
          <div className="relative z-10 order-2 lg:order-1 min-w-0">
            <EditableText
              contentKey="hero_subtitle"
              value={subtitle || "ZEYNEP ÇELTEK GÜZELLİK MERKEZİ"}
              as="p"
              block
              className="animate-hero font-sans text-orange text-[10px] sm:text-[11px] font-semibold tracking-[0.28em] uppercase mb-3 sm:mb-4"
              help="Hero üst etiket"
              textStyle={styles?.hero_subtitle}
            />

            <h1 className="animate-hero-delay mb-4 sm:mb-5">
              <EditableText
                contentKey="hero_title"
                value={title || "Güzelliğinize Değer Veriyoruz"}
                as="span"
                block
                className="block"
                help='Slogan. "Değer"den sonrası altın script olur.'
                textStyle={styles?.hero_title}
              >
                <span className="font-display text-[2.35rem] leading-[1.08] sm:text-5xl lg:text-[3.35rem] font-semibold text-white tracking-tight">
                  {before}
                </span>
                <span className="mt-1 block font-script text-orange text-[2.35rem] sm:text-5xl lg:text-[3.4rem] italic font-normal leading-[1.05]">
                  {scriptPart}
                </span>
              </EditableText>
            </h1>

            <EditableText
              contentKey="hero_body"
              value={body || DEFAULT_BODY}
              as="p"
              block
              multiline
              className="animate-hero-delay-2 font-sans text-white/65 text-sm sm:text-[0.95rem] max-w-md mb-7 leading-relaxed"
              help="Hero açıklama"
              textStyle={styles?.hero_body}
            />

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

          {/* Portrait panel — fills column */}
          <div className="relative order-1 lg:order-2 min-w-0 w-full">
            <div className="relative mx-auto w-full max-w-[28rem] lg:max-w-none aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] lg:h-[min(36rem,calc(100svh-5.5rem))] lg:aspect-auto">
              {/* Gold circular frame */}
              <div className="pointer-events-none absolute inset-[-4%] sm:inset-[-6%] rounded-full border border-orange/40" />
              <div className="pointer-events-none absolute inset-[2%] rounded-full border border-orange/15" />

              <div className="absolute inset-0 overflow-hidden rounded-full bg-card">
                {enabled ? (
                  <EditableImage
                    contentKey="hero_image"
                    value={bg}
                    fallback={DEFAULT_HERO_IMAGE}
                    alt="Zeynep Çeltek Güzellik"
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 42vw"
                    imgClassName="object-cover object-[center_20%]"
                    help="Ana sayfa hero görseli"
                  />
                ) : (
                  <HeroMedia
                    src={bg}
                    alt="Zeynep Çeltek Güzellik"
                    className="object-cover object-[center_20%]"
                    sizes="(max-width: 1024px) 90vw, 42vw"
                  />
                )}
              </div>

              {/* Vertical stats — desktop */}
              <ul className="hidden lg:flex absolute -right-1 xl:right-0 top-1/2 -translate-y-1/2 translate-x-full xl:translate-x-[70%] flex-col gap-5 pl-4">
                {heroStats.map((s) => (
                  <li key={s.label} className="text-left min-w-[4.5rem]">
                    <p className="font-display text-orange text-lg font-semibold leading-none">
                      {s.value}
                    </p>
                    <p className="text-[10px] text-white/50 tracking-wider uppercase mt-1">
                      {s.label}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile stats */}
            <ul className="lg:hidden mt-5 grid grid-cols-4 gap-2 text-center">
              {heroStats.map((s) => (
                <li key={s.label}>
                  <p className="font-display text-orange text-sm font-semibold">
                    {s.value}
                  </p>
                  <p className="text-[9px] text-white/45 uppercase tracking-wide">
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
