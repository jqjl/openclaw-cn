import fs from "node:fs/promises";
import path from "node:path";
import { resolveStateDir } from "../config/paths.js";
<<<<<<< HEAD
=======
import { appendRegularFile } from "../infra/fs-safe.js";
>>>>>>> upstream/main

type CrestodianAuditEntry = {
  timestamp: string;
  operation: string;
  summary: string;
  configPath?: string;
  configHashBefore?: string | null;
  configHashAfter?: string | null;
  details?: Record<string, unknown>;
};

export function resolveCrestodianAuditPath(
  env: NodeJS.ProcessEnv = process.env,
  stateDir = resolveStateDir(env),
): string {
  return path.join(stateDir, "audit", "crestodian.jsonl");
}

export async function appendCrestodianAuditEntry(
  entry: Omit<CrestodianAuditEntry, "timestamp">,
  opts: { env?: NodeJS.ProcessEnv; auditPath?: string } = {},
): Promise<string> {
  const auditPath = opts.auditPath ?? resolveCrestodianAuditPath(opts.env);
  await fs.mkdir(path.dirname(auditPath), { recursive: true });
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    ...entry,
  } satisfies CrestodianAuditEntry);
<<<<<<< HEAD
  await fs.appendFile(auditPath, `${line}\n`, { encoding: "utf8", mode: 0o600 });
  await fs.chmod(auditPath, 0o600).catch(() => {
    // Best-effort on platforms/filesystems without POSIX modes.
=======
  await appendRegularFile({
    filePath: auditPath,
    content: `${line}\n`,
    rejectSymlinkParents: true,
>>>>>>> upstream/main
  });
  return auditPath;
}
