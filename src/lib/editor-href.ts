/** Map public site paths to /duzenle editor paths. */
const EDITOR_ROOTS = [
  "/hakkimizda",
  "/iletisim",
  "/hizmetler",
  "/projeler",
  "/blog",
  "/urun",
] as const;

export function toEditorHref(href: string): string {
  if (!href || href === "/") return "/duzenle";
  if (href.startsWith("/duzenle")) return href;
  if (
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#")
  ) {
    return href;
  }
  const path = href.startsWith("/") ? href : `/${href}`;
  // Keep legal / cart / admin outside editor shell
  if (
    path.startsWith("/admin") ||
    path.startsWith("/sepet") ||
    path.startsWith("/kvkk") ||
    path.startsWith("/gizlilik") ||
    path.startsWith("/kullanim") ||
    path.startsWith("/hizmet-bolgeleri")
  ) {
    return path;
  }
  const matched = EDITOR_ROOTS.some(
    (root) => path === root || path.startsWith(`${root}/`)
  );
  if (matched) return `/duzenle${path}`;
  return path;
}

export function mapNavToEditor<T extends { href: string }>(links: T[]): T[] {
  return links.map((link) => ({
    ...link,
    href: toEditorHref(link.href),
  }));
}
