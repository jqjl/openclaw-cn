<<<<<<< HEAD
import fs from "node:fs/promises";

export async function fileExists(filePath?: string | null): Promise<boolean> {
  if (!filePath) {
    return false;
  }
  try {
    await fs.stat(filePath);
    return true;
  } catch {
    return false;
  }
=======
import { pathExists } from "../infra/fs-safe.js";

export async function fileExists(filePath?: string | null): Promise<boolean> {
  return filePath ? await pathExists(filePath) : false;
>>>>>>> upstream/main
}
