"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { SiteLink } from "@/components/ui/SiteLink";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Plus, MapPin } from "lucide-react";
import type { Project } from "@/types";
import { EditableText } from "@/components/editor/EditableText";

interface WorksSliderProps {
  projects: Project[];
  eyebrow?: string;
  title?: string;
}

export function WorksSlider({ projects, eyebrow, title }: WorksSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const scrollToIndex = useCallback((index: number) => {
    const container = sliderRef.current;
    if (!container) return;
    const card = container.children[index] as HTMLElement | undefined;
    if (!card) return;
    // Only scroll the horizontal track — never the page (scrollIntoView jumps viewport).
    const left =
      container.scrollLeft +
      (card.getBoundingClientRect().left - container.getBoundingClientRect().left);
    container.scrollTo({ left, behavior: "smooth" });
    setCurrentIndex(index);
  }, []);

  const next = useCallback(() => {
    const nextIndex = (currentIndex + 1) % projects.length;
    scrollToIndex(nextIndex);
  }, [currentIndex, projects.length, scrollToIndex]);

  const prev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
    scrollToIndex(prevIndex);
  }, [currentIndex, projects.length, scrollToIndex]);

  useEffect(() => {
    if (isPaused || projects.length === 0) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [isPaused, next, projects.length]);

  if (projects.length === 0) return null;

  return (
    <section className="pt-6 pb-14 lg:pt-8 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <EditableText
              contentKey="works_eyebrow"
              value={eyebrow || "Portföy"}
              as="p"
              block
              className="font-display text-orange text-xs font-semibold tracking-[0.22em] uppercase mb-2"
              help="Çalışmalar bölümü üst etiketi"
            />
            <EditableText
              contentKey="works_title"
              value={title || "Gerçekleştirdiğimiz Bazı Çalışmalar"}
              as="h2"
              block
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white"
              help="Ana sayfadaki çalışmalar kaydırıcısı başlığı"
            />
          </div>
          <SiteLink
            href="/projeler"
            className="hidden sm:flex items-center gap-2 text-sm text-muted hover:text-orange transition-colors group"
          >
            <span className="w-8 h-8 flex items-center justify-center border border-border rounded-full group-hover:border-orange transition-colors">
              <Plus size={16} />
            </span>
            TÜM PROJELER
          </SiteLink>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 flex items-center justify-center bg-black/80 border border-border rounded-full text-white hover:border-orange hover:text-orange transition-colors hidden lg:flex"
            aria-label="Önceki"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 flex items-center justify-center bg-black/80 border border-border rounded-full text-white hover:border-orange hover:text-orange transition-colors hidden lg:flex"
            aria-label="Sonraki"
          >
            <ChevronRight size={20} />
          </button>

          {/* Slider */}
          <div
            ref={sliderRef}
            className="works-slider flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {projects.map((project) => (
              <SiteLink
                key={project.id}
                href={`/projeler/${project.slug}`}
                className="flex-shrink-0 w-72 sm:w-80 group"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-card border border-border group-hover:border-orange/50 transition-colors">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-card to-black">
                      <span className="font-display text-2xl font-bold text-orange/30 uppercase">
                        {project.title}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-1">
                      {project.title}
                    </h3>
                    {project.location && (
                      <p className="flex items-center gap-1 text-xs text-muted">
                        <MapPin size={12} />
                        {project.location}
                      </p>
                    )}
                  </div>
                </div>
              </SiteLink>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-orange" : "bg-border"
                }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
