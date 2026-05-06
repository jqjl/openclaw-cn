import { describe, expect, it } from "vitest";
import { SENSITIVE_URL_HINT_TAG } from "../shared/net/redact-sensitive-url.js";
import { computeBaseConfigSchemaResponse } from "./schema-base.js";
<<<<<<< HEAD
import { GENERATED_BASE_CONFIG_SCHEMA } from "./schema.base.generated.js";

describe("generated base config schema", () => {
  it("matches the computed base config schema payload", () => {
    expect(
      computeBaseConfigSchemaResponse({
        generatedAt: GENERATED_BASE_CONFIG_SCHEMA.generatedAt,
      }),
    ).toEqual(GENERATED_BASE_CONFIG_SCHEMA);
  });

  it("includes explicit URL-secret tags for sensitive URL fields", () => {
    expect(GENERATED_BASE_CONFIG_SCHEMA.uiHints["mcp.servers.*.url"]?.tags).toContain(
      SENSITIVE_URL_HINT_TAG,
    );
    expect(GENERATED_BASE_CONFIG_SCHEMA.uiHints["models.providers.*.baseUrl"]?.tags).toContain(
=======

const BASE_CONFIG_SCHEMA = computeBaseConfigSchemaResponse({
  generatedAt: "2026-05-05T00:00:00.000Z",
});

describe("base config schema", () => {
  it("is deterministic for a fixed generatedAt timestamp", () => {
    expect(
      computeBaseConfigSchemaResponse({
        generatedAt: BASE_CONFIG_SCHEMA.generatedAt,
      }),
    ).toEqual(BASE_CONFIG_SCHEMA);
  });

  it("includes explicit URL-secret tags for sensitive URL fields", () => {
    expect(BASE_CONFIG_SCHEMA.uiHints["mcp.servers.*.url"]?.tags).toContain(SENSITIVE_URL_HINT_TAG);
    expect(BASE_CONFIG_SCHEMA.uiHints["models.providers.*.baseUrl"]?.tags).toContain(
>>>>>>> upstream/main
      SENSITIVE_URL_HINT_TAG,
    );
  });

  it("omits legacy hooks.internal.handlers from the public schema payload", () => {
    const hooksInternalProperties = (
<<<<<<< HEAD
      GENERATED_BASE_CONFIG_SCHEMA.schema as {
=======
      BASE_CONFIG_SCHEMA.schema as {
>>>>>>> upstream/main
        properties?: {
          hooks?: {
            properties?: {
              internal?: {
                properties?: Record<string, unknown>;
              };
            };
          };
        };
      }
    ).properties?.hooks?.properties?.internal?.properties;
<<<<<<< HEAD
    const uiHints = GENERATED_BASE_CONFIG_SCHEMA.uiHints as Record<string, unknown>;
=======
    const uiHints = BASE_CONFIG_SCHEMA.uiHints as Record<string, unknown>;
>>>>>>> upstream/main

    expect(hooksInternalProperties?.handlers).toBeUndefined();
    expect(uiHints["hooks.internal.handlers"]).toBeUndefined();
  });

  it("includes videoGenerationModel in the public schema payload", () => {
    const agentDefaultsProperties = (
<<<<<<< HEAD
      GENERATED_BASE_CONFIG_SCHEMA.schema as {
=======
      BASE_CONFIG_SCHEMA.schema as {
>>>>>>> upstream/main
        properties?: {
          agents?: {
            properties?: {
              defaults?: {
                properties?: Record<string, unknown>;
              };
            };
          };
        };
      }
    ).properties?.agents?.properties?.defaults?.properties;
<<<<<<< HEAD
    const uiHints = GENERATED_BASE_CONFIG_SCHEMA.uiHints as Record<string, unknown>;
=======
    const uiHints = BASE_CONFIG_SCHEMA.uiHints as Record<string, unknown>;
>>>>>>> upstream/main

    expect(agentDefaultsProperties?.videoGenerationModel).toBeDefined();
    expect(uiHints["agents.defaults.videoGenerationModel.primary"]).toBeDefined();
    expect(uiHints["agents.defaults.videoGenerationModel.fallbacks"]).toBeDefined();
    expect(uiHints["agents.defaults.mediaGenerationAutoProviderFallback"]).toBeDefined();
  });
});
