import { parseJsonObject } from "@/lib/utils";
import type { ProductSpecs } from "@/types";

export type SpecFlags = {
  malzeme: string;
  isikli: boolean | null;
  mekan: "ic" | "dis" | null;
  garanti: string;
};

export function parseProductSpecs(specsJson: string | null | undefined): SpecFlags {
  const specs = parseJsonObject<ProductSpecs>(specsJson || "{}", {});
  const malzeme = (specs.malzeme || "").trim();
  const garanti = (specs.garanti || "").trim();
  const raw = `${specs.montaj || ""} ${specs.teslimat || ""} ${malzeme} ${specs.aciklama || ""}`.toLowerCase();

  return {
    malzeme,
    isikli: null,
    mekan: /salon|şube|sube|klinik/.test(raw) ? "ic" : null,
    garanti,
  };
}

export function productSeoScore(input: {
  name: string;
  slug: string;
  shortDesc: string | null;
  description: string | null;
  image: string | null;
  specs: string;
}): { score: number; tips: string[] } {
  const tips: string[] = [];
  let score = 0;

  if (input.name.length >= 8) score += 15;
  else tips.push("Hizmet adı en az 8 karakter olmalı");

  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)) score += 15;
  else tips.push("Slug küçük harf ve tire ile olmalı");

  if ((input.shortDesc || "").length >= 40) score += 15;
  else tips.push("Kısa açıklama en az ~40 karakter");

  if ((input.description || "").length >= 120) score += 20;
  else tips.push("Detay açıklama en az ~120 karakter");

  if (input.image) score += 15;
  else tips.push("Kapak görseli ekleyin");

  const specs = parseJsonObject<Record<string, string>>(input.specs || "{}", {});
  const filled = Object.values(specs).filter((v) => (v || "").trim().length > 0).length;
  if (filled >= 2) score += 20;
  else tips.push("En az 2 özellik (süre, seans…) doldurun");

  return { score: Math.min(100, score), tips };
}
