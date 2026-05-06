<<<<<<< HEAD
import path from "node:path";
import { isPathInside } from "./path-guards.js";

export function resolveSafeBaseDir(rootDir: string): string {
  const resolved = path.resolve(rootDir);
  return resolved.endsWith(path.sep) ? resolved : `${resolved}${path.sep}`;
}

export function isWithinDir(rootDir: string, targetPath: string): boolean {
  return isPathInside(rootDir, targetPath);
}
=======
import "./fs-safe-defaults.js";
export {
  isNotFoundPathError,
  hasNodeErrorCode,
  isNodeError,
  isPathInside,
  isPathInsideWithRealpath,
  isSymlinkOpenError,
  isWithinDir,
  normalizeWindowsPathForComparison,
  resolveSafeBaseDir,
  resolveSafeRelativePath,
  safeRealpathSync,
  safeStatSync,
  splitSafeRelativePath,
} from "@openclaw/fs-safe/path";
export { formatPosixMode } from "@openclaw/fs-safe/advanced";
>>>>>>> upstream/main
