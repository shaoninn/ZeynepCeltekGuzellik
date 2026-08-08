"use client";

import { Calendar, ShoppingCart } from "lucide-react";
import { SiteLink } from "@/components/ui/SiteLink";
import { useAppSelector } from "@/store/hooks";
import { selectCartCount } from "@/store/cartSlice";
import { CartToast } from "@/components/shop/CartToast";
import {
  SiteMenu,
  type MenuCategoryItem,
  type MenuLinkItem,
} from "@/components/layout/SiteMenu";
import type { NavLinkItem } from "@/lib/site";

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
  const cartCount = useAppSelector(selectCartCount);

  return (
    <>
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <SiteLink
          href="/iletisim"
          className="hidden md:inline-flex items-center gap-2 h-9 px-4 rounded-sm border border-orange text-orange text-[11px] font-semibold tracking-[0.14em] uppercase hover:bg-orange hover:text-ink transition-colors"
        >
          <Calendar size={14} />
          Randevu Al
        </SiteLink>

        <SiteLink
          href="/sepet"
          className="relative inline-flex w-10 h-10 items-center justify-center text-muted hover:text-orange transition-colors"
          aria-label={`Randevu Sepeti${cartCount > 0 ? ` (${cartCount})` : ""}`}
        >
          <ShoppingCart size={18} />
          {cartCount > 0 ? (
            <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 bg-orange text-ink text-[9px] rounded-full flex items-center justify-center font-bold leading-none">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          ) : null}
        </SiteLink>

        <SiteMenu
          navLinks={navLinks}
          categories={categories}
          projects={projects}
          blogPosts={blogPosts}
          phone={phone}
          phoneRaw={phoneRaw}
          whatsappUrl={whatsappUrl}
        />
      </div>

      <CartToast />
    </>
  );
}
