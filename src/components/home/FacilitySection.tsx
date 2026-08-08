"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EditableText } from "@/components/editor/EditableText";
import { EditableImage } from "@/components/editor/EditableImage";
import type { ProjectListItem } from "@/lib/catalog";

interface FacilitySectionProps {
  projects: ProjectListItem[];
  title?: string;
  body?: string;
}

const FALLBACK = "/images/about/about-1.jpg";

export function FacilitySection({
  projects,
  title = "Modern, konforlu ve profesyonel ortam",
  body = "Hizmetlerimizi modern, hijyenik ve konforlu bir salon atmosferinde sunuyoruz. Profesyonel uygulamalar ve özenli bakım ile kendinizi özel hissedin.",
}: FacilitySectionProps) {
  const shots = [
    projects[0]?.image,
    projects[1]?.image,
    projects[2]?.image,
  ].filter(Boolean) as string[];

  const main = shots[0] || FALLBACK;
  const sideA = shots[1] || FALLBACK;
  const sideB = shots[2] || FALLBACK;

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

          <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
            <div className="relative col-span-2 aspect-[16/10] rounded-2xl overflow-hidden border border-ink/10">
              <EditableImage
                contentKey="facility_image_1"
                value={main}
                fallback={FALLBACK}
                alt="Salon ortamı"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                imgClassName="object-cover"
                help="Salon ana görsel"
              />
              <div className="absolute -bottom-3 -right-3 sm:bottom-4 sm:right-4 w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-orange bg-ink text-orange flex items-center justify-center text-center px-2 shadow-xl">
                <span className="font-display text-[10px] sm:text-xs font-semibold uppercase leading-tight tracking-wider">
                  Kalite
                  <br />
                  Güvencesi
                </span>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-ink/10">
              <Image
                src={sideA}
                alt="Salon detay"
                fill
                className="object-cover"
                sizes="25vw"
                loading="lazy"
              />
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-ink/10">
              <Image
                src={sideB}
                alt="Salon detay"
                fill
                className="object-cover"
                sizes="25vw"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
