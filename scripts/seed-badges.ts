import "dotenv/config";
import { prisma } from "../src/lib/db";

async function main() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: 12,
    select: { id: true, slug: true },
  });
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    if (!p) continue;
    await prisma.product.update({
      where: { id: p.id },
      data: {
        isFeatured: i < 6,
        badgeNew: i % 4 === 0,
        badgeBestseller: i % 3 === 0,
        badgeSale: i % 5 === 0,
        salePrice: i % 5 === 0 ? 999 : null,
        shippingLabel: i % 2 === 0 ? "3-5 iş günü" : "Keşif sonrası",
      },
    });
  }
  console.log("Updated", products.length, "products with badges");

  const navExtras = [
    { label: "KAYITLARIM", href: "/tekliflerim", sortOrder: 65 },
  ];
  for (const item of navExtras) {
    const existing = await prisma.navItem.findFirst({
      where: { href: item.href },
    });
    if (!existing) {
      await prisma.navItem.create({
        data: { ...item, isActive: true },
      });
      console.log("Nav added", item.href);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
