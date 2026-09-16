import { formatPrice } from "@/lib/utils";

export const WORKFLOW_STEPS = [
  { id: "INTAKE", label: "Talep alındı" },
  { id: "MEASURE", label: "Ön görüşme / teyit" },
  { id: "PRODUCTION", label: "Hizmet planı" },
  { id: "SHIP", label: "Randevu / başlangıç" },
  { id: "DONE", label: "Tamamlandı" },
] as const;

export type WorkflowId = (typeof WORKFLOW_STEPS)[number]["id"];

export function workflowIndex(id: string): number {
  const idx = WORKFLOW_STEPS.findIndex((s) => s.id === id);
  return idx >= 0 ? idx : 0;
}

export function workflowLabel(id: string): string {
  return WORKFLOW_STEPS.find((s) => s.id === id)?.label ?? id;
}

export function nextWorkflowId(id: string): WorkflowId | null {
  const idx = workflowIndex(id);
  if (idx >= WORKFLOW_STEPS.length - 1) return null;
  return WORKFLOW_STEPS[idx + 1]!.id;
}

export function prevWorkflowId(id: string): WorkflowId | null {
  const idx = workflowIndex(id);
  if (idx <= 0) return null;
  return WORKFLOW_STEPS[idx - 1]!.id;
}

export function buildAdminWhatsAppMessage(order: {
  orderNo: string;
  name: string;
  phone: string;
  total: number;
  items: {
    productName: string;
    quantity: number;
    color?: string | null;
    optionsNote?: string | null;
  }[];
}): string {
  const lines = [
    `Merhaba ${order.name},`,
    ``,
    `Zeynep Çeltek Güzellik teklifiniz (${order.orderNo}) hakkında bilgi:`,
    ``,
    ...order.items.map((item) => {
      const extra = [item.color || null, item.optionsNote || null]
        .filter(Boolean)
        .join(" · ");
      const suffix = extra ? ` (${extra})` : "";
      return `• ${item.productName} × ${item.quantity}${suffix}`;
    }),
    ``,
    `Tahmini toplam: ${formatPrice(order.total)}`,
    ``,
    `Randevu teyidi için dönüş yapabilir misiniz?`,
    `Tel: ${order.phone}`,
  ];
  return lines.join("\n");
}
