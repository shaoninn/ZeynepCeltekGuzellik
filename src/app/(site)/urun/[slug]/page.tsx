import { notFound } from "next/navigation";
import { cache } from "react";
import { SiteLink } from "@/components/ui/SiteLink";
import { prisma } from "@/lib/db";
import { getSimilarProducts } from "@/lib/catalog";
import { memoryCache } from "@/lib/memory-cache";
import { formatPrice, parseJsonArray, parseJsonObject } from "@/lib/utils";
import { ProductConfigurator } from "@/components/shop/ProductConfigurator";
import { SimilarProducts } from "@/components/shop/SimilarProducts";
import { TrackProductView } from "@/components/shop/TrackProductView";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { productJsonLd } from "@/lib/seo";
import type { ProductSpecs } from "@/types";
import { MapPin, Check, Truck } from "lucide-react";
import { CatalogAdminHint } from "@/components/editor/CatalogAdminHint";
import { ProductBadges } from "@/components/shop/ProductBadges";

export const revalidate = 60;


interface Props {
  params: Promise<{ slug: string }>;
}

const getProductBySlug = cache(async (slug: string) => {
  return memoryCache(
    `catalog:product:${slug}`,
    () =>
      prisma.product.findUnique({
        where: { slug },
        include: { category: true },
      }),
    { ttlMs: 60_000, skipEmpty: true }
  );
});

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return {
      alternates: { canonical: `/urun/${slug}` },
      title: "Ürün Bulunamadı",
    };
  }
  return {
    alternates: { canonical: `/urun/${slug}` },
    title: product.name,
    description: product.shortDesc || product.description || undefined,
    openGraph: {
      title: product.name,
      description: product.shortDesc || undefined,
      images: product.image ? [product.image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.isActive) notFound();

  const specs = parseJsonObject<ProductSpecs>(product.specs, {});
  const gallery = parseJsonArray<string>(product.images);
  const images =
    gallery.length > 0
      ? gallery
      : product.image
        ? [product.image]
        : [];

  const unitPrice =
    product.badgeSale && product.salePrice != null
      ? product.salePrice
      : product.price;

  const similar = await getSimilarProducts(product.categoryId, product.id, 4);

  return (
    <section className="py-16 lg:py-24">
      <TrackProductView productId={product.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd(product)),
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="text-xs text-muted mb-6">
          <SiteLink href="/" className="hover:text-orange">
            Anasayfa
          </SiteLink>
          <span className="mx-2">/</span>
          <SiteLink href="/hizmetler" className="hover:text-orange">
            Hizmetler
          </SiteLink>
          {product.category && (
            <>
              <span className="mx-2">/</span>
              <SiteLink
                href={`/hizmetler/${product.category.slug}`}
                className="hover:text-orange"
              >
                {product.category.name}
              </SiteLink>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-white">{product.name}</span>
        </nav>

        <CatalogAdminHint
          title="Bu ürün sayfasının tamamı"
          adminHref="/admin/urunler"
          adminLabel="Admin → Ürünler"
          detail="ad, fiyat, özellikler, görseller, açıklama ürün eklerken girilir; canlı editörden düzenlenmez."
        />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="relative">
            <ProjectGallery title={product.name} images={images} />
            <div className="absolute top-3 left-3 z-10 pointer-events-none">
              <ProductBadges
                badgeNew={product.badgeNew}
                badgeBestseller={product.badgeBestseller}
                badgeSale={product.badgeSale}
                inStock={product.inStock}
              />
            </div>
          </div>

          <div>
            {product.category && (
              <SiteLink
                href={`/hizmetler/${product.category.slug}`}
                className="text-xs text-orange uppercase tracking-wider hover:underline"
              >
                {product.category.name}
              </SiteLink>
            )}
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mt-2 mb-4">
              {product.name}
            </h1>
            <div className="mb-2 flex items-baseline gap-3">
              <p className="font-display text-3xl font-bold text-orange">
                {formatPrice(unitPrice)}
              </p>
              {product.badgeSale &&
                product.salePrice != null &&
                product.salePrice < product.price && (
                  <p className="text-muted line-through text-lg">
                    {formatPrice(product.price)}
                  </p>
                )}
            </div>
            <p className="text-xs text-muted mb-6">
              Başlangıç / örnek fiyat — kesin teklif keşif sonrası verilir.
            </p>

            {product.shippingLabel && (
              <p className="flex items-center gap-2 text-sm text-muted mb-4">
                <Truck size={16} className="text-orange" />
                {product.shippingLabel}
              </p>
            )}

            {product.shortDesc && (
              <p className="text-muted mb-6">{product.shortDesc}</p>
            )}

            {Object.keys(specs).length > 0 && (
              <div className="mb-6 p-4 bg-card border border-border rounded-xl">
                <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
                  Özellikler
                </h3>
                <dl className="space-y-2">
                  {Object.entries(specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4 text-sm"
                    >
                      <dt className="text-muted capitalize shrink-0">{key}</dt>
                      <dd className="text-white sm:text-right break-words">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="mb-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted">
                <Check size={16} className="text-orange" />
                Ücretsiz ön görüşme
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <Check size={16} className="text-orange" />
                Profesyonel uygulama ve bakım desteği
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <MapPin size={16} className="text-orange" />
                Adana
              </div>
            </div>

            <ProductConfigurator product={product} />

            {product.description && (
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
                  Ürün Açıklaması
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>

        <SimilarProducts products={similar} />
      </div>
    </section>
  );
}
