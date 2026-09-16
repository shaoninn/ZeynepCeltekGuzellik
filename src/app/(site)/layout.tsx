import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { Analytics } from "@/components/Analytics";
import { CartProvider } from "@/context/CartContext";
import { getNavLinks, getSiteSettings } from "@/lib/site";
import { getContentMap } from "@/lib/site-content";
import {
  getMenuCategories,
  getMenuPosts,
  getMenuProjects,
} from "@/lib/catalog";

/** ISR: HTML + data cache ~60s; editor/admin saves call revalidatePath. */
export const revalidate = 60;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, navLinks, content, categories, projects, posts] =
    await Promise.all([
      getSiteSettings(),
      getNavLinks(),
      getContentMap(["footer_blurb"]),
      getMenuCategories(),
      getMenuProjects(),
      getMenuPosts(),
    ]);

  const menuCategories = categories.map((c) => ({
    href: `/hizmetler/${c.slug}`,
    label: c.name,
  }));
  const menuProjects = projects.map((p) => ({
    href: `/projeler/${p.slug}`,
    label: p.title,
  }));
  const menuPosts = posts.map((p) => ({
    href: `/blog/${p.slug}`,
    label: p.title,
  }));

  return (
    <CartProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-orange focus:text-black focus:px-3 focus:py-2"
      >
        İçeriğe geç
      </a>
      <Header
        settings={settings}
        navLinks={navLinks}
        categories={menuCategories}
        projects={menuProjects}
        blogPosts={menuPosts}
      />
      <main id="main-content" className="min-h-screen pt-14 sm:pt-16 pb-[max(7.5rem,calc(env(safe-area-inset-bottom)+6.5rem))] md:pb-8 overflow-x-clip">
        {children}
      </main>
      <Footer
        settings={settings}
        navLinks={navLinks}
        footerBlurb={content.footer_blurb}
      />
      <FloatingContact
        phone={settings.phone}
        whatsappUrl={settings.whatsappUrl}
      />
      <CookieConsent />
      <Analytics />
    </CartProvider>
  );
}
