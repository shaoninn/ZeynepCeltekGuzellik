import { EditableText } from "@/components/editor/EditableText";
import { toWebpSrc } from "@/lib/image-optimize";

interface GallerySectionProps {
  title?: string;
  images: string[];
}

export function GallerySection({
  title = "Salonumuzdan Kareler",
  images,
}: GallerySectionProps) {
  const list =
    images.length > 0
      ? images.slice(0, 5)
      : [
          "/images/gallery/gallery-1.jpg",
          "/images/gallery/gallery-2.jpg",
          "/images/gallery/gallery-3.jpg",
          "/images/gallery/gallery-4.jpg",
          "/images/gallery/gallery-5.jpg",
        ];

  return (
    <section className="py-14 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EditableText
          contentKey="gallery_section_title"
          value={title}
          as="h2"
          block
          className="font-display text-2xl sm:text-3xl font-semibold text-cream text-center mb-8 sm:mb-10 tracking-wide uppercase"
          help="Galeri bölümü başlığı"
        />
        <div className="mt-[-1.5rem] mb-8 mx-auto flex items-center justify-center gap-2">
          <span className="h-px w-16 bg-orange/70" />
          <span className="h-1.5 w-1.5 rotate-45 bg-orange" />
          <span className="h-px w-16 bg-orange/70" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          {list.map((src, i) => {
            const webp = toWebpSrc(src);
            return (
              <div
                key={`${src}-${i}`}
                className={`relative overflow-hidden rounded-sm bg-surface ${
                  i === 0 ? "col-span-2 md:col-span-2 aspect-[4/3] md:aspect-auto md:row-span-2 md:min-h-full" : "aspect-square"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={webp}
                  alt={`Galeri ${i + 1}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
