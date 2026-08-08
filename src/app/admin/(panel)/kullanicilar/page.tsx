import { prisma } from "@/lib/db";
import { UsersClient } from "./UsersClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      totpEnabled: true,
      createdAt: true,
    },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-2">Admin kullanıcılar</h1>
      <p className="text-sm text-[#888] mb-6">
        Panel erişimi ve roller. 2FA her kullanıcı kendi Ayarlar sayfasından açar.
      </p>
      <UsersClient initial={users} />
    </div>
  );
}
