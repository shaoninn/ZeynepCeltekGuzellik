import { SiteLink } from "@/components/ui/SiteLink";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { getSiteSettings } from "@/lib/site";
import { isPaytrConfigured, isPaytrUiEnabled } from "@/lib/paytr";
import { PaytrCheckoutButton } from "@/components/payments/PaytrCheckoutButton";

export const dynamic = "force-dynamic";

export const metadata = {
  alternates: { canonical: "/odeme" },
  robots: { index: false, follow: false },
  title: "Ödeme",
};

interface Props {
  searchParams: Promise<{ orderNo?: string; phone?: string }>;
}

export default async function PaymentPage({ searchParams }: Props) {
  const { orderNo, phone } = await searchParams;
  const settings = await getSiteSettings();
  const rows = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: [
          "payment_enabled",
          "paytr_ui_enabled",
          "bank_name",
          "bank_iban",
          "bank_holder",
          "payment_note",
        ],
      },
    },
  });
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  const bankPanel =
    map.payment_enabled === "1" || map.payment_enabled === "true";
  const paytrReady = isPaytrUiEnabled(
    map.paytr_ui_enabled || process.env.PAYTR_UI_ENABLED
  );
  const paytrConfigured = isPaytrConfigured();

  let order: {
    orderNo: string;
    total: number;
    paymentStatus: string;
    invoiceNo: string | null;
    name: string;
    phone: string;
  } | null = null;

  if (orderNo && phone) {
    const found = await prisma.order.findUnique({ where: { orderNo } });
    const norm = (s: string) => s.replace(/\D/g, "");
    if (
      found &&
      (norm(found.phone).endsWith(norm(phone).slice(-10)) ||
        norm(phone).endsWith(norm(found.phone).slice(-10)))
    ) {
      order = {
        orderNo: found.orderNo,
        total: found.total,
        paymentStatus: found.paymentStatus,
        invoiceNo: found.invoiceNo,
        name: found.name,
        phone: found.phone,
      };
    }
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          Ödeme
        </h1>
        <p className="text-muted text-sm mb-8">
          Randevu talebi sonrası güvenli kart ödemesi PayTR ile yapılır.
          İsterseniz havale / EFT bilgisini de kullanabilirsiniz.
        </p>

        {!paytrConfigured && (
          <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted mb-6">
            Kart ödemesi altyapısı hazır; PayTR mağaza anahtarları bağlandığında
            burada 3D Secure formu açılır. Şimdilik onay sonrası ekibimiz ödeme
            linki veya havale bilgisi iletir. İletişim:{" "}
            <a href={`tel:${settings.phoneRaw}`} className="text-orange">
              {settings.phone}
            </a>
          </div>
        )}

        {order && (
          <div className="rounded-xl border border-orange/40 bg-card p-5 mb-6 space-y-2 text-sm">
            <p className="text-white font-semibold">{order.orderNo}</p>
            <p className="text-muted">{order.name}</p>
            <p>
              Tutar:{" "}
              <span className="text-orange font-bold">
                {formatPrice(order.total)}
              </span>
            </p>
            <p className="text-muted">Durum: {order.paymentStatus}</p>
            {order.invoiceNo && (
              <p className="text-muted">Fatura: {order.invoiceNo}</p>
            )}
          </div>
        )}

        {order && paytrReady && order.paymentStatus !== "PAID" && (
          <div className="mb-6">
            <PaytrCheckoutButton
              orderNo={order.orderNo}
              phone={phone || order.phone}
              totalLabel={formatPrice(order.total)}
            />
          </div>
        )}

        {order?.paymentStatus === "PAID" && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-sm text-emerald-300 mb-6">
            Bu talep için ödeme alındı. Teşekkürler.
          </div>
        )}

        {(bankPanel || map.bank_iban) && map.bank_iban ? (
          <div className="rounded-xl border border-border bg-card p-5 space-y-3 text-sm">
            <p className="font-semibold text-white">Havale / EFT (alternatif)</p>
            <p>
              <span className="text-muted">Banka:</span>{" "}
              {map.bank_name || "—"}
            </p>
            <p>
              <span className="text-muted">IBAN:</span>{" "}
              <span className="text-white break-all">{map.bank_iban}</span>
            </p>
            <p>
              <span className="text-muted">Alıcı:</span>{" "}
              {map.bank_holder || "Zeynep Çeltek Güzellik"}
            </p>
            <p className="text-xs text-muted">
              {map.payment_note ||
                "Açıklamaya talep numaranızı yazın. Dekontu WhatsApp’tan iletin."}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted">
            Havale bilgisi yayınlanmadıysa onay sonrası ekibimiz IBAN’ı WhatsApp
            veya telefonla iletir. Kart ödemesi için PayTR formu yukarıda
            görünür (yapılandırma tamamlanınca).
          </div>
        )}

        {!order && (
          <p className="mt-6 text-sm text-muted">
            Ödeme için talep no ve telefon ile{" "}
            <SiteLink href="/tekliflerim" className="text-orange hover:underline">
              Taleplerim
            </SiteLink>{" "}
            sayfasından devam edin.
          </p>
        )}

        <p className="mt-6 text-sm">
          <SiteLink href="/tekliflerim" className="text-orange hover:underline">
            ← Taleplerime dön
          </SiteLink>
        </p>
      </div>
    </section>
  );
}
