/**
 * Edge/middleware must not load the MariaDB driver.
 * The Node instrumentation build keeps the real `db.ts`.
 */
export async function pingDatabase(): Promise<{
  ok: boolean;
  ms: number;
  error?: string;
}> {
  return { ok: false, ms: 0, error: "skipped on edge" };
}
