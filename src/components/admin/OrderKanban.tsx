"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  WORKFLOW_STEPS,
  nextWorkflowId,
  prevWorkflowId,
  type WorkflowId,
} from "@/lib/order-workflow";
import { formatPrice } from "@/lib/utils";

export interface KanbanOrder {
  id: string;
  orderNo: string;
  name: string;
  phone: string;
  workflow: string;
  status: string;
  total: number;
  createdAt: string;
}

interface OrderKanbanProps {
  initialOrders: KanbanOrder[];
}

export function OrderKanban({ initialOrders }: OrderKanbanProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [busy, setBusy] = useState<string | null>(null);

  const byWorkflow = WORKFLOW_STEPS.map((col) => ({
    ...col,
    items: orders.filter((o) => o.workflow === col.id || (!o.workflow && col.id === "INTAKE")),
  }));

  async function moveOrder(id: string, workflow: WorkflowId) {
    setBusy(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflow }),
      });
      if (!res.ok) throw new Error("Güncellenemedi");
      const updated = (await res.json()) as KanbanOrder;
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, workflow: updated.workflow ?? workflow } : o
        )
      );
    } catch {
      alert("Aşama güncellenemedi.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 xl:grid-cols-5 md:overflow-visible md:snap-none">
      {byWorkflow.map((col) => (
        <div
          key={col.id}
          className="admin-card p-3 w-[min(78vw,240px)] shrink-0 snap-start md:w-auto md:min-w-0"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider text-orange mb-3">
            {col.label}
            <span className="ml-1 text-[#666]">({col.items.length})</span>
          </h3>
          <ul className="space-y-2">
            {col.items.map((order) => {
              const prev = prevWorkflowId(order.workflow);
              const next = nextWorkflowId(order.workflow);
              return (
                <li
                  key={order.id}
                  className="bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-sm"
                >
                  <Link
                    href={`/admin/siparisler/${order.id}`}
                    className="font-semibold text-white hover:text-orange"
                  >
                    {order.orderNo}
                  </Link>
                  <p className="text-[#aaa] truncate">{order.name}</p>
                  <p className="text-xs text-[#666]">{order.phone}</p>
                  <p className="text-orange font-semibold mt-1">
                    {formatPrice(order.total)}
                  </p>
                  <div className="flex gap-1 mt-2">
                    {prev && (
                      <button
                        type="button"
                        disabled={busy === order.id}
                        onClick={() => moveOrder(order.id, prev)}
                        className="flex-1 flex items-center justify-center gap-0.5 py-1 text-[10px] uppercase border border-[#444] rounded hover:border-orange text-[#aaa] hover:text-orange disabled:opacity-50"
                      >
                        <ChevronLeft size={12} />
                        Geri
                      </button>
                    )}
                    {next && (
                      <button
                        type="button"
                        disabled={busy === order.id}
                        onClick={() => moveOrder(order.id, next)}
                        className="flex-1 flex items-center justify-center gap-0.5 py-1 text-[10px] uppercase border border-[#444] rounded hover:border-orange text-[#aaa] hover:text-orange disabled:opacity-50"
                      >
                        İleri
                        <ChevronRight size={12} />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
            {col.items.length === 0 && (
              <p className="text-xs text-[#555] text-center py-4">Boş</p>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}
