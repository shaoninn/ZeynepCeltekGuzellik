const WISHLIST_KEY = "zc-wishlist";
const RECENT_KEY = "zc-recent";
const RECENT_MAX = 24;

function safeParseIds(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

function readIds(key: string): string[] {
  if (typeof window === "undefined") return [];
  return safeParseIds(localStorage.getItem(key));
}

function writeIds(key: string, ids: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(ids));
}

export function getWishlist(): string[] {
  return readIds(WISHLIST_KEY);
}

export function setWishlist(ids: string[]): void {
  writeIds(WISHLIST_KEY, ids);
}

export function isInWishlist(productId: string): boolean {
  return getWishlist().includes(productId);
}

export function toggleWishlist(productId: string): string[] {
  const current = getWishlist();
  const next = current.includes(productId)
    ? current.filter((id) => id !== productId)
    : [...current, productId];
  setWishlist(next);
  return next;
}

export function getRecent(): string[] {
  return readIds(RECENT_KEY);
}

export function addRecent(productId: string): string[] {
  const current = getRecent().filter((id) => id !== productId);
  const next = [productId, ...current].slice(0, RECENT_MAX);
  writeIds(RECENT_KEY, next);
  return next;
}

export function clearRecent(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(RECENT_KEY);
}
