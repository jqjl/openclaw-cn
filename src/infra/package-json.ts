<<<<<<< HEAD
import fs from "node:fs/promises";
import path from "node:path";

export async function readPackageVersion(root: string): Promise<string | null> {
  try {
    const raw = await fs.readFile(path.join(root, "package.json"), "utf-8");
    const parsed = JSON.parse(raw) as { version?: string };
    const version = parsed?.version?.trim();
    return version ? version : null;
  } catch {
    return null;
  }
}

export async function readPackageName(root: string): Promise<string | null> {
  try {
    const raw = await fs.readFile(path.join(root, "package.json"), "utf-8");
    const parsed = JSON.parse(raw) as { name?: string };
    const name = parsed?.name?.trim();
    return name ? name : null;
  } catch {
    return null;
  }
=======
import path from "node:path";
import { tryReadJson } from "./json-files.js";

type PackageJson = {
  name?: unknown;
  packageManager?: unknown;
  version?: unknown;
};

function normalizeString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function readPackageJson(root: string): Promise<PackageJson | null> {
  const parsed = await tryReadJson<unknown>(path.join(root, "package.json"));
  return parsed && typeof parsed === "object" && !Array.isArray(parsed)
    ? (parsed as PackageJson)
    : null;
}

export async function readPackageVersion(root: string): Promise<string | null> {
  return normalizeString((await readPackageJson(root))?.version);
}

export async function readPackageName(root: string): Promise<string | null> {
  return normalizeString((await readPackageJson(root))?.name);
}

export async function readPackageManagerSpec(root: string): Promise<string | null> {
  return normalizeString((await readPackageJson(root))?.packageManager);
>>>>>>> upstream/main
}
