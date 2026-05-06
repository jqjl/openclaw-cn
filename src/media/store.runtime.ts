<<<<<<< HEAD
import {
  readLocalFileSafely as readLocalFileSafelyImpl,
  SafeOpenError,
  type SafeOpenErrorCode,
} from "../infra/fs-safe.js";

export type SafeOpenLikeError = {
  code: SafeOpenErrorCode;
=======
import "../infra/fs-safe-defaults.js";
import {
  FsSafeError,
  readLocalFileSafely as readLocalFileSafelyImpl,
  type FsSafeErrorCode,
} from "../infra/fs-safe.js";

export type FsSafeLikeError = {
  code: FsSafeErrorCode;
>>>>>>> upstream/main
  message: string;
};

export const readLocalFileSafely = readLocalFileSafelyImpl;

<<<<<<< HEAD
export function isSafeOpenError(error: unknown): error is SafeOpenLikeError {
  return error instanceof SafeOpenError;
=======
export function isFsSafeError(error: unknown): error is FsSafeLikeError {
  return error instanceof FsSafeError;
>>>>>>> upstream/main
}
