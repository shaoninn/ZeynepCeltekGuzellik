import type { CSSProperties } from "react";

export type LayoutBox = {
  x: number;
  y: number;
  scale: number;
};

export const DEFAULT_LAYOUT_BOX: LayoutBox = { x: 0, y: 0, scale: 1 };

export function parseLayoutBox(raw: string | undefined | null): LayoutBox {
  if (!raw?.trim()) return { ...DEFAULT_LAYOUT_BOX };
  try {
    const p = JSON.parse(raw) as Partial<LayoutBox>;
    return {
      x: typeof p.x === "number" && Number.isFinite(p.x) ? p.x : 0,
      y: typeof p.y === "number" && Number.isFinite(p.y) ? p.y : 0,
      scale:
        typeof p.scale === "number" && Number.isFinite(p.scale) && p.scale > 0.2
          ? Math.min(3, p.scale)
          : 1,
    };
  } catch {
    return { ...DEFAULT_LAYOUT_BOX };
  }
}

export function serializeLayoutBox(box: LayoutBox): string {
  return JSON.stringify({
    x: Math.round(box.x),
    y: Math.round(box.y),
    scale: Math.round(box.scale * 100) / 100,
  });
}

export function layoutBoxStyle(
  box: LayoutBox,
  opts?: { mobileClamp?: boolean }
): CSSProperties {
  let { x, y, scale } = box;
  if (opts?.mobileClamp) {
    x = Math.max(-28, Math.min(28, x));
    y = Math.max(-20, Math.min(20, y));
    scale = Math.max(0.75, Math.min(1.2, scale));
  } else {
    scale = Math.max(0.6, Math.min(1.8, scale));
  }
  return {
    transform: `translate(${x}px, ${y}px) scale(${scale})`,
    transformOrigin: "center center",
  };
}

/** True when viewport is phone-sized (client only). */
export function isNarrowViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}
