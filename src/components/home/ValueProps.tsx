"use client";

import { Package, Clock, Users, Shield, Ruler } from "lucide-react";
import { VALUE_PROPS } from "@/lib/constants";
import { EditableText } from "@/components/editor/EditableText";
import { EditableIconBox } from "@/components/editor/EditableIconBox";

const iconKeys = ["quality", "clock", "team", "support", "design"] as const;

const iconMap = {
  quality: Package,
  clock: Clock,
  team: Users,
  support: Shield,
  design: Ruler,
};

export interface ValuePropItem {
  icon: string;
  title: string;
  desc: string;
  iconUrl?: string;
  iconSize?: number;
}

interface ValuePropsProps {
  items?: ValuePropItem[];
  styles?: Record<string, string>;
}

export function ValueProps({ items, styles }: ValuePropsProps) {
  const list: ValuePropItem[] =
    items && items.length > 0
      ? items
      : VALUE_PROPS.map((p) => ({
          icon: p.icon,
          title: p.title,
          desc: p.desc,
        }));

  return (
    <div className="border-y border-border bg-card/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-7">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
          {list.slice(0, 4).map((prop, index) => {
            const n = index + 1;
            const iconKey =
              (prop.icon as (typeof iconKeys)[number]) in iconMap
                ? (prop.icon as keyof typeof iconMap)
                : iconKeys[index % iconKeys.length];
            const Icon = iconMap[iconKey];
            return (
              <div key={`vp-${n}`} className="flex items-center gap-3 group min-w-0">
                <EditableIconBox
                  contentKey={`value_prop_${n}_icon`}
                  sizeKey={`value_prop_${n}_icon_size`}
                  iconUrl={prop.iconUrl}
                  iconSize={prop.iconSize || 22}
                  FallbackIcon={Icon}
                  alt={`İkon ${n}`}
                  help={`Değer önerisi ${n} ikonu`}
                  minSize={14}
                  maxSize={36}
                />
                <div className="min-w-0">
                  <EditableText
                    contentKey={`value_prop_${n}_title`}
                    value={prop.title}
                    as="h3"
                    className="text-[10px] sm:text-sm font-semibold text-white uppercase tracking-wider break-anywhere leading-snug"
                    help={`Özellik ${n} başlığı`}
                    textStyle={styles?.[`value_prop_${n}_title`]}
                  />
                  <EditableText
                    contentKey={`value_prop_${n}_desc`}
                    value={prop.desc}
                    as="p"
                    className="text-[10px] text-muted hidden sm:block mt-0.5 break-anywhere"
                    help={`Özellik ${n} kısa açıklama`}
                    textStyle={styles?.[`value_prop_${n}_desc`]}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
