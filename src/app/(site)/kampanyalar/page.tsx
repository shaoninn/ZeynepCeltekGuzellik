import { SiteLink } from "@/components/ui/SiteLink";
import { formatPrice } from "@/lib/utils";
import { toWebpSrc, toWebpSrcMobile } from "@/lib/image-optimize";
import { getFeaturedProducts } from "@/lib/catalog";
import { getActiveCampaigns } from "@/lib/campaigns";
import { getPackages } from "@/lib/packages";
import { PageIntro } from "@/components/editor/PageIntro";

export const revalidate = 60;

export const metadata = {
  alternates: { canonical: "/kampanyalar" },
  title: "Galeriler | Zeynep Çeltek Güzellik",
  description:
    "Adana Zeynep Çeltek Güzellik salon galerisi: uygulama görselleri, öne çıkan hizmetler ve paket önerileri.",
};

const GALLERY = [
  "/images/gallery/gallery-1.jpg",
  "/images/gallery/gallery-2.jpg",
  "/images/gallery/gallery-3.jpg",
  "/images/gallery/gallery-4.jpg",
  "/images/gallery/gallery-5.jpg",
  "/images/gallery/gallery-6.jpg",
];

export default async function CampaignsPage() {
  const [featured, campaigns, packages] = await Promise.all([
    getFeaturedProducts().catch(() => []),
    getActiveCampaigns(),
    getPackages(),
  ]);
  const showcase = featured.slice(0, 6);

  return (
    <section className="py-12 sm:py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrowKey="campaigns_page_eyebrow"
          titleKey="campaigns_page_title"
          introKey="campaigns_page_intro"
          eyebrow="Galeriler"
          title="Salonumuzdan Kareler"
          intro="Uygulama alanlarımızdan ve bakım süreçlerimizden bir seçki. Öne çıkan hizmet ve paket önerilerine de buradan ulaşabilirsiniz."
        />

        {campaigns.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {campaigns.map((offer) => (
              <SiteLink
                key={offer.id}
                href={offer.href || "/paketler"}
                className="border border-orange/40 bg-card p-5 hover:border-orange transition-colors"
              >
                <p className="text-[10px] uppercase tracking-widest text-orange mb-2">
                  Öne çıkan
                  {offer.endsAt
                    ? ` · ${offer.endsAt.toLocaleDateString("tr-TR")}`
                    : ""}
                </p>
                <h2 className="font-display text-xl text-cream mb-2">
                  {offer.title}
                </h2>
                {offer.description ? (
                  <p className="text-sm text-muted">{offer.description}</p>
                ) : null}
              </SiteLink>
            ))}
          </div>
        ) : null}

        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 mb-14">
          {GALLERY.map((src, i) => {
            const webp = toWebpSrc(src);
            const sm = toWebpSrcMobile(src);
            return (
              <div
                key={src}
                className="relative aspect-[3/4] overflow-hidden border border-border bg-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sm || webp}
                  srcSet={sm ? `${sm} 640w, ${webp} 1100w` : undefined}
                  alt={`Galeri ${i + 1}`}
                  width={480}
                  height={640}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 280px"
                />
              </div>
            );
          })}
        </div>

        {showcase.length > 0 ? (
          <div className="mb-14">
            <h2 className="font-display text-2xl font-semibold text-cream mb-6">
              Öne çıkan hizmetler
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {showcase.map((product) => {
                const img = product.image
                  ? toWebpSrc(product.image)
                  : "/images/gallery/gallery-1.jpg";
                return (
                  <SiteLink
                    key={product.id}
                    href={`/hizmet/${product.slug}`}
                    className="group border border-border bg-card overflow-hidden hover:border-orange/40 transition-colors"
                  >
                    <div className="relative aspect-[16/10] bg-surface">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={product.name}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-base font-semibold text-cream group-hover:text-orange transition-colors">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-orange font-semibold">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </SiteLink>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mb-10">
          <h2 className="font-display text-2xl font-semibold text-cream mb-6">
            Paket önerileri
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {packages.map((pkg) => (
              <SiteLink
                key={pkg.slug}
                href={`/paketler/${pkg.slug}`}
                className="border border-border bg-card p-5 hover:border-orange/40 transition-colors"
              >
                <h3 className="font-display text-lg font-semibold text-orange mb-2">
                  {pkg.name}
                </h3>
                <p className="text-xs text-muted mb-3 line-clamp-2">
                  {pkg.shortDesc}
                </p>
                <p className="font-display text-2xl font-semibold text-cream">
                  {formatPrice(pkg.price)}
                </p>
              </SiteLink>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <SiteLink href="/hizmetler" className="btn-primary !rounded-sm">
            Tüm Hizmetler
          </SiteLink>
          <SiteLink href="/paketler" className="btn-outline !rounded-sm">
            Tüm Paketler
          </SiteLink>
          <SiteLink href="/iletisim" className="btn-outline !rounded-sm">
            Randevu Al
          </SiteLink>
        </div>
      </div>
    </section>
  );
}
