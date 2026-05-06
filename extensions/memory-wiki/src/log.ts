import fs from "node:fs/promises";
import path from "node:path";
<<<<<<< HEAD
=======
import { appendRegularFile } from "openclaw/plugin-sdk/security-runtime";
>>>>>>> upstream/main

type MemoryWikiLogEntry = {
  type: "init" | "ingest" | "compile" | "lint";
  timestamp: string;
  details?: Record<string, unknown>;
};

export async function appendMemoryWikiLog(
  vaultRoot: string,
  entry: MemoryWikiLogEntry,
): Promise<void> {
  const logPath = path.join(vaultRoot, ".openclaw-wiki", "log.jsonl");
  await fs.mkdir(path.dirname(logPath), { recursive: true });
<<<<<<< HEAD
  await fs.appendFile(logPath, `${JSON.stringify(entry)}\n`, "utf8");
=======
  await appendRegularFile({
    filePath: logPath,
    content: `${JSON.stringify(entry)}\n`,
    rejectSymlinkParents: true,
  });
>>>>>>> upstream/main
}
