"use client";

import dynamic from "next/dynamic";
import { Calendar, Menu, ShoppingCart } from "lucide-react";
import { useCallback, useState } from "react";
import { SiteLink } from "@/components/ui/SiteLink";
import { useCart } from "@/context/CartContext";
import type {
  MenuCategoryItem,
  MenuLinkItem,
} from "@/components/layout/SiteMenu";
import type { NavLinkItem } from "@/lib/site";

const CartToast = dynamic(
  () => import("@/components/shop/CartToast").then((m) => m.CartToast),
  { ssr: false }
);

const SiteMenu = dynamic(
  () => import("@/components/layout/SiteMenu").then((m) => m.SiteMenu),
  { ssr: false }
);

interface HeaderClientProps {
  navLinks: NavLinkItem[];
  categories: MenuCategoryItem[];
  projects?: MenuLinkItem[];
  blogPosts?: MenuLinkItem[];
  phone: string;
  phoneRaw: string;
  whatsappUrl: string;
}

export function HeaderClient({
  navLinks,
  categories,
  projects = [],
  blogPosts = [],
  phone,
  phoneRaw,
  whatsappUrl,
}: HeaderClientProps) {
  const { count: cartCount } = useCart();
  const [menuMounted, setMenuMounted] = useState(false);
  const [menuOpenRequest, setMenuOpenRequest] = useState(0);

  const openMenu = useCallback(() => {
    setMenuMounted(true);
    setMenuOpenRequest((n) => n + 1);
  }, []);

  return (
    <>
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <SiteLink
          href="/iletisim"
          className="inline-flex w-11 h-11 lg:w-auto lg:h-9 items-center justify-center lg:gap-2 lg:px-4 rounded-sm border border-orange text-orange text-[11px] font-semibold tracking-[0.14em] uppercase hover:bg-orange hover:text-ink transition-colors"
          aria-label="Randevu Al"
        >
          <Calendar size={14} />
          <span className="hidden lg:inline">Randevu Al</span>
        </SiteLink>

        <SiteLink
          href="/sepet"
          className="relative inline-flex w-11 h-11 items-center justify-center text-muted hover:text-orange transition-colors"
          aria-label={`Randevu Sepeti${cartCount > 0 ? ` (${cartCount})` : ""}`}
        >
          <ShoppingCart size={18} />
          {cartCount > 0 ? (
            <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 bg-orange text-ink text-[9px] rounded-full flex items-center justify-center font-bold leading-none">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          ) : null}
        </SiteLink>

        {menuMounted ? (
          <SiteMenu
            navLinks={navLinks}
            categories={categories}
            projects={projects}
            blogPosts={blogPosts}
            phone={phone}
            phoneRaw={phoneRaw}
            whatsappUrl={whatsappUrl}
            autoOpenToken={menuOpenRequest}
          />
        ) : (
          <button
            type="button"
            className="inline-flex w-11 h-11 items-center justify-center text-muted hover:text-orange transition-colors border border-transparent hover:border-border rounded-md"
            onClick={openMenu}
            aria-label="Menüyü aç"
            aria-expanded={false}
          >
            <Menu size={22} />
          </button>
        )}
      </div>

      <CartToast />
    </>
  );
}
