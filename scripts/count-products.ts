import "dotenv/config";
import { prisma } from "../src/lib/db";

async function main() {
  const total = await prisma.product.count();
  const active = await prisma.product.count({ where: { isActive: true } });
  const cats = await prisma.category.count();
  console.log({ total, active, cats });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
