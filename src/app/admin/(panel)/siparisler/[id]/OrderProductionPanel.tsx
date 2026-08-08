"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminButton, AdminField, apiJson } from "@/components/admin/AdminForm";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { WORKFLOW_STEPS } from "@/lib/order-workflow";

export function OrderProductionPanel({
  id,
  workflow,
  productionNotes,
  productionFile,
  paymentStatus,
  mountAt,
  mountNote,
}: {
  id: string;
  workflow: string;
  productionNotes: string | null;
  productionFile: string | null;
  paymentStatus: string;
  mountAt: string | null;
  mountNote: string | null;
}) {
  const router = useRouter();
  const [notes, setNotes] = useState(productionNotes || "");
  const [file, setFile] = useState(productionFile || "");
  const [stage, setStage] = useState(workflow || "INTAKE");
  const [pay, setPay] = useState(paymentStatus || "UNPAID");
  const [mount, setMount] = useState(
    mountAt ? mountAt.slice(0, 16) : ""
  );
  const [mNote, setMNote] = useState(mountNote || "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    setLoading(true);
    setMsg(null);
    try {
      await apiJson(`/api/orders/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          workflow: stage,
          productionNotes: notes,
          productionFile: file.trim() || null,
          paymentStatus: pay,
          mountAt: mount || null,
          mountNote: mNote || null,
        }),
      });
      setMsg("Kaydedildi.");
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Kayıt hatası");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-card p-5 space-y-4">
      <h2 className="font-semibold">Üretim kartı & ödeme</h2>
      <AdminField label="İş akışı aşaması">
        <select
          className="admin-input"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
        >
          {WORKFLOW_STEPS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </AdminField>
      <AdminField label="Ödeme durumu">
        <select
          className="admin-input"
          value={pay}
          onChange={(e) => setPay(e.target.value)}
        >
          <option value="UNPAID">Ödenmedi</option>
          <option value="PENDING">Ödeme bekleniyor</option>
          <option value="PAID">Ödendi</option>
          <option value="REFUNDED">İade</option>
        </select>
      </AdminField>
      <AdminField label="Hizmet notları (içerik, malzeme, süre)">
        <textarea
          className="admin-input min-h-[100px]"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Program içeriği, malzeme seti, süre notları…"
        />
      </AdminField>
      <ImageUploadField
        label="Hizmet eki (PDF / görsel URL)"
        value={file}
        onChange={setFile}
        help="Müfredat veya görsel linki. PDF yükleyip URL yapıştırın."
      />
      <AdminField label="Randevu">
        <input
          type="datetime-local"
          className="admin-input"
          value={mount}
          onChange={(e) => setMount(e.target.value)}
        />
      </AdminField>
      <AdminField label="Randevu notu">
        <input
          className="admin-input"
          value={mNote}
          onChange={(e) => setMNote(e.target.value)}
        />
      </AdminField>
      {msg && <p className="text-xs text-[#888]">{msg}</p>}
      <AdminButton loading={loading} onClick={() => void save()}>
        Hizmet bilgisini kaydet
      </AdminButton>
    </div>
  );
}
