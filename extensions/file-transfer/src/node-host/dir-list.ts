import fs from "node:fs/promises";
import path from "node:path";
<<<<<<< HEAD
=======
import {
  FsSafeError,
  resolveAbsolutePathForRead,
  root,
} from "openclaw/plugin-sdk/security-runtime";
>>>>>>> upstream/main
import { mimeFromExtension } from "../shared/mime.js";

export const DIR_LIST_DEFAULT_MAX_ENTRIES = 200;
export const DIR_LIST_HARD_MAX_ENTRIES = 5000;

type DirListParams = {
  path?: unknown;
  pageToken?: unknown;
  maxEntries?: unknown;
  followSymlinks?: unknown;
};

type DirListEntry = {
  name: string;
  path: string;
  size: number;
  mimeType: string;
  isDir: boolean;
  mtime: number;
};

type DirListOk = {
  ok: true;
  path: string;
  entries: DirListEntry[];
  nextPageToken?: string;
  truncated: boolean;
};

type DirListErrCode =
  | "INVALID_PATH"
  | "NOT_FOUND"
  | "PERMISSION_DENIED"
  | "IS_FILE"
  | "SYMLINK_REDIRECT"
  | "READ_ERROR";

type DirListErr = {
  ok: false;
  code: DirListErrCode;
  message: string;
  canonicalPath?: string;
};

type DirListResult = DirListOk | DirListErr;

function clampMaxEntries(input: unknown): number {
  if (typeof input !== "number" || !Number.isFinite(input) || input <= 0) {
    return DIR_LIST_DEFAULT_MAX_ENTRIES;
  }
  return Math.min(Math.floor(input), DIR_LIST_HARD_MAX_ENTRIES);
}

function classifyFsError(err: unknown): DirListErrCode {
<<<<<<< HEAD
=======
  if (err instanceof FsSafeError) {
    if (err.code === "not-found") {
      return "NOT_FOUND";
    }
    if (err.code === "symlink") {
      return "SYMLINK_REDIRECT";
    }
    if (err.code === "invalid-path") {
      return "INVALID_PATH";
    }
  }
>>>>>>> upstream/main
  const code = (err as { code?: string } | null)?.code;
  if (code === "ENOENT") {
    return "NOT_FOUND";
  }
  if (code === "EACCES" || code === "EPERM") {
    return "PERMISSION_DENIED";
  }
  return "READ_ERROR";
}

export async function handleDirList(params: DirListParams): Promise<DirListResult> {
  const requestedPath = params.path;
  if (typeof requestedPath !== "string" || requestedPath.length === 0) {
    return { ok: false, code: "INVALID_PATH", message: "path required" };
  }
  if (requestedPath.includes("\0")) {
    return { ok: false, code: "INVALID_PATH", message: "path contains NUL byte" };
  }
  if (!path.isAbsolute(requestedPath)) {
    return { ok: false, code: "INVALID_PATH", message: "path must be absolute" };
  }

  const maxEntries = clampMaxEntries(params.maxEntries);
  const offset =
    typeof params.pageToken === "string" && params.pageToken.length > 0
      ? Math.max(0, Number.parseInt(params.pageToken, 10) || 0)
      : 0;

  const followSymlinks = params.followSymlinks === true;

  let canonical: string;
  try {
<<<<<<< HEAD
    canonical = await fs.realpath(requestedPath);
  } catch (err) {
    const code = classifyFsError(err);
    return {
      ok: false,
      code,
      message: code === "NOT_FOUND" ? "path not found" : `realpath failed: ${String(err)}`,
    };
  }

  if (!followSymlinks && canonical !== requestedPath) {
    return {
      ok: false,
      code: "SYMLINK_REDIRECT",
      message: `path traverses a symlink; refusing because followSymlinks=false (set plugins.entries.file-transfer.config.nodes.<node>.followSymlinks=true to allow, or update allowReadPaths to the canonical path)`,
      canonicalPath: canonical,
=======
    canonical = (
      await resolveAbsolutePathForRead(requestedPath, {
        symlinks: followSymlinks ? "follow" : "reject",
      })
    ).canonicalPath;
  } catch (err) {
    const code = classifyFsError(err);
    const canonicalPath =
      err instanceof FsSafeError &&
      err.cause &&
      typeof err.cause === "object" &&
      "canonicalPath" in err.cause &&
      typeof err.cause.canonicalPath === "string"
        ? err.cause.canonicalPath
        : undefined;
    return {
      ok: false,
      code,
      message:
        code === "NOT_FOUND"
          ? "path not found"
          : code === "SYMLINK_REDIRECT"
            ? "path traverses a symlink; refusing because followSymlinks=false (set plugins.entries.file-transfer.config.nodes.<node>.followSymlinks=true to allow, or update allowReadPaths to the canonical path)"
            : `realpath failed: ${String(err)}`,
      ...(canonicalPath ? { canonicalPath } : {}),
>>>>>>> upstream/main
    };
  }

  let stats: Awaited<ReturnType<typeof fs.stat>>;
  try {
    stats = await fs.stat(canonical);
  } catch (err) {
    const code = classifyFsError(err);
    return { ok: false, code, message: `stat failed: ${String(err)}`, canonicalPath: canonical };
  }

  if (!stats.isDirectory()) {
    return {
      ok: false,
      code: "IS_FILE",
      message: "path is not a directory",
      canonicalPath: canonical,
    };
  }

<<<<<<< HEAD
  let names: string[];
  try {
    names = await fs.readdir(canonical, { encoding: "utf8" });
=======
  let listedEntries: { name: string; isDirectory: boolean; size: number; mtimeMs: number }[];
  try {
    const dirRoot = await root(canonical);
    listedEntries = await dirRoot.list(".", { withFileTypes: true });
>>>>>>> upstream/main
  } catch (err) {
    const code = classifyFsError(err);
    return {
      ok: false,
      code,
<<<<<<< HEAD
      message: `readdir failed: ${String(err)}`,
=======
      message: `list failed: ${String(err)}`,
>>>>>>> upstream/main
      canonicalPath: canonical,
    };
  }

<<<<<<< HEAD
  // Sort by name for stable pagination
  names.sort((a, b) => a.localeCompare(b));

  const total = names.length;
  const page = names.slice(offset, offset + maxEntries);
=======
  listedEntries.sort((a, b) => a.name.localeCompare(b.name));

  const total = listedEntries.length;
  const page = listedEntries.slice(offset, offset + maxEntries);
>>>>>>> upstream/main
  const truncated = offset + maxEntries < total;
  const nextPageToken = truncated ? String(offset + maxEntries) : undefined;

  const entries: DirListEntry[] = [];
<<<<<<< HEAD
  for (const name of page) {
    const entryPath = path.join(canonical, name);

    let isDir = false;
    let size = 0;
    let mtime = 0;
    try {
      const s = await fs.stat(entryPath);
      isDir = s.isDirectory();
      size = isDir ? 0 : s.size;
      mtime = s.mtimeMs;
    } catch {
      // stat may fail for broken symlinks; keep zeros and treat as file
    }

    entries.push({
      name,
      path: entryPath,
      size,
      mimeType: isDir ? "inode/directory" : mimeFromExtension(name),
      isDir,
      mtime,
=======
  for (const entry of page) {
    const entryPath = path.join(canonical, entry.name);
    const isDir = entry.isDirectory;

    entries.push({
      name: entry.name,
      path: entryPath,
      size: isDir ? 0 : entry.size,
      mimeType: isDir ? "inode/directory" : mimeFromExtension(entry.name),
      isDir,
      mtime: entry.mtimeMs,
>>>>>>> upstream/main
    });
  }

  return {
    ok: true,
    path: canonical,
    entries,
    nextPageToken,
    truncated,
  };
}
