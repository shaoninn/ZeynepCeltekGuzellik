"use client";

import { useState } from "react";
import { SiteLink } from "@/components/ui/SiteLink";
import Image from "next/image";
import { Moon, ShoppingCart, Sun, Truck, Shield } from "lucide-react";
import { formatPrice, parseJsonArray } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/cartSlice";
import { ProductBadges } from "@/components/shop/ProductBadges";
import { WishlistButton } from "@/components/shop/WishlistButton";
import { parseProductSpecs } from "@/lib/catalog-meta";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product & {
    category?: { name: string; slug: string };
    nightImage?: string | null;
    campaignEndsAt?: string | Date | null;
  };
}

function displayPrice(product: Product): { current: number; list?: number } {
  const saleActive =
    product.badgeSale &&
    product.salePrice != null &&
    product.salePrice < product.price &&
    (!(product as { campaignEndsAt?: string | Date | null }).campaignEndsAt ||
      new Date((product as { campaignEndsAt?: string | Date }).campaignEndsAt!) >
        new Date());
  if (saleActive && product.salePrice != null) {
    return { current: product.salePrice, list: product.price };
  }
  return { current: product.price };
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [night, setNight] = useState(false);
  const gallery = parseJsonArray<string>(product.images);
  const hoverImage =
    gallery.find((src) => src && src !== product.image) || null;
  const nightSrc = product.nightImage || null;
  const pricing = displayPrice(product);
  const unitPrice = pricing.current;
  const specs = parseProductSpecs(product.specs);
  const showNight = Boolean(nightSrc || product.image);

  const primarySrc =
    night && nightSrc
      ? nightSrc
      : product.image;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: unitPrice,
        image: product.image,
        quantity: 1,
        categoryName: product.category?.name || "",
        widthCm: null,
        heightCm: null,
        color: null,
      })
    );
  };

  return (
    <SiteLink
      href={`/urun/${product.slug}`}
      prefetch={false}
      className="group block bg-card border border-border hover:border-orange/50 transition-all rounded-xl overflow-hidden"
    >
      <div
        className={`relative aspect-square overflow-hidden ${
          night && !nightSrc ? "bg-[#050505]" : "bg-black"
        }`}
      >
        {primarySrc ? (
          <>
            <Image
              src={primarySrc}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-500 ${
                night && !nightSrc ? "brightness-[0.55] contrast-125 saturate-150" : ""
              } ${
                hoverImage && !night
                  ? "group-hover:opacity-0"
                  : "group-hover:scale-105"
              }`}
              sizes="(max-width:640px) 50vw, 280px"
            />
            {hoverImage && !night ? (
              <Image
                src={hoverImage}
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
        />
        {specs.garanti ? (
          <span className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-black/70 text-orange px-2 py-0.5 rounded">
            <Shield size={10} />
            {specs.garanti}
          </span>
        ) : null}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
          {showNight ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setNight((v) => !v);
              }}
              className="w-9 h-9 rounded-lg flex items-center justify-center bg-black/60 border border-white/10 text-white/80 hover:text-orange hover:border-orange/50"
              aria-label={night ? "Gündüz görünümü" : "Gece görünümü"}
            >
              {night ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          ) : null}
          <div onClick={(e) => e.preventDefault()}>
            <WishlistButton productId={product.id} />
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-lg flex items-center justify-center bg-orange text-black hover:bg-orange-dark transition-colors z-10"
          aria-label="Teklif listesine ekle"
          type="button"
        >
          <ShoppingCart size={18} />
        </button>
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
            Teklif
          </span>
        </div>
        {product.shippingLabel && (
          <p className="mt-2 flex items-center gap-1 text-[11px] text-muted">
            <Truck size={12} className="text-orange shrink-0" />
            {product.shippingLabel}
          </p>
        )}
      </div>
    </SiteLink>
  );
}
