"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EditableText } from "@/components/editor/EditableText";
import { EditableImage } from "@/components/editor/EditableImage";

interface FacilitySectionProps {
  projects?: { image?: string | null }[];
  title?: string;
  body?: string;
  images?: string[];
}

const FALLBACKS = [
  "/images/about/about-1.jpg",
  "/images/about/about-2.jpg",
  "/images/about/about-3.jpg",
] as const;

export function FacilitySection({
  projects = [],
  title = "Modern, konforlu ve profesyonel ortam",
  body = "Hizmetlerimizi modern, hijyenik ve konforlu bir salon atmosferinde sunuyoruz. Profesyonel uygulamalar ve özenli bakım ile kendinizi özel hissedin.",
  images,
}: FacilitySectionProps) {
  const fromProjects = [
    projects[0]?.image,
    projects[1]?.image,
    projects[2]?.image,
  ].filter(Boolean) as string[];

  const main = images?.[0] || fromProjects[0] || FALLBACKS[0];
  const sideA = images?.[1] || fromProjects[1] || FALLBACKS[1];
  const sideB = images?.[2] || fromProjects[2] || FALLBACKS[2];

  return (
    <section className="bg-cream-section py-16 lg:py-22">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <EditableText
              contentKey="facility_title"
              value={title}
              as="h2"
              block
              className="font-display text-2xl sm:text-3xl lg:text-[2.1rem] font-semibold text-ink mb-4 tracking-tight"
              help="Salon ortamı başlığı"
            />
            <EditableText
              contentKey="facility_body"
              value={body}
              as="p"
              multiline
              block
              className="text-ink/70 text-sm sm:text-base leading-relaxed mb-8 max-w-lg"
              help="Salon ortamı açıklaması"
            />
            <Button
              href="/hakkimizda"
              variant="outline"
              className="!text-ink !border-ink/25 hover:!border-orange hover:!text-orange"
            >
              Salonu İncele
              <ArrowRight size={16} />
            </Button>
          </div>

          {/* Fixed-height mosaic: tall left + two stacked right — images must cover cells */}
          <div className="relative grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4 h-[22rem] sm:h-[28rem] lg:h-[32rem]">
            <div className="relative row-span-2 min-h-0 rounded-2xl overflow-hidden border border-ink/10 bg-[#ddd5c8]">
              <EditableImage
                contentKey="facility_image_1"
                value={main}
                fallback={FALLBACKS[0]}
                alt="Salon ortamı"
                fill
                sizes="(max-width: 1024px) 50vw, 28vw"
                imgClassName="object-cover object-center"
                help="Salon ana görsel (sol, dikey)"
              />
              <div className="pointer-events-none absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-orange bg-ink text-orange flex items-center justify-center text-center px-2 shadow-xl">
                <span className="font-display text-[10px] sm:text-xs font-semibold uppercase leading-tight tracking-wider">
                  Kalite
                  <br />
                  Güvencesi
                </span>
              </div>
            </div>

            <div className="relative min-h-0 rounded-2xl overflow-hidden border border-ink/10 bg-[#ddd5c8]">
              <EditableImage
                contentKey="facility_image_2"
                value={sideA}
                fallback={FALLBACKS[1]}
                alt="Salon detay"
                fill
                sizes="(max-width: 1024px) 45vw, 22vw"
                imgClassName="object-cover object-center"
                help="Salon üst sağ görsel"
              />
            </div>

            <div className="relative min-h-0 rounded-2xl overflow-hidden border border-ink/10 bg-[#ddd5c8]">
              <EditableImage
                contentKey="facility_image_3"
                value={sideB}
                fallback={FALLBACKS[2]}
                alt="Salon detay"
                fill
                sizes="(max-width: 1024px) 45vw, 22vw"
                imgClassName="object-cover object-center"
                help="Salon alt sağ görsel"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
