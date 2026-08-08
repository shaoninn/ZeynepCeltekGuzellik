/** Pages available in the live visual editor. */
export const EDITOR_PAGES = [
  {
    href: "/duzenle",
    path: "/",
    label: "Ana Sayfa",
    kind: "edit" as const,
    help: "Hero, özellikler, süreç, istatistikler, hizmetler girişi, SSS ve CTA metinleri.",
  },
  {
    href: "/duzenle/hakkimizda",
    path: "/hakkimizda",
    label: "Hakkımızda",
    kind: "edit" as const,
    help: "Giriş metni, misyon, vizyon, değerler ve atölye görselleri.",
  },
  {
    href: "/duzenle/iletisim",
    path: "/iletisim",
    label: "İletişim",
    kind: "edit" as const,
    help: "Sayfa başlığı, kart metinleri, butonlar ve telefon/adres ayarları.",
  },
  {
    href: "/duzenle/hizmetler",
    path: "/hizmetler",
    label: "Hizmetler",
    kind: "edit" as const,
    help: "Liste başlıkları + kategori adı/açıklama. Ürün fiyatı Admin → Ürünler.",
  },
  {
    href: "/duzenle/projeler",
    path: "/projeler",
    label: "Projeler",
    kind: "edit" as const,
    help: "Portföy sayfa metinleri ve proje detay etiketleri. Proje kartları Admin → Projeler.",
  },
  {
    href: "/duzenle/blog",
    path: "/blog",
    label: "Blog",
    kind: "edit" as const,
    help: "Blog üst başlık / açıklama. Yazı ekleme Admin → Blog.",
  },
] as const;

export type EditorPageKind = (typeof EDITOR_PAGES)[number]["kind"];
