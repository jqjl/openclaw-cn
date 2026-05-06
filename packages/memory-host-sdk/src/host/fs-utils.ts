<<<<<<< HEAD
import type { Stats } from "node:fs";
import fs from "node:fs/promises";

export type RegularFileStatResult = { missing: true } | { missing: false; stat: Stats };
=======
import { configureFsSafePython } from "@openclaw/fs-safe/config";
export { root } from "@openclaw/fs-safe/root";
export { isPathInside } from "@openclaw/fs-safe/path";
export {
  readRegularFile,
  statRegularFile,
  type RegularFileStatResult,
} from "@openclaw/fs-safe/advanced";
export { walkDirectory, type WalkDirectoryEntry } from "@openclaw/fs-safe/walk";

const hasPythonModeOverride =
  process.env.FS_SAFE_PYTHON_MODE != null || process.env.OPENCLAW_FS_SAFE_PYTHON_MODE != null;

if (!hasPythonModeOverride) {
  configureFsSafePython({ mode: "off" });
}
>>>>>>> upstream/main

export function isFileMissingError(
  err: unknown,
): err is NodeJS.ErrnoException & { code: "ENOENT" } {
  return Boolean(
    err &&
    typeof err === "object" &&
    "code" in err &&
<<<<<<< HEAD
    (err as Partial<NodeJS.ErrnoException>).code === "ENOENT",
  );
}

export async function statRegularFile(absPath: string): Promise<RegularFileStatResult> {
  let stat: Stats;
  try {
    stat = await fs.lstat(absPath);
  } catch (err) {
    if (isFileMissingError(err)) {
      return { missing: true };
    }
    throw err;
  }
  if (stat.isSymbolicLink() || !stat.isFile()) {
    throw new Error("path required");
  }
  return { missing: false, stat };
}
=======
    ((err as Partial<NodeJS.ErrnoException>).code === "ENOENT" ||
      (err as { code?: unknown }).code === "not-found"),
  );
}
>>>>>>> upstream/main
