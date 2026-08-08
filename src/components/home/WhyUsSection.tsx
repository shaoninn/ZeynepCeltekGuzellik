"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SiteLink } from "@/components/ui/SiteLink";
import { Button } from "@/components/ui/Button";
import { EditableText } from "@/components/editor/EditableText";
import type { ProjectListItem } from "@/lib/catalog";
import type { StatItem } from "@/components/home/StatsBar";

interface WhyUsSectionProps {
  projects: ProjectListItem[];
  stats?: StatItem[];
}

export function WhyUsSection({ projects, stats }: WhyUsSectionProps) {
  const recent = projects.slice(0, 8);
  const statItems = stats?.length
    ? stats
    : [
        { value: "10+", label: "Yıllık Tecrübe" },
        { value: "2500+", label: "Tamamlanan Proje" },
        { value: "1200+", label: "Mutlu Müşteri" },
        { value: "50+", label: "Ürün Çeşidi" },
      ];

  return (
    <section className="py-10 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {statItems.slice(0, 4).map((stat, index) => {
            const n = index + 1;
            return (
              <div
                key={`stat-${n}`}
                className="rounded-xl border border-border bg-card px-2.5 py-3.5 sm:px-4 sm:py-5 min-w-0"
              >
                <EditableText
                  contentKey={`stat_${n}_value`}
                  value={stat.value}
                  as="p"
                  className="font-display text-lg sm:text-2xl lg:text-3xl font-bold text-orange mb-0.5 break-anywhere"
                  help={`İstatistik ${n} değer`}
                />
                <EditableText
                  contentKey={`stat_${n}_label`}
                  value={stat.label}
                  as="p"
                  className="text-[9px] sm:text-xs text-muted uppercase tracking-wider leading-snug break-anywhere"
                  help={`İstatistik ${n} etiket`}
                />
              </div>
            );
          })}
        </div>

        <div>
          <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
            <EditableText
              contentKey="works_title"
              value="Son Projelerimiz"
              as="h2"
              block
              className="font-display text-xl sm:text-2xl font-bold text-white"
              help="Son projeler başlığı"
            />
            <Button
              href="/projeler"
              variant="outline"
              size="sm"
              className="justify-center shrink-0"
            >
              Tüm Projeleri Gör
              <ArrowRight size={14} />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
            {recent.map((project) => (
              <SiteLink
                key={project.id}
                href={`/projeler/${project.slug}`}
                className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border group bg-card"
              >
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-2">
                    <span className="text-[10px] text-orange/30 font-bold uppercase text-center">
                      {project.title}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-0 left-0 right-0 p-2.5 text-xs sm:text-sm font-medium text-white truncate">
                  {project.title}
                </span>
              </SiteLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
