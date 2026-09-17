import { AboutPageView } from "@/components/about/AboutPageView";
import { loadAboutPageData } from "@/lib/page-content";
import { getSiteSettings } from "@/lib/site";
import { resolveBranches } from "@/lib/constants";

export const revalidate = 60;


export const metadata = {
  alternates: { canonical: "/hakkimizda" },
  title: "Hakkımızda | Zeynep Çeltek Güzellik Adana",
  description:
    "Zeynep Çeltek Güzellik — Adana Gazi Paşa ve Turgut Özal şubelerinde 30+ yıl tecrübe, kişiye özel cilt bakımı, lazer epilasyon ve Epilyum Alex. Misyon, vizyon, çalışma ilkeleri ve şube bilgileri.",
};

export default async function AboutPage() {
  const [data, settings] = await Promise.all([
    loadAboutPageData(),
    getSiteSettings(),
  ]);
  return (
    <AboutPageView
      data={data}
      googleReviewsUrl={settings.googleReviewsUrl}
      branches={resolveBranches({
        gazipasaAddress: settings.branchGazipasaAddress,
        gazipasaPhone: settings.branchGazipasaPhone,
        turgutozalAddress: settings.branchTurgutozalAddress,
        turgutozalPhone: settings.branchTurgutozalPhone,
      })}
    />
  );
}
