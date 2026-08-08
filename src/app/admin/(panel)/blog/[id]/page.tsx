import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { BlogForm } from "../BlogForm";

export const dynamic = "force-dynamic";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();
  return (
    <div>
      <Link href="/admin/blog" className="text-sm text-orange hover:underline mb-4 inline-block">
        ← Bloga dön
      </Link>
      <h1 className="font-display text-3xl font-bold mb-6">Yazı Düzenle</h1>
      <BlogForm initial={post} />
    </div>
  );
}
