"use client";

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronRight, Menu, Phone, X } from "lucide-react";
import { SiteLink } from "@/components/ui/SiteLink";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import { LEGAL_LINKS, PRIMARY_NAV_HREFS } from "@/lib/constants";
import type { NavLinkItem } from "@/lib/site";

export interface MenuCategoryItem {
  href: string;
  label: string;
}

export interface MenuLinkItem {
  href: string;
  label: string;
}

type SubPanel = "categories" | "projects" | "blog" | "legal" | null;

interface SiteMenuProps {
  navLinks: NavLinkItem[];
  categories: MenuCategoryItem[];
  projects?: MenuLinkItem[];
  blogPosts?: MenuLinkItem[];
  phone: string;
  phoneRaw: string;
  whatsappUrl: string;
}

const PRIMARY_SET = new Set<string>(PRIMARY_NAV_HREFS);

/** Header dışı + alt menülü sayfalar (masaüstü menü). */
const DRAWER_LINKS: { href: string; label: string; sub?: SubPanel }[] = [
  { href: "/hizmetler", label: "Hizmetlerimiz", sub: "categories" },
  { href: "/#paketler", label: "Paketler" },
  { href: "/#kampanyalar", label: "Kampanyalar" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/sepet", label: "Randevu Sepeti" },
  { href: "/projeler", label: "Galeri", sub: "projects" },
  { href: "/blog", label: "Blog", sub: "blog" },
  { href: "#legal", label: "Kurumsal / Yasal", sub: "legal" },
];

/** Mobil: ana sayfa + drawer sırası. */
const MOBILE_LINKS: { href: string; label: string; sub?: SubPanel }[] = [
  { href: "/", label: "Ana Sayfa" },
  ...DRAWER_LINKS,
];

function publicPath(href: string): string {
  return href.replace(/^\/duzenle/, "") || "/";
}

function toEditorAware(
  href: string,
  navLinks: NavLinkItem[]
): string {
  if (href.startsWith("#")) return href;
  const match = navLinks.find((l) => publicPath(l.href) === href);
  return match?.href || href;
}

export function SiteMenu({
  navLinks,
  categories,
  projects = [],
  blogPosts = [],
  phone,
  phoneRaw,
  whatsappUrl,
}: SiteMenuProps) {
  const [open, setOpen] = useState(false);
  const [sub, setSub] = useState<SubPanel>(null);
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /** Masaüstünde header’daki ana linkleri menüden çıkar (alt menülüler hariç tutulmaz). */
  const rawLinks = isDesktop
    ? DRAWER_LINKS.filter((l) => {
        if (l.sub) return true;
        return !PRIMARY_SET.has(l.href);
      })
    : MOBILE_LINKS;

  const links = rawLinks.map((l) => ({
    ...l,
    href: toEditorAware(l.href, navLinks),
  }));

  const close = useCallback(() => {
    setOpen(false);
    setSub(null);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const waHref = `${whatsappUrl}?text=${encodeURIComponent(
    "Merhaba, hizmetleriniz hakkında bilgi almak ve randevu oluşturmak istiyorum."
  )}`;

  const subItems: MenuLinkItem[] =
    sub === "categories"
      ? [
          { href: toEditorAware("/hizmetler", navLinks), label: "Tüm hizmetler" },
          ...categories,
        ]
      : sub === "projects"
        ? [
            {
              href: toEditorAware("/projeler", navLinks),
              label: "Tüm galeri",
            },
            ...projects,
          ]
        : sub === "blog"
          ? [
              { href: toEditorAware("/blog", navLinks), label: "Tüm yazılar" },
              ...blogPosts,
            ]
          : sub === "legal"
            ? LEGAL_LINKS.map((l) => ({ href: l.href, label: l.label }))
            : [];

  const subTitle =
    sub === "categories"
      ? "Hizmetler"
      : sub === "projects"
        ? "Galeri"
        : sub === "blog"
          ? "Blog"
          : sub === "legal"
            ? "Kurumsal"
            : "";

  const panel =
    open && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[80] pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-label="Site menüsü"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/60 pointer-events-auto cursor-default"
              aria-label="Menüyü kapat"
              onClick={close}
            />
            <div
              id="site-menu-panel"
              className="pointer-events-auto absolute top-0 right-0 h-full w-[min(100%,22rem)] sm:w-[min(100%,36rem)] md:w-[min(100%,42rem)] flex shadow-2xl"
            >
              <nav
                className={`h-full overflow-y-auto overscroll-contain bg-card border-l border-border flex flex-col ${
                  sub ? "hidden sm:flex sm:w-[44%]" : "flex w-full"
                }`}
              >
                <div className="px-4 py-4 border-b border-border flex items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-orange">
                    Menü
                  </p>
                  <button
                    type="button"
                    className="w-9 h-9 inline-flex items-center justify-center text-muted hover:text-orange"
                    onClick={close}
                    aria-label="Menüyü kapat"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 p-2 flex flex-col gap-0.5">
                  {links.map((link) => {
                    const active = link.sub != null && sub === link.sub;
                    if (link.sub) {
                      return (
                        <button
                          key={link.href + link.label}
                          type="button"
                          onClick={() =>
                            setSub((cur) =>
                              cur === link.sub ? null : (link.sub ?? null)
                            )
                          }
                          className={`flex items-center justify-between gap-2 px-3 py-3 text-left text-sm font-semibold tracking-wider uppercase rounded-lg transition-colors ${
                            active
                              ? "bg-orange/10 text-orange"
                              : "text-muted hover:text-orange hover:bg-orange/5"
                          }`}
                          aria-expanded={active}
                        >
                          <span>{link.label}</span>
                          <ChevronRight size={16} className="shrink-0" />
                        </button>
                      );
                    }
                    return (
                      <SiteLink
                        key={link.href}
                        href={link.href}
                        onClick={close}
                        className="px-3 py-3 text-sm font-semibold tracking-wider text-muted hover:text-orange hover:bg-orange/5 transition-colors uppercase rounded-lg"
                      >
                        {link.label}
                      </SiteLink>
                    );
                  })}
                </div>

                <div className="p-3 border-t border-border grid grid-cols-1 gap-2">
                  <a
                    href={`tel:+${phoneRaw}`}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-border text-sm font-semibold text-white hover:border-orange hover:text-orange rounded-lg"
                  >
                    <Phone size={16} /> Ara
                  </a>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white text-sm font-semibold rounded-lg hover:brightness-110"
                  >
                    <WhatsAppIcon size={16} /> WhatsApp
                  </a>
                  <p className="text-center text-xs text-muted">{phone}</p>
                </div>
              </nav>

              {sub && (
                <div className="h-full w-full sm:w-[56%] overflow-y-auto overscroll-contain bg-black border-l border-border flex flex-col">
                  <div className="px-4 py-4 border-b border-border flex items-center justify-between gap-2">
                    <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-orange">
                      {subTitle}
                    </p>
                    <button
                      type="button"
                      className="text-muted hover:text-orange text-xs uppercase tracking-wider"
                      onClick={() => setSub(null)}
                    >
                      Geri
                    </button>
                  </div>
                  <div className="flex-1 p-2 flex flex-col gap-0.5">
                    {subItems.map((item) => (
                      <SiteLink
                        key={item.href}
                        href={item.href}
                        onClick={close}
                        className="px-3 py-3 text-sm text-white/85 hover:text-orange hover:bg-orange/5 transition-colors rounded-lg"
                      >
                        {item.label}
                      </SiteLink>
                    ))}
                    {subItems.length <= 1 && (
                      <p className="px-3 py-4 text-sm text-muted">
                        Alt sayfa bulunamadı.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        type="button"
        className="inline-flex w-10 h-10 items-center justify-center text-muted hover:text-orange transition-colors border border-transparent hover:border-border rounded-md"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
        aria-expanded={open}
        aria-controls="site-menu-panel"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      {panel}
    </>
  );
}
