import Link from "next/link";
import { prisma } from "@/lib/db";
import { CrmRemindersClient } from "./CrmRemindersClient";

export const dynamic = "force-dynamic";

export default async function CrmPage() {
  const since = new Date();
  since.setHours(since.getHours() - 72);

  const orders = await prisma.order.findMany({
    where: {
      status: "PENDING",
      createdAt: { lte: since },
    },
    orderBy: { createdAt: "asc" },
    take: 40,
    select: {
      id: true,
      orderNo: true,
      name: true,
      phone: true,
      email: true,
      total: true,
      status: true,
      reminderAt: true,
      reminderSent: true,
      createdAt: true,
    },
  });

  const initial = orders.map((o) => ({
    ...o,
    reminderAt: o.reminderAt?.toISOString() ?? null,
    createdAt: o.createdAt.toISOString(),
  }));

  return (
    <div>
      <Link
        href="/admin"
        className="text-sm text-orange hover:underline mb-4 inline-block"
      >
        ← Panel
      </Link>
      <h1 className="font-display text-3xl font-bold mb-2">CRM hatırlatma</h1>
      <p className="text-sm text-[#888] mb-6">
        72 saatten eski bekleyen teklifler. WhatsApp şablonu veya e-posta
        hatırlatması gönderin.
      </p>
      <CrmRemindersClient initial={initial} />
    </div>
  );
}
