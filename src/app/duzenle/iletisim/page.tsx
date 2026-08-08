import { getSiteSettings } from "@/lib/site";
import { ContactPageView } from "@/components/contact/ContactPageView";
import { loadContactPageData } from "@/lib/page-content";

export const dynamic = "force-dynamic";

export default async function EditorContactPage() {
  const [settings, data] = await Promise.all([
    getSiteSettings(),
    loadContactPageData(),
  ]);

  return <ContactPageView data={data} settings={settings} />;
}
