import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <Link href="/admin/urunler" className="text-sm text-orange hover:underline mb-4 inline-block">
        ← Ürünlere dön
      </Link>
      <h1 className="font-display text-3xl font-bold mb-2">Yeni Ürün</h1>
      <p className="text-sm text-[#888] mb-6">
        Tüm alanları doldurun. Görsel yoksa boş bırakabilirsiniz — sitede
        placeholder görünür.
      </p>
      {categories.length === 0 ? (
        <div className="admin-warning">
          Önce en az bir kategori oluşturmalısınız.{" "}
          <Link href="/admin/kategoriler" className="underline">
            Kategorilere git
          </Link>
        </div>
      ) : (
        <ProductForm categories={categories} />
      )}
    </div>
  );
}
