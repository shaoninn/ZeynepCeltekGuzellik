"use client";

import { EditableText } from "@/components/editor/EditableText";

const DEFAULT_STEPS = [
  {
    n: "01",
    title: "Ön Görüşme",
    desc: "İhtiyacınızı ve uygun hizmeti birlikte netleştiririz.",
  },
  {
    n: "02",
    title: "Randevu & Plan",
    desc: "Hizmet içeriği, süre ve ödeme planını şeffaf şekilde paylaşırız.",
  },
  {
    n: "03",
    title: "Uygulama",
    desc: "Profesyonel uygulama ile salonda hizmetinizi alırsınız.",
  },
  {
    n: "04",
    title: "Bakım & Destek",
    desc: "Uygulama sonrası bakım önerileri ve destek devam eder.",
  },
];

export type ProcessStepItem = {
  n?: string;
  title: string;
  desc: string;
};

export function ProcessSteps({
  sectionTitle,
  sectionDesc,
  sectionEyebrow,
  steps,
  styles,
}: {
  sectionTitle?: string;
  sectionDesc?: string;
  sectionEyebrow?: string;
  steps?: ProcessStepItem[];
  styles?: Record<string, string>;
}) {
  const list = DEFAULT_STEPS.map((d, i) => ({
    n: steps?.[i]?.n || d.n,
    title: steps?.[i]?.title || d.title,
    desc: steps?.[i]?.desc || d.desc,
  }));

  return (
    <section className="py-10 lg:py-14 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <EditableText
            contentKey="process_section_eyebrow"
            value={sectionEyebrow || "Süreç"}
            as="p"
            block
            className="font-display text-orange text-xs font-semibold tracking-[0.22em] uppercase mb-2"
            help="Süreç bölümü üst etiketi"
            textStyle={styles?.process_section_eyebrow}
          />
          <EditableText
            contentKey="process_section_title"
            value={sectionTitle || "Randevudan bakıma net adımlar"}
            as="h2"
            block
            className="font-display text-2xl sm:text-3xl font-bold text-white mb-3"
            help="Süreç bölümü başlığı"
            textStyle={styles?.process_section_title}
          />
          <EditableText
            contentKey="process_section_desc"
            value={
              sectionDesc ||
              "Randevu sürecini baştan sona sizinle birlikte yönetiyoruz; her adım net ve planlı."
            }
            as="p"
            block
            multiline
            className="text-muted text-sm leading-relaxed"
            help="Süreç bölümü kısa açıklama"
            textStyle={styles?.process_section_desc}
          />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map((step, index) => {
            const n = index + 1;
            return (
              <div key={`process-${n}`} className="border border-border p-5 bg-card/40">
                <EditableText
                  contentKey={`process_${n}_number`}
                  value={step.n || `0${n}`}
                  as="p"
                  block
                  className="font-display text-3xl font-bold text-orange/40 mb-3"
                  help={`Adım ${n} numarası (01, 02…)`}
                  textStyle={styles?.[`process_${n}_number`]}
                />
                <EditableText
                  contentKey={`process_${n}_title`}
                  value={step.title}
                  as="h3"
                  block
                  className="font-display text-base font-bold text-white mb-2"
                  help={`Adım ${n} başlığı`}
                  textStyle={styles?.[`process_${n}_title`]}
                />
                <EditableText
                  contentKey={`process_${n}_desc`}
                  value={step.desc}
                  as="p"
                  block
                  multiline
                  className="text-sm text-muted leading-relaxed"
                  help={`Adım ${n} açıklaması`}
                  textStyle={styles?.[`process_${n}_desc`]}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
