"use client";

import { useState, type FormEvent, type ReactNode } from "react";

interface FieldProps {
  label: string;
  help?: string;
  error?: string;
  children: ReactNode;
}

export function AdminField({ label, help, error, children }: FieldProps) {
  return (
    <div className="mb-4">
      <label className="admin-label">{label}</label>
      {children}
      {help && !error && <p className="admin-help">{help}</p>}
      {error && <p className="admin-error">{error}</p>}
    </div>
  );
}

interface AlertProps {
  type: "success" | "error" | "warning";
  children: ReactNode;
}

export function AdminAlert({ type, children }: AlertProps) {
  const cls =
    type === "success"
      ? "admin-success"
      : type === "warning"
        ? "admin-warning"
        : "admin-error p-3 bg-red-500/10 border border-red-500/30 rounded-md";
  return <div className={`${cls} mb-4`}>{children}</div>;
}

export function AdminButton({
  children,
  variant = "primary",
  loading,
  type = "button",
  onClick,
  disabled,
  className = "",
}: {
  children: ReactNode;
  variant?: "primary" | "danger" | "ghost";
  loading?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50";
  const variants = {
    primary: "bg-orange text-white hover:bg-orange-dark",
    danger: "bg-red-600/80 text-white hover:bg-red-600",
    ghost: "border border-[#333] text-[#ccc] hover:border-orange hover:text-orange",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? "Kaydediliyor..." : children}
    </button>
  );
}

export function useAdminForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function submit(
    e: FormEvent,
    action: () => Promise<void>,
    successMsg = "Başarıyla kaydedildi."
  ) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await action();
      setSuccess(successMsg);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, success, setError, setSuccess, submit };
}

export async function apiJson<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "İşlem başarısız");
  }
  return data as T;
}
