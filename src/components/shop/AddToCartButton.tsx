"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus, Check } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/cartSlice";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product & { category?: { name: string } };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [widthCm, setWidthCm] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [color, setColor] = useState("");
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    dispatch(
      addToCart({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        categoryName: product.category?.name || "",
        widthCm: widthCm ? Number(widthCm) : null,
        heightCm: heightCm ? Number(heightCm) : null,
        color: color.trim() || null,
      })
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 4000);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-muted mb-1" htmlFor="w-cm">
            En (cm)
          </label>
          <input
            id="w-cm"
            type="number"
            min={1}
            step="0.1"
            className="admin-input"
            placeholder="örn. 120"
            value={widthCm}
            onChange={(e) => setWidthCm(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1" htmlFor="h-cm">
            Boy (cm)
          </label>
          <input
            id="h-cm"
            type="number"
            min={1}
            step="0.1"
            className="admin-input"
            placeholder="örn. 40"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs text-muted mb-1" htmlFor="color">
          Renk / RAL
        </label>
        <input
          id="color"
          className="admin-input"
          placeholder="örn. Siyah mat, RAL 9005"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted">Adet:</span>
        <div className="flex items-center border border-border">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center text-muted hover:text-orange transition-colors"
            aria-label="Azalt"
          >
            <Minus size={16} />
          </button>
          <span className="w-12 text-center font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 flex items-center justify-center text-muted hover:text-orange transition-colors"
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
            Teklif Listesine Eklendi
          </>
        ) : (
          <>
            <ShoppingCart size={20} />
            Teklif Listesine Ekle — {formatPrice(product.price * quantity)}
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
          Şu an teklife kapalı — iletişime geçin
        </p>
      )}
    </div>
  );
}
