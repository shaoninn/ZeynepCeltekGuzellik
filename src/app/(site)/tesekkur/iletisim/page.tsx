import { SiteLink } from "@/components/ui/SiteLink";
import { branchWhatsAppUrl } from "@/lib/constants";
import { ContactThanksTracker } from "@/components/analytics/ConversionTracker";

export const metadata = {
  title: "Mesajınız alındı",
  robots: { index: false, follow: false },
};

export default async function ThanksContactPage({
  searchParams,
}: {
  searchParams: Promise<{ branch?: string }>;
}) {
  const { branch } = await searchParams;
  const wa = branchWhatsAppUrl(branch || "turgutozal");
  const waText = encodeURIComponent(
    "Merhaba, iletişim formundan yazmıştım. Randevu için dönüş bekliyorum."
  );

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-lg mx-auto px-4 text-center">
        <ContactThanksTracker />
        <p className="text-orange text-xs tracking-[0.2em] uppercase mb-3">
          Teşekkürler
        </p>
        <h1 className="font-display text-3xl font-semibold text-cream mb-4">
          Mesajınız bize ulaştı
        </h1>
        <p className="text-muted mb-8">
          En kısa sürede telefon veya WhatsApp üzerinden dönüş yapacağız.
        </p>
        <div className="flex flex-col gap-3">
          <a
            href={`${wa}?text=${waText}`}
            className="btn-primary justify-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
          <SiteLink href="/" className="btn-outline justify-center">
            Ana sayfa
          </SiteLink>
        </div>
      </div>
    </section>
  );
}
