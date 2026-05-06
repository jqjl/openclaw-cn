import { createHash } from "node:crypto";
<<<<<<< HEAD
import fs from "node:fs/promises";
import path from "node:path";
import { resolveStateDir } from "../config/paths.js";
=======
import path from "node:path";
import { resolveStateDir } from "../config/paths.js";
import { privateFileStore } from "../infra/private-file-store.js";
>>>>>>> upstream/main
import { normalizeAgentId, parseAgentSessionKey } from "../routing/session-key.js";
import type { TuiSessionList } from "./tui-backend.js";
import type { SessionScope } from "./tui-types.js";

type LastSessionRecord = {
  sessionKey: string;
  updatedAt: number;
};

type LastSessionStore = Record<string, LastSessionRecord>;

export function resolveTuiLastSessionStatePath(stateDir = resolveStateDir()): string {
  return path.join(stateDir, "tui", "last-session.json");
}

export function buildTuiLastSessionScopeKey(params: {
  connectionUrl: string;
  agentId: string;
  sessionScope: SessionScope;
}): string {
  const agentId = normalizeAgentId(params.agentId);
  const connectionUrl = params.connectionUrl.trim() || "local";
  return createHash("sha256")
    .update(`${params.sessionScope}\n${agentId}\n${connectionUrl}`)
    .digest("hex")
    .slice(0, 32);
}

async function readStore(filePath: string): Promise<LastSessionStore> {
  try {
<<<<<<< HEAD
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
=======
    const parsed = await privateFileStore(path.dirname(filePath)).readJsonIfExists(
      path.basename(filePath),
    );
>>>>>>> upstream/main
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as LastSessionStore)
      : {};
  } catch {
    return {};
  }
}

<<<<<<< HEAD
=======
function normalizeMarker(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function isHeartbeatSessionKey(sessionKey: string): boolean {
  return normalizeMarker(sessionKey).endsWith(":heartbeat");
}

export function isHeartbeatLikeTuiSession(session: TuiSessionList["sessions"][number]): boolean {
  if (isHeartbeatSessionKey(session.key)) {
    return true;
  }
  const markers = [
    session.provider,
    session.lastProvider,
    session.lastChannel,
    session.lastTo,
    session.origin?.provider,
    session.origin?.surface,
    session.origin?.label,
  ];
  return markers.some((marker) => normalizeMarker(marker) === "heartbeat");
}

>>>>>>> upstream/main
export async function readTuiLastSessionKey(params: {
  scopeKey: string;
  stateDir?: string;
}): Promise<string | null> {
  const store = await readStore(resolveTuiLastSessionStatePath(params.stateDir));
  const value = store[params.scopeKey]?.sessionKey;
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function writeTuiLastSessionKey(params: {
  scopeKey: string;
  sessionKey: string;
  stateDir?: string;
}): Promise<void> {
  const sessionKey = params.sessionKey.trim();
<<<<<<< HEAD
  if (!sessionKey || sessionKey === "unknown") {
=======
  if (!sessionKey || sessionKey === "unknown" || isHeartbeatSessionKey(sessionKey)) {
>>>>>>> upstream/main
    return;
  }
  const filePath = resolveTuiLastSessionStatePath(params.stateDir);
  const store = await readStore(filePath);
  store[params.scopeKey] = {
    sessionKey,
    updatedAt: Date.now(),
  };
<<<<<<< HEAD
  await fs.mkdir(path.dirname(filePath), { recursive: true, mode: 0o700 });
  await fs.writeFile(filePath, `${JSON.stringify(store, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
=======
  await privateFileStore(path.dirname(filePath)).writeJson(path.basename(filePath), store, {
    trailingNewline: true,
>>>>>>> upstream/main
  });
}

export function resolveRememberedTuiSessionKey(params: {
  rememberedKey: string | null | undefined;
  currentAgentId: string;
  sessions: TuiSessionList["sessions"];
}): string | null {
  const rememberedKey = params.rememberedKey?.trim();
  if (!rememberedKey) {
    return null;
  }
<<<<<<< HEAD
=======
  if (isHeartbeatSessionKey(rememberedKey)) {
    return null;
  }
>>>>>>> upstream/main
  const currentAgentId = normalizeAgentId(params.currentAgentId);
  const parsed = parseAgentSessionKey(rememberedKey);
  if (parsed && normalizeAgentId(parsed.agentId) !== currentAgentId) {
    return null;
  }
  const rememberedRest = parsed?.rest ?? rememberedKey;
  const match = params.sessions.find((session) => {
<<<<<<< HEAD
=======
    if (isHeartbeatLikeTuiSession(session)) {
      return false;
    }
>>>>>>> upstream/main
    if (session.key === rememberedKey) {
      return true;
    }
    return parseAgentSessionKey(session.key)?.rest === rememberedRest;
  });
  return match?.key ?? null;
}
