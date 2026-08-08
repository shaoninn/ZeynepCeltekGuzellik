/**
 * Replace DMD leftover projects with Global portfolio images + fix hero_image.
 * Run: npx tsx scripts/sync-portfolio.ts
 */
import "dotenv/config";
import { prisma } from "../src/lib/db";
import { projectData } from "../prisma/projects-data";

const HERO = "/images/hero/hero-global.png";

async function main() {
  const deleted = await prisma.project.deleteMany({});
  console.log("Deleted projects:", deleted.count);

  const categories = await prisma.category.findMany({
    select: { id: true, slug: true },
  });
  const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  for (const [index, project] of projectData.entries()) {
    await prisma.project.create({
      data: {
        title: project.title,
        slug: project.slug,
        location: project.location,
        description: project.description,
        image: project.image,
        images: JSON.stringify([...project.images]),
        categoryId: categoryMap[project.categorySlug] || null,
        sortOrder: index,
        isActive: true,
        isFeatured: index < 8,
      },
    });
  }
  console.log("Created projects:", projectData.length);

  await prisma.siteContent.upsert({
    where: { key: "hero_image" },
    create: {
      key: "hero_image",
      title: "Hero Görsel",
      content: HERO,
    },
    update: { content: HERO, title: "Hero Görsel" },
  });
  console.log("hero_image ->", HERO);

  const blogPosts = await prisma.blogPost.findMany({
    select: { id: true, image: true },
  });
  const blogImages = [
    "/images/portfolio/cmk-ecu-completed.png",
    "/images/portfolio/gulbag-totem-3.png",
    "/images/portfolio/arac-1.png",
  ];
  for (let i = 0; i < blogPosts.length; i++) {
    const post = blogPosts[i];
    if (!post) continue;
    const img = blogImages[i % blogImages.length]!;
    if (post.image?.includes("/images/projects/work-")) {
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { image: img },
      });
      console.log("Blog image fixed:", post.id);
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
