/**
 * Process-memory TTL cache for Hostinger.
 * Avoids Next.js Data Cache "sticky empty" bugs while cutting remote MySQL RTTs.
 */

type Entry<T> = { value: T; expiresAt: number };

const store = new Map<string, Entry<unknown>>();

export type MemoryCacheOptions = {
  /** TTL in ms */
  ttlMs: number;
  /** If true, empty arrays/null are cached with short ttl (default 5s) instead of full ttl */
  skipEmpty?: boolean;
};

function isEmptyResult(value: unknown): boolean {
  if (value == null) return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

export async function memoryCache<T>(
  key: string,
  loader: () => Promise<T>,
  options: MemoryCacheOptions
): Promise<T> {
  const now = Date.now();
  const hit = store.get(key) as Entry<T> | undefined;
  if (hit && hit.expiresAt > now) {
    return hit.value;
  }

  const value = await loader();
  const empty = options.skipEmpty !== false && isEmptyResult(value);
  const ttl = empty ? Math.min(5_000, options.ttlMs) : options.ttlMs;
  store.set(key, { value, expiresAt: now + ttl });
  return value;
}

export function memoryCacheInvalidate(prefixOrKey?: string): void {
  if (!prefixOrKey) {
    store.clear();
    return;
  }
  for (const key of store.keys()) {
    if (key === prefixOrKey || key.startsWith(prefixOrKey)) {
      store.delete(key);
    }
  }
}

export function memoryCacheStats(): { keys: number; keysSample: string[] } {
  return {
    keys: store.size,
    keysSample: [...store.keys()].slice(0, 20),
  };
}
