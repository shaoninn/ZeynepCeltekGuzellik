"use client";

import { useMemo, useState } from "react";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { track } from "@/lib/analytics";
import type { Product } from "@/types";

type ConfigProduct = Product & {
  category?: { name: string };
  salePrice?: number | null;
  badgeNew?: boolean;
  badgeBestseller?: boolean;
  badgeSale?: boolean;
};

interface ProductConfiguratorProps {
  product: ConfigProduct;
}

export function ProductConfigurator({ product }: ProductConfiguratorProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const unitPrice =
    product.badgeSale && product.salePrice != null
      ? product.salePrice
      : product.price;

  const lineTotal = useMemo(
    () => Math.round(unitPrice * quantity * 100) / 100,
    [unitPrice, quantity]
  );

  const handleAdd = () => {
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: unitPrice,
      image: product.image,
      quantity,
      categoryName: product.category?.name || "",
      widthCm: null,
      heightCm: null,
      color: null,
    });
    track("add_to_list", { item: product.slug, value: lineTotal });
    setAdded(true);
    setTimeout(() => setAdded(false), 4000);
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="font-display text-2xl font-bold text-orange">
          {formatPrice(unitPrice)}
        </p>
        {product.badgeSale && product.salePrice != null && (
          <p className="text-sm text-muted line-through">
            {formatPrice(product.price)}
          </p>
        )}
        <p className="text-xs text-muted mt-1">Seans / birim fiyat</p>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted">Seans sayısı:</span>
        <div className="flex items-center border border-border rounded-lg">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center text-muted hover:text-orange"
            aria-label="Azalt"
          >
            <Minus size={16} />
          </button>
          <span className="w-12 text-center font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 flex items-center justify-center text-muted hover:text-orange"
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
        className="w-full flex items-center justify-center gap-2 py-4 bg-orange text-black font-semibold uppercase tracking-wider hover:bg-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {added ? (
          <>
            <Check size={20} />
            Listeye eklendi
          </>
        ) : (
          <>
            <ShoppingCart size={20} />
            Listeye ekle — {formatPrice(lineTotal)}
          </>
        )}
      </button>

      {!product.inStock && (
        <p className="text-sm text-red-400 text-center">
          Şu an randevuya kapalı — iletişime geçin
        </p>
      )}
    </div>
  );
}
