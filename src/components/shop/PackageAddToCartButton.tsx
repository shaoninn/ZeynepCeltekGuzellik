"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { track } from "@/lib/analytics";
import type { PackageRecord } from "@/lib/packages";

interface PackageAddToCartButtonProps {
  pkg: PackageRecord;
  className?: string;
  variant?: "primary" | "outline" | "featured";
  label?: string;
}

export function PackageAddToCartButton({
  pkg,
  className = "",
  variant = "primary",
  label = "Listeye ekle",
}: PackageAddToCartButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart({
      productId: `package:${pkg.slug}`,
      slug: pkg.slug,
      name: pkg.name,
      price: pkg.price,
      image: pkg.image,
      quantity: 1,
      categoryName: "Paket",
      widthCm: null,
      heightCm: null,
      color: null,
      optionsNote: pkg.sessions,
    });
    track("add_to_list", { item: pkg.slug, value: pkg.price });
    setAdded(true);
    setTimeout(() => setAdded(false), 4000);
  };

  const base =
    variant === "featured"
      ? "btn-primary"
      : variant === "outline"
        ? "btn-outline"
        : "btn-primary";

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={`w-full justify-center !rounded-sm inline-flex items-center gap-2 ${base} ${className}`}
    >
      {added ? (
        <>
          <Check size={16} />
          Listeye eklendi
        </>
      ) : (
        <>
          <ShoppingCart size={16} className="shrink-0" />
          <span className="inline-flex flex-col sm:flex-row sm:gap-1 leading-tight">
            <span>{label}</span>
            <span className="text-[11px] sm:text-inherit opacity-90">
              {formatPrice(pkg.price)}
            </span>
          </span>
        </>
      )}
    </button>
  );
}
