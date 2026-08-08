import { prisma } from "@/lib/db";
import Link from "next/link";
import { ContentsClient } from "./ContentsClient";

export const dynamic = "force-dynamic";

export default async function AdminContentsPage() {
  const contents = await prisma.siteContent.findMany({
    orderBy: { key: "asc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-2">Site Yazıları</h1>
      <div className="admin-warning mb-6 text-sm leading-relaxed">
        <strong>Canlı editörü tercih edin:</strong> Metin ve görselleri sitede
        tıklayarak düzenlemek için{" "}
        <Link href="/duzenle" className="text-orange font-semibold hover:underline">
          Siteyi Düzenle
        </Link>
        . Bu form listesi yedek / toplu düzenleme içindir.
      </div>
      <p className="text-sm text-[#888] mb-6">
        Hero başlık, hakkımızda, misyon, vizyon ve diğer metinleri buradan
        yönetin.
      </p>
      <ContentsClient initial={contents} />
    </div>
  );
}
