"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type KeyboardEvent,
} from "react";
import dynamic from "next/dynamic";
import { Pencil } from "lucide-react";
import { useEditor } from "@/components/editor/EditorProvider";
import { SiteLink } from "@/components/ui/SiteLink";
import {
  parseTextStyle,
  serializeTextStyle,
  styleContentKey,
  textStyleToCss,
  type TextStyleValue,
} from "@/lib/text-style";
import type { EditableTextProps } from "@/components/editor/EditableText";

const EditableTextPanel = dynamic(
  () =>
    import("@/components/editor/EditableTextPanel").then(
      (m) => m.EditableTextPanel
    ),
  { ssr: false }
);

/** Editor-only interactive text — not loaded on the public site path. */
export function EditableTextActive({
  contentKey,
  value,
  as: Tag = "span",
  className,
  help,
  multiline = false,
  block = false,
  children,
  editField = "content",
  pairedContent = "",
  textStyle: textStyleRaw = "",
  style: styleProp,
  linkHref,
  linkClassName,
}: EditableTextProps) {
  const { saveContent, saving, draftEpoch } = useEditor();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [local, setLocal] = useState(value);
  const [styleDraft, setStyleDraft] = useState<TextStyleValue>(() =>
    parseTextStyle(textStyleRaw)
  );
  const [localStyle, setLocalStyle] = useState<TextStyleValue>(() =>
    parseTextStyle(textStyleRaw)
  );
  const anchorRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setLocal(value);
    setDraft(value);
    setLocalStyle(parseTextStyle(textStyleRaw));
    setStyleDraft(parseTextStyle(textStyleRaw));
    setEditing(false);
  }, [draftEpoch]); // eslint-disable-line react-hooks/exhaustive-deps -- reset on discard

  useEffect(() => {
    setLocal(value);
    if (!editing) setDraft(value);
  }, [value, editing]);

  useEffect(() => {
    const parsed = parseTextStyle(textStyleRaw);
    setLocalStyle(parsed);
    if (!editing) setStyleDraft(parsed);
  }, [textStyleRaw, editing]);

  const close = useCallback(() => {
    setDraft(local);
    setStyleDraft(localStyle);
    setEditing(false);
  }, [local, localStyle]);

  const mergedStyle: CSSProperties = {
    ...textStyleToCss(localStyle),
    ...styleProp,
  };

  const textContent = children ?? local;

  const openEditor = useCallback(() => {
    setDraft(local);
    setStyleDraft(localStyle);
    setEditing(true);
  }, [local, localStyle]);

  async function commit() {
    const textChanged = draft !== local;
    const styleChanged =
      serializeTextStyle(styleDraft) !== serializeTextStyle(localStyle);

    if (!textChanged && !styleChanged) {
      setEditing(false);
      return;
    }

    let ok = true;
    if (textChanged) {
      ok =
        editField === "title"
          ? await saveContent(contentKey, pairedContent, draft)
          : await saveContent(contentKey, draft);
    }
    if (ok && styleChanged) {
      ok = await saveContent(
        styleContentKey(contentKey),
        serializeTextStyle(styleDraft)
      );
    }
    if (ok) {
      if (textChanged) setLocal(draft);
      if (styleChanged) setLocalStyle(styleDraft);
      setEditing(false);
    }
  }

  const editPanel = editing ? (
    <EditableTextPanel
      open={editing}
      onClose={close}
      anchorRef={anchorRef}
      help={help}
      multiline={multiline}
      draft={draft}
      onDraftChange={setDraft}
      styleDraft={styleDraft}
      onStyleChange={(patch) =>
        setStyleDraft((prev) => ({ ...prev, ...patch }))
      }
      saving={saving}
      onCommit={() => void commit()}
      onResetStyle={() => setStyleDraft({})}
    />
  ) : null;

  if (linkHref) {
    return (
      <div
        className={`relative group/edit inline-flex items-center gap-1 max-w-full ${
          block ? "w-full" : ""
        }`}
      >
        <SiteLink href={linkHref} className={linkClassName}>
          <Tag
            className={className}
            style={mergedStyle}
            data-editor-field={contentKey}
          >
            {textContent}
          </Tag>
        </SiteLink>
        <button
          type="button"
          ref={anchorRef as never}
          onClick={openEditor}
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border border-orange/40 bg-black/80 text-orange opacity-0 transition-opacity group-hover/edit:opacity-100 hover:bg-orange/10"
          aria-label="Bağlantı metnini düzenle"
          title="Metni düzenle"
        >
          <Pencil size={12} />
        </button>
        <span className="pointer-events-none absolute -top-5 left-0 z-20 opacity-0 group-hover/edit:opacity-100 inline-flex items-center rounded bg-orange px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
          Bağlantı
        </span>
        {editPanel}
      </div>
    );
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
        style={
          editing
            ? { ...textStyleToCss(styleDraft), ...styleProp }
            : mergedStyle
        }
        data-editor-field={contentKey}
        onClick={(e: { stopPropagation: () => void }) => {
          e.stopPropagation();
          openEditor();
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openEditor();
          }
        }}
      >
        {textContent}
      </Tag>
      <span className="pointer-events-none absolute -top-5 left-0 z-20 opacity-0 group-hover/edit:opacity-100 inline-flex items-center rounded bg-orange px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
        Metin
      </span>

      {editPanel}
    </div>
  );
}
