"use client";

export function AdminPrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="ml-4 px-4 py-2 bg-orange text-black font-semibold text-sm uppercase tracking-wider hover:bg-orange-dark"
    >
      Yazdır
    </button>
  );
}
