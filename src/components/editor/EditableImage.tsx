"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEditor } from "@/components/editor/EditorProvider";
import { ImagePlus, Loader2 } from "lucide-react";
import {
  isLocalPublicPath,
  toWebpSrc,
  toWebpSrcMobile,
} from "@/lib/image-optimize";

const EditorImagePanel = dynamic(
  () =>
    import("@/components/editor/EditableImagePanel").then(
      (m) => m.EditableImagePanel
    ),
  { ssr: false }
);

type EditableImageProps = {
  contentKey: string;
  value: string;
  fallback?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  help?: string;
  aspectClass?: string;
  /** When true, fills parent (absolute inset-0) like a background */
  fill?: boolean;
  /** LCP / above-the-fold: preload + high fetch priority */
  priority?: boolean;
  sizes?: string;
};

function PublicImg({
  src,
  alt,
  imgClassName,
  fill,
  priority,
  sizes,
}: {
  src: string;
  alt: string;
  imgClassName: string;
  fill: boolean;
  priority?: boolean;
  sizes?: string;
}) {
  const webp = toWebpSrc(src);
  const webpSm = toWebpSrcMobile(src);
  const usePicture = isLocalPublicPath(src) && Boolean(webpSm || webp !== src);

  if (usePicture) {
    const className = `absolute inset-0 h-full w-full ${imgClassName}`;
    // Single download via srcSet — do not set desktop src while also listing sm source.
    if (webpSm) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={webpSm}
          srcSet={`${webpSm} 960w, ${webp} 1600w`}
          sizes={sizes || "(max-width: 640px) 100vw, 50vw"}
          alt={alt}
          width={1600}
          height={1600}
          className={className}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={webp}
        alt={alt}
        width={1600}
        height={1600}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        sizes={sizes}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={webp}
        alt={alt}
        fill
        priority={priority}
        fetchPriority={priority ? "high" : "auto"}
        sizes={sizes || "100vw"}
        className={imgClassName}
        loading={priority ? undefined : "lazy"}
      />
    );
  }

  return (
    <Image
      src={webp}
      alt={alt}
      fill
      priority={priority}
      fetchPriority={priority ? "high" : "auto"}
      sizes={sizes || "100vw"}
      className={imgClassName}
      loading={priority ? undefined : "lazy"}
    />
  );
}

export function EditableImage({
  contentKey,
  value,
  fallback = "",
  alt,
  className,
  imgClassName = "object-cover",
  help,
  aspectClass = "aspect-[16/9]",
  fill = false,
  priority = false,
  sizes,
}: EditableImageProps) {
  const { enabled, saveContent, saving } = useEditor();
  const [local, setLocal] = useState(value || fallback);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocal(value || fallback);
  }, [value, fallback]);

  const src = local || fallback;

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
        setLocal(data.url);
        setOpen(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yükleme hatası");
    } finally {
      setUploading(false);
    }
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void uploadFile(file);
    e.target.value = "";
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void uploadFile(file);
  }

  if (!enabled) {
    if (!src) return null;
    if (fill) {
      return (
        <PublicImg
          src={src}
          alt={alt}
          imgClassName={imgClassName}
          fill
          priority={priority}
          sizes={sizes || "(max-width: 1024px) 100vw, 50vw"}
        />
      );
    }
    return (
      <div className={`relative overflow-hidden ${aspectClass} ${className || ""}`}>
        <PublicImg
          src={src}
          alt={alt}
          imgClassName={imgClassName}
          fill
          priority={priority}
          sizes={sizes || "100vw"}
        />
      </div>
    );
  }

  const panel = open ? (
    <EditorImagePanel
      fill={fill}
      help={help}
      inputId={inputId}
      inputRef={inputRef}
      uploading={uploading}
      saving={saving}
      dragOver={dragOver}
      error={error}
      onDragOver={() => setDragOver(true)}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      onChange={onChange}
      onClose={() => setOpen(false)}
    />
  ) : null;

  if (fill) {
    return (
      <>
        <PublicImg
          src={src}
          alt={alt}
          imgClassName={imgClassName}
          fill
          priority={priority}
          sizes={sizes || "(max-width: 1024px) 100vw, 50vw"}
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed top-[max(5.5rem,env(safe-area-inset-top))] sm:top-[4.75rem] right-3 z-[85] inline-flex items-center gap-1.5 rounded-lg border border-orange/60 bg-black/85 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-orange shadow-lg hover:bg-orange hover:text-white"
        >
          <ImagePlus size={14} />
          Arka plan görseli
        </button>
        {panel}
      </>
    );
  }

  return (
    <div className={`relative group/edit ${className || ""}`}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`relative w-full overflow-hidden border border-transparent hover:border-orange/70 ${aspectClass} bg-card`}
      >
        {src ? (
          <PublicImg
            src={src}
            alt={alt}
            imgClassName={imgClassName}
            fill
            priority={priority}
            sizes={sizes || "100vw"}
          />
        ) : (
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted bg-black/40">
            <ImagePlus size={28} />
            <span className="text-xs">Görsel ekle</span>
          </span>
        )}
        <span className="absolute top-2 left-2 z-10 rounded bg-orange px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white opacity-0 group-hover/edit:opacity-90 transition-opacity">
          Görsel
        </span>
      </button>
      {panel}
    </div>
  );
}
