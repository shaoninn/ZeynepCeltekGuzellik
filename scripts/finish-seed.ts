import "dotenv/config";
import { prisma } from "../src/lib/db";
import { NAV_LINKS } from "../src/lib/constants";

async function main() {
  // Finish incomplete seed pieces safely (upsert)
  const settings = [
    { key: "phone", value: "0 (532) 224 07 85" },
    { key: "email", value: "info@zeynepceltekguzellik.local" },
    { key: "address", value: "Çakırlar, Antalya" },
    { key: "instagram", value: "https://www.instagram.com/zeynepceltekguzellik/" },
    { key: "whatsapp", value: "905322240785" },
    {
      key: "google_reviews_url",
      value: "https://share.google/mmdpck843WySI93pq",
    },
  ];
  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      create: s,
      update: { value: s.value },
    });
  }

  for (const [i, link] of NAV_LINKS.entries()) {
    const existing = await prisma.navItem.findFirst({
      where: { href: link.href },
    });
    if (!existing) {
      await prisma.navItem.create({
        data: {
          label: link.label,
          href: link.href,
          sortOrder: (i + 1) * 10,
          isActive: true,
        },
      });
    }
  }

  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: 12,
    select: { id: true },
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

  console.log("Finished settings/nav/badges", { products: products.length });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
