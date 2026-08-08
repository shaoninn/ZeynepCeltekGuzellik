"use client";

import { SiteLink } from "@/components/ui/SiteLink";
import { ShoppingCart, Search, User } from "lucide-react";
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
      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
        <SiteLink
          href="/iletisim"
          className="hidden md:inline-flex items-center h-9 px-4 rounded-sm border border-orange/50 text-orange text-[11px] font-semibold tracking-[0.14em] uppercase hover:bg-orange hover:text-black transition-colors"
        >
          Randevu Al
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

        <SiteLink
          href="/hizmetler"
          className="hidden sm:inline-flex w-10 h-10 items-center justify-center text-muted hover:text-orange transition-colors"
          aria-label="Ürünleri ara"
        >
          <Search size={18} />
        </SiteLink>

        <SiteLink
          href="/admin"
          className="hidden lg:inline-flex w-10 h-10 items-center justify-center text-muted hover:text-orange transition-colors"
          aria-label="Hesap"
        >
          <User size={18} />
        </SiteLink>

        <SiteLink
          href="/sepet"
          className="relative inline-flex items-center gap-2 h-10 px-2 sm:px-3 text-muted hover:text-orange transition-colors"
          aria-label={`Randevu Sepeti${cartCount > 0 ? ` (${cartCount})` : ""}`}
        >
          <span className="relative">
            <ShoppingCart size={20} />
            <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 bg-orange text-black text-[10px] rounded-full flex items-center justify-center font-bold leading-none">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          </span>
          <span className="hidden sm:inline text-[11px] font-semibold tracking-wider uppercase">
            Randevu Sepeti
          </span>
        </SiteLink>
      </div>

      <CartToast />
    </>
  );
}
