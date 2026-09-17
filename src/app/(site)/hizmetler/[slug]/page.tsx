import { notFound } from "next/navigation";
import { SiteLink } from "@/components/ui/SiteLink";
import { getCategoryBySlug, getProductsByCategoryId } from "@/lib/catalog";
import { categoryTitleFromSlug } from "@/lib/catalog-fallback";
import { CatalogProductGrid, type CatalogProduct } from "@/components/shop/CatalogProductGrid";
import { EditableCategoryField } from "@/components/editor/EditableCategoryField";
import { CatalogAdminHint } from "@/components/editor/CatalogAdminHint";

export const revalidate = 60;


interface Props {
  params: Promise<{ slug: string }>;
}

/** No DB in metadata — cuts parallel pool pressure with page render. */
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const name = categoryTitleFromSlug(slug);
  if (!name) {
    return {
      alternates: { canonical: `/hizmetler/${slug}` },
      title: "Kategori | Zeynep Çeltek Güzellik",
    };
  }
  return {
    alternates: { canonical: `/hizmetler/${slug}` },
    title: `${name} | Zeynep Çeltek Güzellik`,
    description: `${name} hizmetleri — Adana Zeynep Çeltek Güzellik. Fiyat listesi ve randevu.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);
  if (!category || !category.isActive) notFound();

  const products = await getProductsByCategoryId(category.id);

  const desc = category.description || "";

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="text-xs text-muted mb-6">
          <SiteLink href="/" className="hover:text-orange">
            Anasayfa
          </SiteLink>
          <span className="mx-2">/</span>
          <SiteLink href="/hizmetler" className="hover:text-orange">
            Hizmetler
          </SiteLink>
          <span className="mx-2">/</span>
          <span className="text-white">{category.name}</span>
        </nav>

        <CatalogAdminHint
          title="Ürün kartları / fiyat"
          adminHref="/admin/urunler"
          adminLabel="Admin → Hizmetler"
        />

        <div className="mb-8">
          <EditableCategoryField
            categoryId={category.id}
            slug={category.slug}
            name={category.name}
            description={desc}
            field="name"
            as="h1"
            block
            className="font-display text-3xl sm:text-4xl font-bold text-white mb-2"
            help="Kategori adı (hizmet fiyatları Admin → Hizmetler’de)"
          />
          <EditableCategoryField
            categoryId={category.id}
            slug={category.slug}
            name={category.name}
            description={desc}
            field="description"
            as="p"
            block
            multiline
            className="text-muted max-w-2xl"
            help="Kategori sayfası açıklama metni — kim için, süre, not"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mb-10">
          <div className="border border-border bg-card/40 p-4">
            <p className="text-orange text-[10px] uppercase tracking-widest mb-1">
              Kim için
            </p>
            <p className="text-sm text-muted">
              Cilt tipi, kıl yapısı ve hedefinize göre uzman yönlendirir; ilk
              görüşmede protokol netleşir.
            </p>
          </div>
          <div className="border border-border bg-card/40 p-4">
            <p className="text-orange text-[10px] uppercase tracking-widest mb-1">
              Süre
            </p>
            <p className="text-sm text-muted">
              Seans süresi uygulamaya göre değişir; kesin süre randevu
              teyidinde paylaşılır.
            </p>
          </div>
          <div className="border border-border bg-card/40 p-4">
            <p className="text-orange text-[10px] uppercase tracking-widest mb-1">
              Not
            </p>
            <p className="text-sm text-muted">
              Randevu WhatsApp veya telefonla kesinleşir. Güvenli kart ödemesi
              PayTR ile tamamlanabilir. Konum: Adana — Gazi Paşa / Turgut Özal.
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted">Bu kategoride henüz hizmet bulunmuyor.</p>
            <SiteLink
              href="/iletisim"
              className="inline-block mt-4 text-orange text-sm hover:underline"
            >
              Randevu için iletişime geçin
            </SiteLink>
          </div>
        ) : (
          <CatalogProductGrid products={products as CatalogProduct[]} />
        )}
      </div>
    </section>
  );
}
