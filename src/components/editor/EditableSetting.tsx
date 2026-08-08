"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ElementType,
  type KeyboardEvent,
} from "react";
import { useEditor } from "@/components/editor/EditorProvider";
import { EditorEditPanel } from "@/components/editor/EditorEditPanel";

/** Inline edit for SiteSetting values (phone, address, …). */
export function EditableSetting({
  settingKey,
  value,
  as: Tag = "span",
  className,
  help,
  multiline = false,
  block = false,
}: {
  settingKey: string;
  value: string;
  as?: ElementType;
  className?: string;
  help?: string;
  multiline?: boolean;
  block?: boolean;
}) {
  const { enabled, saveSetting, saving, draftEpoch } = useEditor();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [local, setLocal] = useState(value);
  const anchorRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setLocal(value);
    setDraft(value);
    setEditing(false);
  }, [draftEpoch]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setLocal(value);
    if (!editing) setDraft(value);
  }, [value, editing]);

  const close = useCallback(() => {
    setDraft(local);
    setEditing(false);
  }, [local]);

  if (!enabled) {
    return <Tag className={className}>{local}</Tag>;
  }

  async function commit() {
    if (draft === local) {
      setEditing(false);
      return;
    }
    const ok = await saveSetting(settingKey, draft);
    if (ok) {
      setLocal(draft);
      setEditing(false);
    }
  }

  return (
    <div
      className={`relative group/edit ${block ? "block w-full" : "inline-block max-w-full"}`}
    >
      <Tag
        ref={anchorRef as never}
        className={`${className || ""} cursor-pointer rounded-sm transition-shadow ${
          editing
            ? "ring-2 ring-orange ring-offset-2 ring-offset-black"
            : "hover:ring-2 hover:ring-orange/60 hover:ring-offset-2 hover:ring-offset-black"
        }`}
        onClick={(e: { stopPropagation: () => void }) => {
          e.stopPropagation();
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
        Ayar
      </span>
      <EditorEditPanel open={editing} onClose={close} anchorRef={anchorRef}>
        <p className="text-[11px] text-muted mb-2 leading-relaxed">
          {help ||
            "Uygula taslağa yazar. Yayınlamak için üstteki Kaydet’e basın."}
        </p>
        {multiline ? (
          <textarea
            className="admin-input min-h-[100px] text-sm w-full"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
          />
        ) : (
          <input
            className="admin-input text-sm w-full"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
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
            Uygula
          </button>
          <button
            type="button"
            onClick={close}
            className="px-3 py-1.5 border border-border text-xs text-muted hover:text-white"
          >
            İptal / Kapat
          </button>
        </div>
      </EditorEditPanel>
    </div>
  );
}
