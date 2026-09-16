"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EditableText } from "@/components/editor/EditableText";
import { SiteLink } from "@/components/ui/SiteLink";
import { toWebpSrc, toWebpSrcMobile } from "@/lib/image-optimize";

interface GallerySectionProps {
  title?: string;
  images: string[];
}

const FALLBACKS = [
  "/images/gallery/gallery-1.jpg",
  "/images/gallery/gallery-2.jpg",
  "/images/gallery/gallery-3.jpg",
  "/images/gallery/gallery-4.jpg",
  "/images/gallery/gallery-5.jpg",
];

export function GallerySection({
  title = "Kampanyalar & Uygulamalarımız",
  images,
}: GallerySectionProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const list = (images.length > 0 ? images : FALLBACKS).slice(0, 8);

  function scrollBy(dir: -1 | 1) {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(360, el.clientWidth * 0.8), behavior: "smooth" });
  }

  return (
    <section id="kampanyalar" className="scroll-mt-24 py-12 sm:py-14 lg:py-16 bg-marble">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <EditableText
            contentKey="gallery_section_title"
            value={title}
            as="h2"
            block
            className="section-title text-xl sm:text-2xl lg:text-3xl text-cream"
            help="Galeri / kampanya başlığı"
          />
          <div className="section-ornament">
            <span className="section-ornament-dot" />
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 w-11 h-11 rounded-full border border-orange/50 bg-black/70 text-orange flex items-center justify-center hover:bg-orange hover:text-ink transition-colors"
            aria-label="Önceki"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 w-11 h-11 rounded-full border border-orange/50 bg-black/70 text-orange flex items-center justify-center hover:bg-orange hover:text-ink transition-colors"
            aria-label="Sonraki"
          >
            <ChevronRight size={18} />
          </button>

          <div
            ref={scroller}
            className="works-slider flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide px-12"
          >
            {list.map((src, i) => {
              const webp = toWebpSrc(src);
              const sm = toWebpSrcMobile(src);
              return (
                <div
                  key={`${src}-${i}`}
                  className="relative shrink-0 w-[78%] sm:w-[42%] lg:w-[30%] aspect-[4/5] overflow-hidden border border-border bg-card"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sm || webp}
                    srcSet={sm ? `${sm} 640w, ${webp} 1100w` : undefined}
                    alt={`Uygulama ${i + 1}`}
                    width={640}
                    height={800}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 42vw, 30vw"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 text-center">
          <SiteLink
            href="/kampanyalar"
            className="text-orange text-sm font-semibold tracking-wide uppercase hover:underline"
          >
            Tüm kampanyaları gör →
          </SiteLink>
        </div>
      </div>
    </section>
  );
}
