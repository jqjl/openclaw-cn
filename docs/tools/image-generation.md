---
summary: "Generate and edit images using configured providers (OpenAI, Google Gemini, fal, MiniMax, ComfyUI, Vydra)"
read_when:
  - Generating or editing images via the agent
  - Configuring image-generation providers and models
  - Understanding the image_generate tool parameters
title: "Image generation"
sidebarTitle: "Image generation"
---

The `image_generate` tool lets the agent create and edit images using your
configured providers. Generated images are delivered automatically as media
attachments in the agent's reply.

<Note>
The tool only appears when at least one image-generation provider is
available. If you do not see `image_generate` in your agent's tools,
configure `agents.defaults.imageGenerationModel`, set up a provider API key,
or sign in with OpenAI Codex OAuth.
</Note>

## Quick start

1. Set an API key for at least one provider (for example `OPENAI_API_KEY` or `GEMINI_API_KEY`).
2. Optionally set your preferred model:

```json5
{
  agents: {
    defaults: {
      imageGenerationModel: {
        primary: "openai/gpt-image-1",
      },
    }
    ```

    Codex OAuth uses the same `openai/gpt-image-2` model ref. When an
    `openai-codex` OAuth profile is configured, OpenClaw routes image
    requests through that OAuth profile instead of first trying
    `OPENAI_API_KEY`. Explicit `models.providers.openai` config (API key,
    custom/Azure base URL) opts back into the direct OpenAI Images API
    route.

  </Step>
  <Step title="Ask the agent">
    _"Generate an image of a friendly robot mascot."_

    The agent calls `image_generate` automatically. No tool allow-listing
    needed — it is enabled by default when a provider is available.

  </Step>
</Steps>

<Warning>
For OpenAI-compatible LAN endpoints such as LocalAI, keep the custom
`models.providers.openai.baseUrl` and explicitly opt in with
`browser.ssrfPolicy.dangerouslyAllowPrivateNetwork: true`. Private and
internal image endpoints remain blocked by default.
</Warning>

## Common routes

| Goal                                                 | Model ref                                          | Auth                                   |
| ---------------------------------------------------- | -------------------------------------------------- | -------------------------------------- |
| OpenAI image generation with API billing             | `openai/gpt-image-2`                               | `OPENAI_API_KEY`                       |
| OpenAI image generation with Codex subscription auth | `openai/gpt-image-2`                               | OpenAI Codex OAuth                     |
| OpenAI transparent-background PNG/WebP               | `openai/gpt-image-1.5`                             | `OPENAI_API_KEY` or OpenAI Codex OAuth |
| DeepInfra image generation                           | `deepinfra/black-forest-labs/FLUX-1-schnell`       | `DEEPINFRA_API_KEY`                    |
| OpenRouter image generation                          | `openrouter/google/gemini-3.1-flash-image-preview` | `OPENROUTER_API_KEY`                   |
| LiteLLM image generation                             | `litellm/gpt-image-2`                              | `LITELLM_API_KEY`                      |
| Google Gemini image generation                       | `google/gemini-3.1-flash-image-preview`            | `GEMINI_API_KEY` or `GOOGLE_API_KEY`   |

The same `image_generate` tool handles text-to-image and reference-image
editing. Use `image` for one reference or `images` for multiple references.
Provider-supported output hints such as `quality`, `outputFormat`, and
`background` are forwarded when available and reported as ignored when a
provider does not support them. Bundled transparent-background support is
OpenAI-specific; other providers may still preserve PNG alpha if their
backend emits it.

## Supported providers

| Provider | Default model                    | Edit support                       | API key                                               |
| -------- | -------------------------------- | ---------------------------------- | ----------------------------------------------------- |
| OpenAI   | `gpt-image-1`                    | Yes (up to 5 images)               | `OPENAI_API_KEY`                                      |
| Google   | `gemini-3.1-flash-image-preview` | Yes                                | `GEMINI_API_KEY` or `GOOGLE_API_KEY`                  |
| fal      | `fal-ai/flux/dev`                | Yes                                | `FAL_KEY`                                             |
| MiniMax  | `image-01`                       | Yes (subject reference)            | `MINIMAX_API_KEY` or MiniMax OAuth (`minimax-portal`) |
| ComfyUI  | `workflow`                       | Yes (1 image, workflow-configured) | `COMFY_API_KEY` or `COMFY_CLOUD_API_KEY` for cloud    |
| Vydra    | `grok-imagine`                   | No                                 | `VYDRA_API_KEY`                                       |

Use `action: "list"` to inspect available providers and models at runtime:

```text
/tool image_generate action=list
```

## Provider capabilities

| Capability            | ComfyUI            | DeepInfra | fal               | Google         | MiniMax               | OpenAI         | Vydra | xAI            |
| --------------------- | ------------------ | --------- | ----------------- | -------------- | --------------------- | -------------- | ----- | -------------- |
| Generate (max count)  | Workflow-defined   | 4         | 4                 | 4              | 9                     | 4              | 1     | 4              |
| Edit / reference      | 1 image (workflow) | 1 image   | 1 image           | Up to 5 images | 1 image (subject ref) | Up to 5 images | —     | Up to 5 images |
| Size control          | —                  | ✓         | ✓                 | ✓              | —                     | Up to 4K       | —     | —              |
| Aspect ratio          | —                  | —         | ✓ (generate only) | ✓              | ✓                     | —              | —     | ✓              |
| Resolution (1K/2K/4K) | —                  | —         | ✓                 | ✓              | —                     | —              | —     | 1K, 2K         |

## Tool parameters

| Parameter     | Type     | Description                                                                           |
| ------------- | -------- | ------------------------------------------------------------------------------------- |
| `prompt`      | string   | Image generation prompt (required for `action: "generate"`)                           |
| `action`      | string   | `"generate"` (default) or `"list"` to inspect providers                               |
| `model`       | string   | Provider/model override, e.g. `openai/gpt-image-1`                                    |
| `image`       | string   | Single reference image path or URL for edit mode                                      |
| `images`      | string[] | Multiple reference images for edit mode (up to 5)                                     |
| `size`        | string   | Size hint: `1024x1024`, `1536x1024`, `1024x1536`, `1024x1792`, `1792x1024`            |
| `aspectRatio` | string   | Aspect ratio: `1:1`, `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9` |
| `resolution`  | string   | Resolution hint: `1K`, `2K`, or `4K`                                                  |
| `count`       | number   | Number of images to generate (1–4)                                                    |
| `filename`    | string   | Output filename hint                                                                  |

<Note>
Not all providers support all parameters. When a fallback provider supports a
nearby geometry option instead of the exact requested one, OpenClaw remaps to
the closest supported size, aspect ratio, or resolution before submission.
Unsupported output hints are dropped for providers that do not declare
support and reported in the tool result. Tool results report the applied
settings; `details.normalization` captures any requested-to-applied
translation.
</Note>

## Configuration

### Model selection

```json5
{
  agents: {
    defaults: {
      imageGenerationModel: {
        primary: "openai/gpt-image-1",
        fallbacks: ["google/gemini-3.1-flash-image-preview", "fal/fal-ai/flux/dev"],
      },
    },
  },
}
```

### Provider selection order

OpenClaw tries providers in this order:

1. **`model` parameter** from the tool call (if the agent specifies one).
2. **`imageGenerationModel.primary`** from config.
3. **`imageGenerationModel.fallbacks`** in order.
4. **Auto-detection** — auth-backed provider defaults only:
   - current default provider first;
   - remaining registered image-generation providers in provider-id order.

If a provider fails (auth error, rate limit, etc.), the next configured
candidate is tried automatically. If all fail, the error includes details
from each attempt.

<AccordionGroup>
  <Accordion title="Per-call model overrides are exact">
    A per-call `model` override tries only that provider/model and does
    not continue to configured primary/fallback or auto-detected providers.
  </Accordion>
  <Accordion title="Auto-detection is auth-aware">
    A provider default only enters the candidate list when OpenClaw can
    actually authenticate that provider. Set
    `agents.defaults.mediaGenerationAutoProviderFallback: false` to use only
    explicit `model`, `primary`, and `fallbacks` entries.
  </Accordion>
  <Accordion title="Timeouts">
    Set `agents.defaults.imageGenerationModel.timeoutMs` for slow image
    backends. A per-call `timeoutMs` tool parameter overrides the configured
    default.
  </Accordion>
  <Accordion title="Inspect at runtime">
    Use `action: "list"` to inspect the currently registered providers,
    their default models, and auth env-var hints.
  </Accordion>
</AccordionGroup>

### Image editing

OpenAI, Google, fal, MiniMax, and ComfyUI support editing reference images. Pass a reference image path or URL:

```text
"Generate a watercolor version of this photo" + image: "/path/to/photo.jpg"
```

OpenAI and Google support up to 5 reference images via the `images` parameter. fal, MiniMax, and ComfyUI support 1.

MiniMax image generation is available through both bundled MiniMax auth paths:

- `minimax/image-01` for API-key setups
- `minimax-portal/image-01` for OAuth setups

## Provider capabilities

| Capability            | OpenAI               | Google               | fal                 | MiniMax                    | ComfyUI                            | Vydra   |
| --------------------- | -------------------- | -------------------- | ------------------- | -------------------------- | ---------------------------------- | ------- |
| Generate              | Yes (up to 4)        | Yes (up to 4)        | Yes (up to 4)       | Yes (up to 9)              | Yes (workflow-defined outputs)     | Yes (1) |
| Edit/reference        | Yes (up to 5 images) | Yes (up to 5 images) | Yes (1 image)       | Yes (1 image, subject ref) | Yes (1 image, workflow-configured) | No      |
| Size control          | Yes                  | Yes                  | Yes                 | No                         | No                                 | No      |
| Aspect ratio          | No                   | Yes                  | Yes (generate only) | Yes                        | No                                 | No      |
| Resolution (1K/2K/4K) | No                   | Yes                  | Yes                 | No                         | No                                 | No      |

## Related

- [Tools overview](/tools) — all available agent tools
- [ComfyUI](/providers/comfy) — local ComfyUI and Comfy Cloud workflow setup
- [fal](/providers/fal) — fal image and video provider setup
- [Google (Gemini)](/providers/google) — Gemini image provider setup
- [MiniMax](/providers/minimax) — MiniMax image provider setup
- [OpenAI](/providers/openai) — OpenAI Images provider setup
- [Vydra](/providers/vydra) — Vydra image, video, and speech setup
- [Configuration Reference](/gateway/configuration-reference#agent-defaults) — `imageGenerationModel` config
- [Models](/concepts/models) — model configuration and failover
