"use client";

import { useEffect } from "react";
import Image from "next/image";
import { SiteLink } from "@/components/ui/SiteLink";
import { Check, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearCartToast,
  selectCartCount,
  selectCartToast,
  selectCartTotal,
} from "@/store/cartSlice";
import { formatPrice } from "@/lib/utils";

export function CartToast() {
  const dispatch = useAppDispatch();
  const item = useAppSelector(selectCartToast);
  const count = useAppSelector(selectCartCount);
  const total = useAppSelector(selectCartTotal);

  useEffect(() => {
    if (!item) return;
    const t = setTimeout(() => dispatch(clearCartToast()), 6000);
    return () => clearTimeout(t);
  }, [item, dispatch]);

  if (!item) return null;

  return (
    <div
      className="fixed top-20 right-3 sm:right-6 z-[70] w-[min(100%-1.5rem,22rem)] bg-card border border-border shadow-2xl animate-fade-in-up"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-border">
        <p className="flex items-center gap-2 text-sm font-semibold text-white">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-white">
            <Check size={12} strokeWidth={3} />
          </span>
          Listeye eklendi
        </p>
        <button
          type="button"
          onClick={() => dispatch(clearCartToast())}
          className="p-1 text-muted hover:text-white"
          aria-label="Kapat"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex gap-3 p-3">
        <div className="relative h-14 w-14 shrink-0 bg-black border border-border overflow-hidden">
          {item.image ? (
            <Image src={item.image} alt="" fill className="object-cover" />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-white font-medium line-clamp-2">{item.name}</p>
          <p className="text-xs text-muted mt-0.5">
            {item.quantity} adet · {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between px-3 pb-2 text-xs text-muted">
        <span>{count} ürün listede</span>
        <span className="text-white font-semibold">{formatPrice(total)}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 p-3 pt-0">
        <button
          type="button"
          onClick={() => dispatch(clearCartToast())}
          className="py-2.5 border border-orange text-orange text-xs font-semibold uppercase tracking-wider hover:bg-orange/10"
        >
          Alışverişe devam
        </button>
        <SiteLink
          href="/sepet"
          onClick={() => dispatch(clearCartToast())}
          className="py-2.5 bg-orange text-white text-center text-xs font-semibold uppercase tracking-wider hover:bg-orange-dark"
        >
          Sepete git →
        </SiteLink>
      </div>
    </div>
  );
}
