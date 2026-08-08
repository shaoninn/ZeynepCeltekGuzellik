import "dotenv/config";
import { prisma } from "../src/lib/db";

async function main() {
  const cats = await prisma.category.findMany({
    select: { slug: true, name: true, _count: { select: { products: true, projects: true } } },
    orderBy: { sortOrder: "asc" },
  });
  console.log("=== CATEGORIES ===");
  for (const c of cats) {
    console.log(
      `${c.slug} | ${c.name} | products=${c._count.products} projects=${c._count.projects}`,
    );
  }
  console.log("\n=== PROJECTS ===");
  const projects = await prisma.project.findMany({
    include: { category: { select: { slug: true, name: true } } },
    orderBy: { sortOrder: "asc" },
  });
  for (const p of projects) {
    console.log(`${p.slug} -> ${p.category?.slug ?? "NULL"} | ${p.image}`);
  }
  // Product.categoryId is required; Project.categoryId is optional.
  const nullCatProjects = await prisma.project.count({
    where: { categoryId: null },
  });
  const withImg = await prisma.product.count({
    where: { images: { not: "[]" } },
  });
  const total = await prisma.product.count();
  console.log(
    `\nProducts: ${total}, with images: ${withImg}, projects without category: ${nullCatProjects}`,
  );
  const sample = await prisma.product.findMany({
    take: 5,
    select: {
      name: true,
      images: true,
      category: { select: { slug: true } },
    },
  });
  console.log("Sample product images:");
  for (const p of sample) {
    console.log(`  [${p.category?.slug}] ${p.name}: ${String(p.images).slice(0, 100)}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
