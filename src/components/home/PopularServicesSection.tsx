import {
  ArrowUpRight,
  Droplets,
  LayoutGrid,
  Search,
  Sparkles,
  Waves,
  Zap,
} from "lucide-react";
import { SiteLink } from "@/components/ui/SiteLink";
import { EditableText } from "@/components/editor/EditableText";
import { POPULAR_SERVICES } from "@/lib/constants";

interface PopularServicesSectionProps {
  title?: string;
  styles?: Record<string, string>;
}

const ICONS = {
  graduation: LayoutGrid,
  search: Search,
  droplet: Droplets,
  sparkles: Sparkles,
  zap: Zap,
  waves: Waves,
} as const;

export function PopularServicesSection({
  title = "Popüler Hizmetlerimiz",
  styles,
}: PopularServicesSectionProps) {
  return (
    <section className="py-12 sm:py-14 lg:py-16 bg-cream text-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <EditableText
            contentKey="services_section_title"
            value={title}
            as="h2"
            block
            className="section-title text-xl sm:text-2xl lg:text-3xl text-ink"
            help="Popüler hizmetler başlığı"
            textStyle={styles?.services_section_title}
          />
          <div className="section-ornament">
            <span className="section-ornament-dot" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 sm:gap-5">
          {POPULAR_SERVICES.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <SiteLink
                key={item.name}
                href={item.href}
                className="group flex flex-col items-center text-center min-w-0"
              >
                <span className="mb-3 flex h-16 w-16 sm:h-[5.25rem] sm:w-[5.25rem] items-center justify-center rounded-full border border-orange/55 text-orange transition-colors group-hover:bg-orange group-hover:text-ink">
                  <Icon size={24} strokeWidth={1.25} />
                </span>
                <h3 className="font-sans text-xs sm:text-[11px] font-bold tracking-[0.14em] uppercase text-orange mb-1.5 px-0.5">
                  {item.name}
                </h3>
                <p className="text-ink/55 text-xs leading-snug line-clamp-2 max-w-[10.5rem] px-0.5">
                  {item.description}
                </p>
                <span className="mt-2 inline-flex items-center gap-0.5 text-orange/70 sm:text-orange/0 group-hover:text-orange text-[10px] uppercase tracking-wider transition-colors">
                  İncele <ArrowUpRight size={11} />
                </span>
              </SiteLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
