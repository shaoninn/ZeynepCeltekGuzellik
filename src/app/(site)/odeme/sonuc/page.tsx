import { SiteLink } from "@/components/ui/SiteLink";

export const metadata = {
  title: "Ödeme sonucu",
  robots: { index: false, follow: false },
};

export default async function PaymentResultPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; orderNo?: string }>;
}) {
  const { status, orderNo } = await searchParams;
  const ok = status === "ok" || status === "success";

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-lg mx-auto px-4 text-center">
        <p className="text-orange text-xs tracking-[0.2em] uppercase mb-3">
          PayTR
        </p>
        <h1 className="font-display text-3xl font-semibold text-cream mb-4">
          {ok ? "Ödeme alındı" : "Ödeme tamamlanamadı"}
        </h1>
        {orderNo ? (
          <p className="text-muted mb-2">
            Talep no:{" "}
            <span className="text-orange font-semibold">{orderNo}</span>
          </p>
        ) : null}
        <p className="text-muted mb-8">
          {ok
            ? "Kart ödemeniz PayTR üzerinden alındı. Randevu teyidi için ekibimiz sizinle iletişime geçecek."
            : "İşlem iptal edildi veya banka reddetti. Dilerseniz tekrar deneyin veya havale / WhatsApp ile devam edin."}
        </p>
        <div className="flex flex-col gap-3">
          {!ok && orderNo ? (
            <SiteLink
              href={`/odeme?orderNo=${encodeURIComponent(orderNo)}`}
              className="btn-primary justify-center"
            >
              Ödemeyi tekrar dene
            </SiteLink>
          ) : null}
          <SiteLink href="/tekliflerim" className="btn-outline justify-center">
            Taleplerim
          </SiteLink>
          <SiteLink href="/" className="text-orange text-sm hover:underline">
            Ana sayfa
          </SiteLink>
        </div>
      </div>
    </section>
  );
}
