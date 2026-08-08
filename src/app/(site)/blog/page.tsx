import { SiteLink } from "@/components/ui/SiteLink";
import Image from "next/image";
import { getPublishedPosts } from "@/lib/catalog";
import { getContentMap } from "@/lib/site-content";
import { PageIntro } from "@/components/editor/PageIntro";
import { CatalogAdminHint } from "@/components/editor/CatalogAdminHint";
import { EditableText } from "@/components/editor/EditableText";

export const revalidate = 60;


export const metadata = {
  alternates: { canonical: "/blog" },
  title: "Blog",
  description: "Güzellik eğitimi, bakım ve meslek hakkında bilgilendirici yazılar.",
};

export default async function BlogPage() {
  const [posts, map] = await Promise.all([
    getPublishedPosts(),
    getContentMap([
      "blog_eyebrow",
      "blog_title",
      "blog_intro",
      "blog_empty",
    ]),
  ]);

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrowKey="blog_eyebrow"
          titleKey="blog_title"
          introKey="blog_intro"
          eyebrow={map.blog_eyebrow || "Blog"}
          title={map.blog_title || "Haberler & Yazılar"}
          intro={
            map.blog_intro ||
            "Güzellik eğitimi, bakım teknikleri ve meslek hakkında bilgilendirici içerikler."
          }
        />

        <CatalogAdminHint
          title="Blog yazıları"
          adminHref="/admin/blog"
          adminLabel="Admin → Blog"
        />

        {posts.length === 0 ? (
          <EditableText
            contentKey="blog_empty"
            value={map.blog_empty || "Henüz yayınlanmış yazı yok."}
            as="p"
            block
            className="text-muted"
            help="Yazı yokken görünen mesaj"
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <SiteLink
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block bg-card border border-border hover:border-orange/50 transition-all"
              >
                <div className="relative aspect-video bg-black overflow-hidden">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-lg font-bold text-orange/20 uppercase px-4 text-center">
                        {post.title}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h2 className="font-display text-base font-bold text-white group-hover:text-orange transition-colors mb-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-muted line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  {post.publishedAt && (
                    <p className="text-xs text-muted mt-3">
                      {new Date(post.publishedAt).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </SiteLink>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
