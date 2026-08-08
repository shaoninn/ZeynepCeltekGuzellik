"use client";

import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EditableText } from "@/components/editor/EditableText";
import { EditableImage } from "@/components/editor/EditableImage";
import { useEditor } from "@/components/editor/EditorProvider";
import { HeroMedia } from "@/components/home/HeroMedia";
import { SocialRail } from "@/components/home/SocialRail";

interface HeroProps {
  title: string;
  subtitle: string;
  body?: string;
  image?: string;
  styles?: Record<string, string>;
  scriptLine?: string;
}

export const DEFAULT_HERO_IMAGE = "/images/hero/hero-1.jpg";
const DEFAULT_BODY =
  "Kişiye özel cilt bakımı, lazer epilasyon ve bölgesel incelme çözümleriyle Adana’da yanınızdayız. Uzman kadromuzla güzelliğinize değer katıyoruz.";
const DEFAULT_SCRIPT = "Değer";

export function Hero({
  title,
  subtitle,
  body,
  image,
  styles,
  scriptLine = DEFAULT_SCRIPT,
}: HeroProps) {
  const { enabled } = useEditor();
  const bg = image || DEFAULT_HERO_IMAGE;

  // "Güzelliğinize Değer Veriyoruz" → highlight script word
  const highlight = scriptLine || DEFAULT_SCRIPT;
  const lower = title.toLocaleLowerCase("tr-TR");
  const hiLower = highlight.toLocaleLowerCase("tr-TR");
  const hiAt = lower.indexOf(hiLower);
  const before =
    hiAt >= 0 ? title.slice(0, hiAt).trimEnd() : title;
  const matched =
    hiAt >= 0 ? title.slice(hiAt, hiAt + highlight.length) : highlight;
  const after =
    hiAt >= 0 ? title.slice(hiAt + highlight.length).trimStart() : "";

  return (
    <section className="relative overflow-hidden bg-marble">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(201,169,98,0.14),transparent_55%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-10 items-center min-h-0 lg:min-h-[calc(100svh-5.5rem)] py-10 sm:py-12 lg:py-8 pb-24 lg:pb-28">
          <div className="relative z-10 order-1 min-w-0">
            {subtitle ? (
              <EditableText
                contentKey="hero_subtitle"
                value={subtitle}
                as="p"
                block
                multiline
                className="animate-hero font-sans text-orange text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase mb-4 sm:mb-5 break-anywhere"
                help="Hero üst etiket (marka satırı)"
                textStyle={styles?.hero_subtitle}
              />
            ) : null}

            <h1 className="animate-hero-delay mb-4 sm:mb-5">
              <EditableText
                contentKey="hero_title"
                value={title}
                as="span"
                block
                className="font-display text-[2.15rem] leading-[1.15] sm:text-5xl lg:text-[3.25rem] xl:text-[3.5rem] font-semibold text-white tracking-tight break-anywhere"
                help='Ana slogan. Örn: "Güzelliğinize Değer Veriyoruz" — Değer altın script olur.'
                textStyle={styles?.hero_title}
              >
                <span className="block">
                  {before ? <span>{before} </span> : null}
                  <span className="font-script text-orange text-[1.85rem] sm:text-4xl lg:text-[2.85rem] italic font-normal tracking-normal">
                    {matched}
                  </span>
                  {after ? <span> {after}</span> : null}
                </span>
              </EditableText>
            </h1>

            <EditableText
              contentKey="hero_body"
              value={body || DEFAULT_BODY}
              as="p"
              block
              multiline
              className="animate-hero-delay-2 font-sans text-white/70 text-sm sm:text-base max-w-md mb-8 leading-relaxed"
              help="Başlığın altındaki kısa açıklama"
              textStyle={styles?.hero_body}
            />

            <div className="animate-hero-delay-2 flex flex-wrap gap-3">
              <Button
                href="/hizmetler"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto justify-center"
              >
                Hizmetlerimizi İncele
              </Button>
              <Button
                href="/iletisim"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto justify-center gap-2"
              >
                <Calendar size={16} />
                Randevu Al
              </Button>
            </div>
          </div>

          <div className="relative order-2 min-w-0 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[min(100%,26rem)] lg:max-w-[30rem]">
              <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[108%] w-[108%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange/35" />
              <div className="relative aspect-[4/5] max-h-[48svh] sm:max-h-none mx-auto w-full overflow-hidden rounded-sm border border-white/10 bg-card">
                {enabled ? (
                  <EditableImage
                    contentKey="hero_image"
                    value={bg}
                    fallback={DEFAULT_HERO_IMAGE}
                    alt="Zeynep Çeltek Güzellik"
                    fill
                    priority
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 30rem"
                    imgClassName="object-cover object-center"
                    help="Ana sayfa hero görseli"
                  />
                ) : (
                  <HeroMedia src={bg} alt="Zeynep Çeltek Güzellik" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <SocialRail />
    </section>
  );
}
