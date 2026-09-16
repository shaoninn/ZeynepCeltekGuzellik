import "dotenv/config";
import { prisma } from "../src/lib/db";
import { NAV_LINKS, PACKAGES } from "../src/lib/constants";

async function main() {
  // Finish incomplete seed pieces safely (upsert)
  const settings = [
    { key: "phone", value: "0 (545) 457 06 56" },
    { key: "email", value: "" },
    {
      key: "address",
      value:
        "Gazi Paşa: CarrefourSA Expres Market Üstü, Cemal Paşa Mh. Gazipaşa Bulvarı, 63003. Sk. Tek Apt Kat 4 No 41, 01120 Seyhan/Adana · Turgut Özal: Güzelyalı, Turgut Özal Blv. No:102, 01170 Çukurova/Adana",
    },
    { key: "instagram", value: "https://www.instagram.com/zeynepceltek_adana/" },
    { key: "whatsapp", value: "905454570656" },
    { key: "google_reviews_url", value: "" },
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
        shippingLabel: "",
      },
    });
  }

  for (const [index, pkg] of PACKAGES.entries()) {
    await prisma.servicePackage.upsert({
      where: { slug: pkg.slug },
      create: {
        slug: pkg.slug,
        name: pkg.name,
        price: pkg.price,
        sessions: pkg.sessions,
        featured: pkg.featured,
        badge: "badge" in pkg ? pkg.badge : null,
        image: pkg.image,
        shortDesc: pkg.shortDesc,
        items: JSON.stringify([...pkg.items]),
        sortOrder: index,
        isActive: true,
      },
      update: {},
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
