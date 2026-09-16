import { prisma } from "@/lib/db";
import { PackagesAdminClient } from "./PackagesAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPackagesPage() {
  let initial: Awaited<ReturnType<typeof prisma.servicePackage.findMany>> = [];
  try {
    initial = await prisma.servicePackage.findMany({
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    initial = [];
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-2">Paketler</h1>
      <p className="text-sm text-[#888] mb-6">
        Ana sayfa ve /paketler vitrinindeki seans paketleri. Boşsa sitede sabit
        paketler gösterilir.
      </p>
      <PackagesAdminClient initial={initial} />
    </div>
  );
}
