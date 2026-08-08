import { prisma } from "@/lib/db";
import Link from "next/link";
import { NavClient } from "./NavClient";

export const dynamic = "force-dynamic";

export default async function AdminNavPage() {
  const items = await prisma.navItem.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-2">Menüler</h1>
      <div className="admin-warning mb-6 text-sm leading-relaxed">
        <strong>Canlı editörü tercih edin:</strong> Üst menüyü{" "}
        <Link href="/duzenle" className="text-orange font-semibold hover:underline">
          Siteyi Düzenle → Menüyü yönet
        </Link>{" "}
        panelinden de güncelleyebilirsiniz. Bu sayfa yedek formdur.
      </div>
      <p className="text-sm text-[#888] mb-6">
        Üst menü ve footer kurumsal linklerini buradan yönetin. Sıralama için ↑↓
        kullanın.
      </p>
      <NavClient initial={items} />
    </div>
  );
}
