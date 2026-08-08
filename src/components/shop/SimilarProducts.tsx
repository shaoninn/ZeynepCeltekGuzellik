import { ProductCard } from "@/components/shop/ProductCard";
import type { Product } from "@/types";

type SimilarProduct = Product & {
  category?: { name: string; slug: string };
  badgeNew?: boolean;
  badgeBestseller?: boolean;
  badgeSale?: boolean;
  salePrice?: number | null;
};

interface SimilarProductsProps {
  products: SimilarProduct[];
  title?: string;
}

export function SimilarProducts({
  products,
  title = "Benzer ürünler",
}: SimilarProductsProps) {
  if (!products.length) return null;

  return (
    <section className="mt-12">
      <h2 className="font-display text-xl font-bold text-white mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
