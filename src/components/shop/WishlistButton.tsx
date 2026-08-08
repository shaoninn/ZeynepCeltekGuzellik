"use client";

import { useCallback, useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { getWishlist, toggleWishlist } from "@/lib/local-lists";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(getWishlist().includes(productId));
  }, [productId]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const next = toggleWishlist(productId);
      setActive(next.includes(productId));
    },
    [productId]
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "w-9 h-9 rounded-lg flex items-center justify-center bg-black/60 backdrop-blur-sm border border-white/10 hover:border-orange/50 transition-colors",
        className
      )}
      aria-label={active ? "Favorilerden çıkar" : "Favorilere ekle"}
    >
      <Heart
        size={18}
        className={active ? "fill-orange text-orange" : "text-white/80"}
      />
    </button>
  );
}
