import { prisma } from "@/lib/db";
import { generateOrderNo } from "@/lib/api";
import { sendOrderConfirmation, sendManufacturerBrief } from "@/lib/mail";
import { writeAuditLog } from "@/lib/audit";

export interface QuoteItemInput {
  productId: string;
  quantity: number;
  widthCm?: number | null;
  heightCm?: number | null;
  color?: string | null;
  optionsNote?: string | null;
}

function parseCustomLine(item: QuoteItemInput): {
  productName: string;
  productSlug: string | null;
  unitPrice: number;
} | null {
  const isCustom = item.productId.startsWith("custom-");
  if (!isCustom) return null;

  let unitPrice = 0;
  let productName = "Özel kayıt";
  let productSlug: string | null = null;
  try {
    const note = JSON.parse(item.optionsNote || "{}") as {
      estimatedPrice?: number;
      customText?: string;
      builder?: boolean;
    };
    if (typeof note.estimatedPrice === "number" && note.estimatedPrice >= 0) {
      unitPrice = note.estimatedPrice;
    }
    if (note.customText?.trim()) {
      productName = `Özel: ${note.customText.trim()}`;
    }
  } catch {
    /* ignore */
  }
  return { productName, productSlug, unitPrice };
}

export async function createQuoteOrder(input: {
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  note?: string | null;
  source?: string;
  items: QuoteItemInput[];
  ip?: string | null;
  wantPayment?: boolean;
}) {
  const productIds = input.items
    .map((i) => i.productId)
    .filter((id) => !id.startsWith("custom-"));
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  });
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));

  const items = [];
  for (const item of input.items) {
    const custom = parseCustomLine(item);
    if (custom) {
      items.push({
        productId: null as string | null,
        productName: custom.productName,
        productSlug: custom.productSlug,
        unitPrice: custom.unitPrice,
        quantity: item.quantity,
        lineTotal: custom.unitPrice * item.quantity,
        widthCm: item.widthCm ?? null,
        heightCm: item.heightCm ?? null,
        color: item.color?.trim() || null,
        optionsNote: item.optionsNote?.trim() || null,
      });
      continue;
    }

    const product = byId[item.productId];
    if (!product) {
      throw new Error("Sepette geçersiz veya pasif ürün var. Sepeti güncelleyin.");
    }
    if (!product.inStock) {
      throw new Error(`${product.name} şu an teklife kapalı.`);
    }
    const unit =
      product.badgeSale &&
      product.salePrice != null &&
      product.salePrice < product.price &&
      (!product.campaignEndsAt || product.campaignEndsAt > new Date())
        ? product.salePrice
        : product.price;

    items.push({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      unitPrice: unit,
      quantity: item.quantity,
      lineTotal: unit * item.quantity,
      widthCm: item.widthCm ?? null,
      heightCm: item.heightCm ?? null,
      color: item.color?.trim() || null,
      optionsNote: item.optionsNote?.trim() || null,
    });
  }

  const total = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const phone = input.phone.trim();

  const customer = await prisma.customer.upsert({
    where: { phone },
    create: {
      name: input.name.trim(),
      phone,
      email: input.email || null,
      notes: null,
    },
    update: {
      name: input.name.trim(),
      email: input.email || undefined,
    },
  });

  const reminderAt = new Date();
  reminderAt.setHours(reminderAt.getHours() + 24);

  const order = await prisma.order.create({
    data: {
      orderNo: generateOrderNo(),
      name: input.name.trim(),
      phone,
      email: input.email || null,
      address: input.address || null,
      note: input.note || null,
      source: input.source || "WEB",
      status: "PENDING",
      paymentStatus: input.wantPayment ? "PENDING" : "UNPAID",
      paymentProvider: input.wantPayment ? "BANK_TRANSFER" : null,
      invoiceNo: `F-${Date.now().toString(36).toUpperCase()}`,
      reminderAt,
      total,
      customerId: customer.id,
      items: { create: items },
    },
    include: { items: true },
  });

  await writeAuditLog({
    action: "order.create",
    entity: "Order",
    entityId: order.id,
    meta: { orderNo: order.orderNo, source: order.source, total },
    ip: input.ip,
  });

  const mail = await sendOrderConfirmation({
    orderNo: order.orderNo,
    name: order.name,
    phone: order.phone,
    email: order.email,
    address: order.address,
    note: order.note,
    total: order.total,
    items: order.items,
  });

  const manufacturer = await sendManufacturerBrief(order);
  if (manufacturer.sent) {
    await prisma.order.update({
      where: { id: order.id },
      data: { manufacturerNotified: true },
    });
  }

  return { order, mail, manufacturer };
}
