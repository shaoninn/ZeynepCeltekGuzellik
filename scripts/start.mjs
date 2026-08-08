#!/usr/bin/env node
/**
 * Hostinger start — avoid `npx` (extra process). Do NOT run prisma db push
 * on every boot. One-shot: RUN_DB_PUSH=1 npm run start
 */
import { spawnSync, spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const nextPkg = path.dirname(require.resolve("next/package.json"));
const nextBin = path.join(nextPkg, "dist", "bin", "next");

function run(cmd, args) {
  const result = spawnSync(cmd, args, {
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });
  return result.status ?? 1;
}

if (process.env.RUN_DB_PUSH === "1") {
  console.log("[start] RUN_DB_PUSH=1 → prisma db push…");
  const code = run("npx", ["prisma", "db", "push"]);
  if (code !== 0) {
    console.error("[start] prisma db push failed — continuing to boot Next");
  }
} else {
  console.log("[start] skipping db push (set RUN_DB_PUSH=1 to sync schema once)");
}

const port = process.env.PORT || "3000";
console.log(`[start] next start on 0.0.0.0:${port} (single Node, no npx)`);

const child = spawn(
  process.execPath,
  [nextBin, "start", "--hostname", "0.0.0.0", "--port", String(port)],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "production",
    },
  }
);

// One warm hit after listen (instrumentation also warms). Skip if HEALTH_TOKEN set
// without matching warm token — use plain warm only when token unset.
const warmDelayMs = Number(process.env.DB_WARM_DELAY_MS || 4_000) || 4_000;
if (!process.env.HEALTH_TOKEN?.trim()) {
  setTimeout(() => {
    const url = `http://127.0.0.1:${port}/api/health`;
    console.log(`[start] warming ${url}`);
    fetch(url)
      .then(async (res) => {
        const body = await res.text();
        console.log(`[start] warm ${res.status}: ${body.slice(0, 160)}`);
      })
      .catch((err) => {
        console.warn(
          "[start] warm failed:",
          err instanceof Error ? err.message : err
        );
      });
  }, warmDelayMs);
}

child.on("exit", (code) => process.exit(code ?? 1));
