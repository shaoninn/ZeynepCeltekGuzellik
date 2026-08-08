import { notFound } from "next/navigation";
import Image from "next/image";
import { SiteLink } from "@/components/ui/SiteLink";
import { getPostBySlug } from "@/lib/catalog";

export const revalidate = 60;


interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return {
    alternates: { canonical: `/blog/${slug}` },
    title: `${slug.replace(/-/g, " ")} | Zeynep Çeltek Güzellik`,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.isPublished) notFound();

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="text-xs text-muted mb-6">
          <SiteLink href="/" className="hover:text-orange">
            Anasayfa
          </SiteLink>
          <span className="mx-2">/</span>
          <SiteLink href="/blog" className="hover:text-orange">
            Blog
          </SiteLink>
          <span className="mx-2">/</span>
          <span className="text-white">{post.title}</span>
        </nav>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
          {post.title}
        </h1>

        {post.publishedAt && (
          <p className="text-sm text-muted mb-8">
            {new Date(post.publishedAt).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}

        {post.image && (
          <div className="relative aspect-video mb-8 border border-border overflow-hidden bg-card">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <div className="prose-dark">
          {post.content.split("\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
