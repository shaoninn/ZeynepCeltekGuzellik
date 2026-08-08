"use client";

import Image from "next/image";
import { useState } from "react";

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  alt: string;
}

export function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  alt,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);

  return (
    <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-border select-none">
      <Image
        src={afterUrl}
        alt={`${alt} — sonrası`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 800px"
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={beforeUrl}
          alt={`${alt} — öncesi`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-orange shadow-[0_0_8px_#f5c518]"
        style={{ left: `${position}%` }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-orange border-2 border-black flex items-center justify-center text-black text-xs font-bold pointer-events-none"
        style={{ left: `${position}%` }}
      >
        ↔
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
        aria-label="Öncesi / sonrası karşılaştırma"
      />
      <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider bg-black/70 px-2 py-1 rounded text-white">
        Öncesi
      </span>
      <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider bg-black/70 px-2 py-1 rounded text-white">
        Sonrası
      </span>
    </div>
  );
}
