"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";

type EditorEditPanelProps = {
  open: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLElement | null>;
  children: ReactNode;
  preferredTop?: number;
  preferredLeft?: number;
};

/** Portaled edit popover — Escape / outside click; stays inside viewport. */
export function EditorEditPanel({
  open,
  onClose,
  anchorRef,
  children,
  preferredTop,
  preferredLeft,
}: EditorEditPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 120, left: 16 });

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    }

    function onPointerDown(e: MouseEvent | PointerEvent) {
      const t = e.target as Node;
      if (panelRef.current?.contains(t)) return;
      if (anchorRef?.current?.contains(t)) return;
      onClose();
    }

    document.addEventListener("keydown", onKey, true);
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [open, onClose, anchorRef]);

  useLayoutEffect(() => {
    if (!open) return;

    function place() {
      const margin = 8;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const panelW = panelRef.current?.offsetWidth || Math.min(vw - 16, 416);
      const panelH = panelRef.current?.offsetHeight || 280;

      let top = preferredTop ?? 120;
      let left = preferredLeft ?? margin;

      if (anchorRef?.current) {
        const r = anchorRef.current.getBoundingClientRect();
        top = r.bottom + margin;
        left = r.left;
        if (top + panelH > vh - margin) {
          top = Math.max(margin, r.top - panelH - margin);
        }
        if (left + panelW > vw - margin) {
          left = Math.max(margin, vw - panelW - margin);
        }
      }

      top = Math.max(margin, Math.min(top, vh - Math.min(panelH, vh - margin * 2)));
      left = Math.max(margin, Math.min(left, vw - panelW - margin));
      setPos({ top, left });
    }

    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, anchorRef, preferredTop, preferredLeft, children]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      className="fixed z-[200] w-[min(100vw-1rem,26rem)] max-h-[min(75dvh,32rem)] overflow-y-auto overscroll-contain rounded-lg border border-border bg-card p-3 shadow-2xl"
      style={{ top: pos.top, left: pos.left }}
      onClick={(e: ReactMouseEvent) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {children}
    </div>,
    document.body
  );
}
