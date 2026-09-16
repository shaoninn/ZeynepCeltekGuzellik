"use client";

import { Star } from "lucide-react";
import { EditableText } from "@/components/editor/EditableText";

const DEFAULT = [
  {
    quote:
      "Cilt bakımı sonrası cildim gerçekten ferahladı. Ortam çok temiz, ekip ilgiliydi.",
    name: "Seda Y.",
    place: "Adana",
  },
  {
    quote:
      "Lazer epilasyon seanslarım düzenli ilerledi. Fiyatlar net, iletişim hızlıydı.",
    name: "Melike A.",
    place: "Adana",
  },
  {
    quote:
      "G5 paketimi tamamladım; sonuçtan memnunum. Randevu WhatsApp’tan çok kolaydı.",
    name: "Dilek K.",
    place: "Adana",
  },
];

export function Testimonials({
  googleReviewsUrl,
  sectionTitle,
  items,
  styles,
}: {
  googleReviewsUrl?: string;
  sectionTitle?: string;
  sectionDesc?: string;
  sectionEyebrow?: string;
  googleLinkLabel?: string;
  items?: { quote: string; name: string; place: string }[];
  styles?: Record<string, string>;
}) {
  const list = DEFAULT.map((d, i) => ({
    quote: items?.[i]?.quote || d.quote,
    name: items?.[i]?.name || d.name,
    place: items?.[i]?.place || d.place,
  }));

  return (
    <section className="py-12 sm:py-14 lg:py-16 bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <EditableText
            contentKey="testimonial_section_title"
            value={sectionTitle || "Müşterilerimiz Ne Diyor?"}
            as="h2"
            block
            className="section-title text-xl sm:text-2xl lg:text-3xl text-cream"
            help="Yorumlar bölüm başlığı"
            textStyle={styles?.testimonial_section_title}
          />
          <div className="section-ornament">
            <span className="section-ornament-dot" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-5 items-stretch">
          {list.map((t, index) => {
            const n = index + 1;
            const featured = n === 2;
            return (
              <blockquote
                key={`t-${n}`}
                className={`p-6 sm:p-7 border flex flex-col ${
                  featured
                    ? "bg-card border-orange/40 md:-translate-y-1"
                    : "bg-black/30 border-border"
                }`}
              >
                <div className="flex gap-0.5 text-orange mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <EditableText
                  contentKey={`testimonial_${n}_quote`}
                  value={t.quote}
                  as="p"
                  block
                  multiline
                  className="text-sm text-white/85 leading-relaxed mb-6 flex-1"
                  help={`Yorum ${n} metni`}
                  textStyle={styles?.[`testimonial_${n}_quote`]}
                />
                <footer className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-orange/20 border border-orange/40 flex items-center justify-center text-orange text-xs font-bold">
                    {t.name.slice(0, 1)}
                  </span>
                  <div>
                    <EditableText
                      contentKey={`testimonial_${n}_name`}
                      value={t.name}
                      as="span"
                      className="block text-orange text-sm font-semibold uppercase tracking-wide"
                      help={`Yorum ${n} isim`}
                      textStyle={styles?.[`testimonial_${n}_name`]}
                    />
                    <EditableText
                      contentKey={`testimonial_${n}_place`}
                      value={t.place}
                      as="span"
                      className="text-xs text-muted"
                      help={`Yorum ${n} konum`}
                      textStyle={styles?.[`testimonial_${n}_place`]}
                    />
                  </div>
                </footer>
              </blockquote>
            );
          })}
        </div>
        {googleReviewsUrl ? (
          <p className="text-center mt-8">
            <a
              href={googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange text-sm font-semibold hover:underline"
            >
              Google yorumları →
            </a>
          </p>
        ) : (
          <p className="text-center mt-8 text-xs text-muted">
            Örnek yorumlar. Google İşletme linki Ayarlar’dan eklenebilir.
          </p>
        )}
      </div>
    </section>
  );
}
