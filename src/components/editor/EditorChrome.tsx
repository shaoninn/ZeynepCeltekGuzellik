"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  HelpCircle,
  Pencil,
  RotateCcw,
  Save,
  X,
} from "lucide-react";
import { EDITOR_PAGES } from "@/lib/editor-pages";
import { useEditor } from "@/components/editor/EditorProvider";
import { NavEditorPanel } from "@/components/editor/NavEditorPanel";
import { SettingsEditorPanel } from "@/components/editor/SettingsEditorPanel";

export function EditorChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    status,
    saving,
    dirtyCount,
    commitAll,
    discardAll,
    confirmLeave,
  } = useEditor();
  const [pageOpen, setPageOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const current =
    EDITOR_PAGES.find((p) => p.href === pathname) ||
    EDITOR_PAGES.find((p) => pathname.startsWith(p.href) && p.href !== "/duzenle") ||
    EDITOR_PAGES[0];

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirtyCount > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirtyCount]);

  function requestNavigate(href: string) {
    if (dirtyCount <= 0) {
      router.push(href);
      return;
    }
    setPendingHref(href);
    setLeaveOpen(true);
  }

  async function saveThenLeave() {
    const ok = await commitAll();
    if (!ok) return;
    const href = pendingHref;
    setLeaveOpen(false);
    setPendingHref(null);
    if (href) router.push(href);
    router.refresh();
  }

  function discardThenLeave() {
    discardAll();
    const href = pendingHref;
    setLeaveOpen(false);
    setPendingHref(null);
    if (href) router.push(href);
    router.refresh();
  }

  async function onSaveClick() {
    const ok = await commitAll();
    if (ok) router.refresh();
  }

  function onDiscardClick() {
    if (dirtyCount <= 0) return;
    const ok = window.confirm(
      "Tüm kaydedilmemiş değişiklikler geri alınacak. Emin misiniz?"
    );
    if (!ok) return;
    discardAll();
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-[80] border-b border-border bg-[#111]/95 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-2 sm:px-4 min-h-14 py-2 flex flex-wrap items-center gap-x-2 gap-y-2 sm:gap-3">
          <button
            type="button"
            onClick={() => requestNavigate("/admin")}
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-white shrink-0"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Admin</span>
          </button>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange/15 text-orange px-2 py-1 text-[10px] font-semibold uppercase tracking-wider shrink-0">
            <Pencil size={10} />
            <span className="hidden sm:inline">Düzenleme</span>
            <span className="sm:hidden">Edit</span>
          </span>

          <div className="relative min-w-0 flex-1 sm:flex-none max-w-full">
            <button
              type="button"
              onClick={() => setPageOpen((v) => !v)}
              className="inline-flex items-center gap-2 w-full sm:w-auto max-w-full sm:max-w-xs truncate rounded-lg border border-[#333] bg-black/40 px-2.5 sm:px-3 py-1.5 text-sm text-white hover:border-orange"
            >
              <span className="truncate">Sayfa: {current.label}</span>
              <ChevronDown size={14} className="shrink-0 text-muted" />
            </button>
            {pageOpen && (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-40"
                  aria-label="Kapat"
                  onClick={() => setPageOpen(false)}
                />
                <div className="absolute left-0 right-0 sm:right-auto top-full z-50 mt-1 w-[min(100vw-1.5rem,20rem)] max-h-[70vh] overflow-y-auto rounded-lg border border-[#333] bg-[#151515] shadow-2xl">
                  <p className="px-3 py-2 text-[10px] uppercase tracking-wider text-[#666] border-b border-[#333]">
                    Düzenlenebilir sayfalar
                  </p>
                  {EDITOR_PAGES.map((page) => (
                    <button
                      key={page.href}
                      type="button"
                      onClick={() => {
                        setPageOpen(false);
                        if (page.href === pathname) return;
                        requestNavigate(page.href);
                      }}
                      className={`block w-full text-left px-3 py-2.5 border-b border-[#222] hover:bg-white/5 ${
                        page.href === current.href ? "bg-orange/10" : ""
                      }`}
                    >
                      <span className="text-sm text-white font-medium">
                        {page.label}
                      </span>
                      <span className="block text-[11px] text-muted mt-0.5 leading-snug">
                        {page.help}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="hidden sm:block flex-1" />

          <button
            type="button"
            onClick={() => {
              if (!confirmLeave("Menü düzenleyicisini açmadan önce kaydedilmemiş değişiklikler kaybolabilir. Devam?"))
                return;
              setNavOpen(true);
            }}
            className="text-[11px] sm:text-xs text-muted hover:text-orange px-1.5 sm:px-2 py-1.5 shrink-0"
          >
            Menü
          </button>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="text-[11px] sm:text-xs text-muted hover:text-orange px-1.5 sm:px-2 py-1.5 shrink-0"
          >
            İletişim
          </button>

          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            className="w-9 h-9 inline-flex items-center justify-center text-muted hover:text-orange shrink-0"
            aria-label="Yardım"
          >
            <HelpCircle size={18} />
          </button>

          {dirtyCount > 0 && (
            <button
              type="button"
              onClick={onDiscardClick}
              disabled={saving}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-[11px] text-muted hover:text-white shrink-0 disabled:opacity-50"
              title="Tüm kaydedilmemiş değişiklikleri geri al"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">Geri al</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => void onSaveClick()}
            disabled={saving || dirtyCount <= 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange text-black text-[11px] font-semibold uppercase tracking-wider hover:bg-orange-dark shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save size={14} />
            Kaydet
            {dirtyCount > 0 ? ` (${dirtyCount})` : ""}
          </button>

          <span className="text-[10px] sm:text-[11px] text-muted shrink-0 max-w-[7rem] sm:max-w-none text-right truncate">
            {saving
              ? "Kaydediliyor…"
              : status ||
                (dirtyCount > 0
                  ? `${dirtyCount} kaydedilmedi`
                  : "Hazır")}
          </span>
        </div>
      </div>

      <div className="pt-0">{children}</div>

      {leaveOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Kapat"
            onClick={() => {
              setLeaveOpen(false);
              setPendingHref(null);
            }}
          />
          <div className="relative w-full max-w-md border border-border bg-card p-5 shadow-2xl rounded-xl">
            <h2 className="font-display text-lg font-bold text-white mb-2">
              Kaydedilmemiş değişiklikler
            </h2>
            <p className="text-sm text-muted mb-5 leading-relaxed">
              {dirtyCount} değişiklik henüz kaydedilmedi. Çıkarsanız bu
              değişiklikler kaybolur.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => void saveThenLeave()}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-orange text-black text-sm font-semibold"
              >
                <Save size={16} />
                Kaydet ve çık
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={discardThenLeave}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-border text-sm text-muted hover:text-white"
              >
                Kaydetmeden çık
              </button>
              <button
                type="button"
                onClick={() => {
                  setLeaveOpen(false);
                  setPendingHref(null);
                }}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-border text-sm text-white sm:ml-auto"
              >
                Düzenlemeye dön
              </button>
            </div>
          </div>
        </div>
      )}

      {helpOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Kapat"
            onClick={() => setHelpOpen(false)}
          />
          <div className="relative w-full max-w-lg border border-border bg-card p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setHelpOpen(false)}
              className="absolute right-3 top-3 text-muted hover:text-white"
              aria-label="Kapat"
            >
              <X size={18} />
            </button>
            <h2 className="font-display text-xl font-bold text-white mb-3">
              Canlı site editörü — nasıl kullanılır?
            </h2>
            <ol className="space-y-2 text-sm text-muted list-decimal list-inside leading-relaxed">
              <li>Turuncu çerçeveli metin veya görsele tıklayın.</li>
              <li>
                Değişiklikler önce taslak olarak uygulanır; siteye yansıması için
                üstteki <strong className="text-white">Kaydet</strong> gerekir.
              </li>
              <li>
                <strong className="text-white">Geri al</strong> tüm kaydedilmemiş
                değişiklikleri iptal eder.
              </li>
              <li>
                Sayfa değiştirirken veya çıkarken kaydedilmemiş değişiklik varsa
                uyarı görürsünüz.
              </li>
            </ol>
          </div>
        </div>
      )}

      {navOpen && <NavEditorPanel onClose={() => setNavOpen(false)} />}
      {settingsOpen && (
        <SettingsEditorPanel onClose={() => setSettingsOpen(false)} />
      )}
    </div>
  );
}
