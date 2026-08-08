#!/usr/bin/env node
/**
 * Hostinger often injects NODE_ENV=development into the build job.
 * next build must run as production — force it here.
 */
import { spawnSync } from "node:child_process";

process.env.NODE_ENV = "production";

function run(cmd, args) {
  const result = spawnSync(cmd, args, {
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });
  return result.status ?? 1;
}

let code = run("node", ["scripts/optimize-images.mjs"]);
if (code !== 0) process.exit(code);

code = run("npx", ["prisma", "generate"]);
if (code !== 0) process.exit(code);

code = run("npx", ["next", "build"]);
process.exit(code);
