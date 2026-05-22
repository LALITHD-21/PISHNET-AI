import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const standaloneDir = join(root, ".next", "standalone");
const standaloneNextDir = join(standaloneDir, ".next");
const sourceStaticDir = join(root, ".next", "static");
const targetStaticDir = join(standaloneNextDir, "static");
const sourcePublicDir = join(root, "public");
const targetPublicDir = join(standaloneDir, "public");

if (!existsSync(standaloneDir)) {
  console.log("[standalone] No standalone output found. Skipping asset copy.");
  process.exit(0);
}

mkdirSync(standaloneNextDir, { recursive: true });

if (existsSync(sourceStaticDir)) {
  rmSync(targetStaticDir, { recursive: true, force: true });
  cpSync(sourceStaticDir, targetStaticDir, { recursive: true });
  console.log("[standalone] Copied .next/static into standalone output.");
}

if (existsSync(sourcePublicDir)) {
  rmSync(targetPublicDir, { recursive: true, force: true });
  cpSync(sourcePublicDir, targetPublicDir, { recursive: true });
  console.log("[standalone] Copied public assets into standalone output.");
}
