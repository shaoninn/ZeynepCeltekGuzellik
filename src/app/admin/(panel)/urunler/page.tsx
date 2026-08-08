import Link from "next/link";
import { prisma } from "@/lib/db";
import { Plus } from "lucide-react";
import { ProductsAdminClient } from "./ProductsAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
  });

  const initial = products.map((p) => ({
    id: p.id,
    name: p.name,
    categoryName: p.category.name,
    price: p.price,
    inStock: p.inStock,
    isActive: p.isActive,
    sortOrder: p.sortOrder,
  }));

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Ürünler</h1>
          <p className="text-sm text-[#888] mt-1">
            Tabloda fiyat / stok / aktiflik toplu güncelleyin veya Excel ile
            yükleyin. Detaylı görsel ve özellikler için ürün detayına girin.
          </p>
        </div>
        <Link
          href="/admin/urunler/yeni"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange text-white text-sm font-semibold rounded-lg hover:bg-orange-dark w-full sm:w-auto shrink-0"
        >
          <Plus size={16} /> Yeni Ürün
        </Link>
      </div>

      <div className="admin-warning mb-6">
        Silme işlemi geri alınamaz. Excel&apos;de{" "}
        <code className="text-orange">categorySlug</code> sütunu mevcut kategori
        slug&apos;ı ile eşleşmelidir. Online ödeme yoktur — fiyatlar teklif
        referansıdır.
      </div>

      <ProductsAdminClient initial={initial} />
    </div>
  );
}
