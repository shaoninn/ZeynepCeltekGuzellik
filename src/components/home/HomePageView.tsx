import dynamic from "next/dynamic";
import { preload } from "react-dom";
import { Hero, DEFAULT_HERO_IMAGE } from "@/components/home/Hero";
import { heroPreloadHrefs } from "@/components/home/HeroMedia";
import { PopularServicesSection } from "@/components/home/PopularServicesSection";
import { PackagesCampaignSection } from "@/components/home/PackagesCampaignSection";
import { FeatureBar } from "@/components/home/FeatureBar";
import { loadHomePageData } from "@/lib/home-content";

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
const CTASection = dynamic(() =>
  import("@/components/home/CTASection").then((m) => m.CTASection)
);

export async function HomePageView() {
  const data = await loadHomePageData();
  const heroSrc = data.heroImage || DEFAULT_HERO_IMAGE;
  const { mobile, desktop } = heroPreloadHrefs(heroSrc);

  preload(desktop, {
    as: "image",
    fetchPriority: "high",
    imageSrcSet:
      mobile === desktop ? desktop : `${mobile} 960w, ${desktop} 1600w`,
    imageSizes: "(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 32rem",
  });

  const popular = data.categories.slice(0, 6).map((c) => ({
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image,
  }));

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
        ];

  return (
    <>
      <Hero
        title={data.heroTitle}
        subtitle={data.heroSubtitle}
        body={data.heroBody}
        image={heroSrc}
        styles={data.styles}
      />
      <PopularServicesSection
        title={data.servicesTitle || "Popüler Hizmetlerimiz"}
        items={popular}
        styles={data.styles}
      />
      <PackagesCampaignSection styles={data.styles} />
      <FeatureBar
        items={data.featureBarItems}
        sectionOffset={data.sectionFeatureBarOffset}
        styles={data.styles}
      />
      <StatsBar items={data.stats} />
      <GallerySection images={galleryImages} />
      <Testimonials
        googleReviewsUrl={data.googleReviewsUrl}
        sectionTitle={data.testimonialTitle}
        sectionDesc={data.testimonialDesc}
        sectionEyebrow={data.testimonialEyebrow}
        googleLinkLabel={data.googleReviewsLinkLabel}
        items={data.testimonials}
        styles={data.styles}
      />
      <FaqSection
        sectionTitle={data.faqTitle}
        sectionEyebrow={data.faqEyebrow}
        items={data.faqs}
        styles={data.styles}
      />
      <CTASection
        title={data.ctaTitle}
        buttonLabel={data.ctaButtonLabel}
        bannerImages={data.ctaBanners}
        sectionOffset={data.sectionCtaOffset}
        styles={data.styles}
      />
    </>
  );
}
