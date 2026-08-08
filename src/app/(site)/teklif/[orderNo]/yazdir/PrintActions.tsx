"use client";

export function PrintActions() {
  return (
    <div className="mb-6 print:hidden flex gap-3">
      <button
        type="button"
        onClick={() => window.print()}
        className="px-4 py-2 bg-orange text-black font-semibold text-sm uppercase tracking-wider hover:bg-orange-dark"
      >
        Yazdır
      </button>
      <button
        type="button"
        onClick={() => window.history.back()}
        className="px-4 py-2 border border-gray-400 text-sm"
      >
        Geri
      </button>
    </div>
  );
}
