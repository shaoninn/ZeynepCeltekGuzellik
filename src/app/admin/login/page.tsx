"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/brand/Logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [challenge, setChallenge] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          challenge
            ? { email, password, challenge, totpCode }
            : { email, password }
        ),
      });
      const data = await res.json();
      if (data.requires2fa && data.challenge) {
        setChallenge(data.challenge as string);
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Giriş başarısız");

      const from = searchParams.get("from");
      const safeFrom =
        from &&
        (from.startsWith("/admin") || from.startsWith("/duzenle")) &&
        !from.startsWith("//")
          ? from
          : "/admin";
      router.push(safeFrom);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md rounded-2xl border border-border bg-card p-8 space-y-4 shadow-[0_0_40px_rgba(245,197,24,0.08)]"
    >
      <div className="mb-2">
        <Logo href={null} size="md" />
        <p className="text-sm text-muted mt-3">Yönetim paneli girişi</p>
      </div>
      {error && (
        <p className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 p-3 rounded-lg">
          {error}
        </p>
      )}
      {!challenge ? (
        <>
          <div>
            <label className="admin-label" htmlFor="email">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              className="admin-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="password">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              className="admin-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
        </>
      ) : (
        <div>
          <label className="admin-label" htmlFor="totp">
            Authenticator kodu (2FA)
          </label>
          <input
            id="totp"
            className="admin-input tracking-widest"
            value={totpCode}
            onChange={(e) => setTotpCode(e.target.value)}
            required
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="6 haneli kod"
          />
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg bg-orange text-black font-bold uppercase tracking-wider hover:bg-orange-dark disabled:opacity-50 transition-colors"
      >
        {loading ? "Kontrol..." : challenge ? "Doğrula" : "Giriş Yap"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(245,197,24,0.18), transparent 55%)",
        }}
      />
      <Suspense fallback={<p className="text-muted relative">Yükleniyor…</p>}>
        <div className="relative w-full flex justify-center">
          <LoginForm />
        </div>
      </Suspense>
    </div>
  );
}
