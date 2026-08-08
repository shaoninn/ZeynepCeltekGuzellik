"use client";

import { useMemo, useState } from "react";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/cartSlice";
import { formatPrice } from "@/lib/utils";
import {
  estimateCustomPrice,
  type PriceFormulaRates,
  DEFAULT_RATES,
  SIZE_PRESETS,
} from "@/lib/price-formula";
import { WishlistButton } from "@/components/shop/WishlistButton";
import type { Product } from "@/types";

const COLOR_SWATCHES = [
  { label: "Sarı", value: "#f5c518" },
  { label: "Beyaz", value: "#ffffff" },
  { label: "Kırmızı", value: "#ef4444" },
  { label: "Mavi", value: "#3b82f6" },
  { label: "Yeşil", value: "#22c55e" },
  { label: "Pembe", value: "#ec4899" },
];

type ConfigProduct = Product & {
  category?: { name: string };
  salePrice?: number | null;
  badgeNew?: boolean;
  badgeBestseller?: boolean;
  badgeSale?: boolean;
};

interface ProductConfiguratorProps {
  product: ConfigProduct;
  rates?: PriceFormulaRates;
}

export function ProductConfigurator({
  product,
  rates = DEFAULT_RATES,
}: ProductConfiguratorProps) {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [widthCm, setWidthCm] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [color, setColor] = useState(COLOR_SWATCHES[0]!.value);
  const [customColor, setCustomColor] = useState("");
  const [added, setAdded] = useState(false);

  const basePrice =
    product.badgeSale && product.salePrice != null
      ? product.salePrice
      : product.price;

  const resolvedColor = customColor.trim() || color;

  const estimatedPrice = useMemo(
    () =>
      estimateCustomPrice({
        basePrice,
        widthCm: widthCm ? Number(widthCm) : null,
        heightCm: heightCm ? Number(heightCm) : null,
        customText: null,
        rates,
      }),
    [basePrice, widthCm, heightCm, rates]
  );

  const handleAdd = () => {
    const optionsNote = JSON.stringify({
      estimatedPrice,
    });

    dispatch(
      addToCart({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: estimatedPrice,
        image: product.image,
        quantity,
        categoryName: product.category?.name || "",
        widthCm: widthCm ? Number(widthCm) : null,
        heightCm: heightCm ? Number(heightCm) : null,
        color: resolvedColor,
        optionsNote,
      })
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 4000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-2xl font-bold text-orange">
            {formatPrice(estimatedPrice)}
          </p>
          {product.badgeSale && product.salePrice != null && (
            <p className="text-sm text-muted line-through">
              {formatPrice(product.price)}
            </p>
          )}
          <p className="text-xs text-muted mt-1">Tahmini birim fiyat</p>
        </div>
        <WishlistButton productId={product.id} />
      </div>

      <div>
        <span className="block text-xs text-muted mb-2">Hazır boyut</span>
        <div className="flex flex-wrap gap-2 mb-3">
          {SIZE_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setWidthCm(String(p.widthCm));
                setHeightCm(String(p.heightCm));
              }}
              className="px-3 py-1.5 text-xs rounded-lg border border-border text-muted hover:border-orange hover:text-orange"
            >
              {p.label} ({p.widthCm}×{p.heightCm})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-muted mb-1" htmlFor="cfg-w">
            En (cm)
          </label>
          <input
            id="cfg-w"
            type="number"
            min={1}
            step="0.1"
            className="admin-input"
            placeholder="120"
            value={widthCm}
            onChange={(e) => setWidthCm(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1" htmlFor="cfg-h">
            Boy (cm)
          </label>
          <input
            id="cfg-h"
            type="number"
            min={1}
            step="0.1"
            className="admin-input"
            placeholder="40"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
          />
        </div>
      </div>

      <div>
        <span className="block text-xs text-muted mb-2">Renk</span>
        <div className="flex flex-wrap gap-2 mb-2">
          {COLOR_SWATCHES.map((sw) => (
            <button
              key={sw.value}
              type="button"
              title={sw.label}
              onClick={() => {
                setColor(sw.value);
                setCustomColor("");
              }}
              className={`w-8 h-8 rounded-full border-2 transition-transform ${
                color === sw.value && !customColor
                  ? "border-orange scale-110"
                  : "border-border"
              }`}
              style={{ backgroundColor: sw.value }}
            />
          ))}
        </div>
        <input
          className="admin-input text-sm"
          placeholder="Özel renk / RAL kodu"
          value={customColor}
          onChange={(e) => setCustomColor(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted">Adet:</span>
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
            Teklif Listesine Eklendi
          </>
        ) : (
          <>
            <ShoppingCart size={20} />
            Teklif Listesine Ekle — {formatPrice(estimatedPrice * quantity)}
          </>
        )}
      </button>

      {!product.inStock && (
        <p className="text-sm text-red-400 text-center">
          Şu an teklife kapalı — iletişime geçin
        </p>
      )}
    </div>
  );
}
