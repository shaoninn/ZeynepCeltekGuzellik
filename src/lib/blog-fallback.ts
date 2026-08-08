import { SAMPLE_BLOG_POSTS } from "@/lib/blog-data";

export type FallbackBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image: string | null;
  isPublished: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export function getFallbackBlogPosts(): FallbackBlogPost[] {
  const now = Date.now();
  return SAMPLE_BLOG_POSTS.map((post, i) => {
    const publishedAt = new Date(now - i * 86_400_000);
    return {
      id: `fallback-blog-${post.slug}`,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      isPublished: true,
      publishedAt,
      createdAt: publishedAt,
      updatedAt: publishedAt,
    };
  });
}

export function getFallbackBlogPostBySlug(slug: string) {
  return getFallbackBlogPosts().find((p) => p.slug === slug) ?? null;
}
