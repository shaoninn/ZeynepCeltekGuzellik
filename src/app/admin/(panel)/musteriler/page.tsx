import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-2">Müşteriler</h1>
      <p className="text-sm text-[#888] mb-6">
        Teklif taleplerinden otomatik oluşan hafif CRM listesi.
      </p>
      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#888] border-b border-[#333]">
              <th className="p-3">Ad</th>
              <th className="p-3">Telefon</th>
              <th className="p-3">E-posta</th>
              <th className="p-3">Güncelleme</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-[#666]">
                  Henüz müşteri kaydı yok.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="border-b border-[#222]">
                  <td className="p-3 text-white">{c.name}</td>
                  <td className="p-3">{c.phone}</td>
                  <td className="p-3">{c.email || "—"}</td>
                  <td className="p-3 text-[#888]">
                    {new Date(c.updatedAt).toLocaleString("tr-TR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
