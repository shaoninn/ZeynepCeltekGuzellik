"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { track } from "@/lib/analytics";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product & { category?: { name: string } };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      categoryName: product.category?.name || "",
      widthCm: null,
      heightCm: null,
      color: null,
    });
    track("add_to_list", {
      item: product.slug,
      value: product.price * quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 4000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted">Adet:</span>
        <div className="flex items-center border border-border">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="min-w-11 min-h-11 flex items-center justify-center text-muted hover:text-orange transition-colors"
            aria-label="Azalt"
          >
            <Minus size={16} />
          </button>
          <span className="w-12 text-center font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="min-w-11 min-h-11 flex items-center justify-center text-muted hover:text-orange transition-colors"
            aria-label="Artır"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={!product.inStock}
        className="w-full flex items-center justify-center gap-2 py-4 bg-orange text-white font-semibold uppercase tracking-wider hover:bg-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {added ? (
          <>
            <Check size={20} />
            Listeye eklendi
          </>
        ) : (
          <>
            <ShoppingCart size={20} />
            Listeye ekle — {formatPrice(product.price * quantity)}
          </>
        )}
      </button>

      {added && (
        <p className="text-sm text-center text-muted">
          Sağ üstte özet görünecek — oradan sepete gidebilirsiniz.
        </p>
      )}

      {!product.inStock && (
        <p className="text-sm text-red-400 text-center">
          Şu an randevuya kapalı — iletişime geçin
        </p>
      )}
    </div>
  );
}
