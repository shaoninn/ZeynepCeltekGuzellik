import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { resolveMysqlPoolConfig } from "../src/lib/db-url";

async function main() {
  const c = resolveMysqlPoolConfig();
  const prisma = new PrismaClient({
    adapter: new PrismaMariaDb({
      host: c.host,
      port: c.port,
      user: c.user,
      password: c.password,
      database: c.database,
      connectionLimit: 1,
      connectTimeout: 8_000,
      acquireTimeout: 8_000,
    }),
  });

  const [projects, active, featured, categories, products, settings, nav] =
    await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { isActive: true } }),
      prisma.project.count({ where: { isActive: true, isFeatured: true } }),
      prisma.category.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.siteSetting.count(),
      prisma.navItem.count(),
    ]);

  console.log({
    projects,
    active,
    featured,
    categories,
    products,
    settings,
    nav,
  });
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
