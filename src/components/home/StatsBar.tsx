"use client";

import { STATS } from "@/lib/constants";
import { EditableText } from "@/components/editor/EditableText";

export interface StatItem {
  value: string;
  label: string;
}

interface StatsBarProps {
  items?: StatItem[];
  scriptText?: string;
}

export function StatsBar({
  items,
  scriptText = "Kendinizi şımartın, ışıldayın!",
}: StatsBarProps) {
  const list = items && items.length > 0 ? items : [...STATS];

  return (
    <section className="relative py-16 lg:py-20 bg-marble overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_80%_50%,rgba(201,169,98,0.1),transparent_55%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          <div className="grid grid-cols-2 gap-8 lg:gap-10">
            {list.map((stat, index) => {
              const n = index + 1;
              return (
                <div key={`stat-${n}`} className="min-w-0">
                  <EditableText
                    contentKey={`stat_${n}_value`}
                    value={stat.value}
                    as="p"
                    className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-orange mb-2"
                    help={`İstatistik ${n} değeri`}
                  />
                  <EditableText
                    contentKey={`stat_${n}_label`}
                    value={stat.label}
                    as="p"
                    className="text-xs sm:text-sm text-muted tracking-wider uppercase"
                    help={`İstatistik ${n} etiketi`}
                  />
                </div>
              );
            })}
          </div>
          <EditableText
            contentKey="stats_script"
            value={scriptText}
            as="p"
            className="font-script text-orange text-2xl sm:text-3xl lg:text-4xl leading-snug text-right lg:pl-8"
            help="İstatistik bölümü dekoratif yazı"
          />
        </div>
      </div>
    </section>
  );
}
