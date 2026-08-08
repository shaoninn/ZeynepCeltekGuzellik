"use client";

import { usePathname } from "next/navigation";
import { SiteLink } from "@/components/ui/SiteLink";
import { HeaderClient } from "./HeaderClient";
import { Logo } from "@/components/brand/Logo";
import { PRIMARY_NAV_LINKS } from "@/lib/constants";
import type { NavLinkItem, SiteSettingsMap } from "@/lib/site";
import type { MenuCategoryItem, MenuLinkItem } from "@/components/layout/SiteMenu";
import { EditableLayoutBox } from "@/components/editor/EditableLayoutBox";

interface HeaderProps {
  settings: SiteSettingsMap;
  navLinks: NavLinkItem[];
  categories?: MenuCategoryItem[];
  projects?: MenuLinkItem[];
  blogPosts?: MenuLinkItem[];
}

function resolvePrimaryNav(navLinks: NavLinkItem[]): NavLinkItem[] {
  const byHref = new Map(navLinks.map((l) => [l.href, l]));
  return PRIMARY_NAV_LINKS.map((item) => {
    const fromDb = byHref.get(item.href);
    return {
      href: item.href,
      label: fromDb?.label || item.label,
    };
  });
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header({
  settings,
  navLinks,
  categories = [],
  projects = [],
  blogPosts = [],
}: HeaderProps) {
  const pathname = usePathname();
  const primaryNav = resolvePrimaryNav(navLinks);
  const editorMode = pathname.startsWith("/duzenle");

  const logo = (
    <span className="inline-flex origin-left max-sm:scale-[0.9]">
      <Logo size="md" />
    </span>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-14 sm:h-16">
          <div className="min-w-0 shrink">
            {editorMode ? (
              <EditableLayoutBox
                settingKey="layout_logo"
                value={settings.layoutLogo}
                label="Logo"
                maxOffset={60}
              >
                {logo}
              </EditableLayoutBox>
            ) : (
              logo
            )}
          </div>

          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center min-w-0 px-2">
            {primaryNav.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <SiteLink
                  key={link.href}
                  href={link.href}
                  className={`shrink-0 px-2.5 xl:px-3 py-2 text-[11px] font-semibold tracking-[0.14em] uppercase whitespace-nowrap transition-colors border-b-2 ${
                    active
                      ? "text-orange border-orange"
                      : "text-cream/75 border-transparent hover:text-orange"
                  }`}
                >
                  {link.label}
                </SiteLink>
              );
            })}
          </nav>

          <HeaderClient
            navLinks={navLinks}
            categories={categories}
            projects={projects}
            blogPosts={blogPosts}
            phone={settings.phone}
            phoneRaw={settings.phoneRaw}
            whatsappUrl={settings.whatsappUrl}
          />
        </div>
      </div>
    </header>
  );
}
