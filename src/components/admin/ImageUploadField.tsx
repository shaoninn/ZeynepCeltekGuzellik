"use client";

import {
  useCallback,
  useId,
  useRef,
  useState,
  type DragEvent,
  type ChangeEvent,
} from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
const ACCEPT_LABEL = "JPG, PNG, WEBP veya GIF — en fazla 8 MB · otomatik WebP";

async function uploadFile(
  file: File,
  opts: { removeBg?: boolean } = {}
): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("alt", file.name);
  if (opts.removeBg) form.append("removeBg", "1");
  const res = await fetch("/api/upload", { method: "POST", body: form });
  const data = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || !data.url) {
    throw new Error(data.error || "Görsel yüklenemedi");
  }
  return data.url;
}

/** Client-side bg removal (WASM) — no API key; first run downloads model. */
async function clientRemoveBackground(file: File): Promise<File> {
  const { removeBackground } = await import("@imgly/background-removal");
  const blob = await removeBackground(file);
  return new File([blob], file.name.replace(/\.\w+$/, "") + "-nobg.png", {
    type: "image/png",
  });
}

function DropZone({
  disabled,
  multiple,
  inputId,
  onFiles,
}: {
  disabled: boolean;
  multiple: boolean;
  inputId: string;
  onFiles: (files: FileList | File[]) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function onDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setDragOver(true);
  }

  function onDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (disabled) return;
    if (e.dataTransfer.files?.length) onFiles(e.dataTransfer.files);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) onFiles(e.target.files);
    e.target.value = "";
  }

  return (
    <label
      htmlFor={inputId}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center cursor-pointer transition-colors ${
        disabled ? "opacity-60 cursor-wait" : "hover:border-orange hover:bg-orange/5"
      } ${
        dragOver
          ? "border-orange bg-orange/10"
          : "border-[#333] bg-black/30"
      }`}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPT}
        multiple={multiple}
        disabled={disabled}
        onChange={onChange}
        className="sr-only"
      />
      {disabled ? (
        <Loader2 className="text-orange animate-spin" size={28} />
      ) : (
        <Upload className={dragOver ? "text-orange" : "text-[#888]"} size={28} />
      )}
      <span className="text-sm font-semibold text-white">
        {disabled
          ? "İşleniyor…"
          : dragOver
            ? "Bırakın, yüklensin"
            : "Görseli buraya sürükleyin veya tıklayıp seçin"}
      </span>
      <span className="text-xs text-[#888]">{ACCEPT_LABEL}</span>
    </label>
  );
}

async function prepareAndUpload(
  file: File,
  removeBg: boolean
): Promise<string> {
  let toSend = file;
  let serverRemoveBg = false;

  if (removeBg) {
    try {
      toSend = await clientRemoveBackground(file);
    } catch (error) {
      console.warn("[bg-removal] client failed, trying server:", error);
      serverRemoveBg = true;
    }
  }

  return uploadFile(toSend, { removeBg: serverRemoveBg });
}

/** Tek görsel — sürükle-bırak veya tıkla-seç. */
export function ImageUploadField({
  value,
  onChange,
  label = "Görsel",
  help,
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  help?: string;
}) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removeBg, setRemoveBg] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const file = Array.from(files)[0];
      if (!file) return;
      setUploading(true);
      setError(null);
      try {
        const url = await prepareAndUpload(file, removeBg);
        onChange(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Yükleme hatası");
      } finally {
        setUploading(false);
      }
    },
    [onChange, removeBg]
  );

  return (
    <div className="mb-4">
      <label className="admin-label">{label}</label>
      {value ? (
        <div className="relative mb-3 overflow-hidden rounded-lg border border-[#333] bg-black max-w-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Yüklenen görsel"
            className="w-full max-h-56 object-contain bg-black"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-md bg-black/80 border border-[#444] px-2 py-1.5 text-xs text-white hover:border-red-500 hover:text-red-400"
          >
            <Trash2 size={14} />
            Kaldır
          </button>
        </div>
      ) : null}
      <label className="flex items-center gap-2 text-xs text-[#aaa] mb-2 cursor-pointer">
        <input
          type="checkbox"
          checked={removeBg}
          onChange={(e) => setRemoveBg(e.target.checked)}
        />
        Arka planı kaldır (cihazda / Remove.bg)
      </label>
      <DropZone
        disabled={uploading}
        multiple={false}
        inputId={inputId}
        onFiles={handleFiles}
      />
      {help && !error && <p className="admin-help">{help}</p>}
      {!help && !error && (
        <p className="admin-help">
          Sunucu görseli otomatik WebP’ye çevirir. Arka plan kaldırma ilk
          kullanımda model indirebilir.
        </p>
      )}
      {error && <p className="admin-error">{error}</p>}
    </div>
  );
}

/** Birden fazla görsel — sürükle-bırak veya tıkla-seç; küçük önizleme + sil. */
export function ImageGalleryField({
  value,
  onChange,
  label = "Galeri görselleri",
  help,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  help?: string;
}) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removeBg, setRemoveBg] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      if (!list.length) return;
      setUploading(true);
      setError(null);
      try {
        const urls: string[] = [];
        for (const file of list) {
          urls.push(await prepareAndUpload(file, removeBg));
        }
        onChange([...value, ...urls]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Yükleme hatası");
      } finally {
        setUploading(false);
      }
    },
    [onChange, value, removeBg]
  );

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="mb-4">
      <label className="admin-label">{label}</label>
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#333] bg-black"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Galeri ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute top-1.5 right-1.5 inline-flex items-center justify-center rounded-md bg-black/80 border border-[#444] p-1.5 text-white hover:border-red-500 hover:text-red-400"
                aria-label="Görseli kaldır"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      <label className="flex items-center gap-2 text-xs text-[#aaa] mb-2 cursor-pointer">
        <input
          type="checkbox"
          checked={removeBg}
          onChange={(e) => setRemoveBg(e.target.checked)}
        />
        Arka planı kaldır
      </label>
      <DropZone
        disabled={uploading}
        multiple
        inputId={inputId}
        onFiles={handleFiles}
      />
      {value.length === 0 && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-[#666]">
          <ImagePlus size={14} />
          Henüz görsel yok
        </p>
      )}
      {help && !error && <p className="admin-help">{help}</p>}
      {error && <p className="admin-error">{error}</p>}
    </div>
  );
}
