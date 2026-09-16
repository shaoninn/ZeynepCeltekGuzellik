import { prisma } from "@/lib/db";
import { CampaignsAdminClient } from "./CampaignsAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminCampaignsPage() {
  let initial: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    image: string | null;
    href: string | null;
    endsAt: string | null;
    isActive: boolean;
    sortOrder: number;
  }[] = [];
  try {
    const rows = await prisma.campaignOffer.findMany({
      orderBy: { sortOrder: "asc" },
    });
    initial = rows.map((r) => ({
      ...r,
      endsAt: r.endsAt ? r.endsAt.toISOString() : null,
    }));
  } catch {
    initial = [];
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-2">Kampanyalar</h1>
      <p className="text-sm text-[#888] mb-6">
        Tarihli teklif kartları. Boşsa /kampanyalar sayfası galeri + paket
        vitrini gösterir.
      </p>
      <CampaignsAdminClient initial={initial} />
    </div>
  );
}
