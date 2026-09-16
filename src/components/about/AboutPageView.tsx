"use client";

import { Package, Clock, Users, Sparkles, MapPin, ArrowUpRight } from "lucide-react";
import { StatsBar, type StatItem } from "@/components/home/StatsBar";
import { EditableText } from "@/components/editor/EditableText";
import { EditableImage } from "@/components/editor/EditableImage";
import { SiteLink } from "@/components/ui/SiteLink";
import { CATEGORIES, resolveBranches, type BranchInfo } from "@/lib/constants";

const DEFAULT_IMAGES = [
  "/images/about/about-1.jpg",
  "/images/about/about-2.jpg",
  "/images/about/about-3.jpg",
  "/images/about/about-4.jpg",
];

const VALUE_ICONS = [Package, Clock, Users, Sparkles] as const;

export type AboutPageData = {
  headline: string;
  intro: string;
  philosophy: string;
  mission: string;
  vision: string;
  whyUs: string;
  values: { key: string; title: string; desc: string }[];
  images: string[];
  stats?: StatItem[];
};

export function AboutPageView({
  data,
  googleReviewsUrl,
  branches = resolveBranches(),
}: {
  data: AboutPageData;
  googleReviewsUrl?: string;
  branches?: BranchInfo[];
}) {
  return (
    <>
      <section className="py-12 sm:py-14 lg:py-16 bg-marble">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-orange text-[11px] font-semibold tracking-[0.28em] uppercase mb-2">
              Hakkımızda
            </p>
            <EditableText
              contentKey="about_headline"
              value={data.headline}
              as="h1"
              block
              multiline
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-5 whitespace-pre-line"
              help="Hakkımızda ana başlık. Satır kırmak için Enter kullanın."
            />
            <EditableText
              contentKey="about_intro"
              value={data.intro}
              as="p"
              block
              multiline
              className="text-muted leading-relaxed whitespace-pre-line"
              help="Hakkımızda giriş paragrafı"
            />
          </div>
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {DEFAULT_IMAGES.map((fallback, i) => {
              const n = i + 1;
              const src = data.images[i] || fallback;
              return (
                <EditableImage
                  key={`about-img-${n}`}
                  contentKey={`about_image_${n}`}
                  value={src}
                  fallback={fallback}
                  alt={`Zeynep Çeltek Güzellik ${n}`}
                  aspectClass="aspect-[4/3]"
                  imgClassName="object-cover object-center"
                  className="border border-border overflow-hidden bg-card rounded-lg"
                  help={`Hakkımızda galeri görseli ${n}`}
                />
              );
            })}
          </div>
        </div>
      </section>

      <StatsBar items={data.stats} />

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
              Felsefemiz / Çalışma İlkelerimiz
            </h2>
            <EditableText
              contentKey="about_philosophy"
              value={data.philosophy}
              as="p"
              block
              multiline
              className="text-muted max-w-2xl mx-auto whitespace-pre-line"
              help="Çalışma ilkeleri açıklaması"
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.values.map((value, index) => {
              const Icon = VALUE_ICONS[index % VALUE_ICONS.length];
              return (
                <div
                  key={value.key}
                  className="p-6 bg-card border border-border hover:border-orange/30 transition-colors"
                >
                  <Icon size={32} className="text-orange mb-4" strokeWidth={1.5} />
                  <EditableText
                    contentKey={value.key}
                    value={value.title}
                    editField="title"
                    pairedContent={value.desc}
                    as="h3"
                    block
                    className="font-display text-lg font-bold text-white mb-2"
                    help={`Değer ${index + 1} başlığı`}
                  />
                  <EditableText
                    contentKey={value.key}
                    value={value.desc}
                    as="p"
                    block
                    multiline
                    className="text-sm text-muted leading-relaxed whitespace-pre-line"
                    help={`Değer ${index + 1} açıklaması`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-2xl font-bold text-orange mb-4">
                Misyonumuz
              </h2>
              <EditableText
                contentKey="mission"
                value={data.mission}
                as="p"
                block
                multiline
                className="text-muted leading-relaxed whitespace-pre-line"
                help="Misyon metni"
              />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-orange mb-4">
                Vizyonumuz
              </h2>
              <EditableText
                contentKey="vision"
                value={data.vision}
                as="p"
                block
                multiline
                className="text-muted leading-relaxed whitespace-pre-line"
                help="Vizyon metni"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
            Neden Zeynep Çeltek?
          </h2>
          <EditableText
            contentKey="about_why_us"
            value={data.whyUs}
            as="p"
            block
            multiline
            className="text-muted leading-relaxed max-w-3xl whitespace-pre-line mb-6"
            help="Neden biz açıklaması"
          />
          {googleReviewsUrl ? (
            <a
              href={googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex mb-12 text-orange text-sm font-semibold hover:underline"
            >
              Google yorumları →
            </a>
          ) : (
            <p className="text-xs text-muted mb-12">
              Google İşletme yorum linki Ayarlar’dan eklenebilir.
            </p>
          )}

          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <h3 className="font-display text-xl font-semibold text-orange mb-5">
                Şubelerimiz
              </h3>
              <ul className="space-y-5">
                {branches.map((branch) => (
                  <li
                    key={branch.name}
                    className="border border-border bg-card p-5"
                  >
                    <p className="font-display text-lg font-semibold text-cream mb-2 flex items-start gap-2">
                      <MapPin size={18} className="text-orange shrink-0 mt-0.5" />
                      {branch.name}
                    </p>
                    <p className="text-sm text-muted leading-relaxed mb-2">
                      {branch.address}
                    </p>
                    <p className="text-sm text-cream">
                      {branch.phones.join(" · ")}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-display text-xl font-semibold text-orange mb-5">
                Hizmet alanlarımız
              </h3>
              <ul className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <li key={cat.slug}>
                    <SiteLink
                      href={`/hizmetler/${cat.slug}`}
                      className="flex items-center justify-between gap-3 border border-border bg-card px-4 py-3 text-cream hover:border-orange/40 hover:text-orange transition-colors"
                    >
                      <span>{cat.name}</span>
                      <ArrowUpRight size={16} className="shrink-0 opacity-70" />
                    </SiteLink>
                  </li>
                ))}
              </ul>
              <SiteLink
                href="/hizmetler"
                className="inline-flex mt-4 text-sm text-orange font-semibold hover:underline"
              >
                Tüm hizmetleri gör →
              </SiteLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
