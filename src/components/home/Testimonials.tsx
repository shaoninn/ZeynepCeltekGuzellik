"use client";

import { EditableText } from "@/components/editor/EditableText";

const DEFAULT = [
  {
    quote:
      "Protez tırnak uygulaması çok özenliydi. Sonuç tam istediğim gibi oldu, tekrar geleceğim.",
    name: "Misafir",
    place: "Adana",
  },
  {
    quote:
      "Ekip birebir ilgilendi. Hijyen ve iletişim süreci çok kolaydı, WhatsApp’tan hızlı yanıt aldım.",
    name: "Misafir",
    place: "Adana",
  },
  {
    quote:
      "Kalıcı makyaj uygulaması hijyen odaklı ve doğal sonuçluydu. Randevu süreci çok rahattı.",
    name: "Misafir",
    place: "Adana",
  },
];

export function Testimonials({
  googleReviewsUrl,
  sectionTitle,
  sectionDesc,
  sectionEyebrow,
  googleLinkLabel,
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
    <section className="py-16 lg:py-24 bg-card/20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <EditableText
            contentKey="testimonial_section_eyebrow"
            value={sectionEyebrow || "Referanslar"}
            as="p"
            block
            className="text-orange text-xs font-semibold tracking-[0.3em] uppercase mb-2"
            help="Referanslar üst etiketi"
            textStyle={styles?.testimonial_section_eyebrow}
          />
          <EditableText
            contentKey="testimonial_section_title"
            value={sectionTitle || "Misafirlerimizin deneyimi"}
            as="h2"
            block
            className="font-display text-2xl sm:text-3xl font-bold text-white mb-3"
            help="Referanslar bölüm başlığı"
            textStyle={styles?.testimonial_section_title}
          />
          <EditableText
            contentKey="testimonial_section_desc"
            value={
              sectionDesc ||
              "Gerçek misafir deneyimlerini paylaşıyoruz. Hizmet sonrası kısa bir yorum, sonraki misafirlere yol gösterir."
            }
            as="p"
            block
            multiline
            className="text-sm text-muted"
            help="Referanslar açıklama metni"
            textStyle={styles?.testimonial_section_desc}
          />
          {googleReviewsUrl ? (
            <a
              href={googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm text-orange hover:underline"
            >
              <EditableText
                contentKey="google_reviews_link_label"
                value={
                  googleLinkLabel ||
                  "Google’da yorumları gör / yorum bırak →"
                }
                as="span"
                className="text-orange"
                help="Google yorumları bağlantı yazısı"
                textStyle={styles?.google_reviews_link_label}
              />
            </a>
          ) : (
            <div className="mt-3">
              <EditableText
                contentKey="google_reviews_link_label"
                value={
                  googleLinkLabel ||
                  "Google’da yorumları gör / yorum bırak →"
                }
                as="span"
                className="text-sm text-orange"
                help="Google yorumları bağlantı yazısı (URL ayarlardan)"
                textStyle={styles?.google_reviews_link_label}
              />
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {list.map((t, index) => {
            const n = index + 1;
            return (
              <blockquote
                key={`t-${n}`}
                className="border border-border p-6 bg-black/40"
              >
                <EditableText
                  contentKey={`testimonial_${n}_quote`}
                  value={t.quote}
                  as="p"
                  block
                  multiline
                  className="text-sm text-white/90 leading-relaxed mb-6"
                  help={`Yorum ${n} metni`}
                  textStyle={styles?.[`testimonial_${n}_quote`]}
                />
                <footer className="text-xs text-muted space-y-1">
                  <EditableText
                    contentKey={`testimonial_${n}_name`}
                    value={t.name}
                    as="span"
                    className="text-orange font-semibold"
                    help={`Yorum ${n} isim / ünvan`}
                    textStyle={styles?.[`testimonial_${n}_name`]}
                  />
                  <span> · </span>
                  <EditableText
                    contentKey={`testimonial_${n}_place`}
                    value={t.place}
                    as="span"
                    help={`Yorum ${n} konum`}
                    textStyle={styles?.[`testimonial_${n}_place`]}
                  />
                </footer>
              </blockquote>
            );
          })}
        </div>
      </div>
    </section>
  );
}
