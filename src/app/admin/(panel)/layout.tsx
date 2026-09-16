import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unreadMessages, pendingOrders] = await Promise.all([
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <div className="flex min-h-screen min-h-dvh bg-background text-white">
      <AdminSidebar
        unreadMessages={unreadMessages}
        pendingOrders={pendingOrders}
      />
      <main className="flex-1 min-w-0 overflow-x-hidden pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
