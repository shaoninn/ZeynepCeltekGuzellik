import { cache } from "react";
import { prisma } from "@/lib/db";

export type CampaignRecord = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
  href: string | null;
  endsAt: Date | null;
};

export const getActiveCampaigns = cache(async (): Promise<CampaignRecord[]> => {
  try {
    const now = new Date();
    const rows = await prisma.campaignOffer.findMany({
      where: {
        isActive: true,
        OR: [{ endsAt: null }, { endsAt: { gt: now } }],
      },
      orderBy: { sortOrder: "asc" },
    });
    return rows;
  } catch {
    return [];
  }
});
