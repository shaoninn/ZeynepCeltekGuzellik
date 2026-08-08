export type PriceFormulaRates = {
  perCm2: number;
  perLetter: number;
  perNeonMeter: number;
  baseMount: number;
  backboardFee: number;
};

export const DEFAULT_RATES: PriceFormulaRates = {
  perCm2: 0.35,
  perLetter: 45,
  perNeonMeter: 180,
  baseMount: 250,
  backboardFee: 350,
};

export const SIZE_PRESETS = [
  { id: "s", label: "Küçük", widthCm: 40, heightCm: 20 },
  { id: "m", label: "Orta", widthCm: 80, heightCm: 35 },
  { id: "l", label: "Büyük", widthCm: 120, heightCm: 50 },
] as const;

function letterCount(text: string): number {
  return text.replace(/\s/g, "").length;
}

/** Approximate neon tube length from bounding box (meters). */
export function estimateNeonMeters(widthCm: number, heightCm: number): number {
  const perimeterCm = 2 * (widthCm + heightCm);
  return Math.max(0.3, perimeterCm / 100 / 2.2);
}

export function estimateCustomPrice(opts: {
  basePrice: number;
  widthCm?: number | null;
  heightCm?: number | null;
  customText?: string | null;
  hasBackboard?: boolean;
  rates?: Partial<PriceFormulaRates>;
}): number {
  const rates = { ...DEFAULT_RATES, ...opts.rates };
  let total = opts.basePrice;

  const w = opts.widthCm;
  const h = opts.heightCm;
  if (w != null && w > 0 && h != null && h > 0) {
    total += w * h * rates.perCm2;
    total += rates.baseMount;
    total += estimateNeonMeters(w, h) * rates.perNeonMeter;
  }

  const text = opts.customText?.trim();
  if (text) {
    total += letterCount(text) * rates.perLetter;
  }

  if (opts.hasBackboard) {
    total += rates.backboardFee;
  }

  return Math.round(total * 100) / 100;
}

export function parseRatesFromSettings(
  map: Record<string, string | undefined>
): PriceFormulaRates {
  const num = (key: string, fallback: number) => {
    const v = Number(map[key]);
    return Number.isFinite(v) && v >= 0 ? v : fallback;
  };
  return {
    perCm2: num("price_per_cm2", DEFAULT_RATES.perCm2),
    perLetter: num("price_per_letter", DEFAULT_RATES.perLetter),
    perNeonMeter: num("price_per_neon_m", DEFAULT_RATES.perNeonMeter),
    baseMount: num("price_base_mount", DEFAULT_RATES.baseMount),
    backboardFee: num("price_backboard", DEFAULT_RATES.backboardFee),
  };
}
