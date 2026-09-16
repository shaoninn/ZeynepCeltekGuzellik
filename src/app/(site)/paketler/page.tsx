import { SiteLink } from "@/components/ui/SiteLink";
import { PackageAddToCartButton } from "@/components/shop/PackageAddToCartButton";
import { getPackages } from "@/lib/packages";
import { formatPrice } from "@/lib/utils";
import { toWebpSrc } from "@/lib/image-optimize";
import { PageIntro } from "@/components/editor/PageIntro";

export const revalidate = 60;

export const metadata = {
  alternates: { canonical: "/paketler" },
  title: "Paketler | Zeynep Çeltek Güzellik",
  description:
    "Adana Zeynep Çeltek Güzellik paketleri: başlangıç, güzellik, VIP ve lazer seans paketleri. Detayları inceleyin, randevu sepetine ekleyin.",
};

export default async function PackagesPage() {
  const packages = await getPackages();
  return (
    <section className="py-12 sm:py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrowKey="packages_page_eyebrow"
          titleKey="packages_page_title"
          introKey="packages_page_intro"
          eyebrow="Paketler"
          title="Güzellik Paketlerimiz"
          intro="Hazır seans paketleriyle planlı bakım. Detay sayfasından içeriği inceleyin veya doğrudan randevu sepetine ekleyip teklif talebi oluşturun."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-4 items-stretch">
          {packages.map((pkg) => {
            const img = toWebpSrc(pkg.image);
            return (
              <article
                key={pkg.slug}
                className={`relative flex flex-col overflow-hidden border ${
                  pkg.featured
                    ? "border-orange bg-cream text-ink lg:-translate-y-2 shadow-[0_24px_50px_rgba(0,0,0,0.35)]"
                    : "border-border bg-card text-cream"
                }`}
              >
                {pkg.featured && pkg.badge ? (
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
                  <h2
                    className={`font-display text-lg font-semibold tracking-wide uppercase ${
                      pkg.featured ? "text-ink" : "text-orange"
                    }`}
                  >
                    <SiteLink href={`/paketler/${pkg.slug}`}>{pkg.name}</SiteLink>
                  </h2>
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
                    Detayı Gör
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
      </div>
    </section>
  );
}
