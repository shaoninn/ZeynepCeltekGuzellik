"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { SiteLink } from "@/components/ui/SiteLink";
import { X, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectCartItems,
  selectCartOpen,
  selectCartTotal,
  setCartOpen,
  removeFromCart,
} from "@/store/cartSlice";
import { formatPrice } from "@/lib/utils";

export function MiniCart() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const open = useAppSelector(selectCartOpen);
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);

  if (!open) return null;

  function goToCart() {
    dispatch(setCartOpen(false));
    router.push("/sepet");
  }

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Kapat"
        onClick={() => dispatch(setCartOpen(false))}
      />
      <aside className="absolute right-0 top-0 h-full w-full sm:max-w-md bg-card border-l border-border shadow-2xl flex flex-col safe-pb">
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <h2 className="font-display text-lg font-bold text-white">
            Teklif listesi
          </h2>
          <button
            type="button"
            onClick={() => dispatch(setCartOpen(false))}
            className="p-2 text-muted hover:text-white"
            aria-label="Kapat"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-muted">Listeniz boş.</p>
          ) : (
            items.map((item) => (
              <div
                key={item.lineId}
                className="flex gap-3 border border-border p-3 bg-black/30"
              >
                <div className="relative w-14 h-14 shrink-0 bg-black overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{item.name}</p>
                  {(item.widthCm || item.heightCm || item.color) && (
                    <p className="text-[11px] text-muted mt-0.5">
                      {[
                        item.widthCm ? `${item.widthCm} cm` : null,
                        item.heightCm ? `${item.heightCm} cm` : null,
                        item.color,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                  <p className="text-xs text-orange mt-1">
                    {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => dispatch(removeFromCart(item.lineId))}
                  className="text-muted hover:text-red-400 self-start"
                  aria-label="Kaldır"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="shrink-0 p-4 border-t border-border space-y-3 bg-card">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Tahmini toplam</span>
            <span className="text-orange font-semibold">{formatPrice(total)}</span>
          </div>
          <button
            type="button"
            onClick={goToCart}
            className="block w-full py-3 bg-orange text-white text-center font-display font-semibold uppercase tracking-wider hover:bg-orange-dark"
          >
            Teklif formuna git
          </button>
          <SiteLink
            href="/sepet"
            onClick={() => dispatch(setCartOpen(false))}
            className="block w-full py-2 text-center text-xs text-muted hover:text-orange"
          >
            Tam sepet sayfasını aç
          </SiteLink>
        </div>
      </aside>
    </div>
  );
}
