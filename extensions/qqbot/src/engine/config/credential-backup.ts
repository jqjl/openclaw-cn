/**
 * Credential backup & recovery.
 * 凭证暂存与恢复。
 *
 * Solves the "hot-upgrade interrupted, appId/secret vanished from
 * openclaw.json" failure mode.
 *
 * Mechanics:
 *   - After each successful gateway start we snapshot the currently
 *     resolved `appId` / `clientSecret` to a per-account backup file.
 *   - During plugin startup, if the live config has an empty appId or
 *     secret, the gateway consults the backup and restores the values
 *     via the config mutation API.
 *   - Backups live under `~/.openclaw/qqbot/data/` so they survive
 *     plugin directory replacement.
 *
 * Safety notes:
 *   - Only restore when credentials are **actually empty** — never
 *     overwrite a user's intentional config change.
 *   - Atomic write (temp file + rename) to avoid torn files.
 *   - Per-account file: `credential-backup-<accountId>.json`. We do
 *     **not** also key by appId because recovery happens precisely
 *     when appId is unknown.
 *   - Legacy single `credential-backup.json` is migrated automatically
 *     when the stored accountId matches the caller.
 */

import fs from "node:fs";
<<<<<<< HEAD
import path from "node:path";
=======
import { loadJsonFile } from "openclaw/plugin-sdk/json-store";
import { replaceFileAtomicSync } from "openclaw/plugin-sdk/security-runtime";
>>>>>>> upstream/main
import { getCredentialBackupFile, getLegacyCredentialBackupFile } from "../utils/data-paths.js";

interface CredentialBackup {
  accountId: string;
  appId: string;
  clientSecret: string;
  savedAt: string;
}

/** Persist a credential snapshot (called once gateway reaches READY). */
export function saveCredentialBackup(accountId: string, appId: string, clientSecret: string): void {
  if (!appId || !clientSecret) {
    return;
  }
  try {
    const backupPath = getCredentialBackupFile(accountId);
<<<<<<< HEAD
    fs.mkdirSync(path.dirname(backupPath), { recursive: true });
=======
>>>>>>> upstream/main
    const data: CredentialBackup = {
      accountId,
      appId,
      clientSecret,
      savedAt: new Date().toISOString(),
    };
<<<<<<< HEAD
    const tmpPath = `${backupPath}.tmp`;
    fs.writeFileSync(tmpPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    fs.renameSync(tmpPath, backupPath);
=======
    replaceFileAtomicSync({
      filePath: backupPath,
      content: `${JSON.stringify(data, null, 2)}\n`,
      tempPrefix: ".qqbot-credential-backup",
    });
>>>>>>> upstream/main
  } catch {
    /* best-effort — ignore */
  }
}

/**
 * Load a credential snapshot for `accountId`.
 *
 * Consults the new per-account file first; falls back to the legacy
 * global backup file and migrates it when the embedded `accountId`
 * matches the request. Returns `null` when no usable backup exists.
 */
export function loadCredentialBackup(accountId?: string): CredentialBackup | null {
  try {
    if (accountId) {
      const newPath = getCredentialBackupFile(accountId);
<<<<<<< HEAD
      if (fs.existsSync(newPath)) {
        const data = JSON.parse(fs.readFileSync(newPath, "utf8")) as CredentialBackup;
        if (data?.appId && data.clientSecret) {
          return data;
        }
=======
      const data = loadJsonFile<CredentialBackup>(newPath);
      if (data?.appId && data.clientSecret) {
        return data;
>>>>>>> upstream/main
      }
    }

    const legacy = getLegacyCredentialBackupFile();
<<<<<<< HEAD
    if (fs.existsSync(legacy)) {
      const data = JSON.parse(fs.readFileSync(legacy, "utf8")) as CredentialBackup;
=======
    const data = loadJsonFile<CredentialBackup>(legacy);
    if (data) {
>>>>>>> upstream/main
      if (!data?.appId || !data?.clientSecret) {
        return null;
      }
      if (accountId && data.accountId !== accountId) {
        return null;
      }
      if (data.accountId) {
        try {
          const backupPath = getCredentialBackupFile(data.accountId);
<<<<<<< HEAD
          fs.mkdirSync(path.dirname(backupPath), { recursive: true });
          const tmpPath = `${backupPath}.tmp`;
          fs.writeFileSync(tmpPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
          fs.renameSync(tmpPath, backupPath);
=======
          replaceFileAtomicSync({
            filePath: backupPath,
            content: `${JSON.stringify(data, null, 2)}\n`,
            tempPrefix: ".qqbot-credential-backup",
          });
>>>>>>> upstream/main
          fs.unlinkSync(legacy);
        } catch {
          /* ignore migration errors */
        }
      }
      return data;
    }
  } catch {
    /* corrupt file — ignore */
  }
  return null;
}
