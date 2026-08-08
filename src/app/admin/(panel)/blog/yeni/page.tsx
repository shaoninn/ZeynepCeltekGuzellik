import Link from "next/link";
import { BlogForm } from "../BlogForm";

export default function NewBlogPage() {
  return (
    <div>
      <Link href="/admin/blog" className="text-sm text-orange hover:underline mb-4 inline-block">
        ← Bloga dön
      </Link>
      <h1 className="font-display text-3xl font-bold mb-6">Yeni Yazı</h1>
      <BlogForm />
    </div>
  );
}
