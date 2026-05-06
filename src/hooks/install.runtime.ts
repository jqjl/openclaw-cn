<<<<<<< HEAD
import { fileExists, readJsonFile, resolveArchiveKind } from "../infra/archive.js";
=======
import { resolveArchiveKind } from "../infra/archive.js";
import { pathExists } from "../infra/fs-safe.js";
>>>>>>> upstream/main
import { resolveExistingInstallPath, withExtractedArchiveRoot } from "../infra/install-flow.js";
import { installFromValidatedNpmSpecArchive } from "../infra/install-from-npm-spec.js";
import {
  resolveInstallModeOptions,
  resolveTimedInstallModeOptions,
} from "../infra/install-mode-options.js";
import {
  installPackageDir,
  installPackageDirWithManifestDeps,
} from "../infra/install-package-dir.js";
import {
  type NpmIntegrityDrift,
  type NpmSpecResolution,
  resolveArchiveSourcePath,
} from "../infra/install-source-utils.js";
import {
  ensureInstallTargetAvailable,
  resolveCanonicalInstallTarget,
} from "../infra/install-target.js";
<<<<<<< HEAD
=======
import { readJson } from "../infra/json-files.js";
>>>>>>> upstream/main
import { isPathInside, isPathInsideWithRealpath } from "../security/scan-paths.js";

export type { NpmIntegrityDrift, NpmSpecResolution };

export {
  ensureInstallTargetAvailable,
<<<<<<< HEAD
  fileExists,
=======
  pathExists as fileExists,
>>>>>>> upstream/main
  installFromValidatedNpmSpecArchive,
  installPackageDir,
  installPackageDirWithManifestDeps,
  isPathInside,
  isPathInsideWithRealpath,
<<<<<<< HEAD
  readJsonFile,
=======
  readJson as readJsonFile,
>>>>>>> upstream/main
  resolveArchiveKind,
  resolveArchiveSourcePath,
  resolveCanonicalInstallTarget,
  resolveExistingInstallPath,
  resolveInstallModeOptions,
  resolveTimedInstallModeOptions,
  withExtractedArchiveRoot,
};
