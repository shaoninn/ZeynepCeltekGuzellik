import dynamic from "next/dynamic";
import { preload } from "react-dom";
import {
  DEFAULT_HERO_IMAGE,
  HeroPublic,
} from "@/components/home/HeroPublic";
import { heroPreloadHrefs } from "@/components/home/HeroMedia";
import { PopularServicesSection } from "@/components/home/PopularServicesSection";
import { PackagesCampaignSection } from "@/components/home/PackagesCampaignSection";
import { loadHomePageData } from "@/lib/home-content";
import { getPackages } from "@/lib/packages";
import { faqPageJsonLd } from "@/lib/faq";

const Hero = dynamic(() =>
  import("@/components/home/Hero").then((m) => m.Hero)
);
const FeatureBar = dynamic(() =>
  import("@/components/home/FeatureBar").then((m) => m.FeatureBar)
);
const StatsBar = dynamic(() =>
  import("@/components/home/StatsBar").then((m) => m.StatsBar)
);
const GallerySection = dynamic(() =>
  import("@/components/home/StatsGallery").then((m) => m.GallerySection)
);
const Testimonials = dynamic(() =>
  import("@/components/home/Testimonials").then((m) => m.Testimonials)
);
const FaqSection = dynamic(() =>
  import("@/components/home/FaqSection").then((m) => m.FaqSection)
);

export async function HomePageView({
  editable = false,
}: {
  editable?: boolean;
} = {}) {
  const [data, packages] = await Promise.all([
    loadHomePageData(),
    getPackages(),
  ]);
  const heroSrc = data.heroImage || DEFAULT_HERO_IMAGE;
  const { mobile, desktop } = heroPreloadHrefs(heroSrc);

  preload(mobile, {
    as: "image",
    fetchPriority: "high",
    imageSrcSet:
      mobile === desktop ? desktop : `${mobile} 960w, ${desktop} 1600w`,
    imageSizes: "(max-width: 640px) 70vw, (max-width: 1024px) 90vw, 42vw",
  });

  const galleryImages =
    data.projects.map((p) => p.image).filter((x): x is string => Boolean(x))
      .length > 0
      ? data.projects
          .map((p) => p.image)
          .filter((x): x is string => Boolean(x))
      : [
          "/images/gallery/gallery-1.jpg",
          "/images/gallery/gallery-2.jpg",
          "/images/gallery/gallery-3.jpg",
          "/images/gallery/gallery-4.jpg",
          "/images/gallery/gallery-5.jpg",
          "/images/gallery/gallery-6.jpg",
        ];

  const heroProps = {
    title: data.heroTitle,
    subtitle: data.heroSubtitle,
    body: data.heroBody,
    image: heroSrc,
    styles: data.styles,
    whatsappUrl: data.whatsappUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd()) }}
      />
      {editable ? <Hero {...heroProps} /> : <HeroPublic {...heroProps} />}
      <PopularServicesSection
        title={data.servicesTitle || "Popüler Hizmetlerimiz"}
        styles={data.styles}
      />
      <PackagesCampaignSection styles={data.styles} packages={packages} />
      <FeatureBar
        items={data.featureBarItems}
        sectionOffset={data.sectionFeatureBarOffset}
        styles={data.styles}
      />
      <StatsBar items={data.stats} />
      <GallerySection
        title="Uygulamalarımız"
        images={galleryImages}
      />
      <Testimonials
        sectionTitle={data.testimonialTitle || "Müşterilerimiz Ne Diyor?"}
        items={data.testimonials}
        styles={data.styles}
        googleReviewsUrl={data.googleReviewsUrl}
      />
      <FaqSection styles={data.styles} />
    </>
  );
}
