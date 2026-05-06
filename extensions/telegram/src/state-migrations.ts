<<<<<<< HEAD
import fs from "node:fs";
import type { ChannelLegacyStateMigrationPlan } from "openclaw/plugin-sdk/channel-contract";
import { resolveChannelAllowFromPath } from "openclaw/plugin-sdk/channel-pairing-paths";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-types";
=======
import type { ChannelLegacyStateMigrationPlan } from "openclaw/plugin-sdk/channel-contract";
import { resolveChannelAllowFromPath } from "openclaw/plugin-sdk/channel-pairing-paths";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-types";
import { statRegularFileSync } from "openclaw/plugin-sdk/security-runtime";
>>>>>>> upstream/main
import { resolveDefaultTelegramAccountId } from "./account-selection.js";

function fileExists(pathValue: string): boolean {
  try {
<<<<<<< HEAD
    return fs.existsSync(pathValue) && fs.statSync(pathValue).isFile();
=======
    return !statRegularFileSync(pathValue).missing;
>>>>>>> upstream/main
  } catch {
    return false;
  }
}

export function detectTelegramLegacyStateMigrations(params: {
  cfg: OpenClawConfig;
  env: NodeJS.ProcessEnv;
}): ChannelLegacyStateMigrationPlan[] {
  const legacyPath = resolveChannelAllowFromPath("telegram", params.env);
  if (!fileExists(legacyPath)) {
    return [];
  }
  const accountId = resolveDefaultTelegramAccountId(params.cfg);
  const targetPath = resolveChannelAllowFromPath("telegram", params.env, accountId);
  if (fileExists(targetPath)) {
    return [];
  }
  return [
    {
      kind: "copy",
      label: "Telegram pairing allowFrom",
      sourcePath: legacyPath,
      targetPath,
    },
  ];
}
