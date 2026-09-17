"use client";

import { EditableText } from "@/components/editor/EditableText";
import { SALON_FAQS } from "@/lib/faq";

export function FaqSection({
  sectionTitle,
  sectionEyebrow,
  items,
  styles,
}: {
  sectionTitle?: string;
  sectionEyebrow?: string;
  items?: { q: string; a: string }[];
  styles?: Record<string, string>;
}) {
  const list = SALON_FAQS.map((d, i) => ({
    q: items?.[i]?.q || d.q,
    a: items?.[i]?.a || d.a,
  }));

  return (
    <section className="py-16 lg:py-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <details className="group/faq border border-border bg-card/30 open:border-orange/40">
            <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0 text-left">
                <EditableText
                  contentKey="faq_section_eyebrow"
                  value={sectionEyebrow || "SSS"}
                  as="p"
                  block
                  className="text-orange text-[10px] font-semibold tracking-[0.28em] uppercase mb-1"
                  help="SSS üst etiketi"
                  textStyle={styles?.faq_section_eyebrow}
                />
                <EditableText
                  contentKey="faq_section_title"
                  value={sectionTitle || "Sık sorulan sorular"}
                  as="span"
                  className="font-display text-lg sm:text-xl font-semibold text-white"
                  help="SSS bölüm başlığı — tek satır"
                  textStyle={styles?.faq_section_title}
                />
              </div>
              <span
                aria-hidden
                className="text-orange text-xl leading-none shrink-0 transition-transform group-open/faq:rotate-45"
              >
                +
              </span>
            </summary>

            <div className="px-3 sm:px-4 pb-4 space-y-2 border-t border-border/60 pt-3">
              {list.map((item, index) => {
                const n = index + 1;
                return (
                  <details
                    key={`faq-${n}`}
                    className="group/item border border-border/80 bg-black/20 open:border-orange/35"
                  >
                    <summary className="cursor-pointer list-none px-4 py-3.5 font-medium text-white flex items-center justify-between gap-3 text-sm sm:text-[15px]">
                      <EditableText
                        contentKey={`faq_${n}_q`}
                        value={item.q}
                        as="span"
                        className="text-left leading-snug"
                        help={`Soru ${n}`}
                        textStyle={styles?.[`faq_${n}_q`]}
                      />
                      <span
                        aria-hidden
                        className="text-orange text-lg leading-none shrink-0 transition-transform group-open/item:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <div className="px-4 pb-4">
                      <EditableText
                        contentKey={`faq_${n}_a`}
                        value={item.a}
                        as="p"
                        block
                        multiline
                        className="text-sm text-muted leading-relaxed"
                        help={`Cevap ${n}`}
                        textStyle={styles?.[`faq_${n}_a`]}
                      />
                    </div>
                  </details>
                );
              })}
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
