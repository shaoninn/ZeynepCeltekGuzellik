"use client";

import { Button } from "@/components/ui/Button";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { EditableText } from "@/components/editor/EditableText";
import { EditableSectionShift } from "@/components/editor/EditableSectionShift";
import { BRANCHES, PHONE, WORK_HOURS } from "@/lib/constants";

interface CTASectionProps {
  title?: string;
  buttonLabel?: string;
  bannerImages?: string[];
  sectionOffset?: string;
  styles?: Record<string, string>;
}

export function CTASection({
  title,
  buttonLabel,
  sectionOffset = "0",
  styles,
}: CTASectionProps) {
  return (
    <EditableSectionShift
      settingKey="section_cta_offset"
      value={sectionOffset}
      label="CTA kaydır"
    >
      <section className="py-14 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto rounded-3xl border border-border bg-card overflow-hidden bg-marble">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-0">
            <div className="p-8 sm:p-10 lg:p-14 flex flex-col justify-center">
              <EditableText
                contentKey="cta_title"
                value={title || "Kendinizi şımartın, ışıldayın!"}
                as="h2"
                block
                className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-4 tracking-tight"
                help="Alt CTA başlığı"
                textStyle={styles?.cta_title}
              />
              <p className="text-muted text-sm sm:text-base mb-8 max-w-md leading-relaxed">
                Randevu için bize ulaşın; size uygun bakımı birlikte
                planlayalım. Özal ve Gazi Paşa şubelerimizde hizmetinizdeyiz.
              </p>
              <Button href="/iletisim" size="lg" className="w-full sm:w-auto justify-center">
                <EditableText
                  contentKey="cta_button_label"
                  value={buttonLabel || "Randevu Al"}
                  as="span"
                  help="CTA buton yazısı"
                  textStyle={styles?.cta_button_label}
                />
                <ArrowRight size={18} />
              </Button>
            </div>

            <div className="border-t lg:border-t-0 lg:border-l border-border p-8 sm:p-10 lg:p-14 bg-black/30 space-y-5">
              <h3 className="font-display text-sm font-semibold tracking-[0.18em] uppercase text-orange mb-2">
                İletişim
              </h3>
              <div className="space-y-4">
                {BRANCHES.map((branch) => (
                  <div key={branch.name} className="space-y-1.5">
                    <p className="flex items-start gap-3 text-sm text-white/85">
                      <MapPin size={16} className="mt-0.5 text-orange shrink-0" />
                      <span>
                        <span className="block text-cream">{branch.name}</span>
                        {branch.address}
                      </span>
                    </p>
                    {branch.phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:+90${phone.replace(/\D/g, "").replace(/^0/, "")}`}
                        className="flex items-start gap-3 text-sm text-white/85 hover:text-orange transition-colors pl-7"
                      >
                        {phone}
                        {phone === PHONE ? " · WhatsApp" : ""}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
              <p className="flex items-start gap-3 text-sm text-white/85">
                <Clock size={16} className="mt-0.5 text-orange shrink-0" />
                <span>
                  {WORK_HOURS.weekdays}
                  <br />
                  {WORK_HOURS.sunday}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </EditableSectionShift>
  );
}
