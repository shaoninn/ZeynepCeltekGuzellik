import { prisma } from "../src/lib/db";
import { NAV_LINKS } from "../src/lib/constants";

async function main() {
  console.log("navItem typeof:", typeof prisma.navItem);
  const count = await prisma.navItem.count();
  console.log("nav count:", count);

  if (count === 0) {
    await prisma.navItem.createMany({
      data: NAV_LINKS.map((l, i) => ({
        label: l.label,
        href: l.href,
        sortOrder: i,
        isActive: true,
      })),
    });
    console.log("Seeded nav items");
  }

  const items = await prisma.navItem.findMany({ orderBy: { sortOrder: "asc" } });
  console.log(items.map((i) => `${i.label} -> ${i.href}`));
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
