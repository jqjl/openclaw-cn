import fs from "node:fs/promises";
<<<<<<< HEAD
import path from "node:path";
=======
import { readPackageManagerSpec } from "./package-json.js";
>>>>>>> upstream/main

type DetectedPackageManager = "pnpm" | "bun" | "npm";

export async function detectPackageManager(root: string): Promise<DetectedPackageManager | null> {
<<<<<<< HEAD
  try {
    const raw = await fs.readFile(path.join(root, "package.json"), "utf-8");
    const parsed = JSON.parse(raw) as { packageManager?: string };
    const pm = parsed?.packageManager?.split("@")[0]?.trim();
    if (pm === "pnpm" || pm === "bun" || pm === "npm") {
      return pm;
    }
  } catch {
    // ignore
=======
  const pm = (await readPackageManagerSpec(root))?.split("@")[0]?.trim();
  if (pm === "pnpm" || pm === "bun" || pm === "npm") {
    return pm;
>>>>>>> upstream/main
  }

  const files = await fs.readdir(root).catch((): string[] => []);
  if (files.includes("pnpm-lock.yaml")) {
    return "pnpm";
  }
  if (files.includes("bun.lock") || files.includes("bun.lockb")) {
    return "bun";
  }
  if (files.includes("package-lock.json")) {
    return "npm";
  }
  return null;
}
