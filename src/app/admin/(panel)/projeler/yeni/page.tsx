import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProjectForm } from "../ProjectForm";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true },
  });
  return (
    <div>
      <Link href="/admin/projeler" className="text-sm text-orange hover:underline mb-4 inline-block">
        ← Projelere dön
      </Link>
      <h1 className="font-display text-3xl font-bold mb-6">Yeni Proje</h1>
      <ProjectForm categories={categories} />
    </div>
  );
}
