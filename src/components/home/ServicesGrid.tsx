"use client";

import { useRef } from "react";
import { SiteLink } from "@/components/ui/SiteLink";
import {
  Box,
  Zap,
  Columns,
  Lamp,
  Scissors,
  Car,
  Flag,
  Building,
  Palette,
  Sparkles,
  HeartHandshake,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { SERVICE_GRID } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { EditableText } from "@/components/editor/EditableText";

const iconMap: Record<string, React.ElementType> = {
  design: Palette,
  quality: Sparkles,
  production: Scissors,
  support: HeartHandshake,
  egitim: GraduationCap,
  education: GraduationCap,
  // Legacy keys
  tabela: GraduationCap,
  "kutu-harf": Box,
  neon: Zap,
  totem: Columns,
  fener: Lamp,
  cnc: Scissors,
  arac: Car,
  branda: Flag,
  mekan: Building,
};

interface ServicesGridProps {
  intro?: string;
  title?: string;
}

export function ServicesGrid({ intro, title }: ServicesGridProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(dir: -1 | 1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".service-card");
    const step = (card?.offsetWidth ?? 160) + 12;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <section className="py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div className="max-w-xl">
            <p className="font-display text-orange text-xs font-semibold tracking-[0.22em] uppercase mb-2">
              Hizmetler
            </p>
            <EditableText
              contentKey="services_section_title"
              value={title || "Güzellik Hizmetlerimiz"}
              as="h2"
              block
              className="font-display text-2xl sm:text-3xl font-bold text-white mb-3"
              help="Hizmetler bölüm başlığı (kart isimleri Admin → Kategoriler’den gelir)"
            />
            <EditableText
              contentKey="services_intro"
              value={
                intro ||
                "Profesyonel güzellik hizmetleriyle kendinizi şımartın; randevular Adana’da yüz yüze sunulur."
              }
              as="p"
              block
              multiline
              className="font-sans text-muted text-sm leading-relaxed"
              help="Hizmetler bölümü kısa açıklama"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                className="w-10 h-10 flex items-center justify-center border border-border text-white hover:border-orange hover:text-orange transition-colors"
                aria-label="Önceki hizmetler"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                className="w-10 h-10 flex items-center justify-center border border-border text-white hover:border-orange hover:text-orange transition-colors"
                aria-label="Sonraki hizmetler"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <Button href="/hizmetler" variant="outline" size="sm">
              Tüm Hizmetler
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {SERVICE_GRID.map((service) => {
            const Icon = iconMap[service.icon] || GraduationCap;
            return (
              <SiteLink
                key={service.slug}
                href={`/hizmetler/${service.slug}`}
                className="service-card group flex-shrink-0 w-[42vw] max-w-[160px] sm:w-40 snap-start flex flex-col items-center justify-center p-4 bg-card border border-border hover:border-orange/50 hover:bg-orange/5 transition-all aspect-square"
              >
                <Icon
                  size={28}
                  className="text-orange mb-3 group-hover:scale-110 transition-transform"
                  strokeWidth={1.5}
                />
                <span className="font-display text-xs font-semibold text-white text-center uppercase tracking-wider">
                  {service.name}
                </span>
              </SiteLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
