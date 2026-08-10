/** Salon catalog uses list price; no signage/neon size formula. */

export type PriceFormulaRates = Record<string, never>;

export const DEFAULT_RATES: PriceFormulaRates = {};

export function estimateCustomPrice(opts: {
  basePrice: number;
}): number {
  return Math.round(opts.basePrice * 100) / 100;
}

export function parseRatesFromSettings(
  _map: Record<string, string | undefined>
): PriceFormulaRates {
  return {};
}
