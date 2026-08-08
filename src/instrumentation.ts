/**
 * Next.js boot hook — open MySQL before the first user request pays cold TLS cost.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  try {
    const { pingDatabase } = await import("@/lib/db");
    const result = await pingDatabase();
    if (result.ok) {
      console.info(`[instrumentation] db warm ok ${result.ms}ms`);
    } else {
      console.warn(`[instrumentation] db warm failed ${result.ms}ms:`, result.error);
    }
  } catch (error) {
    console.warn(
      "[instrumentation] db warm error:",
      error instanceof Error ? error.message : error
    );
  }
}
