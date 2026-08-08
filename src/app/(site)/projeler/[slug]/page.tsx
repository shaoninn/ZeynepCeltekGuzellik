import { notFound } from "next/navigation";
import { MapPin, ArrowRight } from "lucide-react";
import { SiteLink } from "@/components/ui/SiteLink";
import { getProjectBySlug } from "@/lib/catalog";
import { parseJsonArray } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { BeforeAfterSlider } from "@/components/projects/BeforeAfterSlider";
import { getContentMap } from "@/lib/site-content";
import { EditableText } from "@/components/editor/EditableText";
import { CatalogAdminHint } from "@/components/editor/CatalogAdminHint";

export const revalidate = 60;


interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return {
    alternates: { canonical: `/projeler/${slug}` },
    title: `${slug.replace(/-/g, " ")} | Zeynep Çeltek Güzellik`,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [project, map] = await Promise.all([
    getProjectBySlug(slug),
    getContentMap([
      "project_detail_eyebrow",
      "project_gallery_hint",
      "project_quote_cta",
      "project_back_link",
      "project_products_suffix",
    ]),
  ]);

  if (!project || !project.isActive) notFound();

  const gallery = parseJsonArray<string>(project.images);
  const images = Array.from(
    new Set(
      [
        ...gallery,
        ...(project.image ? [project.image] : []),
      ].filter(Boolean)
    )
  );
  if (project.image && images[0] !== project.image) {
    const rest = images.filter((src) => src !== project.image);
    images.splice(0, images.length, project.image, ...rest);
  }

  const hintTemplate =
    map.project_gallery_hint ||
    "Bu projede {count} görsel · oklarla veya alttaki küçük resimlerle gezinin; birkaç saniyede otomatik kayar.";
  const galleryHint = hintTemplate.replace("{count}", String(images.length));
  const afterUrl = project.image || images[0] || null;
  const showBeforeAfter = Boolean(project.imageBefore && afterUrl);

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CatalogAdminHint
          title="Proje başlığı / görseller / açıklama"
          adminHref="/admin/projeler"
          adminLabel="Admin → Projeler"
        />

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            {showBeforeAfter && project.imageBefore && afterUrl ? (
              <BeforeAfterSlider
                beforeUrl={project.imageBefore}
                afterUrl={afterUrl}
                alt={project.title}
              />
            ) : (
              <ProjectGallery title={project.title} images={images} />
            )}
            {showBeforeAfter && images.length > 1 ? (
              <ProjectGallery title={project.title} images={images} />
            ) : null}
          </div>

          <div>
            <EditableText
              contentKey="project_detail_eyebrow"
              value={map.project_detail_eyebrow || "Proje"}
              as="p"
              block
              className="text-orange text-xs font-semibold tracking-[0.3em] uppercase mb-2"
              help="Proje detay üst etiketi"
            />
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              {project.title}
            </h1>
            {project.location && (
              <p className="flex items-center gap-2 text-muted mb-6">
                <MapPin size={16} className="text-orange" />
                {project.location}
              </p>
            )}
            {project.description && (
              <p className="text-muted leading-relaxed mb-8 whitespace-pre-line">
                {project.description}
              </p>
            )}
            {images.length > 1 && (
              <EditableText
                contentKey="project_gallery_hint"
                value={hintTemplate}
                as="p"
                block
                multiline
                className="text-xs text-muted mb-6"
                help="Galeri ipucu. Metinde {count} yazın — görsel sayısı otomatik basılır."
              >
                {galleryHint}
              </EditableText>
            )}

            <div className="flex flex-wrap gap-3">
              {project.category && (
                <Button href={`/hizmetler/${project.category.slug}`}>
                  {project.category.name}{" "}
                  <EditableText
                    contentKey="project_products_suffix"
                    value={map.project_products_suffix || "Ürünleri"}
                    as="span"
                    help="Kategori CTA son eki (örn. Ürünleri)"
                  />
                  <ArrowRight size={16} />
                </Button>
              )}
              <Button href="/iletisim" variant="outline">
                <EditableText
                  contentKey="project_quote_cta"
                  value={map.project_quote_cta || "Benzer Proje Teklifi Al"}
                  as="span"
                  help="Proje detay teklif butonu"
                />
              </Button>
            </div>
            <p className="mt-8 text-sm text-muted">
              <SiteLink href="/projeler" className="text-orange hover:underline">
                <EditableText
                  contentKey="project_back_link"
                  value={map.project_back_link || "← Tüm projelere dön"}
                  as="span"
                  help="Projelere dönüş linki"
                />
              </SiteLink>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
