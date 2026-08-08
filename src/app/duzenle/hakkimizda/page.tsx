import { AboutPageView } from "@/components/about/AboutPageView";
import { loadAboutPageData } from "@/lib/page-content";

export const dynamic = "force-dynamic";

export default async function EditorAboutPage() {
  const data = await loadAboutPageData();
  return <AboutPageView data={data} />;
}
