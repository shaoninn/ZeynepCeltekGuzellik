"use client";

import type { RefObject } from "react";
import { EditorEditPanel } from "@/components/editor/EditorEditPanel";
import {
  EDITOR_FONT_OPTIONS,
  EDITOR_SIZE_OPTIONS,
  type TextStyleValue,
} from "@/lib/text-style";

type EditableTextPanelProps = {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  help?: string;
  multiline: boolean;
  draft: string;
  onDraftChange: (next: string) => void;
  styleDraft: TextStyleValue;
  onStyleChange: (patch: Partial<TextStyleValue>) => void;
  saving: boolean;
  onCommit: () => void;
  onResetStyle: () => void;
};

/** Lazy-loaded rich-text editor chrome — excluded from public first paint JS. */
export function EditableTextPanel({
  open,
  onClose,
  anchorRef,
  help,
  multiline,
  draft,
  onDraftChange,
  styleDraft,
  onStyleChange,
  saving,
  onCommit,
  onResetStyle,
}: EditableTextPanelProps) {
  return (
    <EditorEditPanel open={open} onClose={onClose} anchorRef={anchorRef}>
      <p className="text-[11px] text-muted mb-2 leading-relaxed">
        {help ||
          "Uygula taslağa yazar. Siteye yansıması için üstteki Kaydet gerekir. Esc veya dışarı tık kapatır."}
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

      <div className="mt-3 grid grid-cols-2 gap-2">
        <label className="block text-[10px] text-muted uppercase tracking-wider">
          Renk
          <input
            type="color"
            className="mt-1 h-8 w-full cursor-pointer rounded border border-border bg-transparent"
            value={
              styleDraft.color && /^#[0-9a-fA-F]{6}$/.test(styleDraft.color)
                ? styleDraft.color
                : "#f5c518"
            }
            onChange={(e) => onStyleChange({ color: e.target.value })}
          />
        </label>
        <label className="block text-[10px] text-muted uppercase tracking-wider">
          Hex
          <input
            className="admin-input mt-1 text-xs font-mono w-full"
            placeholder="#rrggbb"
            value={styleDraft.color || ""}
            onChange={(e) => onStyleChange({ color: e.target.value })}
          />
        </label>
        <label className="block text-[10px] text-muted uppercase tracking-wider col-span-2">
          Font
          <select
            className="admin-input mt-1 text-xs w-full"
            value={styleDraft.fontFamily || ""}
            onChange={(e) =>
              onStyleChange({ fontFamily: e.target.value || undefined })
            }
          >
            {EDITOR_FONT_OPTIONS.map((o) => (
              <option key={o.label} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-[10px] text-muted uppercase tracking-wider">
          Boyut
          <select
            className="admin-input mt-1 text-xs w-full"
            value={styleDraft.fontSize || ""}
            onChange={(e) =>
              onStyleChange({ fontSize: e.target.value || undefined })
            }
          >
            {EDITOR_SIZE_OPTIONS.map((o) => (
              <option key={o.label} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-[10px] text-muted uppercase tracking-wider">
          Kalınlık
          <select
            className="admin-input mt-1 text-xs w-full"
            value={styleDraft.fontWeight || ""}
            onChange={(e) =>
              onStyleChange({ fontWeight: e.target.value || undefined })
            }
          >
            <option value="">Varsayılan</option>
            <option value="400">Normal</option>
            <option value="600">Yarı kalın</option>
            <option value="700">Kalın</option>
            <option value="800">Extra kalın</option>
          </select>
        </label>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={saving}
          onClick={onCommit}
          className="px-3 py-1.5 bg-orange text-white text-xs font-semibold uppercase tracking-wider hover:bg-orange-dark disabled:opacity-50"
        >
          Uygula
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 border border-border text-xs text-muted hover:text-white"
        >
          İptal / Kapat
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={onResetStyle}
          className="px-3 py-1.5 border border-border text-xs text-muted hover:text-white ml-auto"
        >
          Stili sıfırla
        </button>
      </div>
    </EditorEditPanel>
  );
}
