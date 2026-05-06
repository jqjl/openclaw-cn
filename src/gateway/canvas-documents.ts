import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { CANVAS_HOST_PATH } from "../canvas-host/a2ui.js";
import { resolveStateDir } from "../config/paths.js";
<<<<<<< HEAD
=======
import { root as fsRoot, sanitizeUntrustedFileName } from "../infra/fs-safe.js";
>>>>>>> upstream/main
import { resolveUserPath } from "../utils.js";

type CanvasDocumentKind = "html_bundle" | "url_embed" | "document" | "image" | "video_asset";

type CanvasDocumentAsset = {
  logicalPath: string;
  sourcePath: string;
  contentType?: string;
};

type CanvasDocumentEntrypoint =
  | { type: "html"; value: string }
  | { type: "path"; value: string }
  | { type: "url"; value: string };

type CanvasDocumentCreateInput = {
  id?: string;
  kind: CanvasDocumentKind;
  title?: string;
  preferredHeight?: number;
  entrypoint?: CanvasDocumentEntrypoint;
  assets?: CanvasDocumentAsset[];
  surface?: "assistant_message" | "tool_card" | "sidebar";
};

type CanvasDocumentManifest = {
  id: string;
  kind: CanvasDocumentKind;
  title?: string;
  preferredHeight?: number;
  createdAt: string;
  entryUrl: string;
  localEntrypoint?: string;
  externalUrl?: string;
  surface?: "assistant_message" | "tool_card" | "sidebar";
  assets: Array<{
    logicalPath: string;
    contentType?: string;
  }>;
};

type CanvasDocumentResolvedAsset = {
  logicalPath: string;
  contentType?: string;
  url: string;
  localPath: string;
};

const CANVAS_DOCUMENTS_DIR_NAME = "documents";

function isPdfPathLike(value: string): boolean {
  return /\.pdf(?:[?#].*)?$/i.test(value.trim());
}

function buildPdfWrapper(url: string): string {
  const escaped = escapeHtml(url);
  return `<!doctype html><html><body style="margin:0;background:#e5e7eb;"><object data="${escaped}" type="application/pdf" style="width:100%;height:100vh;border:0;"><iframe src="${escaped}" style="width:100%;height:100vh;border:0;"></iframe><p style="padding:16px;font:14px system-ui,sans-serif;">Unable to render PDF preview. <a href="${escaped}" target="_blank" rel="noopener noreferrer">Open PDF</a>.</p></object></body></html>`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeLogicalPath(value: string): string {
  const normalized = value.replaceAll("\\", "/").replace(/^\/+/, "");
  const parts = normalized.split("/").filter(Boolean);
<<<<<<< HEAD
  if (parts.length === 0 || parts.some((part) => part === "." || part === "..")) {
=======
  if (
    parts.length === 0 ||
    parts.some(
      (part) => part === "." || part === ".." || part.includes(":") || hasControlCharacter(part),
    )
  ) {
>>>>>>> upstream/main
    throw new Error("canvas document logicalPath invalid");
  }
  return parts.join("/");
}

<<<<<<< HEAD
=======
function hasControlCharacter(value: string): boolean {
  for (const char of value) {
    const code = char.charCodeAt(0);
    if (code < 0x20 || code === 0x7f) {
      return true;
    }
  }
  return false;
}

>>>>>>> upstream/main
function canvasDocumentId(): string {
  return `cv_${randomUUID().replaceAll("-", "")}`;
}

function normalizeCanvasDocumentId(value: string): string {
  const normalized = value.trim();
  if (
    !normalized ||
    normalized === "." ||
    normalized === ".." ||
    !/^[A-Za-z0-9._-]+$/.test(normalized)
  ) {
    throw new Error("canvas document id invalid");
  }
  return normalized;
}

function resolveCanvasRootDir(rootDir?: string, stateDir = resolveStateDir()): string {
  const resolved = rootDir?.trim() ? resolveUserPath(rootDir) : path.join(stateDir, "canvas");
  return path.resolve(resolved);
}

function resolveCanvasDocumentsDir(rootDir?: string, stateDir = resolveStateDir()): string {
  return path.join(resolveCanvasRootDir(rootDir, stateDir), CANVAS_DOCUMENTS_DIR_NAME);
}

export function resolveCanvasDocumentDir(
  documentId: string,
  options?: { rootDir?: string; stateDir?: string },
): string {
  return path.join(resolveCanvasDocumentsDir(options?.rootDir, options?.stateDir), documentId);
}

export function buildCanvasDocumentEntryUrl(documentId: string, entrypoint: string): string {
  const normalizedEntrypoint = normalizeLogicalPath(entrypoint);
  const encodedEntrypoint = normalizedEntrypoint
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${CANVAS_HOST_PATH}/${CANVAS_DOCUMENTS_DIR_NAME}/${encodeURIComponent(documentId)}/${encodedEntrypoint}`;
}

function buildCanvasDocumentAssetUrl(documentId: string, logicalPath: string): string {
  return buildCanvasDocumentEntryUrl(documentId, logicalPath);
}

export function resolveCanvasHttpPathToLocalPath(
  requestPath: string,
  options?: { rootDir?: string; stateDir?: string },
): string | null {
  const trimmed = requestPath.trim();
  const prefix = `${CANVAS_HOST_PATH}/${CANVAS_DOCUMENTS_DIR_NAME}/`;
  if (!trimmed.startsWith(prefix)) {
    return null;
  }
  const pathWithoutQuery = trimmed.replace(/[?#].*$/, "");
  const relative = pathWithoutQuery.slice(prefix.length);
  const segments = relative
    .split("/")
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    })
    .filter(Boolean);
  if (segments.length < 2) {
    return null;
  }
  const [rawDocumentId, ...entrySegments] = segments;
  try {
    const documentId = normalizeCanvasDocumentId(rawDocumentId);
    const normalizedEntrypoint = normalizeLogicalPath(entrySegments.join("/"));
    const documentsDir = path.resolve(
      resolveCanvasDocumentsDir(options?.rootDir, options?.stateDir),
    );
    const candidatePath = path.resolve(
      resolveCanvasDocumentDir(documentId, options),
      normalizedEntrypoint,
    );
    if (
      !(candidatePath === documentsDir || candidatePath.startsWith(`${documentsDir}${path.sep}`))
    ) {
      return null;
    }
    return candidatePath;
  } catch {
    return null;
  }
}

<<<<<<< HEAD
async function writeManifest(rootDir: string, manifest: CanvasDocumentManifest): Promise<void> {
  await fs.writeFile(
    path.join(rootDir, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );
}

async function copyAssets(
  rootDir: string,
=======
type CanvasDocumentRoot = Awaited<ReturnType<typeof fsRoot>>;

async function writeManifest(
  root: CanvasDocumentRoot,
  manifest: CanvasDocumentManifest,
): Promise<void> {
  await root.writeJson("manifest.json", manifest, { space: 2 });
}

async function copyAssets(
  root: CanvasDocumentRoot,
>>>>>>> upstream/main
  assets: CanvasDocumentAsset[] | undefined,
  workspaceDir: string,
): Promise<CanvasDocumentManifest["assets"]> {
  const copied: CanvasDocumentManifest["assets"] = [];
  for (const asset of assets ?? []) {
    const logicalPath = normalizeLogicalPath(asset.logicalPath);
    const sourcePath = asset.sourcePath.startsWith("~")
      ? resolveUserPath(asset.sourcePath)
      : path.isAbsolute(asset.sourcePath)
        ? path.resolve(asset.sourcePath)
        : path.resolve(workspaceDir, asset.sourcePath);
<<<<<<< HEAD
    const destination = path.join(rootDir, logicalPath);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.copyFile(sourcePath, destination);
=======
    await root.copyIn(logicalPath, sourcePath);
>>>>>>> upstream/main
    copied.push({
      logicalPath,
      ...(asset.contentType ? { contentType: asset.contentType } : {}),
    });
  }
  return copied;
}

async function materializeEntrypoint(
  rootDir: string,
<<<<<<< HEAD
=======
  root: CanvasDocumentRoot,
>>>>>>> upstream/main
  input: CanvasDocumentCreateInput,
  workspaceDir: string,
): Promise<Pick<CanvasDocumentManifest, "entryUrl" | "localEntrypoint" | "externalUrl">> {
  const entrypoint = input.entrypoint;
  if (!entrypoint) {
    throw new Error("canvas document entrypoint required");
  }
  if (entrypoint.type === "html") {
    const fileName = "index.html";
<<<<<<< HEAD
    await fs.writeFile(path.join(rootDir, fileName), entrypoint.value, "utf8");
=======
    await root.write(fileName, entrypoint.value);
>>>>>>> upstream/main
    return {
      localEntrypoint: fileName,
      entryUrl: buildCanvasDocumentEntryUrl(path.basename(rootDir), fileName),
    };
  }
  if (entrypoint.type === "url") {
    if (input.kind === "document" && isPdfPathLike(entrypoint.value)) {
      const fileName = "index.html";
<<<<<<< HEAD
      await fs.writeFile(path.join(rootDir, fileName), buildPdfWrapper(entrypoint.value), "utf8");
=======
      await root.write(fileName, buildPdfWrapper(entrypoint.value));
>>>>>>> upstream/main
      return {
        localEntrypoint: fileName,
        externalUrl: entrypoint.value,
        entryUrl: buildCanvasDocumentEntryUrl(path.basename(rootDir), fileName),
      };
    }
    return {
      externalUrl: entrypoint.value,
      entryUrl: entrypoint.value,
    };
  }

  const resolvedPath = entrypoint.value.startsWith("~")
    ? resolveUserPath(entrypoint.value)
    : path.isAbsolute(entrypoint.value)
      ? path.resolve(entrypoint.value)
      : path.resolve(workspaceDir, entrypoint.value);

  if (input.kind === "image" || input.kind === "video_asset") {
<<<<<<< HEAD
    const copiedName = path.basename(resolvedPath);
    await fs.copyFile(resolvedPath, path.join(rootDir, copiedName));
=======
    const copiedName = sanitizeUntrustedFileName(path.basename(resolvedPath), "asset");
    await root.copyIn(copiedName, resolvedPath);
>>>>>>> upstream/main
    const wrapper =
      input.kind === "image"
        ? `<!doctype html><html><body style="margin:0;background:#0f172a;display:flex;align-items:center;justify-content:center;"><img src="${escapeHtml(copiedName)}" style="max-width:100%;max-height:100vh;object-fit:contain;" /></body></html>`
        : `<!doctype html><html><body style="margin:0;background:#0f172a;"><video src="${escapeHtml(copiedName)}" controls autoplay style="width:100%;height:100vh;object-fit:contain;background:#000;"></video></body></html>`;
<<<<<<< HEAD
    await fs.writeFile(path.join(rootDir, "index.html"), wrapper, "utf8");
=======
    await root.write("index.html", wrapper);
>>>>>>> upstream/main
    return {
      localEntrypoint: "index.html",
      entryUrl: buildCanvasDocumentEntryUrl(path.basename(rootDir), "index.html"),
    };
  }

<<<<<<< HEAD
  const fileName = path.basename(resolvedPath);
  await fs.copyFile(resolvedPath, path.join(rootDir, fileName));
  if (input.kind === "document" && isPdfPathLike(fileName)) {
    await fs.writeFile(path.join(rootDir, "index.html"), buildPdfWrapper(fileName), "utf8");
=======
  const fileName = sanitizeUntrustedFileName(path.basename(resolvedPath), "document");
  await root.copyIn(fileName, resolvedPath);
  if (input.kind === "document" && isPdfPathLike(fileName)) {
    await root.write("index.html", buildPdfWrapper(fileName));
>>>>>>> upstream/main
    return {
      localEntrypoint: "index.html",
      entryUrl: buildCanvasDocumentEntryUrl(path.basename(rootDir), "index.html"),
    };
  }
  return {
    localEntrypoint: fileName,
    entryUrl: buildCanvasDocumentEntryUrl(path.basename(rootDir), fileName),
  };
}

export async function createCanvasDocument(
  input: CanvasDocumentCreateInput,
  options?: { stateDir?: string; workspaceDir?: string; canvasRootDir?: string },
): Promise<CanvasDocumentManifest> {
  const workspaceDir = options?.workspaceDir ?? process.cwd();
  const id = input.id?.trim() ? normalizeCanvasDocumentId(input.id) : canvasDocumentId();
  const rootDir = resolveCanvasDocumentDir(id, {
    stateDir: options?.stateDir,
    rootDir: options?.canvasRootDir,
  });
  await fs.rm(rootDir, { recursive: true, force: true }).catch(() => undefined);
  await fs.mkdir(rootDir, { recursive: true });
<<<<<<< HEAD
  const assets = await copyAssets(rootDir, input.assets, workspaceDir);
  const entry = await materializeEntrypoint(rootDir, input, workspaceDir);
=======
  const root = await fsRoot(rootDir);
  const assets = await copyAssets(root, input.assets, workspaceDir);
  const entry = await materializeEntrypoint(rootDir, root, input, workspaceDir);
>>>>>>> upstream/main
  const manifest: CanvasDocumentManifest = {
    id,
    kind: input.kind,
    ...(input.title?.trim() ? { title: input.title.trim() } : {}),
    ...(typeof input.preferredHeight === "number"
      ? { preferredHeight: input.preferredHeight }
      : {}),
    ...(input.surface ? { surface: input.surface } : {}),
    createdAt: new Date().toISOString(),
    entryUrl: entry.entryUrl,
    ...(entry.localEntrypoint ? { localEntrypoint: entry.localEntrypoint } : {}),
    ...(entry.externalUrl ? { externalUrl: entry.externalUrl } : {}),
    assets,
  };
<<<<<<< HEAD
  await writeManifest(rootDir, manifest);
=======
  await writeManifest(root, manifest);
>>>>>>> upstream/main
  return manifest;
}

export function resolveCanvasDocumentAssets(
  manifest: CanvasDocumentManifest,
  options?: { baseUrl?: string; stateDir?: string; canvasRootDir?: string },
): CanvasDocumentResolvedAsset[] {
  const baseUrl = options?.baseUrl?.trim().replace(/\/+$/, "");
  const documentDir = resolveCanvasDocumentDir(manifest.id, {
    stateDir: options?.stateDir,
    rootDir: options?.canvasRootDir,
  });
  return manifest.assets.map((asset) => ({
    logicalPath: asset.logicalPath,
    ...(asset.contentType ? { contentType: asset.contentType } : {}),
    localPath: path.join(documentDir, asset.logicalPath),
    url: baseUrl
      ? `${baseUrl}${buildCanvasDocumentAssetUrl(manifest.id, asset.logicalPath)}`
      : buildCanvasDocumentAssetUrl(manifest.id, asset.logicalPath),
  }));
}
