import type { Metadata } from "next";
import { SiteLink } from "@/components/ui/SiteLink";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Hizmet Bölgeleri",
  description:
    "Zeynep Çeltek Güzellik hizmet bölgesi: Adana ve çevresi güzellik salonu hizmetleri.",
  alternates: { canonical: "/hizmet-bolgeleri" },
};

const AREAS = [
  {
    title: "Adana Merkez",
    desc: "Salonumuz Adana’da. Yüz yüze hizmet, danışmanlık ve randevu görüşmeleri.",
  },
  {
    title: "Çukurova & Seyhan",
    desc: "Çukurova ve Seyhan bölgelerinden kolay ulaşım ile randevu alınabilir.",
  },
  {
    title: "Yüreğir & Sarıçam",
    desc: "Yüreğir ve Sarıçam’dan gelen misafirlerimiz için hizmet ve bakım desteği.",
  },
  {
    title: "Çevre İlçeler",
    desc: "Adana çevre ilçelerinden gelen misafirler için randevu ve hizmet bilgisi sunuyoruz.",
  },
];

export default function ServiceAreasPage() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-orange text-xs font-semibold tracking-[0.3em] uppercase mb-2">
          Hizmet alanları
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
          Adana’da güzellik salonu
        </h1>
        <p className="text-muted max-w-2xl mb-12">
          Zeynep Çeltek Güzellik, Adana merkez ve çevre bölgelerden gelen
          misafirlerine profesyonel güzellik hizmetleri sunar. Hizmet detayları
          için hizmetler sayfasına bakın veya iletişime geçin.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {AREAS.map((area) => (
            <div
              key={area.title}
              className="border border-border p-6 bg-card rounded-xl"
            >
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={18} className="text-orange" />
                <h2 className="font-display text-lg font-bold text-white">
                  {area.title}
                </h2>
              </div>
              <p className="text-sm text-muted leading-relaxed">{area.desc}</p>
            </div>
          ))}
        </div>

        <Button href="/iletisim" variant="primary">
          İletişime geç
        </Button>
        <p className="mt-4 text-sm text-muted">
          <SiteLink href="/hizmetler" className="text-orange hover:underline">
            Hizmetleri incele →
          </SiteLink>
        </p>
      </div>
    </section>
  );
}
