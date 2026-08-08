import { prisma } from "@/lib/db";
import { MediaClient } from "./MediaClient";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-2">Medya</h1>
      <p className="text-sm text-[#888] mb-6">
        Tüm yüklenen görseller burada listelenir. Ürün, proje ve blog
        formlarında da doğrudan sürükleyip bırakarak yükleyebilirsiniz.
      </p>
      <MediaClient
        initial={assets.map((a) => ({
          ...a,
          createdAt: a.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
