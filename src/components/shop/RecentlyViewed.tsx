"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import { getRecent } from "@/lib/local-lists";
import type { Product } from "@/types";

type RecentProduct = Product & {
  category?: { name: string; slug: string };
  badgeNew?: boolean;
  badgeBestseller?: boolean;
  badgeSale?: boolean;
  salePrice?: number | null;
};

interface RecentlyViewedProps {
  allProducts?: RecentProduct[];
}

export function RecentlyViewed({ allProducts }: RecentlyViewedProps) {
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    setRecentIds(getRecent());
  }, []);

  const products = useMemo(() => {
    if (!allProducts?.length || !recentIds.length) return [];
    const byId = Object.fromEntries(allProducts.map((p) => [p.id, p]));
    return recentIds.map((id) => byId[id]).filter(Boolean) as RecentProduct[];
  }, [allProducts, recentIds]);

  if (!allProducts || products.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="font-display text-xl font-bold text-white mb-4">
        Son baktıklarınız
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.slice(0, 6).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
