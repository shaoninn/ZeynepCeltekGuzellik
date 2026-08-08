"use client";

import {
  GraduationCap,
  Award,
  Users,
  Headphones,
  Search,
  PenTool,
  Factory,
  Wrench,
} from "lucide-react";
import { FEATURE_BAR } from "@/lib/constants";
import { EditableText } from "@/components/editor/EditableText";
import { EditableSectionShift } from "@/components/editor/EditableSectionShift";
import { EditableIconBox } from "@/components/editor/EditableIconBox";

const iconMap = {
  search: GraduationCap,
  design: Award,
  production: Users,
  install: Wrench,
  support: Headphones,
  pen: PenTool,
  factory: Factory,
  fallback: Search,
} as const;

type FeatureBarItem = {
  title: string;
  desc: string;
  iconUrl?: string;
  iconSize?: number;
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
    iconUrl: items?.[i]?.iconUrl,
    iconSize: items?.[i]?.iconSize || 22,
  }));

  return (
    <EditableSectionShift
      settingKey="section_feature_bar_offset"
      value={sectionOffset}
      label="Özellik çubuğu"
    >
      <section className="relative z-20 -mt-14 sm:-mt-16 lg:-mt-20 px-4 sm:px-6 lg:px-8 mb-4">
        <div className="max-w-6xl mx-auto rounded-2xl sm:rounded-3xl border border-border bg-card/95 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.45)] px-4 sm:px-6 lg:px-8 py-7 lg:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 lg:gap-6">
            {list.map((item, index) => {
              const n = index + 1;
              const Icon =
                iconMap[item.icon as keyof typeof iconMap] || GraduationCap;
              return (
                <div
                  key={`fb-${n}`}
                  className="flex flex-col items-center text-center gap-3 px-2 min-w-0"
                >
                  <div className="text-orange">
                    <EditableIconBox
                      contentKey={`feature_bar_${n}_icon`}
                      sizeKey={`feature_bar_${n}_icon_size`}
                      iconUrl={item.iconUrl}
                      iconSize={item.iconSize}
                      FallbackIcon={Icon}
                      alt={`Özellik ikon ${n}`}
                      help={`Özellik ${n} için özel ikon yükleyin`}
                    />
                  </div>
                  <EditableText
                    contentKey={`feature_bar_${n}_title`}
                    value={item.title}
                    as="h3"
                    className="font-display text-sm font-semibold text-white tracking-wide"
                    help={`Özellik çubuğu ${n} başlık`}
                    textStyle={styles?.[`feature_bar_${n}_title`]}
                  />
                  <EditableText
                    contentKey={`feature_bar_${n}_desc`}
                    value={item.desc}
                    as="p"
                    multiline
                    className="text-xs text-muted leading-relaxed max-w-[16rem]"
                    help={`Özellik çubuğu ${n} açıklama`}
                    textStyle={styles?.[`feature_bar_${n}_desc`]}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </EditableSectionShift>
  );
}
