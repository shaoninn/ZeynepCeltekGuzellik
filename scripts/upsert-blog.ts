/**
 * Upsert & publish sample beauty-salon blog posts.
 *   ALLOW_PROD_SEED=true npm run db:upsert:blog
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { SAMPLE_BLOG_POSTS } from "../prisma/blog-data";
import { resolveMysqlDatabaseUrl } from "../src/lib/db-url";

const adapter = new PrismaMariaDb(resolveMysqlDatabaseUrl());
const prisma = new PrismaClient({ adapter });

async function main() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_PROD_SEED !== "true"
  ) {
    throw new Error("ALLOW_PROD_SEED=true gerekli (production).");
  }

  const now = new Date();
  for (const [i, post] of SAMPLE_BLOG_POSTS.entries()) {
    const publishedAt = new Date(now.getTime() - i * 86_400_000);
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        isPublished: true,
        publishedAt,
      },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        isPublished: true,
        publishedAt,
      },
    });
    console.log("Published:", post.slug);
  }

  console.log(
    "Done:",
    await prisma.blogPost.count({ where: { isPublished: true } }),
    "published"
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
