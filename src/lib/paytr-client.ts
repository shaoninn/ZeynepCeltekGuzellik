/** Client-safe PayTR helpers (no secrets). */

export function paytrIframeSrc(iframeToken: string): string {
  return `https://www.paytr.com/odeme/guvenli/${iframeToken}`;
}
