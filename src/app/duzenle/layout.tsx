import { EditorProvider } from "@/components/editor/EditorProvider";
import { EditorChrome } from "@/components/editor/EditorChrome";
import { EditorHelp } from "@/components/editor/EditorHelp";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { getNavLinks, getSiteSettings } from "@/lib/site";
import { getContentMap } from "@/lib/site-content";
import { mapNavToEditor, toEditorHref } from "@/lib/editor-href";
import {
  getMenuCategories,
  getMenuPosts,
  getMenuProjects,
} from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Siteyi Düzenle | Zeynep Çeltek Güzellik",
  robots: { index: false, follow: false },
};

export default async function EditorLayout({
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
  const editorNav = mapNavToEditor(navLinks);
  const menuCategories = categories.map((c) => ({
    href: toEditorHref(`/hizmetler/${c.slug}`),
    label: c.name,
  }));
  const menuProjects = projects.map((p) => ({
    href: toEditorHref(`/projeler/${p.slug}`),
    label: p.title,
  }));
  const menuPosts = posts.map((p) => ({
    href: toEditorHref(`/blog/${p.slug}`),
    label: p.title,
  }));

  return (
    <EditorProvider enabled>
      <EditorChrome>
        <CartProvider>
          <div className="[&_header]:!top-14 [&_header]:z-[60]">
            <Header
              settings={settings}
              navLinks={editorNav}
              categories={menuCategories}
              projects={menuProjects}
              blogPosts={menuPosts}
            />
            <main
              id="main-content"
              className="min-h-screen pt-[9.5rem] sm:pt-[10rem] lg:pt-[10.5rem] pb-24 md:pb-8 overflow-x-clip"
            >
              {children}
            </main>
            <Footer
              settings={settings}
              navLinks={editorNav}
              footerBlurb={content.footer_blurb}
            />
          </div>
          <EditorHelp />
        </CartProvider>
      </EditorChrome>
    </EditorProvider>
  );
}
