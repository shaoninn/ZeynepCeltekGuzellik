import { getSiteSettings } from "@/lib/site";
import { ContactPageView } from "@/components/contact/ContactPageView";
import { loadContactPageData } from "@/lib/page-content";

export const revalidate = 60;


export const metadata = {
  alternates: { canonical: "/iletisim" },
  title: "İletişim | Zeynep Çeltek Güzellik",
  description: "Zeynep Çeltek Güzellik iletişim bilgileri ve teklif formu.",
};

export default async function ContactPage() {
  const [settings, data] = await Promise.all([
    getSiteSettings(),
    loadContactPageData(),
  ]);

  return <ContactPageView data={data} settings={settings} />;
}
