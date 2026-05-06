import { existsSync } from "node:fs";
import { resolveConfigPath } from "../config/paths.js";
import type { OpenClawConfig } from "../config/types.js";
<<<<<<< HEAD
=======
import { resolveGatewayAuthTokenSourceConflict } from "../gateway/auth-token-source-conflict.js";
>>>>>>> upstream/main

export function shouldSkipStatusScanMissingConfigFastPath(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return env.VITEST === "true" || env.VITEST_POOL_ID !== undefined || env.NODE_ENV === "test";
}

export function resolveStatusScanColdStart(params?: {
  env?: NodeJS.ProcessEnv;
  allowMissingConfigFastPath?: boolean;
}): boolean {
  const env = params?.env ?? process.env;
  const skipMissingConfigFastPath =
    params?.allowMissingConfigFastPath === true && shouldSkipStatusScanMissingConfigFastPath(env);
  return !skipMissingConfigFastPath && !existsSync(resolveConfigPath(env));
}

export async function loadStatusScanCommandConfig(params: {
  commandName: string;
  readBestEffortConfig: () => Promise<OpenClawConfig>;
  resolveConfig: (
    sourceConfig: OpenClawConfig,
  ) => Promise<{ resolvedConfig: OpenClawConfig; diagnostics: string[] }>;
  env?: NodeJS.ProcessEnv;
  allowMissingConfigFastPath?: boolean;
}): Promise<{
  coldStart: boolean;
  sourceConfig: OpenClawConfig;
  resolvedConfig: OpenClawConfig;
  secretDiagnostics: string[];
}> {
  const env = params.env ?? process.env;
  const coldStart = resolveStatusScanColdStart({
    env,
    allowMissingConfigFastPath: params.allowMissingConfigFastPath,
  });
  const sourceConfig =
    coldStart && params.allowMissingConfigFastPath === true
      ? {}
      : await params.readBestEffortConfig();
  const { resolvedConfig, diagnostics } =
    coldStart && params.allowMissingConfigFastPath === true
      ? { resolvedConfig: sourceConfig, diagnostics: [] }
      : await params.resolveConfig(sourceConfig);
<<<<<<< HEAD
=======
  const tokenConflict = resolveGatewayAuthTokenSourceConflict({ cfg: sourceConfig, env });
>>>>>>> upstream/main
  return {
    coldStart,
    sourceConfig,
    resolvedConfig,
<<<<<<< HEAD
    secretDiagnostics: diagnostics,
=======
    secretDiagnostics: tokenConflict ? [...diagnostics, tokenConflict.diagnostic] : diagnostics,
>>>>>>> upstream/main
  };
}
