import Link from "next/link";
import { prisma } from "@/lib/db";
import { Plus } from "lucide-react";
import { ProjectDeleteButton } from "./ProjectDeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    include: { category: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Projeler</h1>
          <p className="text-sm text-[#888] mt-1">
            Ana sayfa kaydırıcısı ve /projeler sayfasında görünür. &quot;Öne
            çıkan&quot; işaretlenenler ana sayfada listelenir.
          </p>
        </div>
        <Link
          href="/admin/projeler/yeni"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange text-white text-sm font-semibold rounded-lg shrink-0 w-full sm:w-auto"
        >
          <Plus size={16} /> Yeni Proje
        </Link>
      </div>

      <div className="space-y-3">
        {projects.map((p) => (
          <div
            key={p.id}
            className="admin-card p-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center"
          >
            <div className="min-w-0">
              <p className="font-semibold text-white break-words">
                {p.title}{" "}
                {p.isFeatured && (
                  <span className="text-xs text-orange ml-2">Öne çıkan</span>
                )}
              </p>
              <p className="text-xs text-[#666]">
                {p.location || "—"} · {p.category?.name || "Kategorisiz"} ·{" "}
                {p.isActive ? "Aktif" : "Pasif"}
              </p>
            </div>
            <div className="flex gap-3 text-sm shrink-0">
              <Link href={`/admin/projeler/${p.id}`} className="text-orange">
                Düzenle
              </Link>
              <ProjectDeleteButton id={p.id} title={p.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
