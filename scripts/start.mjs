#!/usr/bin/env node
/**
 * Optional one-shot boot with schema sync.
 * Prefer `npm run start` (single Next process) on Hostinger.
 * Use only when you need: RUN_DB_PUSH=1 npm run start:db
 *
 * Do NOT use this as the default Hostinger Start command — the parent
 * `node scripts/start.mjs` + child `next start` counts as TWO processes.
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
  console.log("[start:db] RUN_DB_PUSH=1 → prisma db push…");
  const code = run("npx", ["prisma", "db", "push"]);
  if (code !== 0) {
    console.error("[start:db] prisma db push failed — continuing to boot Next");
  }
} else {
  console.log(
    "[start:db] skipping db push (set RUN_DB_PUSH=1). Prefer npm run start on Hostinger."
  );
}

const port = process.env.PORT || "3000";
console.warn(
  "[start:db] WARNING: this wrapper keeps a parent Node process alive (2 processes). Use npm run start in production."
);
console.log(`[start:db] next start on 0.0.0.0:${port}`);

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

child.on("exit", (code) => process.exit(code ?? 1));
