import { notFound } from "next/navigation";
import { SiteLink } from "@/components/ui/SiteLink";
import { PackageAddToCartButton } from "@/components/shop/PackageAddToCartButton";
import { getPackageBySlug, getPackages } from "@/lib/packages";
import { WHATSAPP_URL } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { toWebpSrc } from "@/lib/image-optimize";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const packages = await getPackages();
  return packages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) return { title: "Paket | Zeynep Çeltek Güzellik" };
  return {
    alternates: { canonical: `/paketler/${pkg.slug}` },
    title: `${pkg.name} | Zeynep Çeltek Güzellik`,
    description: pkg.shortDesc,
  };
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  const img = toWebpSrc(pkg.image);
  const waText = encodeURIComponent(
    `Merhaba, ${pkg.name} (${formatPrice(pkg.price)}) hakkında bilgi almak istiyorum.`
  );

  return (
    <section className="py-12 sm:py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-muted mb-6">
          <SiteLink href="/paketler" className="hover:text-orange">
            Paketler
          </SiteLink>
          <span className="mx-2">/</span>
          <span className="text-cream">{pkg.name}</span>
        </p>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="relative aspect-[4/3] overflow-hidden border border-border bg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt={pkg.name}
              width={960}
              height={720}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>

          <div>
            {"badge" in pkg && pkg.badge ? (
              <span className="inline-block mb-3 bg-orange text-ink text-[10px] font-bold tracking-[0.14em] uppercase px-3 py-1">
                {pkg.badge}
              </span>
            ) : null}
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-cream mb-3">
              {pkg.name}
            </h1>
            <p className="text-muted leading-relaxed mb-6">{pkg.shortDesc}</p>
            <p className="font-display text-4xl font-semibold text-orange mb-1">
              {formatPrice(pkg.price)}
            </p>
            <p className="text-[11px] tracking-[0.14em] uppercase text-white/40 mb-8">
              {pkg.sessions}
            </p>

            <h2 className="font-display text-lg font-semibold text-cream mb-3">
              Paket içeriği
            </h2>
            <ul className="space-y-2 mb-8">
              {pkg.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-muted">
                  <span className="text-orange shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <PackageAddToCartButton pkg={pkg} label="Listeye ekle" />
              </div>
              <a
                href={`${WHATSAPP_URL}?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline !rounded-sm inline-flex items-center justify-center gap-2 flex-1"
              >
                <WhatsAppIcon className="w-4 h-4" />
                WhatsApp
              </a>
            </div>

            <p className="mt-4 text-xs text-muted">
              Ödeme online alınmaz; sepete ekledikten sonra{" "}
              <SiteLink href="/sepet" className="text-orange hover:underline">
                randevu sepetinden
              </SiteLink>{" "}
              teklif / randevu talebi oluşturursunuz.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
