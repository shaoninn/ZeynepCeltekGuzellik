"use client";

import { useRef } from "react";
import { toWebpSrc } from "@/lib/image-optimize";
import Image from "next/image";
import { SiteLink } from "@/components/ui/SiteLink";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { EditableText } from "@/components/editor/EditableText";
import type { CategoryListItem } from "@/lib/catalog";

interface CategoriesGridProps {
  categories: CategoryListItem[];
  title?: string;
  titleStyle?: string;
}

export function CategoriesGrid({
  categories,
  title,
  titleStyle,
}: CategoriesGridProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const items = categories.slice(0, 12);

  function scrollByCard(dir: -1 | 1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-cat-card]");
    const step = (card?.offsetWidth ?? 220) + 20;
    el.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  }

  return (
    <section className="bg-cream-section py-16 lg:py-22">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <EditableText
            contentKey="services_section_title"
            value={title || "Sizi güzelleştiren hizmetler"}
            as="h2"
            block
            className="font-display text-2xl sm:text-3xl lg:text-[2.15rem] font-semibold text-ink max-w-xl tracking-tight"
            help="Hizmetler bölüm başlığı"
            textStyle={titleStyle}
          />
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-ink/15 text-ink hover:border-orange hover:text-orange transition-colors"
                aria-label="Önceki hizmetler"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-ink/15 text-ink hover:border-orange hover:text-orange transition-colors"
                aria-label="Sonraki hizmetler"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <SiteLink
              href="/hizmetler"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-orange transition-colors uppercase tracking-wider"
            >
              Tüm Hizmetleri Gör
              <ArrowRight size={16} />
            </SiteLink>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((cat, index) => {
            const num = String(index + 1).padStart(2, "0");
            return (
              <SiteLink
                key={cat.id}
                href={`/hizmetler/${cat.slug}`}
                data-cat-card
                className="group snap-start shrink-0 w-[58vw] max-w-[240px] sm:w-52"
              >
                <div className="relative mb-4">
                  <span className="absolute -top-1 left-3 z-10 font-display text-4xl sm:text-5xl font-semibold text-ink/10 select-none">
                    {num}
                  </span>
                  <div className="arch-frame relative aspect-[3/4] bg-cream-dark border border-ink/8 shadow-[0_12px_40px_rgba(26,22,18,0.08)]">
                    {cat.image ? (
                      <Image
                        src={toWebpSrc(cat.image)}
                        alt={cat.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="220px"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-b from-[#2a2420] to-[#1a1612]">
                        <span className="font-display text-sm font-semibold text-orange/40 uppercase text-center tracking-wide">
                          {cat.name}
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-orange text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <span className="font-display text-xs font-bold">
                        {num}
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="font-display text-xs sm:text-sm font-semibold text-ink uppercase tracking-[0.12em] text-center group-hover:text-orange transition-colors line-clamp-2 px-1">
                  {cat.name}
                </h3>
              </SiteLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
