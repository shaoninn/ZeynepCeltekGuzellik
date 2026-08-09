#!/usr/bin/env node
/**
 * Hostinger often injects NODE_ENV=development into the build job.
 * Panel NODE_OPTIONS=--max-old-space-size=448 is for *runtime* RAM —
 * that same env kills `next build` TypeScript. Raise heap for build only.
 */
import { spawnSync } from "node:child_process";

process.env.NODE_ENV = "production";

/** Ensure --max-old-space-size is at least `mb` (Hostinger panel may set 448). */
function withBuildHeap(env, mb = 1536) {
  const next = { ...env };
  const raw = next.NODE_OPTIONS ?? "";
  const parts = raw
    .split(/\s+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => !/^--max-old-space-size=\d+$/i.test(p));
  parts.push(`--max-old-space-size=${mb}`);
  next.NODE_OPTIONS = parts.join(" ");
  return next;
}

function run(cmd, args, env = process.env) {
  const result = spawnSync(cmd, args, {
    stdio: "inherit",
    env,
    shell: process.platform === "win32",
  });
  return result.status ?? 1;
}

// Images: `prebuild` already runs optimize-images — skip duplicate here.

const buildEnv = withBuildHeap(process.env, 1536);
console.log(`[build] NODE_OPTIONS=${buildEnv.NODE_OPTIONS}`);

let code = run("npx", ["prisma", "generate"], buildEnv);
if (code !== 0) process.exit(code);

code = run("npx", ["next", "build"], buildEnv);
process.exit(code);
