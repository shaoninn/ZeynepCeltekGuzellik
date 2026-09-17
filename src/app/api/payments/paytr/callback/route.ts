import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPaytrConfig, verifyPaytrCallbackHash } from "@/lib/paytr";
import { writeAuditLog } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/payments/paytr/callback
 * PayTR bildirim URL — düz metin "OK" dönülmeli.
 */
export async function POST(request: NextRequest) {
  const config = getPaytrConfig();
  if (!config) {
    return new NextResponse("PayTR not configured", { status: 503 });
  }

  try {
    const form = await request.formData();
    const merchantOid = String(form.get("merchant_oid") || "");
    const status = String(form.get("status") || "");
    const totalAmount = String(form.get("total_amount") || "");
    const hash = String(form.get("hash") || "");
    const failedReasonCode = String(form.get("failed_reason_code") || "");
    const failedReasonMsg = String(form.get("failed_reason_msg") || "");

    if (
      !verifyPaytrCallbackHash(config, {
        merchantOid,
        status,
        totalAmount,
        hash,
      })
    ) {
      console.error("[paytr/callback] bad hash", merchantOid);
      return new NextResponse("bad hash", { status: 400 });
    }

    const order =
      (await prisma.order.findFirst({
        where: { paymentRef: merchantOid },
      })) ||
      (await prisma.order.findUnique({
        where: { orderNo: merchantOid },
      }));

    if (!order) {
      console.error("[paytr/callback] order not found", merchantOid);
      // Still OK so PayTR stops retrying forever for unknown oid in test
      return new NextResponse("OK");
    }

    if (status === "success") {
      if (order.paymentStatus !== "PAID") {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "PAID",
            paymentProvider: "PAYTR",
            paymentRef: merchantOid,
            status:
              order.status === "PENDING" ? "CONFIRMED" : order.status,
          },
        });
        await writeAuditLog({
          action: "payment.paytr.success",
          entity: "Order",
          entityId: order.id,
          meta: { merchantOid, totalAmount },
        });
      }
    } else {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "UNPAID",
          paymentProvider: "PAYTR",
          paymentRef: merchantOid,
        },
      });
      await writeAuditLog({
        action: "payment.paytr.failed",
        entity: "Order",
        entityId: order.id,
        meta: {
          merchantOid,
          totalAmount,
          failedReasonCode,
          failedReasonMsg,
        },
      });
    }

    return new NextResponse("OK");
  } catch (e) {
    console.error("[paytr/callback]", e);
    return new NextResponse("error", { status: 500 });
  }
}
