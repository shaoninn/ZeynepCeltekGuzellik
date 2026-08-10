import { SiteLink } from "@/components/ui/SiteLink";
import { getActiveCategories } from "@/lib/catalog";
import { getContentMap } from "@/lib/site-content";
import { PageIntro } from "@/components/editor/PageIntro";
import { CatalogAdminHint } from "@/components/editor/CatalogAdminHint";
import {
  Palette,
  Sparkles,
  GraduationCap,
  HeartHandshake,
  Scissors,
} from "lucide-react";

export const revalidate = 60;

const iconMap: Record<string, React.ElementType> = {
  design: Palette,
  quality: Sparkles,
  production: Scissors,
  support: HeartHandshake,
  egitim: GraduationCap,
  education: GraduationCap,
};

export const metadata = {
  alternates: { canonical: "/hizmetler" },
  title: "Hizmetler | Zeynep Çeltek Güzellik",
  description:
    "Adana’da güzellik hizmetleri: cilt bakımı, lazer epilasyon, bölgesel incelme ve Alex lazer paketleri.",
};

export default async function ServicesPage() {
  const [categories, map] = await Promise.all([
    getActiveCategories(),
    getContentMap([
      "services_page_eyebrow",
      "services_page_title",
      "services_page_intro",
    ]),
  ]);

  return (
    <section className="py-12 sm:py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrowKey="services_page_eyebrow"
          titleKey="services_page_title"
          introKey="services_page_intro"
          eyebrow={map.services_page_eyebrow || "Hizmetlerimiz"}
          title={map.services_page_title || "Güzellik Hizmetlerimiz"}
          intro={
            map.services_page_intro ||
            "Profesyonel uygulamalarla kendinizi şımartın. Hizmet içerikleri ve fiyatlar için detaylara göz atın."
          }
        />

        <CatalogAdminHint
          title="Hizmetler"
          adminHref="/admin/urunler"
          adminLabel="Admin → Hizmetler"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const Icon = iconMap[category.icon || "egitim"] || GraduationCap;
            return (
              <SiteLink
                key={category.id}
                href={`/hizmetler/${category.slug}`}
                className="group overflow-hidden bg-card border border-border hover:border-orange/50 transition-all"
              >
                {category.image ? (
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={category.image}
                      alt={category.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>
                ) : null}
                <div className="flex items-start gap-4 p-5">
                  <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center text-orange border border-orange/40 rounded-full group-hover:bg-orange group-hover:text-ink transition-colors">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-semibold text-cream group-hover:text-orange transition-colors mb-1">
                      {category.name}
                    </h2>
                    {category.description ? (
                      <p className="text-sm text-muted line-clamp-2 leading-relaxed">
                        {category.description}
                      </p>
                    ) : null}
                    <span className="inline-block mt-2 text-xs text-orange">
                      {category._count.products} hizmet
                    </span>
                  </div>
                </div>
              </SiteLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
