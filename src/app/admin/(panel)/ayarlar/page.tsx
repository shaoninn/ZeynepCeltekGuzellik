import { prisma } from "@/lib/db";
import { SettingsClient } from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSetting.findMany();
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-2">Ayarlar</h1>
      <p className="text-sm text-[#888] mb-6">
        İletişim ve sosyal medya bilgileri. WhatsApp numarasını ülke kodu ile
        (90...) girin.
      </p>
      <SettingsClient initial={map} />
    </div>
  );
}
