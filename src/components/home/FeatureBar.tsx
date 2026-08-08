"use client";

import {
  Award,
  Headphones,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { FEATURE_BAR } from "@/lib/constants";
import { EditableText } from "@/components/editor/EditableText";
import { EditableSectionShift } from "@/components/editor/EditableSectionShift";

const iconMap = {
  search: Users,
  design: ShieldCheck,
  production: Sparkles,
  support: Award,
  install: Headphones,
  fallback: Search,
} as const;

type FeatureBarItem = {
  title: string;
  desc: string;
};

export function FeatureBar({
  items,
  sectionOffset = "0",
  styles,
}: {
  items?: FeatureBarItem[];
  sectionOffset?: string;
  styles?: Record<string, string>;
} = {}) {
  const list = FEATURE_BAR.map((d, i) => ({
    title: items?.[i]?.title || d.title,
    desc: items?.[i]?.desc || d.desc,
    icon: d.icon,
  }));

  return (
    <EditableSectionShift
      settingKey="section_feature_bar_offset"
      value={sectionOffset}
      label="Özellik çubuğu"
    >
      <section className="py-8 sm:py-10 border-y border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {list.map((item, index) => {
              const n = index + 1;
              const Icon =
                iconMap[item.icon as keyof typeof iconMap] || Users;
              return (
                <div
                  key={`fb-${n}`}
                  className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left"
                >
                  <span className="shrink-0 text-orange">
                    <Icon size={22} strokeWidth={1.4} />
                  </span>
                  <div className="min-w-0">
                    <EditableText
                      contentKey={`feature_bar_${n}_title`}
                      value={item.title}
                      as="p"
                      className="text-[11px] font-bold tracking-[0.14em] uppercase text-cream mb-1"
                      help={`Özellik ${n} başlık`}
                      textStyle={styles?.[`feature_bar_${n}_title`]}
                    />
                    <EditableText
                      contentKey={`feature_bar_${n}_desc`}
                      value={item.desc}
                      as="p"
                      block
                      className="text-[11px] text-muted leading-snug"
                      help={`Özellik ${n} açıklama`}
                      textStyle={styles?.[`feature_bar_${n}_desc`]}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </EditableSectionShift>
  );
}
