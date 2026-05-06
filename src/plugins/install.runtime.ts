<<<<<<< HEAD
import { fileExists, readJsonFile, resolveArchiveKind } from "../infra/archive.js";
import { writeFileFromPathWithinRoot } from "../infra/fs-safe.js";
=======
import { resolveArchiveKind } from "../infra/archive.js";
import { pathExists, root } from "../infra/fs-safe.js";
>>>>>>> upstream/main
import { resolveExistingInstallPath, withExtractedArchiveRoot } from "../infra/install-flow.js";
import {
  resolveInstallModeOptions,
  resolveTimedInstallModeOptions,
} from "../infra/install-mode-options.js";
import { installPackageDir } from "../infra/install-package-dir.js";
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
import {
  finalizeNpmSpecArchiveInstall,
  installFromNpmSpecArchiveWithInstaller,
} from "../infra/npm-pack-install.js";
import { validateRegistryNpmSpec } from "../infra/npm-registry-spec.js";
import { resolveCompatibilityHostVersion, resolveRuntimeServiceVersion } from "../version.js";
import { detectBundleManifestFormat, loadBundleManifest } from "./bundle-manifest.js";
import {
  scanInstalledPackageDependencyTree,
  scanBundleInstallSource,
  scanFileInstallSource,
  scanPackageInstallSource,
} from "./install-security-scan.js";
import {
  getPackageManifestMetadata,
  loadPluginManifest,
  resolvePackageExtensionEntries,
} from "./manifest.js";
import { checkMinHostVersion } from "./min-host-version.js";
import { isPathInside } from "./path-safety.js";

export type { NpmIntegrityDrift, NpmSpecResolution };

export {
  checkMinHostVersion,
<<<<<<< HEAD
  detectBundleManifestFormat,
  ensureInstallTargetAvailable,
  fileExists,
=======
  root,
  detectBundleManifestFormat,
  ensureInstallTargetAvailable,
  pathExists as fileExists,
>>>>>>> upstream/main
  finalizeNpmSpecArchiveInstall,
  getPackageManifestMetadata,
  installFromNpmSpecArchiveWithInstaller,
  installPackageDir,
  isPathInside,
  loadBundleManifest,
  loadPluginManifest,
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
  resolvePackageExtensionEntries,
  resolveCompatibilityHostVersion,
  resolveRuntimeServiceVersion,
  resolveTimedInstallModeOptions,
  scanInstalledPackageDependencyTree,
  scanBundleInstallSource,
  scanFileInstallSource,
  scanPackageInstallSource,
  validateRegistryNpmSpec,
  withExtractedArchiveRoot,
<<<<<<< HEAD
  writeFileFromPathWithinRoot,
=======
>>>>>>> upstream/main
};
