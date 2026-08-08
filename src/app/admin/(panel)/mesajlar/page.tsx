import { prisma } from "@/lib/db";
import { MessagesClient } from "./MessagesClient";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-2">Mesajlar</h1>
      <p className="text-sm text-[#888] mb-6">
        İletişim formundan gelen talepler. WhatsApp veya telefon ile dönüş yapın.
      </p>
      <MessagesClient
        initial={messages.map((m) => ({
          ...m,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
