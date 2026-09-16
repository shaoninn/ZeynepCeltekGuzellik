"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { track } from "@/lib/analytics";

type ProductCardAddButtonProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    image: string | null;
    unitPrice: number;
    categoryName: string;
    inStock: boolean;
  };
};

export function ProductCardAddButton({ product }: ProductCardAddButtonProps) {
  const { addToCart } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.unitPrice,
      image: product.image,
      quantity: 1,
      categoryName: product.categoryName,
      widthCm: null,
      heightCm: null,
      color: null,
    });
    track("add_to_list", { item: product.slug, value: product.unitPrice });
  };

  return (
    <button
      onClick={handleAdd}
      className="absolute bottom-3 right-3 min-w-11 min-h-11 rounded-lg flex items-center justify-center bg-orange text-black hover:bg-orange-dark transition-colors z-10"
      aria-label="Listeye ekle"
      type="button"
      disabled={!product.inStock}
    >
      <ShoppingCart size={18} />
    </button>
  );
}
