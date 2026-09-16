"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Images,
  FileText,
  ShoppingBag,
  MessageSquare,
  Settings,
  Type,
  LogOut,
  Upload,
  ExternalLink,
  Menu,
  Users,
  UserRound,
  ScrollText,
  X,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";

const NAV_SECTIONS = [
  {
    title: "Günlük iş",
    items: [
      { href: "/admin", label: "Panel", icon: LayoutDashboard, exact: true },
      { href: "/admin/siparisler", label: "Randevu talepleri", icon: ShoppingBag },
      { href: "/admin/siparisler/kanban", label: "Talep panosu", icon: LayoutDashboard },
      { href: "/admin/crm", label: "CRM", icon: MessageSquare },
      { href: "/admin/mesajlar", label: "Mesajlar", icon: MessageSquare },
      { href: "/admin/musteriler", label: "Müşteriler", icon: UserRound },
    ],
  },
  {
    title: "Katalog",
    items: [
      { href: "/admin/urunler", label: "Hizmetler", icon: Package },
      { href: "/admin/paketler", label: "Paketler", icon: Package },
      { href: "/admin/kampanyalar", label: "Kampanyalar", icon: FileText },
      { href: "/admin/kategoriler", label: "Kategoriler", icon: FolderTree },
      { href: "/admin/projeler", label: "Galeri", icon: Images },
    ],
  },
  {
    title: "Site",
    items: [
      { href: "/duzenle", label: "Siteyi Düzenle", icon: Pencil },
      { href: "/admin/blog", label: "Blog", icon: FileText },
      { href: "/admin/icerikler", label: "Site Yazıları", icon: Type },
      { href: "/admin/menuler", label: "Menüler", icon: Menu },
      { href: "/admin/medya", label: "Medya", icon: Upload },
    ],
  },
  {
    title: "Sistem",
    items: [
      { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: Users },
      { href: "/admin/audit", label: "Audit", icon: ScrollText },
      { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
    ],
  },
] as const;

function SidebarNav({
  onNavigate,
  unreadMessages,
  pendingOrders,
}: {
  onNavigate?: () => void;
  unreadMessages: number;
  pendingOrders: number;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      <div className="p-5 border-b border-border">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="inline-flex items-center gap-2.5"
        >
          <Logo href={null} size="sm" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-orange border border-orange/40 rounded px-1.5 py-0.5">
            Admin
          </span>
        </Link>
        <p className="text-xs text-muted mt-2">Yönetim Paneli</p>
      </div>

      <nav className="flex-1 p-3 space-y-3 overflow-y-auto overscroll-contain">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="px-3 pb-1 pt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#666]">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const exact = "exact" in item && item.exact;
                const active = exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors min-h-11",
                      active
                        ? "bg-orange/15 text-orange border border-orange/25"
                        : "text-muted hover:bg-white/5 hover:text-white border border-transparent"
                    )}
                  >
                    <Icon size={18} className="shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.href === "/admin/siparisler" && pendingOrders > 0 ? (
                      <span className="text-[10px] min-w-[1.25rem] h-5 px-1.5 rounded-full bg-orange text-ink font-bold flex items-center justify-center">
                        {pendingOrders > 99 ? "99+" : pendingOrders}
                      </span>
                    ) : null}
                    {item.href === "/admin/mesajlar" && unreadMessages > 0 ? (
                      <span className="text-[10px] min-w-[1.25rem] h-5 px-1.5 rounded-full bg-orange text-ink font-bold flex items-center justify-center">
                        {unreadMessages > 99 ? "99+" : unreadMessages}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-border space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:text-orange hover:bg-orange/5 min-h-11 transition-colors"
        >
          <ExternalLink size={18} />
          Siteyi Gör
        </Link>
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:text-red-400 hover:bg-red-500/10 min-h-11 transition-colors"
        >
          <LogOut size={18} />
          Çıkış Yap
        </button>
      </div>
    </>
  );
}

export function AdminSidebar({
  unreadMessages = 0,
  pendingOrders = 0,
}: {
  unreadMessages?: number;
  pendingOrders?: number;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-card border-b border-border flex items-center px-3 gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-11 h-11 flex items-center justify-center text-muted hover:text-orange transition-colors"
          aria-label="Menüyü aç"
        >
          <Menu size={22} />
        </button>
        <Logo href={null} size="sm" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-orange">
          Admin
        </span>
      </div>

      <aside className="hidden lg:flex w-64 shrink-0 bg-card border-r border-border min-h-screen flex-col sticky top-0 h-screen">
        <SidebarNav
          unreadMessages={unreadMessages}
          pendingOrders={pendingOrders}
        />
      </aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Kapat"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-[min(100%,18rem)] bg-card border-r border-border flex flex-col shadow-2xl">
            <div className="absolute right-2 top-2 z-10">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-11 h-11 flex items-center justify-center text-muted hover:text-white"
                aria-label="Menüyü kapat"
              >
                <X size={20} />
              </button>
            </div>
            <SidebarNav
              onNavigate={() => setOpen(false)}
              unreadMessages={unreadMessages}
              pendingOrders={pendingOrders}
            />
          </aside>
        </div>
      )}
    </>
  );
}
