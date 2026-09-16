import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendStaffDigest } from "@/lib/mail";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/cron/digest
 * Authorization: Bearer <CRON_SECRET or PURGE_SECRET>
 */
export async function GET(request: NextRequest) {
  const secret =
    process.env.CRON_SECRET?.trim() || process.env.PURGE_SECRET?.trim() || "";
  const auth = request.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";

  if (!secret || token !== secret) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const [pendingOrders, unreadMessages] = await Promise.all([
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ]);

    const mail = await sendStaffDigest({ pendingOrders, unreadMessages });

    return NextResponse.json({
      ok: true,
      pendingOrders,
      unreadMessages,
      emailed: mail.sent,
      reason: mail.reason,
    });
  } catch (error) {
    console.error("[cron/digest]", error);
    return NextResponse.json(
      { error: "Özet gönderilemedi" },
      { status: 500 }
    );
  }
}
