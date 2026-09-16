import { SiteLink } from "@/components/ui/SiteLink";
import Image from "next/image";
import { Shield } from "lucide-react";
import { formatPrice, parseJsonArray } from "@/lib/utils";
import { ProductBadges } from "@/components/shop/ProductBadges";
import { ProductCardAddButton } from "@/components/shop/ProductCardAddButton";
import { parseProductSpecs } from "@/lib/catalog-meta";
import { toWebpSrc } from "@/lib/image-optimize";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product & {
    category?: { name: string; slug: string };
    campaignEndsAt?: string | Date | null;
  };
}

function campaignActive(endsAt?: string | Date | null): boolean {
  if (!endsAt) return false;
  return new Date(endsAt) > new Date();
}

function displayPrice(product: ProductCardProps["product"]): {
  current: number;
  list?: number;
} {
  const saleActive =
    Boolean(product.badgeSale) &&
    product.salePrice != null &&
    product.salePrice < product.price &&
    campaignActive(product.campaignEndsAt);
  if (saleActive && product.salePrice != null) {
    return { current: product.salePrice, list: product.price };
  }
  return { current: product.price };
}

/** Server-friendly card shell; add-to-list is a small client island. */
export function ProductCard({ product }: ProductCardProps) {
  const gallery = parseJsonArray<string>(product.images);
  const hoverImage =
    gallery.find((src) => src && src !== product.image) || null;
  const pricing = displayPrice(product);
  const unitPrice = pricing.current;
  const specs = parseProductSpecs(product.specs);

  return (
    <SiteLink
      href={`/hizmet/${product.slug}`}
      prefetch={false}
      className="group block bg-card border border-border hover:border-orange/50 transition-all rounded-xl overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden bg-black">
        {product.image ? (
          <>
            <Image
              src={toWebpSrc(product.image)}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-500 ${
                hoverImage ? "group-hover:opacity-0" : "group-hover:scale-105"
              }`}
              sizes="(max-width:640px) 50vw, 280px"
            />
            {hoverImage ? (
              <Image
                src={toWebpSrc(hoverImage)}
                alt=""
                fill
                className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                sizes="(max-width:640px) 50vw, 280px"
              />
            ) : null}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-lg font-bold text-orange/20 uppercase text-center px-4">
              {product.name}
            </span>
          </div>
        )}
        <ProductBadges
          badgeNew={product.badgeNew}
          badgeBestseller={product.badgeBestseller}
          badgeSale={product.badgeSale}
          inStock={product.inStock}
          campaignEndsAt={product.campaignEndsAt}
        />
        {specs.garanti ? (
          <span className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-black/70 text-orange px-2 py-0.5 rounded">
            <Shield size={10} />
            {specs.garanti}
          </span>
        ) : null}
        <ProductCardAddButton
          product={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            image: product.image,
            unitPrice,
            categoryName: product.category?.name || "",
            inStock: product.inStock,
          }}
        />
      </div>
      <div className="p-4">
        {product.category && (
          <p className="text-xs text-orange uppercase tracking-wider mb-1">
            {product.category.name}
          </p>
        )}
        <h3 className="text-sm font-semibold text-white mb-2 group-hover:text-orange transition-colors">
          {product.name}
        </h3>
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="font-display text-lg font-bold text-orange">
              {formatPrice(unitPrice)}
            </p>
            {pricing.list != null && (
              <p className="text-xs text-muted line-through">
                {formatPrice(pricing.list)}
              </p>
            )}
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted">
            Randevu
          </span>
        </div>
      </div>
    </SiteLink>
  );
}
