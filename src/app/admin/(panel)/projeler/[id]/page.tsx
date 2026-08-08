import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProjectForm } from "../ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, categories] = await Promise.all([
    prisma.project.findUnique({ where: { id } }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  if (!project) notFound();

  return (
    <div>
      <Link href="/admin/projeler" className="text-sm text-orange hover:underline mb-4 inline-block">
        ← Projelere dön
      </Link>
      <h1 className="font-display text-3xl font-bold mb-6">Proje Düzenle</h1>
      <ProjectForm categories={categories} initial={project} />
    </div>
  );
}
