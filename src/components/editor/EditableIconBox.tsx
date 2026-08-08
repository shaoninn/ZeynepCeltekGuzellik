"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type ElementType,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ImagePlus, Loader2, Minus, Plus } from "lucide-react";
import { useEditor } from "@/components/editor/EditorProvider";
import { EditorEditPanel } from "@/components/editor/EditorEditPanel";

type EditableIconBoxProps = {
  contentKey: string;
  sizeKey: string;
  iconUrl?: string;
  iconSize?: number;
  FallbackIcon: ElementType;
  alt: string;
  help?: string;
  minSize?: number;
  maxSize?: number;
};

/**
 * Icon with optional custom image — editor: hover replace, corner drag to resize.
 * No overlapping “Görsel” badge or range sliders.
 */
export function EditableIconBox({
  contentKey,
  sizeKey,
  iconUrl = "",
  iconSize = 22,
  FallbackIcon,
  alt,
  help,
  minSize = 16,
  maxSize = 44,
}: EditableIconBoxProps) {
  const { enabled, saveContent, saving, draftEpoch } = useEditor();
  const [url, setUrl] = useState(iconUrl);
  const [size, setSize] = useState(iconSize);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputId = useId();
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const sizeRef = useRef(size);
  sizeRef.current = size;
  const resizeRef = useRef<{ startX: number; startY: number; startSize: number } | null>(
    null
  );

  useEffect(() => {
    setUrl(iconUrl);
    setSize(iconSize);
    setOpen(false);
  }, [draftEpoch]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setUrl(iconUrl);
  }, [iconUrl]);

  useEffect(() => {
    setSize(iconSize);
  }, [iconSize]);

  const box = size + 20;

  const persistSize = useCallback(
    async (next: number) => {
      const clamped = Math.max(minSize, Math.min(maxSize, Math.round(next)));
      setSize(clamped);
      await saveContent(sizeKey, String(clamped));
    },
    [maxSize, minSize, saveContent, sizeKey]
  );

  async function uploadFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("alt", file.name);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error || "Yükleme başarısız");
      const ok = await saveContent(contentKey, data.url);
      if (ok) {
        setUrl(data.url);
        setOpen(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yükleme hatası");
    } finally {
      setUploading(false);
    }
  }

  function onResizeDown(e: ReactPointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startSize: size,
    };
  }

  function onResizeMove(e: ReactPointerEvent) {
    const d = resizeRef.current;
    if (!d) return;
    const delta = (e.clientX - d.startX + (e.clientY - d.startY)) / 2;
    const next = Math.max(minSize, Math.min(maxSize, d.startSize + delta));
    setSize(next);
  }

  function onResizeUp(e: ReactPointerEvent) {
    if (!resizeRef.current) return;
    resizeRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    void persistSize(sizeRef.current);
  }

  if (!enabled) {
    return (
      <div
        className="rounded-lg bg-orange/10 text-orange flex items-center justify-center shrink-0"
        style={{ width: box, height: box }}
      >
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={alt}
            className="w-full h-full object-contain p-1.5"
          />
        ) : (
          <FallbackIcon size={size} strokeWidth={1.5} />
        )}
      </div>
    );
  }

  return (
    <div
      className="relative group/icon shrink-0"
      style={{ width: box, height: box }}
    >
      <div className="w-full h-full rounded-lg bg-orange/10 text-orange flex items-center justify-center overflow-hidden border border-transparent group-hover/icon:border-orange/50">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={alt}
            className="w-full h-full object-contain p-1.5"
          />
        ) : (
          <FallbackIcon size={size} strokeWidth={1.5} />
        )}
      </div>

      {/* Hover: replace image — does not cover the whole icon with a badge */}
      <button
        ref={anchorRef}
        type="button"
        onClick={() => setOpen(true)}
        className="absolute inset-0 flex items-end justify-center pb-1 opacity-0 group-hover/icon:opacity-100 transition-opacity bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-lg"
        title="İkonu değiştir"
      >
        <span className="inline-flex items-center gap-1 rounded bg-orange px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white">
          <ImagePlus size={10} />
          Değiştir
        </span>
      </button>

      {/* Corner: drag to resize */}
      <button
        type="button"
        aria-label="Boyutu sürükleyerek ayarla"
        onPointerDown={onResizeDown}
        onPointerMove={onResizeMove}
        onPointerUp={onResizeUp}
        onPointerCancel={onResizeUp}
        disabled={saving}
        className="absolute -bottom-1 -right-1 z-10 w-4 h-4 rounded-sm bg-orange border border-white/80 cursor-nwse-resize touch-none shadow opacity-90 hover:opacity-100"
        title="Köşeden tutup sürükleyerek büyüt / küçült"
      />

      {/* Quick +/- for accessibility */}
      <div className="absolute -left-1 top-1/2 -translate-y-1/2 -translate-x-full flex flex-col gap-0.5 opacity-0 group-hover/icon:opacity-100 transition-opacity">
        <button
          type="button"
          disabled={saving || size >= maxSize}
          onClick={() => void persistSize(size + 2)}
          className="w-5 h-5 rounded bg-black/90 border border-border text-muted hover:text-white flex items-center justify-center"
          aria-label="Büyüt"
        >
          <Plus size={10} />
        </button>
        <button
          type="button"
          disabled={saving || size <= minSize}
          onClick={() => void persistSize(size - 2)}
          className="w-5 h-5 rounded bg-black/90 border border-border text-muted hover:text-white flex items-center justify-center"
          aria-label="Küçült"
        >
          <Minus size={10} />
        </button>
      </div>

      <EditorEditPanel
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={anchorRef}
      >
        <p className="text-[11px] text-muted mb-3 leading-relaxed">
          {help || "İkon görseli yükleyin (JPG/PNG/WEBP)."}
        </p>
        <label
          htmlFor={inputId}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e: DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) void uploadFile(file);
          }}
          className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-3 py-6 text-center cursor-pointer ${
            dragOver ? "border-orange bg-orange/10" : "border-[#333]"
          }`}
        >
          <input
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            disabled={uploading || saving}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) void uploadFile(file);
              e.target.value = "";
            }}
          />
          {uploading ? (
            <Loader2 className="animate-spin text-orange" size={22} />
          ) : (
            <ImagePlus size={22} className="text-orange" />
          )}
          <span className="text-xs text-white font-semibold">
            {uploading ? "Yükleniyor…" : "Sürükle veya tıkla"}
          </span>
        </label>
        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        <div className="mt-3 flex gap-2">
          {url ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                void (async () => {
                  const ok = await saveContent(contentKey, "");
                  if (ok) setUrl("");
                  setOpen(false);
                })();
              }}
              className="px-3 py-1.5 border border-border text-xs text-muted hover:text-white"
            >
              Varsayılan ikon
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-3 py-1.5 border border-border text-xs text-muted hover:text-white ml-auto"
          >
            Kapat
          </button>
        </div>
      </EditorEditPanel>
    </div>
  );
}
