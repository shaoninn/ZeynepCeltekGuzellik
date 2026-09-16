import { SiteLink } from "@/components/ui/SiteLink";
import { EditableText } from "@/components/editor/EditableText";
import { PackageAddToCartButton } from "@/components/shop/PackageAddToCartButton";
import { PACKAGES } from "@/lib/constants";
import { toWebpSrc } from "@/lib/image-optimize";
import { formatPrice } from "@/lib/utils";
import type { PackageRecord } from "@/lib/packages";

interface PackagesCampaignSectionProps {
  styles?: Record<string, string>;
  packages?: PackageRecord[];
}

export function PackagesCampaignSection({
  styles,
  packages,
}: PackagesCampaignSectionProps) {
  const list =
    packages && packages.length > 0
      ? packages
      : PACKAGES.map((pkg) => ({
          ...pkg,
          badge: "badge" in pkg ? pkg.badge : undefined,
          items: [...pkg.items],
        }));
  return (
    <section id="paketler" className="scroll-mt-24 py-12 sm:py-14 lg:py-16 bg-marble">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <EditableText
            contentKey="packages_section_title"
            value="Paketlerimiz"
            as="h2"
            block
            className="section-title text-xl sm:text-2xl lg:text-3xl text-cream"
            help="Paketler bölümü başlığı"
            textStyle={styles?.packages_section_title}
          />
          <div className="section-ornament">
            <span className="section-ornament-dot" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-4 items-stretch">
          {list.map((pkg) => {
            const img = toWebpSrc(pkg.image);
            return (
              <article
                key={pkg.id}
                className={`relative flex flex-col overflow-hidden border ${
                  pkg.featured
                    ? "border-orange bg-cream text-ink lg:-translate-y-2 shadow-[0_24px_50px_rgba(0,0,0,0.35)]"
                    : "border-border bg-card text-cream"
                }`}
              >
                {pkg.featured && "badge" in pkg && pkg.badge ? (
                  <span className="absolute top-3 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap bg-orange text-ink text-[9px] font-bold tracking-[0.14em] uppercase px-3 py-1">
                    {pkg.badge}
                  </span>
                ) : null}

                <SiteLink
                  href={`/paketler/${pkg.slug}`}
                  className="relative aspect-[16/11] overflow-hidden bg-surface block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={pkg.name}
                    width={640}
                    height={440}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </SiteLink>

                <div className="flex flex-1 flex-col p-5 gap-3">
                  <h3
                    className={`font-display text-lg font-semibold tracking-wide uppercase ${
                      pkg.featured ? "text-ink" : "text-orange"
                    }`}
                  >
                    {pkg.name}
                  </h3>
                  <ul className="space-y-1.5 flex-1">
                    {pkg.items.map((item) => (
                      <li
                        key={item}
                        className={`text-xs leading-snug flex gap-2 ${
                          pkg.featured ? "text-ink/70" : "text-muted"
                        }`}
                      >
                        <span className="text-orange shrink-0">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p
                    className={`font-display text-3xl font-semibold ${
                      pkg.featured ? "text-ink" : "text-orange"
                    }`}
                  >
                    {formatPrice(pkg.price)}
                  </p>
                  <p
                    className={`text-[10px] tracking-[0.14em] uppercase ${
                      pkg.featured ? "text-ink/50" : "text-white/40"
                    }`}
                  >
                    {pkg.sessions}
                  </p>
                  <SiteLink
                    href={`/paketler/${pkg.slug}`}
                    className={`w-full justify-center !rounded-sm ${
                      pkg.featured ? "btn-primary" : "btn-outline"
                    }`}
                  >
                    Detayları İncele
                  </SiteLink>
                  <PackageAddToCartButton
                    pkg={pkg}
                    variant={pkg.featured ? "featured" : "outline"}
                    label="Listeye ekle"
                  />
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <SiteLink
            href="/paketler"
            className="text-orange text-sm font-semibold tracking-wide uppercase hover:underline"
          >
            Tüm paketleri gör →
          </SiteLink>
        </div>
      </div>
    </section>
  );
}
