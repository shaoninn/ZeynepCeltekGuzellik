"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "zc_editor_help_seen_v1";

export function EditorHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setOpen(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/75"
        aria-label="Kapat"
        onClick={dismiss}
      />
      <div className="relative w-full max-w-lg border border-orange/40 bg-card p-6 shadow-2xl">
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 text-muted hover:text-white"
          aria-label="Kapat"
        >
          <X size={18} />
        </button>
        <p className="text-orange text-xs font-semibold tracking-[0.2em] uppercase mb-2">
          Canlı editör
        </p>
        <h2 className="font-display text-xl font-bold text-white mb-3">
          Siteyi tıklayarak düzenleyin
        </h2>
        <ol className="space-y-2 text-sm text-muted list-decimal list-inside leading-relaxed">
          <li>Turuncu çerçeveli metin veya görsele tıklayın.</li>
          <li>Değişikliği yazın veya görsel yükleyin.</li>
          <li>
            <strong className="text-white">Kaydet</strong> ile yayınlayın.
          </li>
          <li>Üstten sayfa değiştirin; menü ve iletişim bilgilerini panelden yönetin.</li>
          <li>Ürün / proje / kategori için Admin panelini kullanın.</li>
        </ol>
        <button
          type="button"
          onClick={dismiss}
          className="mt-5 w-full px-4 py-2.5 bg-orange text-white text-sm font-semibold uppercase tracking-wider hover:bg-orange-dark"
        >
          Anladım, düzenlemeye başla
        </button>
      </div>
    </div>
  );
}
