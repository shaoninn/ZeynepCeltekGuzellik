import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import {
  mysqlConnectionSummary,
  resolveMysqlDatabaseUrl,
} from "../src/lib/db-url";

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(resolveMysqlDatabaseUrl()),
});

async function main() {
  console.log(mysqlConnectionSummary());
  const cats = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: "asc" },
  });
  console.log(
    cats.map((c) => ({ slug: c.slug, products: c._count.products }))
  );
  console.log("products", await prisma.product.count());
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
