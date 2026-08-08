import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/urunler" className="text-sm text-orange hover:underline mb-4 inline-block">
        ← Ürünlere dön
      </Link>
      <h1 className="font-display text-3xl font-bold mb-2">Ürün Düzenle</h1>
      <p className="text-sm text-[#888] mb-6">{product.name}</p>
      <ProductForm categories={categories} initial={product} />
    </div>
  );
}
