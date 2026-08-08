"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { useEditor } from "@/components/editor/EditorProvider";

type Field = "name" | "description";

/**
 * Edit category name/description via Admin Categories API.
 * Does not touch products — only Category row.
 */
export function EditableCategoryField({
  categoryId,
  slug,
  name,
  description,
  field,
  as: Tag = "span",
  className,
  help,
  multiline = false,
  block = false,
}: {
  categoryId: string;
  slug: string;
  name: string;
  description: string;
  field: Field;
  as?: ElementType;
  className?: string;
  help?: string;
  multiline?: boolean;
  block?: boolean;
}) {
  const router = useRouter();
  const { enabled, bumpDirty, saving, setSaving, setStatus } = useEditor();
  const initial = field === "name" ? name : description;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initial);
  const [local, setLocal] = useState(initial);
  const dirtyRef = useRef(false);

  useEffect(() => {
    const next = field === "name" ? name : description;
    setLocal(next);
    if (!editing) setDraft(next);
  }, [name, description, field, editing]);

  if (!enabled || categoryId.startsWith("fallback-")) {
    return <Tag className={className}>{local || null}</Tag>;
  }

  if (!local && field === "description" && !editing) {
    return (
      <button
        type="button"
        className="text-sm text-orange/80 hover:text-orange underline-offset-2 hover:underline"
        onClick={() => {
          setDraft("");
          setEditing(true);
        }}
      >
        + Kategori açıklaması ekle
      </button>
    );
  }

  async function commit() {
    if (draft === local) {
      setEditing(false);
      return;
    }
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: field === "name" ? draft : name,
          slug,
          description:
            field === "description" ? draft : description || null,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Kategori kaydedilemedi");
      setLocal(draft);
      if (dirtyRef.current) {
        bumpDirty(-1);
        dirtyRef.current = false;
      }
      setEditing(false);
      setStatus("Kategori kaydedildi");
      setTimeout(() => setStatus(null), 2500);
      router.refresh();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Kategori hatası");
    } finally {
      setSaving(false);
    }
  }

  function cancel() {
    setDraft(local);
    if (dirtyRef.current) {
      bumpDirty(-1);
      dirtyRef.current = false;
    }
    setEditing(false);
  }

  function onDraftChange(next: string) {
    setDraft(next);
    if (!dirtyRef.current && next !== local) {
      dirtyRef.current = true;
      bumpDirty(1);
    }
  }

  return (
    <div
      className={`relative group/edit ${block ? "block w-full" : "inline-block max-w-full"}`}
    >
      <Tag
        className={`${className || ""} cursor-pointer rounded-sm transition-shadow ${
          editing
            ? "ring-2 ring-orange ring-offset-2 ring-offset-black"
            : "hover:ring-2 hover:ring-orange/60 hover:ring-offset-2 hover:ring-offset-black"
        }`}
        onClick={() => {
          setDraft(local);
          setEditing(true);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setDraft(local);
            setEditing(true);
          }
        }}
      >
        {local}
      </Tag>
      <span className="pointer-events-none absolute -top-5 left-0 z-20 opacity-0 group-hover/edit:opacity-100 inline-flex items-center rounded bg-orange px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
        Kategori
      </span>
      {editing && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[min(100vw-2rem,28rem)] rounded-lg border border-border bg-card p-3 shadow-2xl">
          <p className="text-[11px] text-muted mb-2 leading-relaxed">
            {help ||
              "Kategori adı / açıklama. Ürün fiyatları ve ürün listesi Admin → Ürünler’den yönetilir."}
          </p>
          {multiline ? (
            <textarea
              className="admin-input min-h-[100px] text-sm w-full"
              value={draft}
              onChange={(e) => onDraftChange(e.target.value)}
              autoFocus
            />
          ) : (
            <input
              className="admin-input text-sm w-full"
              value={draft}
              onChange={(e) => onDraftChange(e.target.value)}
              autoFocus
            />
          )}
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => void commit()}
              className="px-3 py-1.5 bg-orange text-white text-xs font-semibold uppercase tracking-wider hover:bg-orange-dark disabled:opacity-50"
            >
              Kaydet
            </button>
            <button
              type="button"
              onClick={cancel}
              className="px-3 py-1.5 border border-border text-xs text-muted hover:text-white"
            >
              İptal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
