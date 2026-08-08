import type { CSSProperties } from "react";

export type TextStyleValue = {
  color?: string;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
};

export function styleContentKey(contentKey: string): string {
  return `${contentKey}__style`;
}

export function parseTextStyle(raw: string | undefined | null): TextStyleValue {
  if (!raw?.trim()) return {};
  try {
    const parsed = JSON.parse(raw) as TextStyleValue;
    if (!parsed || typeof parsed !== "object") return {};
    return {
      color: typeof parsed.color === "string" ? parsed.color : undefined,
      fontSize:
        typeof parsed.fontSize === "string" ? parsed.fontSize : undefined,
      fontFamily:
        typeof parsed.fontFamily === "string" ? parsed.fontFamily : undefined,
      fontWeight:
        typeof parsed.fontWeight === "string" ? parsed.fontWeight : undefined,
    };
  } catch {
    return {};
  }
}

export function serializeTextStyle(style: TextStyleValue): string {
  const clean: TextStyleValue = {};
  if (style.color?.trim()) clean.color = style.color.trim();
  if (style.fontSize?.trim()) clean.fontSize = style.fontSize.trim();
  if (style.fontFamily?.trim()) clean.fontFamily = style.fontFamily.trim();
  if (style.fontWeight?.trim()) clean.fontWeight = style.fontWeight.trim();
  return JSON.stringify(clean);
}

export function textStyleToCss(
  style: TextStyleValue | undefined
): CSSProperties {
  if (!style) return {};
  return {
    ...(style.color ? { color: style.color } : {}),
    ...(style.fontSize ? { fontSize: style.fontSize } : {}),
    ...(style.fontFamily ? { fontFamily: style.fontFamily } : {}),
    ...(style.fontWeight
      ? { fontWeight: style.fontWeight as CSSProperties["fontWeight"] }
      : {}),
  };
}

export const EDITOR_FONT_OPTIONS = [
  { label: "Varsayılan", value: "" },
  { label: "Display", value: "var(--font-display), 'Space Grotesk', sans-serif" },
  { label: "Sans", value: "var(--font-sans), 'Outfit', sans-serif" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Mono", value: "ui-monospace, Consolas, monospace" },
] as const;

export const EDITOR_SIZE_OPTIONS = [
  { label: "Varsayılan", value: "" },
  { label: "XS", value: "0.75rem" },
  { label: "S", value: "0.875rem" },
  { label: "M", value: "1rem" },
  { label: "L", value: "1.25rem" },
  { label: "XL", value: "1.5rem" },
  { label: "2XL", value: "1.875rem" },
  { label: "3XL", value: "2.25rem" },
  { label: "4XL", value: "3rem" },
] as const;
