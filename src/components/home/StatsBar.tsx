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
    <section className="bg-cream text-ink py-6 sm:py-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 flex-1">
            {list.map((stat, index) => {
              const n = index + 1;
              return (
                <div key={`stat-${n}`} className="min-w-0 text-center sm:text-left">
                  <EditableText
                    contentKey={`stat_${n}_value`}
                    value={stat.value}
                    as="p"
                    className="font-display text-2xl sm:text-3xl font-semibold text-orange mb-0.5"
                    help={`İstatistik ${n} değeri`}
                  />
                  <EditableText
                    contentKey={`stat_${n}_label`}
                    value={stat.label}
                    as="p"
                    className="text-[11px] text-ink/55 tracking-wide uppercase"
                    help={`İstatistik ${n} etiket`}
                  />
                </div>
              );
            })}
          </div>
          <EditableText
            contentKey="stats_script"
            value={scriptText}
            as="p"
            block
            className="font-script text-orange text-2xl sm:text-3xl italic text-center lg:text-right lg:max-w-xs shrink-0"
            help="İstatistik bandı script yazısı"
          />
        </div>
      </div>
    </section>
  );
}
