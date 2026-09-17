import { formatPrice } from "@/lib/utils";
import { getSiteUrl } from "@/lib/seo";

interface OrderEmailItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  widthCm?: number | null;
  heightCm?: number | null;
  color?: string | null;
}

interface OrderEmailPayload {
  orderNo: string;
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  note?: string | null;
  total: number;
  items: OrderEmailItem[];
}

function orderHtml(order: OrderEmailPayload): string {
  const lines = order.items
    .map((i) => {
      const extra = i.color ? `<br/><small>${i.color}</small>` : "";
      return `<tr>
        <td style="padding:8px;border-bottom:1px solid #eee">${i.productName}${extra}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatPrice(i.lineTotal)}</td>
      </tr>`;
    })
    .join("");

  return `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#222">
    <h2>Teklif talebiniz alındı — ${order.orderNo}</h2>
    <p>Merhaba ${order.name},</p>
    <p>Talebiniz Zeynep Çeltek Güzellik sistemine kaydedildi. En kısa sürede sizinle iletişime geçeceğiz.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <thead><tr>
        <th style="text-align:left;padding:8px;border-bottom:2px solid #f97316">Hizmet</th>
        <th style="padding:8px;border-bottom:2px solid #f97316">Adet</th>
        <th style="text-align:right;padding:8px;border-bottom:2px solid #f97316">Tutar</th>
      </tr></thead>
      <tbody>${lines}</tbody>
    </table>
    <p><strong>Toplam (tahmini):</strong> ${formatPrice(order.total)}</p>
    <p style="color:#666;font-size:13px">Bu bir randevu / teklif kaydıdır. Güvenli kart ödemesi PayTR ile yapılabilir; seans planı onayda netleşir.</p>
    <p>Telefon: ${order.phone}${order.address ? `<br/>Adres: ${order.address}` : ""}</p>
  </body></html>`;
}

export async function sendOrderConfirmation(
  order: OrderEmailPayload
): Promise<{ sent: boolean; reason?: string }> {
  if (!order.email) {
    return { sent: false, reason: "no-email" };
  }

  const subject = `Zeynep Çeltek Güzellik teklif özeti — ${order.orderNo}`;
  const html = orderHtml(order);
  const text = `Teklif talebiniz alındı: ${order.orderNo}. Toplam (tahmini): ${formatPrice(order.total)}`;

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const from = process.env.MAIL_FROM || "Zeynep Çeltek Güzellik <onboarding@resend.dev>";
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [order.email],
        subject,
        html,
        text,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return { sent: false, reason: "resend-failed" };
    }
    return { sent: true };
  }

  const smtpUrl = process.env.SMTP_URL;
  if (smtpUrl) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport(smtpUrl);
      await transporter.sendMail({
        from: process.env.MAIL_FROM || "noreply@zeynepceltekguzellik.local",
        to: order.email,
        subject,
        html,
        text,
      });
      return { sent: true };
    } catch (e) {
      console.error("SMTP error:", e);
      return { sent: false, reason: "smtp-failed" };
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.info(`[mail:dev] Would send order confirmation to ${order.email}: ${subject}`);
    return { sent: false, reason: "no-mail-provider" };
  }

  return { sent: false, reason: "no-mail-provider" };
}

async function deliverMail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const from = process.env.MAIL_FROM || "Zeynep Çeltek Güzellik <onboarding@resend.dev>";
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
      }),
    });
    if (!res.ok) {
      console.error("Resend error:", await res.text());
      return { sent: false, reason: "resend-failed" };
    }
    return { sent: true };
  }

  const smtpUrl = process.env.SMTP_URL;
  if (smtpUrl) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport(smtpUrl);
      await transporter.sendMail({
        from: process.env.MAIL_FROM || "noreply@zeynepceltekguzellik.local",
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
      });
      return { sent: true };
    } catch (e) {
      console.error("SMTP error:", e);
      return { sent: false, reason: "smtp-failed" };
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.info(`[mail:dev] ${opts.subject} → ${opts.to}`);
    return { sent: false, reason: "no-mail-provider" };
  }
  return { sent: false, reason: "no-mail-provider" };
}

/** Salon bildirim özeti — SiteSetting manufacturer_email veya MAIL_MANUFACTURER */
export async function sendManufacturerBrief(order: {
  id: string;
  orderNo: string;
  name: string;
  phone: string;
  total: number;
  note?: string | null;
  productionNotes?: string | null;
  items: Array<{
    productName: string;
    quantity: number;
    color?: string | null;
    optionsNote?: string | null;
    lineTotal: number;
  }>;
}): Promise<{ sent: boolean; reason?: string }> {
  const { prisma } = await import("@/lib/db");
  const row = await prisma.siteSetting.findUnique({
    where: { key: "manufacturer_email" },
  });
  const to =
    row?.value?.trim() ||
    process.env.MAIL_MANUFACTURER?.trim() ||
    process.env.MAIL_FROM_NOTIFY?.trim();
  if (!to) return { sent: false, reason: "no-manufacturer-email" };

  const lines = order.items
    .map((i) => {
      const extra = [i.color || null, i.optionsNote || null]
        .filter(Boolean)
        .join(" | ");
      return `• ${i.productName} x${i.quantity}${extra ? ` (${extra})` : ""}`;
    })
    .join("\n");

  const panelUrl = `${getSiteUrl()}/admin/siparisler/${order.id}`;
  const subject = `[Randevu] ${order.orderNo} — ${order.name}`;
  const text = `Yeni randevu / teklif talebi\n\n${order.orderNo}\nMüşteri: ${order.name} / ${order.phone}\nToplam: ${formatPrice(order.total)}\nNot: ${order.note || "-"}\nPanel: ${panelUrl}\n\nKalemler:\n${lines}`;
  const html = `<pre style="font-family:sans-serif;white-space:pre-wrap">${text}</pre>`;

  return deliverMail({ to, subject, html, text });
}

export async function sendContactNotify(input: {
  name: string;
  phone: string;
  subject?: string | null;
  message: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const { prisma } = await import("@/lib/db");
  const row = await prisma.siteSetting.findUnique({
    where: { key: "manufacturer_email" },
  });
  const to =
    row?.value?.trim() ||
    process.env.MAIL_MANUFACTURER?.trim() ||
    process.env.MAIL_FROM_NOTIFY?.trim();
  if (!to) return { sent: false, reason: "no-manufacturer-email" };
  const subject = `[İletişim] ${input.name}`;
  const text = `${input.name} / ${input.phone}\nKonu: ${input.subject || "-"}\n\n${input.message}`;
  return deliverMail({
    to,
    subject,
    html: `<pre style="font-family:sans-serif;white-space:pre-wrap">${text}</pre>`,
    text,
  });
}

export async function sendCrmReminder(order: {
  orderNo: string;
  name: string;
  phone: string;
  email?: string | null;
  total: number;
}): Promise<{ sent: boolean; reason?: string }> {
  if (!order.email) return { sent: false, reason: "no-email" };
  const subject = `Teklifiniz bekliyor — ${order.orderNo}`;
  const text = `Merhaba ${order.name}, ${order.orderNo} numaralı teklif talebiniz için randevu teyidi yapmak isteriz. Tahmini toplam: ${formatPrice(order.total)}. Telefon: ${order.phone}`;
  const html = `<p>${text}</p><p>Zeynep Çeltek Güzellik</p>`;
  return deliverMail({ to: order.email, subject, html, text });
}

/** Günlük özet — bekleyen talepler + okunmamış mesajlar */
export async function sendStaffDigest(input: {
  pendingOrders: number;
  unreadMessages: number;
}): Promise<{ sent: boolean; reason?: string }> {
  const { prisma } = await import("@/lib/db");
  const row = await prisma.siteSetting.findUnique({
    where: { key: "manufacturer_email" },
  });
  const to =
    row?.value?.trim() ||
    process.env.MAIL_MANUFACTURER?.trim() ||
    process.env.MAIL_FROM_NOTIFY?.trim();
  if (!to) return { sent: false, reason: "no-manufacturer-email" };

  const panel = getSiteUrl();
  const subject = `[Özet] ${input.pendingOrders} bekleyen talep · ${input.unreadMessages} okunmamış mesaj`;
  const text = `Zeynep Çeltek Güzellik — günlük özet\n\nBekleyen randevu talepleri: ${input.pendingOrders}\nOkunmamış mesajlar: ${input.unreadMessages}\n\nPanel: ${panel}/admin\nTalepler: ${panel}/admin/siparisler\nMesajlar: ${panel}/admin/mesajlar`;
  return deliverMail({
    to,
    subject,
    html: `<pre style="font-family:sans-serif;white-space:pre-wrap">${text}</pre>`,
    text,
  });
}
