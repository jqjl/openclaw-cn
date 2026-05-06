---
summary: "Alibaba Model Studio Wan video generation in OpenClaw"
title: "Alibaba Model Studio"
read_when:
  - You want to use Alibaba Wan video generation in OpenClaw
  - You need Model Studio or DashScope API key setup for video generation
---

<<<<<<< HEAD
OpenClaw ships a bundled `alibaba` video-generation provider for Wan models on
Alibaba Model Studio / DashScope.

- Provider: `alibaba`
- Preferred auth: `MODELSTUDIO_API_KEY`
- Also accepted: `DASHSCOPE_API_KEY`, `QWEN_API_KEY`
- API: DashScope / Model Studio async video generation
=======
OpenClaw ships a bundled `alibaba` plugin that registers a video-generation provider for Wan models on Alibaba Model Studio (the international name for DashScope). The plugin is enabled by default; you only need to set an API key.

| Property         | Value                                                                           |
| ---------------- | ------------------------------------------------------------------------------- |
| Provider id      | `alibaba`                                                                       |
| Plugin           | bundled, `enabledByDefault: true`                                               |
| Auth env vars    | `MODELSTUDIO_API_KEY` → `DASHSCOPE_API_KEY` → `QWEN_API_KEY` (first match wins) |
| Onboarding flag  | `--auth-choice alibaba-model-studio-api-key`                                    |
| Direct CLI flag  | `--alibaba-model-studio-api-key <key>`                                          |
| Default model    | `alibaba/wan2.6-t2v`                                                            |
| Default base URL | `https://dashscope-intl.aliyuncs.com`                                           |
>>>>>>> upstream/main

## Getting started

<Steps>
  <Step title="Set an API key">
<<<<<<< HEAD
    ```bash
    openclaw onboard --auth-choice qwen-standard-api-key
    ```
=======
    Use onboarding to store the key against the `alibaba` provider:

    ```bash
    openclaw onboard --auth-choice alibaba-model-studio-api-key
    ```

    Or pass the key directly during install/onboarding:

    ```bash
    openclaw onboard --alibaba-model-studio-api-key <your-key>
    ```

    Or export any of the accepted env vars before starting the Gateway:

    ```bash
    export MODELSTUDIO_API_KEY=sk-...
    # or DASHSCOPE_API_KEY=...
    # or QWEN_API_KEY=...
    ```

>>>>>>> upstream/main
  </Step>
  <Step title="Set a default video model">
    ```json5
    {
      agents: {
        defaults: {
          videoGenerationModel: {
            primary: "alibaba/wan2.6-t2v",
          },
        },
      },
    }
    ```
  </Step>
<<<<<<< HEAD
  <Step title="Verify the provider is available">
    ```bash
    openclaw models list --provider alibaba
    ```
=======
  <Step title="Verify the provider is configured">
    ```bash
    openclaw models list --provider alibaba
    ```

    The list should include all five bundled Wan models. If `MODELSTUDIO_API_KEY` is unresolved, `openclaw models status --json` reports the missing credential under `auth.unusableProfiles`.

>>>>>>> upstream/main
  </Step>
</Steps>

<Note>
<<<<<<< HEAD
Any of the accepted auth keys (`MODELSTUDIO_API_KEY`, `DASHSCOPE_API_KEY`, `QWEN_API_KEY`) will work. The `qwen-standard-api-key` onboarding choice configures the shared DashScope credential.
=======
  The Alibaba plugin and the [Qwen plugin](/providers/qwen) both authenticate against DashScope and accept overlapping env vars. Use `alibaba/...` model ids to drive the dedicated Wan video surface; use `qwen/...` ids when you want Qwen's chat, embedding, or media-understanding surface.
>>>>>>> upstream/main
</Note>

## Built-in Wan models

<<<<<<< HEAD
The bundled `alibaba` provider currently registers:

| Model ref                  | Mode                      |
| -------------------------- | ------------------------- |
| `alibaba/wan2.6-t2v`       | Text-to-video             |
=======
| Model ref                  | Mode                      |
| -------------------------- | ------------------------- |
| `alibaba/wan2.6-t2v`       | Text-to-video (default)   |
>>>>>>> upstream/main
| `alibaba/wan2.6-i2v`       | Image-to-video            |
| `alibaba/wan2.6-r2v`       | Reference-to-video        |
| `alibaba/wan2.6-r2v-flash` | Reference-to-video (fast) |
| `alibaba/wan2.7-r2v`       | Reference-to-video        |

<<<<<<< HEAD
## Current limits

| Parameter             | Limit                                                     |
| --------------------- | --------------------------------------------------------- |
| Output videos         | Up to **1** per request                                   |
| Input images          | Up to **1**                                               |
| Input videos          | Up to **4**                                               |
| Duration              | Up to **10 seconds**                                      |
| Supported controls    | `size`, `aspectRatio`, `resolution`, `audio`, `watermark` |
| Reference image/video | Remote `http(s)` URLs only                                |

<Warning>
Reference image/video mode currently requires **remote http(s) URLs**. Local file paths are not supported for reference inputs.
=======
## Capabilities and limits

The bundled provider mirrors DashScope's Wan video API caps. All three modes share the same per-request video count and duration cap; only the input shape differs.

| Mode               | Max output videos | Max input images | Max input videos | Max duration | Supported controls                                        |
| ------------------ | ----------------- | ---------------- | ---------------- | ------------ | --------------------------------------------------------- |
| Text-to-video      | 1                 | n/a              | n/a              | 10 s         | `size`, `aspectRatio`, `resolution`, `audio`, `watermark` |
| Image-to-video     | 1                 | 1                | n/a              | 10 s         | `size`, `aspectRatio`, `resolution`, `audio`, `watermark` |
| Reference-to-video | 1                 | n/a              | 4                | 10 s         | `size`, `aspectRatio`, `resolution`, `audio`, `watermark` |

When a request omits `durationSeconds`, the provider sends DashScope's accepted default of **5 seconds**. Set `durationSeconds` explicitly on the [video generation tool](/tools/video-generation) to extend up to 10 s.

<Warning>
  Reference image and video inputs must be remote `http(s)` URLs. Local file paths are not accepted by DashScope's reference modes; upload to object storage first or use the [media tool](/tools/media-overview) flow that already produces a public URL.
>>>>>>> upstream/main
</Warning>

## Advanced configuration

<AccordionGroup>
<<<<<<< HEAD
  <Accordion title="Relationship to Qwen">
    The bundled `qwen` provider also uses Alibaba-hosted DashScope endpoints for
    Wan video generation. Use:

    - `qwen/...` when you want the canonical Qwen provider surface
    - `alibaba/...` when you want the direct vendor-owned Wan video surface

    See the [Qwen provider docs](/providers/qwen) for more detail.

  </Accordion>

  <Accordion title="Auth key priority">
    OpenClaw checks for auth keys in this order:

    1. `MODELSTUDIO_API_KEY` (preferred)
    2. `DASHSCOPE_API_KEY`
    3. `QWEN_API_KEY`

    Any of these will authenticate the `alibaba` provider.
=======
  <Accordion title="Override the DashScope base URL">
    The provider defaults to the international DashScope endpoint. To target the China-region endpoint, set:

    ```json5
    {
      models: {
        providers: {
          alibaba: {
            baseUrl: "https://dashscope.aliyuncs.com",
          },
        },
      },
    }
    ```

    The provider strips trailing slashes before constructing AIGC task URLs.

  </Accordion>

  <Accordion title="Auth env priority">
    OpenClaw resolves the Alibaba API key from environment variables in this order, taking the first non-empty value:

    1. `MODELSTUDIO_API_KEY`
    2. `DASHSCOPE_API_KEY`
    3. `QWEN_API_KEY`

    Configured `auth.profiles` entries (set via `openclaw models auth login`) override env-var resolution. See [Auth profiles in the models FAQ](/help/faq-models#what-is-an-auth-profile) for profile rotation, cooldown, and override mechanics.

  </Accordion>

  <Accordion title="Relationship to the Qwen plugin">
    Both bundled plugins talk to DashScope and accept overlapping API keys. Use:

    - `alibaba/wan*.*` ids to drive the dedicated Wan video provider documented on this page.
    - `qwen/*` ids for Qwen chat, embedding, and media understanding (see [Qwen](/providers/qwen)).

    Setting `MODELSTUDIO_API_KEY` once authenticates both plugins because the auth env var list intentionally overlaps; you do not need to onboard each plugin separately.
>>>>>>> upstream/main

  </Accordion>
</AccordionGroup>

## Related

<CardGroup cols={2}>
  <Card title="Video generation" href="/tools/video-generation" icon="video">
    Shared video tool parameters and provider selection.
  </Card>
  <Card title="Qwen" href="/providers/qwen" icon="microchip">
<<<<<<< HEAD
    Qwen provider setup and DashScope integration.
=======
    Qwen chat, embedding, and media-understanding setup on the same DashScope auth.
>>>>>>> upstream/main
  </Card>
  <Card title="Configuration reference" href="/gateway/config-agents#agent-defaults" icon="gear">
    Agent defaults and model configuration.
  </Card>
<<<<<<< HEAD
=======
  <Card title="Models FAQ" href="/help/faq-models" icon="circle-question">
    Auth profiles, switching models, and resolving "no profile" errors.
  </Card>
>>>>>>> upstream/main
</CardGroup>
