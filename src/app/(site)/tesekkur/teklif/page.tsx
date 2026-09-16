import { SiteLink } from "@/components/ui/SiteLink";
import { branchWhatsAppUrl, branchLabel } from "@/lib/constants";
import { QuoteThanksTracker } from "@/components/analytics/ConversionTracker";

export const metadata = {
  title: "Talebiniz alındı",
  robots: { index: false, follow: false },
};

export default async function ThanksQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ orderNo?: string; branch?: string }>;
}) {
  const { orderNo, branch } = await searchParams;
  const wa = branchWhatsAppUrl(branch || "turgutozal");
  const waText = encodeURIComponent(
    orderNo
      ? `Merhaba, ${orderNo} numaralı randevu talebimi teyit etmek istiyorum.`
      : "Merhaba, randevu talebim hakkında bilgi almak istiyorum."
  );

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-lg mx-auto px-4 text-center">
        <QuoteThanksTracker />
        <p className="text-orange text-xs tracking-[0.2em] uppercase mb-3">
          Teşekkürler
        </p>
        <h1 className="font-display text-3xl font-semibold text-cream mb-4">
          Randevu talebiniz alındı
        </h1>
        {orderNo ? (
          <p className="text-muted mb-2">
            Talep no: <span className="text-orange font-semibold">{orderNo}</span>
          </p>
        ) : null}
        <p className="text-muted mb-8">
          {branchLabel(branch || "turgutozal")} ekibi en kısa sürede dönüş yapacak.
          Online ödeme yoktur.
        </p>
        <div className="flex flex-col gap-3">
          <a
            href={`${wa}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary justify-center"
          >
            WhatsApp ile teyit
          </a>
          <SiteLink href="/hizmetler" className="btn-outline justify-center">
            Hizmetlere dön
          </SiteLink>
          <SiteLink href="/tekliflerim" className="text-orange text-sm hover:underline">
            Talebinizi takip edin
          </SiteLink>
        </div>
      </div>
    </section>
  );
}
