// Safe local-file helpers for plugin runtime media and bridge code.

<<<<<<< HEAD
export { readFileWithinRoot, writeFileWithinRoot } from "../infra/fs-safe.js";
=======
export {
  readFileWithinRoot,
  readLocalFileFromRoots,
  root,
  writeFileWithinRoot,
} from "../infra/fs-safe.js";
>>>>>>> upstream/main
export { basenameFromMediaSource, safeFileURLToPath } from "../infra/local-file-access.js";
