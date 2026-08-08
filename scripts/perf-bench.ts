/**
 * Latency bench against configured MySQL (remote Hostinger).
 * Run: npx tsx scripts/perf-bench.ts
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { resolveMysqlPoolConfig } from "../src/lib/db-url";

async function timed<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const t0 = Date.now();
  const result = await fn();
  console.log(`${label}: ${Date.now() - t0}ms`);
  return result;
}

async function main() {
  const c = resolveMysqlPoolConfig();
  console.log(
    `target ${c.user}@${c.host}:${c.port}/${c.database} pool=${c.connectionLimit}`
  );

  const adapterStarted = Date.now();
  const prisma = new PrismaClient({
    adapter: new PrismaMariaDb({
      host: c.host,
      port: c.port,
      user: c.user,
      password: c.password,
      database: c.database,
      connectionLimit: c.connectionLimit,
      connectTimeout: c.connectTimeout,
      acquireTimeout: c.acquireTimeout,
      idleTimeout: c.idleTimeout,
      minimumIdle: c.minimumIdle,
      allowPublicKeyRetrieval: true,
    }),
  });
  console.log(`adapter construct: ${Date.now() - adapterStarted}ms`);

  await timed("FIRST ping (cold connect)", () => prisma.$queryRaw`SELECT 1`);
  await timed("SECOND ping (warm)", () => prisma.$queryRaw`SELECT 1`);

  await timed("sequential layout (settings→nav)", async () => {
    await prisma.siteSetting.findMany();
    await prisma.navItem.findMany({ where: { isActive: true } });
  });

  await timed("parallel layout (settings||nav)", async () => {
    await Promise.all([
      prisma.siteSetting.findMany(),
      prisma.navItem.findMany({ where: { isActive: true } }),
    ]);
  });

  await timed("home bundle parallel", async () => {
    await Promise.all([
      prisma.siteSetting.findMany(),
      prisma.navItem.findMany({ where: { isActive: true } }),
      prisma.siteContent.findMany({ take: 30 }),
      prisma.project.findMany({
        where: { isActive: true, isFeatured: true },
        include: { category: true },
        take: 10,
      }),
    ]);
  });

  await timed("projects list", () =>
    prisma.project.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { sortOrder: "asc" },
    })
  );

  // Warm cache simulation: second home bundle
  await timed("home bundle #2 (warm conn)", async () => {
    await Promise.all([
      prisma.siteSetting.findMany(),
      prisma.navItem.findMany({ where: { isActive: true } }),
      prisma.project.findMany({
        where: { isActive: true, isFeatured: true },
        take: 10,
      }),
    ]);
  });

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
