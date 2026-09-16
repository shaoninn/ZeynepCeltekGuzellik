import type { Metadata } from "next";
import { SiteLink } from "@/components/ui/SiteLink";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getSiteSettings } from "@/lib/site";
import { resolveBranches } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Hizmet Bölgeleri",
  description:
    "Zeynep Çeltek Güzellik hizmet bölgesi: Adana Gazi Paşa ve Turgut Özal şubeleri.",
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

export default async function ServiceAreasPage() {
  const settings = await getSiteSettings();
  const branches = resolveBranches({
    gazipasaAddress: settings.branchGazipasaAddress,
    gazipasaPhone: settings.branchGazipasaPhone,
    turgutozalAddress: settings.branchTurgutozalAddress,
    turgutozalPhone: settings.branchTurgutozalPhone,
  });

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
          Zeynep Çeltek Güzellik, Adana’da Gazi Paşa ve Turgut Özal şubelerinde
          hizmet verir. Hizmet detayları için hizmetler sayfasına bakın veya
          iletişime geçin.
        </p>

        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {branches.map((b) => {
            const embed = `https://www.google.com/maps?q=${encodeURIComponent(b.mapQuery)}&z=17&hl=tr&output=embed`;
            const open = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.mapQuery)}`;
            return (
              <div
                key={b.name}
                className="border border-border p-6 bg-card rounded-xl"
              >
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={18} className="text-orange" />
                  <h2 className="font-display text-lg font-bold text-white">
                    {b.name}
                  </h2>
                </div>
                <p className="text-sm text-muted leading-relaxed mb-2">
                  {b.address}
                </p>
                <p className="text-sm text-cream/80 mb-4">
                  {b.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:+90${phone.replace(/\D/g, "").replace(/^0/, "")}`}
                      className="block hover:text-orange"
                    >
                      {phone}
                    </a>
                  ))}
                </p>
                <iframe
                  title={`${b.name} harita`}
                  src={embed}
                  className="w-full h-48 rounded-lg border border-border mb-3"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href={open}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-orange hover:underline"
                >
                  Google Haritalar’da aç →
                </a>
              </div>
            );
          })}
        </div>

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
