import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-2">Audit log</h1>
      <p className="text-sm text-[#888] mb-6">
        Son 200 güvenlik / operasyon kaydı.
      </p>
      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#888] border-b border-[#333]">
              <th className="p-3">Zaman</th>
              <th className="p-3">Aksiyon</th>
              <th className="p-3">Aktör</th>
              <th className="p-3">Varlık</th>
              <th className="p-3">IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-[#666]">
                  Kayıt yok.
                </td>
              </tr>
            ) : (
              logs.map((l) => (
                <tr key={l.id} className="border-b border-[#222]">
                  <td className="p-3 text-[#888] whitespace-nowrap">
                    {new Date(l.createdAt).toLocaleString("tr-TR")}
                  </td>
                  <td className="p-3 text-white">{l.action}</td>
                  <td className="p-3">{l.actorEmail || "—"}</td>
                  <td className="p-3">
                    {l.entity || "—"}
                    {l.entityId ? (
                      <span className="text-[#666] text-xs block truncate max-w-[160px]">
                        {l.entityId}
                      </span>
                    ) : null}
                  </td>
                  <td className="p-3 text-[#888]">{l.ip || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
