import { SiteLink } from "@/components/ui/SiteLink";
import { PHONE } from "@/lib/constants";
import { LandingLeadForm } from "@/components/leads/LandingLeadForm";
import { BranchWhatsAppButtons } from "@/components/leads/BranchWhatsAppButtons";
import { notFound } from "next/navigation";

const LANDINGS = {
  "lazer-epilasyon-adana": {
    title: "Adana Lazer Epilasyon Randevu",
    description:
      "Bayan ve erkek lazer epilasyon paketleri. Şeffaf fiyat, hijyenik ortam, WhatsApp ile hızlı randevu.",
    href: "/hizmetler/lazer-bayan",
    cta: "Lazer paketlerini gör",
    priceHint: "Paket fiyatları hizmet ve paket sayfalarında günceldir.",
  },
  "cilt-bakimi-adana": {
    title: "Adana Cilt Bakımı Randevu",
    description:
      "Hydrafacial, medikal bakım ve onarım. Gazi Paşa ve Turgut Özal şubeleri.",
    href: "/hizmetler/cilt-bakimi",
    cta: "Cilt bakımı hizmetleri",
    priceHint: "Klasik bakım, Hydrafacial ve paket seçenekleri listelenir.",
  },
  "alex-lazer-adana": {
    title: "Adana Epilyum Alex Lazer Randevu",
    description:
      "Epilyum Alex Alexandrite lazer: güçlü soğutma, cilt-kıl analizi ve kişiye özel protokol. 3–4 bölge paketleri, şeffaf fiyat.",
    href: "/hizmetler/alex-lazer",
    cta: "Epilyum Alex paketlerini gör",
    priceHint: "Güncel seans ve fiyat hizmet listesinde yer alır.",
  },
  "bolgesel-incelme-adana": {
    title: "Adana Bölgesel İncelme Randevu",
    description:
      "G5, Emslim ve G8 protokoller. Hedef bölgeye göre paket seçimi.",
    href: "/hizmetler/bolgesel-incelme",
    cta: "Bölgesel paketler",
    priceHint: "10 seans paketleri hizmet sayfasında listelenir.",
  },
  "kirpik-lifting-adana": {
    title: "Adana Kirpik Lifting Randevu",
    description:
      "Kirpik lifting ve kaş şekillendirme. Gazi Paşa ve Turgut Özal şubeleri.",
    href: "/hizmetler/kirpik-kas",
    cta: "Kirpik & kaş hizmetleri",
    priceHint: "Güncel fiyat kategori sayfasındadır.",
  },
} as const;

type Slug = keyof typeof LANDINGS;

export async function generateStaticParams() {
  return Object.keys(LANDINGS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lp = LANDINGS[slug as Slug];
  if (!lp) return { title: "Randevu" };
  return {
    title: lp.title,
    description: lp.description,
    alternates: { canonical: `/randevu/${slug}` },
  };
}

export default async function RandevuLanding({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lp = LANDINGS[slug as Slug];
  if (!lp) notFound();
  const waPrefill = `Merhaba, ${lp.title} için randevu istiyorum.`;

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-xl mx-auto px-4 text-center">
        <p className="text-orange text-xs tracking-[0.2em] uppercase mb-3">
          Adana
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-cream mb-4">
          {lp.title}
        </h1>
        <p className="text-muted mb-3">{lp.description}</p>
        <p className="text-xs text-muted mb-8">{lp.priceHint}</p>
        <div className="flex flex-col gap-3 mb-6">
          <BranchWhatsAppButtons prefill={waPrefill} />
          <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="btn-outline justify-center min-h-11">
            Ara: {PHONE}
          </a>
        </div>
        <LandingLeadForm subject={lp.title} />
        <div className="flex flex-col gap-3 mt-6">
          <SiteLink href={lp.href} className="btn-outline justify-center min-h-11">
            {lp.cta}
          </SiteLink>
          <SiteLink href="/iletisim" className="text-orange text-sm hover:underline">
            Tam iletişim formu
          </SiteLink>
        </div>
      </div>
    </section>
  );
}
