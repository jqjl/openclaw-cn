<<<<<<< HEAD
import crypto from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import path from "node:path";
import { createSubsystemLogger } from "../logging/subsystem.js";
=======
import "./fs-safe-defaults.js";
import crypto from "node:crypto";
import path from "node:path";
import { createSubsystemLogger } from "../logging/subsystem.js";
import { tempWorkspace, type TempWorkspace } from "./private-temp-workspace.js";
>>>>>>> upstream/main
import { resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir.js";

const logger = createSubsystemLogger("infra:temp-download");

export { resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir.js";

type TempDownloadTarget = {
  dir: string;
  path: string;
<<<<<<< HEAD
  cleanup: () => Promise<void>;
};

function sanitizePrefix(prefix: string): string {
=======
  file(fileName?: string): string;
  cleanup: () => Promise<void>;
  [Symbol.asyncDispose](): Promise<void>;
};

function resolveTempRoot(tmpDir?: string): string {
  return tmpDir ?? resolvePreferredOpenClawTmpDir();
}

function sanitizeTempPrefix(prefix: string): string {
>>>>>>> upstream/main
  const normalized = prefix.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  return normalized || "tmp";
}

<<<<<<< HEAD
function sanitizeExtension(extension?: string): string {
=======
function sanitizeTempExtension(extension?: string): string {
>>>>>>> upstream/main
  if (!extension) {
    return "";
  }
  const normalized = extension.startsWith(".") ? extension : `.${extension}`;
  const suffix = normalized.match(/[a-zA-Z0-9._-]+$/)?.[0] ?? "";
  const token = suffix.replace(/^[._-]+/, "");
  return token ? `.${token}` : "";
}

export function sanitizeTempFileName(fileName: string): string {
  const base = path.basename(fileName).replace(/[^a-zA-Z0-9._-]+/g, "-");
  const normalized = base.replace(/^-+|-+$/g, "");
  return normalized || "download.bin";
}

<<<<<<< HEAD
function resolveTempRoot(tmpDir?: string): string {
  return tmpDir ?? resolvePreferredOpenClawTmpDir();
}

function isNodeErrorWithCode(err: unknown, code: string): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === code
  );
}

async function cleanupTempDir(dir: string) {
  try {
    await rm(dir, { recursive: true, force: true });
  } catch (err) {
    if (!isNodeErrorWithCode(err, "ENOENT")) {
      logger.warn(`temp-path cleanup failed for ${dir}: ${String(err)}`, { dir, error: err });
    }
  }
}

=======
>>>>>>> upstream/main
export function buildRandomTempFilePath(params: {
  prefix: string;
  extension?: string;
  tmpDir?: string;
  now?: number;
  uuid?: string;
}): string {
<<<<<<< HEAD
  const prefix = sanitizePrefix(params.prefix);
  const extension = sanitizeExtension(params.extension);
=======
>>>>>>> upstream/main
  const nowCandidate = params.now;
  const now =
    typeof nowCandidate === "number" && Number.isFinite(nowCandidate)
      ? Math.trunc(nowCandidate)
      : Date.now();
  const uuid = params.uuid?.trim() || crypto.randomUUID();
<<<<<<< HEAD
  return path.join(resolveTempRoot(params.tmpDir), `${prefix}-${now}-${uuid}${extension}`);
=======
  return path.join(
    resolveTempRoot(params.tmpDir),
    `${sanitizeTempPrefix(params.prefix)}-${now}-${uuid}${sanitizeTempExtension(params.extension)}`,
  );
}

function buildTempDownloadTarget(
  workspace: TempWorkspace,
  fileName: string | undefined,
): TempDownloadTarget {
  const file = (nextName?: string) =>
    workspace.path(sanitizeTempFileName(nextName ?? fileName ?? "download.bin"));
  return {
    dir: workspace.dir,
    path: file(),
    file,
    cleanup: async () => {
      await workspace.cleanup();
    },
    [Symbol.asyncDispose]: workspace[Symbol.asyncDispose].bind(workspace),
  };
>>>>>>> upstream/main
}

export async function createTempDownloadTarget(params: {
  prefix: string;
  fileName?: string;
  tmpDir?: string;
}): Promise<TempDownloadTarget> {
<<<<<<< HEAD
  const tempRoot = resolveTempRoot(params.tmpDir);
  const prefix = `${sanitizePrefix(params.prefix)}-`;
  const dir = await mkdtemp(path.join(tempRoot, prefix));
  return {
    dir,
    path: path.join(dir, sanitizeTempFileName(params.fileName ?? "download.bin")),
    cleanup: async () => {
      await cleanupTempDir(dir);
    },
=======
  const workspace = await tempWorkspace({
    rootDir: resolveTempRoot(params.tmpDir),
    prefix: sanitizeTempPrefix(params.prefix),
  });
  const target = buildTempDownloadTarget(workspace, params.fileName);
  const cleanup = async () => {
    try {
      await workspace.cleanup();
    } catch (err) {
      logger.warn(`temp-path cleanup failed: ${String(err)}`, { error: err });
    }
  };
  return {
    ...target,
    cleanup,
    [Symbol.asyncDispose]: cleanup,
>>>>>>> upstream/main
  };
}

export async function withTempDownloadPath<T>(
  params: {
    prefix: string;
    fileName?: string;
    tmpDir?: string;
  },
  fn: (tmpPath: string) => Promise<T>,
): Promise<T> {
  const target = await createTempDownloadTarget(params);
  try {
    return await fn(target.path);
  } finally {
    await target.cleanup();
  }
}
