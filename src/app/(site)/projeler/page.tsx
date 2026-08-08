import { SiteLink } from "@/components/ui/SiteLink";
import Image from "next/image";
import { MapPin, Images } from "lucide-react";
import { getActiveProjects } from "@/lib/catalog";
import { parseJsonArray } from "@/lib/utils";
import { getContentMap } from "@/lib/site-content";
import { PageIntro } from "@/components/editor/PageIntro";
import { CatalogAdminHint } from "@/components/editor/CatalogAdminHint";
import { EditableText } from "@/components/editor/EditableText";

export const revalidate = 60;


export const metadata = {
  alternates: { canonical: "/projeler" },
  title: "Galeri | Zeynep Çeltek Güzellik",
  description: "Salon uygulamalarından seçkiler.",
};

export default async function ProjectsPage() {
  const [projects, map] = await Promise.all([
    getActiveProjects(),
    getContentMap([
      "projects_eyebrow",
      "projects_title",
      "projects_intro",
      "projects_empty",
    ]),
  ]);

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrowKey="projects_eyebrow"
          titleKey="projects_title"
          introKey="projects_intro"
          eyebrow={map.projects_eyebrow || "Galeri"}
          title={map.projects_title || "Salon Galerisi"}
          intro={
            map.projects_intro ||
            "Salon uygulamalarından seçkiler. Galeri içeriği yakında güncellenecek."
          }
        />

        <CatalogAdminHint
          title="Proje kartları"
          adminHref="/admin/projeler"
          adminLabel="Admin → Projeler"
        />

        {projects.length === 0 ? (
          <EditableText
            contentKey="projects_empty"
            value={
              map.projects_empty ||
              "Henüz yayınlanmış galeri içeriği yok. Öğrenci çalışmaları yakında eklenecek."
            }
            as="p"
            block
            className="text-muted"
            help="Galeri boşken görünen mesaj"
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const count = Math.max(
                parseJsonArray<string>(project.images).length,
                project.image ? 1 : 0
              );
              return (
                <SiteLink
                  key={project.id}
                  href={`/projeler/${project.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-card border border-border group-hover:border-orange/50 transition-colors">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-card to-black">
                        <span className="font-display text-xl font-bold text-orange/30 uppercase">
                          {project.title}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    {count > 1 && (
                      <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/70 text-xs text-beige border border-border">
                        <Images size={12} />
                        {count}
                      </span>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h2 className="font-display text-base font-bold text-white uppercase tracking-wider mb-1">
                        {project.title}
                      </h2>
                      {project.location && (
                        <p className="flex items-center gap-1 text-xs text-muted">
                          <MapPin size={12} />
                          {project.location}
                        </p>
                      )}
                    </div>
                  </div>
                </SiteLink>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
