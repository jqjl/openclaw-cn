import type { PluginManifestRegistry } from "../plugins/manifest-registry.js";
import {
<<<<<<< HEAD
  configMayNeedPluginAutoEnable,
  resolveConfiguredPluginAutoEnableCandidates,
=======
  resolveConfiguredPluginAutoEnableCandidates,
  resolvePluginAutoEnableReadiness,
>>>>>>> upstream/main
  resolvePluginAutoEnableManifestRegistry,
} from "./plugin-auto-enable.shared.js";
import type { PluginAutoEnableCandidate } from "./plugin-auto-enable.types.js";
import type { OpenClawConfig } from "./types.openclaw.js";

export function detectPluginAutoEnableCandidates(params: {
  config?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  manifestRegistry?: PluginManifestRegistry;
}): PluginAutoEnableCandidate[] {
  const env = params.env ?? process.env;
  const config = params.config ?? ({} as OpenClawConfig);
<<<<<<< HEAD
  if (!configMayNeedPluginAutoEnable(config, env)) {
=======
  const readiness = resolvePluginAutoEnableReadiness(config, env);
  if (!readiness.mayNeedAutoEnable) {
>>>>>>> upstream/main
    return [];
  }
  const registry = resolvePluginAutoEnableManifestRegistry({
    config,
    env,
    manifestRegistry: params.manifestRegistry,
  });
  return resolveConfiguredPluginAutoEnableCandidates({
    config,
    env,
    registry,
<<<<<<< HEAD
=======
    configuredChannelIds: readiness.configuredChannelIds,
>>>>>>> upstream/main
  });
}
