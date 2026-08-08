"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { GripVertical, RotateCcw } from "lucide-react";
import { useEditor } from "@/components/editor/EditorProvider";

type EditableSectionShiftProps = {
  settingKey: string;
  value?: string;
  children: ReactNode;
  className?: string;
  label?: string;
  min?: number;
  max?: number;
};

/** Vertical section offset — grab handle and drag up/down (no range slider). */
export function EditableSectionShift({
  settingKey,
  value = "0",
  children,
  className = "",
  label = "Bölüm kaydır",
  min = -80,
  max = 160,
}: EditableSectionShiftProps) {
  const { enabled, saveSetting, saving, draftEpoch } = useEditor();
  const [offset, setOffset] = useState(() => Number(value) || 0);
  const offsetRef = useRef(offset);
  offsetRef.current = offset;
  const dragRef = useRef<{ startY: number; startOffset: number } | null>(null);

  useEffect(() => {
    setOffset(Number(value) || 0);
  }, [draftEpoch, value]);

  useEffect(() => {
    setOffset(Number(value) || 0);
  }, [value]);

  const commit = useCallback(
    async (next: number) => {
      const clamped = Math.max(min, Math.min(max, Math.round(next)));
      setOffset(clamped);
      await saveSetting(settingKey, String(clamped));
    },
    [max, min, saveSetting, settingKey]
  );

  function onPointerDown(e: ReactPointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startY: e.clientY, startOffset: offset };
  }

  function onPointerMove(e: ReactPointerEvent) {
    const d = dragRef.current;
    if (!d) return;
    const next = Math.max(
      min,
      Math.min(max, d.startOffset + (e.clientY - d.startY))
    );
    setOffset(next);
  }

  function onPointerUp(e: ReactPointerEvent) {
    if (!dragRef.current) return;
    dragRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    void commit(offsetRef.current);
  }

  return (
    <div
      className={`relative ${className}`}
      style={{ marginTop: offset ? offset : undefined }}
    >
      {enabled && (
        <button
          type="button"
          disabled={saving}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={() => void commit(0)}
          className="absolute -top-3 right-2 sm:right-3 z-[40] inline-flex items-center gap-1.5 rounded-lg border border-orange/50 bg-black/90 px-2 py-1.5 shadow-lg cursor-grab active:cursor-grabbing touch-none select-none"
          title="Tutup yukarı/aşağı sürükleyin · çift tık: sıfırla"
          aria-label={label}
        >
          <GripVertical size={14} className="text-orange shrink-0" />
          <span className="text-[10px] uppercase tracking-wider text-muted hidden sm:inline">
            {label}
          </span>
          <span className="text-[10px] text-white/80 tabular-nums w-8">
            {Math.round(offset)}px
          </span>
          {offset !== 0 && (
            <span
              role="presentation"
              className="text-muted"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                void commit(0);
              }}
            >
              <RotateCcw size={11} />
            </span>
          )}
        </button>
      )}
      {children}
    </div>
  );
}
