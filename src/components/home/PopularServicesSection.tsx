import { ArrowUpRight, Droplets, Sparkles, Scissors, Flame, Waves, Gem } from "lucide-react";
import { SiteLink } from "@/components/ui/SiteLink";
import { EditableText } from "@/components/editor/EditableText";

export interface PopularServiceItem {
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
}

interface PopularServicesSectionProps {
  title?: string;
  items: PopularServiceItem[];
  styles?: Record<string, string>;
}

const ICONS = [Sparkles, Droplets, Scissors, Waves, Flame, Gem];

export function PopularServicesSection({
  title = "Popüler Hizmetlerimiz",
  items,
  styles,
}: PopularServicesSectionProps) {
  const list = items.slice(0, 6);

  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-cream text-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <EditableText
            contentKey="services_section_title"
            value={title}
            as="h2"
            block
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-ink tracking-wide uppercase"
            help="Popüler hizmetler başlığı"
            textStyle={styles?.services_section_title}
          />
          <div className="mt-4 mx-auto flex items-center justify-center gap-2">
            <span className="h-px w-16 bg-orange/70" />
            <span className="h-1.5 w-1.5 rotate-45 bg-orange" />
            <span className="h-px w-16 bg-orange/70" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
          {list.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <SiteLink
                key={item.slug}
                href={`/hizmetler/${item.slug}`}
                className="group flex flex-col items-center text-center"
              >
                <span className="mb-4 flex h-[5.5rem] w-[5.5rem] sm:h-24 sm:w-24 items-center justify-center rounded-full border border-orange/60 text-orange transition-colors group-hover:bg-orange group-hover:text-ink">
                  <Icon size={28} strokeWidth={1.25} />
                </span>
                <h3 className="font-sans text-[11px] sm:text-xs font-semibold tracking-[0.12em] uppercase text-ink mb-2">
                  {item.name}
                </h3>
                {item.description ? (
                  <p className="text-ink/55 text-[11px] sm:text-xs leading-relaxed line-clamp-2 max-w-[11rem]">
                    {item.description}
                  </p>
                ) : null}
                <span className="mt-2 inline-flex items-center gap-1 text-orange text-[10px] font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  İncele <ArrowUpRight size={12} />
                </span>
              </SiteLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
