import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/db";
import { requireAdmin, isUnauthorized } from "@/lib/api";
import { slugify } from "@/lib/utils";
import { revalidateCategories } from "@/lib/revalidate";

export const runtime = "nodejs";

type Row = Record<string, unknown>;

function cell(row: Row, ...keys: string[]): string {
  for (const key of keys) {
    const direct = row[key];
    if (direct != null && String(direct).trim() !== "") return String(direct).trim();
    const found = Object.entries(row).find(
      ([k]) => k.trim().toLowerCase() === key.toLowerCase()
    );
    if (found && found[1] != null && String(found[1]).trim() !== "") {
      return String(found[1]).trim();
    }
  }
  return "";
}

function parseBool(value: string, fallback: boolean): boolean {
  if (!value) return fallback;
  const v = value.toLowerCase();
  if (["1", "true", "evet", "yes", "aktif", "var"].includes(v)) return true;
  if (["0", "false", "hayir", "hayır", "no", "pasif", "yok"].includes(v))
    return false;
  return fallback;
}

/** GET: Excel şablonu / mevcut ürün export */
export async function GET() {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
  });

  const rows = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    categorySlug: p.category.slug,
    categoryName: p.category.name,
    price: p.price,
    shortDesc: p.shortDesc || "",
    description: p.description || "",
    image: p.image || "",
    sortOrder: p.sortOrder,
    isActive: p.isActive ? "evet" : "hayir",
    inStock: p.inStock ? "evet" : "hayir",
  }));

  if (rows.length === 0) {
    rows.push({
      id: "",
      name: "Örnek Klasik Cilt Bakımı",
      slug: "ornek-klasik-cilt-bakimi",
      categorySlug: "cilt-bakimi",
      categoryName: "",
      price: 800,
      shortDesc: "Kısa açıklama",
      description: "Uzun açıklama",
      image: "",
      sortOrder: 0,
      isActive: "evet",
      inStock: "evet",
    });
  }

  const sheet = XLSX.utils.json_to_sheet(rows);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Hizmetler");
  const buffer = XLSX.write(book, { type: "buffer", bookType: "xlsx" }) as Buffer;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="zeynep-hizmetler.xlsx"`,
    },
  });
}

/** POST: Excel yükle (oluştur / güncelle) */
export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Excel dosyası gerekli" }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const book = XLSX.read(buf, { type: "buffer" });
    const sheetName = book.SheetNames[0];
    if (!sheetName) {
      return NextResponse.json({ error: "Boş Excel" }, { status: 400 });
    }
    const sheet = book.Sheets[sheetName];
    const raw = XLSX.utils.sheet_to_json<Row>(sheet, { defval: "" });

    const categories = await prisma.category.findMany();
    const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
    const byName = Object.fromEntries(
      categories.map((c) => [c.name.toLowerCase(), c])
    );

    let created = 0;
    let updated = 0;
    const errors: string[] = [];

    for (let i = 0; i < raw.length; i++) {
      const row = raw[i];
      const line = i + 2;
      try {
        const id = cell(row, "id");
        const name = cell(row, "name", "ürün", "urun", "ad");
        if (!name) {
          errors.push(`Satır ${line}: ürün adı boş`);
          continue;
        }
        const categorySlug = cell(row, "categorySlug", "kategoriSlug", "category");
        const categoryName = cell(row, "categoryName", "kategori", "kategoriAdi");
        const category =
          (categorySlug && bySlug[categorySlug]) ||
          (categoryName && byName[categoryName.toLowerCase()]) ||
          null;
        if (!category) {
          errors.push(
            `Satır ${line}: kategori bulunamadı (categorySlug veya categoryName)`
          );
          continue;
        }

        let slug = cell(row, "slug") || slugify(name);
        const priceRaw = cell(row, "price", "fiyat");
        const price = Number(String(priceRaw).replace(",", ".")) || 0;
        const shortDesc = cell(row, "shortDesc", "kisaAciklama", "kısaAçıklama");
        const description = cell(row, "description", "aciklama", "açıklama");
        const image = cell(row, "image", "gorsel", "görsel") || null;
        const sortOrder = Number(cell(row, "sortOrder", "sira")) || 0;
        const isActive = parseBool(cell(row, "isActive", "aktif"), true);
        const inStock = parseBool(cell(row, "inStock", "stok"), true);

        const data = {
          name,
          slug,
          categoryId: category.id,
          price,
          shortDesc: shortDesc || null,
          description: description || null,
          image,
          sortOrder,
          isActive,
          inStock,
        };

        if (id) {
          const existing = await prisma.product.findUnique({ where: { id } });
          if (existing) {
            const slugTaken = await prisma.product.findFirst({
              where: { slug, NOT: { id } },
            });
            if (slugTaken) slug = `${slug}-${Date.now().toString(36)}`;
            await prisma.product.update({
              where: { id },
              data: { ...data, slug },
            });
            updated += 1;
            continue;
          }
        }

        const slugTaken = await prisma.product.findUnique({ where: { slug } });
        if (slugTaken) {
          await prisma.product.update({
            where: { id: slugTaken.id },
            data,
          });
          updated += 1;
        } else {
          await prisma.product.create({
            data: {
              ...data,
              images: "[]",
              specs: "{}",
            },
          });
          created += 1;
        }
      } catch (e) {
        errors.push(
          `Satır ${line}: ${e instanceof Error ? e.message : "kayıt hatası"}`
        );
      }
    }

    revalidateCategories();
    return NextResponse.json({ created, updated, errors });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Excel işlenemedi" },
      { status: 500 }
    );
  }
}
