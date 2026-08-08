"use client";

import { useRef } from "react";
import Image from "next/image";
import { SiteLink } from "@/components/ui/SiteLink";
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/cartSlice";
import { EditableText } from "@/components/editor/EditableText";
import type { Product } from "@/types";

type FeaturedProduct = Product & {
  category?: { name: string; slug: string } | null;
};

interface FeaturedProductsProps {
  products: FeaturedProduct[];
  title?: string;
}

export function FeaturedProducts({ products, title }: FeaturedProductsProps) {
  const dispatch = useAppDispatch();
  const trackRef = useRef<HTMLDivElement>(null);

  if (!products.length) return null;

  function scrollByCard(dir: -1 | 1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-product-card]");
    const step = (card?.offsetWidth ?? 280) + 16;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <section className="py-14 lg:py-20 bg-surface/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <EditableText
            contentKey="featured_products_title"
            value={title || "En Çok Tercih Edilen Ürünler"}
            as="h2"
            block
            className="font-display text-2xl sm:text-3xl font-bold text-white"
            help="Öne çıkan ürünler başlığı"
          />
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                className="w-10 h-10 rounded-lg flex items-center justify-center border border-border text-white hover:border-orange hover:text-orange transition-colors"
                aria-label="Önceki ürünler"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                className="w-10 h-10 rounded-lg flex items-center justify-center border border-border text-white hover:border-orange hover:text-orange transition-colors"
                aria-label="Sonraki ürünler"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <SiteLink
              href="/hizmetler"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange hover:text-orange-dark transition-colors"
            >
              Tüm Ürünleri Gör
              <ArrowRight size={16} />
            </SiteLink>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((product) => (
            <article
              key={product.id}
              data-product-card
              className="snap-start shrink-0 w-[72vw] max-w-[280px] sm:w-64 rounded-xl bg-card border border-border overflow-hidden flex flex-col"
            >
              <SiteLink href={`/urun/${product.slug}`} className="relative aspect-[4/3] bg-black block">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="280px"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-orange/20 font-bold uppercase px-4 text-center text-sm">
                      {product.name}
                    </span>
                  </div>
                )}
              </SiteLink>
              <div className="p-4 flex flex-col flex-1 gap-2">
                <SiteLink href={`/urun/${product.slug}`}>
                  <h3 className="font-display text-base font-bold text-white hover:text-orange transition-colors">
                    {product.name}
                  </h3>
                </SiteLink>
                {product.category && (
                  <p className="text-xs text-muted">{product.category.name}</p>
                )}
                <p className="font-display text-lg font-bold text-orange mt-auto">
                  {formatPrice(product.price)}
                  <span className="text-xs font-medium text-muted ml-1">/ mt</span>
                </p>
                <button
                  type="button"
                  onClick={() =>
                    dispatch(
                      addToCart({
                        productId: product.id,
                        slug: product.slug,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity: 1,
                        categoryName: product.category?.name || "",
                        widthCm: null,
                        heightCm: null,
                        color: null,
                      })
                    )
                  }
                  className="mt-1 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-orange text-black text-xs font-bold uppercase tracking-wider py-2.5 hover:bg-orange-dark transition-colors"
                >
                  <ShoppingCart size={14} />
                  Sepete Ekle
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
