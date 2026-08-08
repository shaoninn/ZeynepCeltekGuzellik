import Link from "next/link";
import { prisma } from "@/lib/db";
import { Plus } from "lucide-react";
import { BlogDeleteButton } from "./BlogDeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Blog</h1>
          <p className="text-sm text-[#888] mt-1">
            Yayınlanmayan yazılar sitede görünmez.
          </p>
        </div>
        <Link
          href="/admin/blog/yeni"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange text-white text-sm font-semibold rounded-lg w-full sm:w-auto shrink-0"
        >
          <Plus size={16} /> Yeni Yazı
        </Link>
      </div>
      <div className="space-y-3">
        {posts.map((p) => (
          <div
            key={p.id}
            className="admin-card p-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center"
          >
            <div className="min-w-0">
              <p className="font-semibold break-words">{p.title}</p>
              <p className="text-xs text-[#666]">
                {p.isPublished ? "Yayında" : "Taslak"} · /blog/{p.slug}
              </p>
            </div>
            <div className="flex gap-3 text-sm shrink-0">
              <Link href={`/admin/blog/${p.id}`} className="text-orange">
                Düzenle
              </Link>
              <BlogDeleteButton id={p.id} title={p.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
