import { SiteLink } from "@/components/ui/SiteLink";
import { EditableText } from "@/components/editor/EditableText";
import { PACKAGES } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

interface PackagesCampaignSectionProps {
  styles?: Record<string, string>;
  campaignTitle?: string;
  campaignPrice?: string;
  campaignDesc?: string;
}

function formatTry(n: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(n);
}

export function PackagesCampaignSection({
  styles,
  campaignTitle = "Bu Haftaya Özel: Alex 3 Bölge",
  campaignPrice = "₺4.000",
  campaignDesc = "Soğuk hava üflemeli Alex — bacak, kolaltı ve genital 5 seans. Kontenjan sınırlıdır.",
}: PackagesCampaignSectionProps) {
  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-surface text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <EditableText
            contentKey="packages_section_title"
            value="Paketlerimiz"
            as="h2"
            block
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-wide uppercase"
            help="Paketler bölümü başlığı"
            textStyle={styles?.packages_section_title}
          />
          <div className="mt-4 mx-auto flex items-center justify-center gap-2">
            <span className="h-px w-16 bg-orange/70" />
            <span className="h-1.5 w-1.5 rotate-45 bg-orange" />
            <span className="h-px w-16 bg-orange/70" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 items-stretch">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-sm p-5 sm:p-6 border flex flex-col ${
                pkg.featured
                  ? "bg-card border-orange shadow-[0_20px_50px_rgba(0,0,0,0.35)] lg:-translate-y-2 lg:scale-[1.02]"
                  : "bg-card/60 border-border"
              }`}
            >
              {pkg.featured && pkg.badge ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-orange text-ink text-[10px] font-bold tracking-wider uppercase px-3 py-1">
                  {pkg.badge}
                </span>
              ) : null}
              <h3 className="font-display text-xl font-semibold mb-4 text-cream">
                {pkg.name}
              </h3>
              <ul className="space-y-2 mb-6 flex-1">
                {pkg.items.map((item) => (
                  <li
                    key={item}
                    className="text-sm leading-snug text-muted flex gap-2"
                  >
                    <span className="text-orange shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="font-display text-3xl font-semibold mb-4 text-orange">
                {formatTry(pkg.price)}
              </p>
              <Button
                href="/iletisim"
                variant={pkg.featured ? "primary" : "outline"}
                className="w-full justify-center"
              >
                Detayları İncele
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-sm border border-orange/25 bg-gradient-to-br from-orange/15 to-transparent p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-orange mb-3">
              Kampanya
            </p>
            <EditableText
              contentKey="campaign_title"
              value={campaignTitle}
              as="h3"
              block
              className="font-display text-2xl sm:text-3xl font-semibold leading-snug mb-3"
              help="Kampanya kutusu başlığı"
            />
            <EditableText
              contentKey="campaign_desc"
              value={campaignDesc}
              as="p"
              block
              multiline
              className="text-muted text-sm leading-relaxed max-w-xl"
              help="Kampanya açıklaması"
            />
          </div>
          <div className="shrink-0 text-left sm:text-right">
            <EditableText
              contentKey="campaign_price"
              value={campaignPrice}
              as="p"
              block
              className="font-display text-4xl text-orange font-semibold mb-4"
              help="Kampanya fiyatı"
            />
            <SiteLink
              href="/iletisim"
              className="inline-flex items-center justify-center rounded-sm bg-orange text-ink px-5 py-2.5 text-sm font-semibold tracking-wide uppercase hover:bg-orange-dark transition-colors"
            >
              Randevu Al
            </SiteLink>
          </div>
        </div>
      </div>
    </section>
  );
}
