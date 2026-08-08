"use client";

import type { ChangeEvent, DragEvent, RefObject } from "react";
import { ImagePlus, Loader2 } from "lucide-react";

type EditableImagePanelProps = {
  fill: boolean;
  help?: string;
  inputId: string;
  inputRef: RefObject<HTMLInputElement | null>;
  uploading: boolean;
  saving: boolean;
  dragOver: boolean;
  error: string | null;
  onDragOver: () => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
};

/** Lazy-loaded upload UI — kept out of the public homepage JS chunk. */
export function EditableImagePanel({
  fill,
  help,
  inputId,
  inputRef,
  uploading,
  saving,
  dragOver,
  error,
  onDragOver,
  onDragLeave,
  onDrop,
  onChange,
  onClose,
}: EditableImagePanelProps) {
  return (
    <div
      className={`${
        fill
          ? "fixed left-1/2 top-24 z-[90] w-[min(100vw-2rem,22rem)] -translate-x-1/2"
          : "absolute left-2 top-12 z-50 w-[min(100vw-2rem,22rem)]"
      } rounded-lg border border-border bg-card p-3 shadow-2xl`}
    >
      <p className="text-[11px] text-muted mb-3 leading-relaxed">
        {help ||
          "Bilgisayardan bir görsel seçin veya sürükleyip bırakın (JPG/PNG/WEBP, max 8 MB)."}
      </p>
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          onDragOver();
        }}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-3 py-6 text-center cursor-pointer ${
          dragOver ? "border-orange bg-orange/10" : "border-[#333]"
        }`}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          disabled={uploading || saving}
          onChange={onChange}
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
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 border border-border text-xs text-muted hover:text-white"
        >
          Kapat
        </button>
      </div>
    </div>
  );
}
