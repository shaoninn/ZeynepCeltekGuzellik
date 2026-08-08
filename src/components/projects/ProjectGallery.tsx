"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectGalleryProps {
  title: string;
  images: string[];
}

export function ProjectGallery({ title, images }: ProjectGalleryProps) {
  const slides = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const current = slides[active] || slides[0];

  const go = useCallback(
    (dir: 1 | -1) => {
      if (count < 2) return;
      setActive((i) => (i + dir + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (paused || count < 2) return;
    const id = setInterval(() => go(1), 4000);
    return () => clearInterval(id);
  }, [paused, count, go]);

  if (!current) {
    return (
      <div className="relative aspect-[4/3] bg-card border border-border flex items-center justify-center">
        <span className="font-display text-2xl text-orange/30">{title}</span>
      </div>
    );
  }

  return (
    <div
      className="space-y-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative">
        <div className="relative aspect-[4/3] bg-card border border-border overflow-hidden">
          <Image
            key={current}
            src={current}
            alt={`${title} — görsel ${active + 1}`}
            fill
            className="object-cover z-0"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />

          {count > 1 && (
            <>
              <div className="pointer-events-none absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/70 to-transparent z-10" />
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    className={`h-2 rounded-full transition-all pointer-events-auto ${
                      i === active
                        ? "w-7 bg-orange"
                        : "w-2 bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`Görsel ${i + 1}`}
                  />
                ))}
              </div>
              <span className="absolute top-3 right-3 z-20 px-2.5 py-1 text-[11px] font-semibold tracking-wider bg-black/80 text-beige border border-orange/40">
                {active + 1} / {count}
              </span>
            </>
          )}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-orange text-white shadow-lg hover:bg-orange/90 transition-colors"
              aria-label="Önceki görsel"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-orange text-white shadow-lg hover:bg-orange/90 transition-colors"
              aria-label="Sonraki görsel"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {slides.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-[4/3] overflow-hidden border transition-colors ${
                i === active
                  ? "border-orange ring-1 ring-orange"
                  : "border-border hover:border-orange/50"
              }`}
              aria-label={`Görsel ${i + 1}`}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
