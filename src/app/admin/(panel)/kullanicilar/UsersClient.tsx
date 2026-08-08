"use client";

import { useState, type FormEvent } from "react";
import {
  AdminAlert,
  AdminButton,
  AdminField,
  apiJson,
} from "@/components/admin/AdminForm";

interface UserRow {
  id: string;
  email: string;
  name: string;
  role: string;
  totpEnabled: boolean;
  createdAt: string | Date;
}

export function UsersClient({ initial }: { initial: UserRow[] }) {
  const [users, setUsers] = useState(initial);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    const list = await apiJson<UserRow[]>("/api/admin-users");
    setUsers(list);
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await apiJson("/api/admin-users", {
        method: "POST",
        body: JSON.stringify({ email, name, password }),
      });
      setEmail("");
      setName("");
      setPassword("");
      setSuccess("Kullanıcı oluşturuldu.");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hata");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Bu admin silinsin mi?")) return;
    setError(null);
    try {
      await apiJson(`/api/admin-users/${id}`, { method: "DELETE" });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hata");
    }
  }

  return (
    <div className="space-y-8">
      {error && <AdminAlert type="error">{error}</AdminAlert>}
      {success && <AdminAlert type="success">{success}</AdminAlert>}

      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#888] border-b border-[#333]">
              <th className="p-3">Ad</th>
              <th className="p-3">E-posta</th>
              <th className="p-3">Rol</th>
              <th className="p-3">2FA</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-[#222]">
                <td className="p-3 text-white">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.totpEnabled ? "Açık" : "Kapalı"}</td>
                <td className="p-3 text-right">
                  <button
                    type="button"
                    onClick={() => onDelete(u.id)}
                    className="text-red-400 hover:underline text-xs"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={onCreate} className="admin-card p-6 max-w-lg">
        <h2 className="font-display text-lg font-bold mb-4">Yeni admin</h2>
        <AdminField label="Ad">
          <input
            className="admin-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </AdminField>
        <AdminField label="E-posta">
          <input
            type="email"
            className="admin-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </AdminField>
        <AdminField label="Şifre" help="En az 8 karakter">
          <input
            type="password"
            className="admin-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </AdminField>
        <AdminButton type="submit" loading={loading}>
          Oluştur
        </AdminButton>
      </form>
    </div>
  );
}
