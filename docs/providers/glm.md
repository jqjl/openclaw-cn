---
<<<<<<< HEAD
summary: "GLM model family overview + how to use it in OpenClaw"
=======
summary: "GLM model family overview and how to use it in OpenClaw"
>>>>>>> upstream/main
read_when:
  - You want GLM models in OpenClaw
  - You need the model naming convention and setup
title: "GLM (Zhipu)"
---

<<<<<<< HEAD
# GLM models

GLM is a **model family** (not a company) available through the Z.AI platform. In OpenClaw, GLM
models are accessed via the `zai` provider and model IDs like `zai/glm-5`.
=======
GLM is a model family (not a company) available through the [Z.AI](https://z.ai) platform. In OpenClaw, GLM models are accessed through the bundled `zai` provider with refs like `zai/glm-5.1`.

| Property            | Value                                                                       |
| ------------------- | --------------------------------------------------------------------------- |
| Provider id         | `zai`                                                                       |
| Plugin              | bundled, `enabledByDefault: true`                                           |
| Auth env vars       | `ZAI_API_KEY` or `Z_AI_API_KEY`                                             |
| Onboarding choices  | `zai-api-key`, `zai-coding-global`, `zai-coding-cn`, `zai-global`, `zai-cn` |
| API                 | OpenAI-compatible                                                           |
| Default base URL    | `https://api.z.ai/api/paas/v4`                                              |
| Suggested default   | `zai/glm-5.1`                                                               |
| Default image model | `zai/glm-4.6v`                                                              |
>>>>>>> upstream/main

## Getting started

<Steps>
  <Step title="Choose an auth route and run onboarding">
<<<<<<< HEAD
    Pick the onboarding choice that matches your Z.AI plan and region:

    | Auth choice | Best for |
    | ----------- | -------- |
    | `zai-api-key` | Generic API-key setup with endpoint auto-detection |
    | `zai-coding-global` | Coding Plan users (global) |
    | `zai-coding-cn` | Coding Plan users (China region) |
    | `zai-global` | General API (global) |
    | `zai-cn` | General API (China region) |

    ```bash
    # Example: generic auto-detect
    openclaw onboard --auth-choice zai-api-key

    # Example: Coding Plan global
    openclaw onboard --auth-choice zai-coding-global
    ```
=======
    Pick the onboarding choice that matches your Z.AI plan and region. The generic `zai-api-key` choice auto-detects the matching endpoint from the key shape; use the explicit regional choices when you want to force a specific Coding Plan or general API surface.

    | Auth choice         | Best for                                            |
    | ------------------- | --------------------------------------------------- |
    | `zai-api-key`       | Generic API key with endpoint auto-detection        |
    | `zai-coding-global` | Coding Plan users (global)                          |
    | `zai-coding-cn`     | Coding Plan users (China region)                    |
    | `zai-global`        | General API (global)                                |
    | `zai-cn`            | General API (China region)                          |

    <CodeGroup>

```bash Auto-detect
openclaw onboard --auth-choice zai-api-key
```

```bash Coding Plan (global)
openclaw onboard --auth-choice zai-coding-global
```

```bash Coding Plan (China)
openclaw onboard --auth-choice zai-coding-cn
```

```bash General API (global)
openclaw onboard --auth-choice zai-global
```

```bash General API (China)
openclaw onboard --auth-choice zai-cn
```

    </CodeGroup>
>>>>>>> upstream/main

  </Step>
  <Step title="Set GLM as the default model">
    ```bash
    openclaw config set agents.defaults.model.primary "zai/glm-5.1"
    ```
  </Step>
  <Step title="Verify models are available">
    ```bash
    openclaw models list --provider zai
    ```
  </Step>
</Steps>

## Config example

```json5
{
  env: { ZAI_API_KEY: "sk-..." },
  agents: { defaults: { model: { primary: "zai/glm-5.1" } } },
}
```

<Tip>
<<<<<<< HEAD
`zai-api-key` lets OpenClaw detect the matching Z.AI endpoint from the key and
apply the correct base URL automatically. Use the explicit regional choices when
you want to force a specific Coding Plan or general API surface.
=======
  `zai-api-key` lets OpenClaw detect the matching Z.AI endpoint from the key shape and apply the correct base URL automatically. Use the explicit regional choices when you want to pin a specific Coding Plan or general API surface.
>>>>>>> upstream/main
</Tip>

## Built-in catalog

<<<<<<< HEAD
OpenClaw currently seeds the bundled `zai` provider with these GLM refs:

| Model           | Model            |
| --------------- | ---------------- |
| `glm-5.1`       | `glm-4.7`        |
| `glm-5`         | `glm-4.7-flash`  |
| `glm-5-turbo`   | `glm-4.7-flashx` |
| `glm-5v-turbo`  | `glm-4.6`        |
| `glm-4.5`       | `glm-4.6v`       |
| `glm-4.5-air`   |                  |
| `glm-4.5-flash` |                  |
| `glm-4.5v`      |                  |

<Note>
The default bundled model ref is `zai/glm-5.1`. GLM versions and availability
can change; check Z.AI's docs for the latest.
=======
The bundled `zai` provider seeds 13 GLM model refs. All entries support reasoning unless marked otherwise; `glm-5v-turbo` and `glm-4.6v` accept image input as well as text.

| Model ref            | Notes                                              |
| -------------------- | -------------------------------------------------- |
| `zai/glm-5.1`        | Default model. Reasoning, text only, 202k context. |
| `zai/glm-5`          | Reasoning, text only, 202k context.                |
| `zai/glm-5-turbo`    | Reasoning, text only, 202k context.                |
| `zai/glm-5v-turbo`   | Reasoning, text + image, 202k context.             |
| `zai/glm-4.7`        | Reasoning, text only, 204k context.                |
| `zai/glm-4.7-flash`  | Reasoning, text only, 200k context.                |
| `zai/glm-4.7-flashx` | Reasoning, text only.                              |
| `zai/glm-4.6`        | Reasoning, text only.                              |
| `zai/glm-4.6v`       | Reasoning, text + image. Default image model.      |
| `zai/glm-4.5`        | Reasoning, text only.                              |
| `zai/glm-4.5-air`    | Reasoning, text only.                              |
| `zai/glm-4.5-flash`  | Reasoning, text only.                              |
| `zai/glm-4.5v`       | Reasoning, text + image.                           |

<Note>
  GLM versions and availability can change. Run `openclaw models list --provider zai` to see the catalog rows known to your installed version, and check Z.AI's docs for newly added or deprecated models.
>>>>>>> upstream/main
</Note>

## Advanced configuration

<AccordionGroup>
  <Accordion title="Endpoint auto-detection">
<<<<<<< HEAD
    When you use the `zai-api-key` auth choice, OpenClaw inspects the key format
    to determine the correct Z.AI base URL. Explicit regional choices
    (`zai-coding-global`, `zai-coding-cn`, `zai-global`, `zai-cn`) override
    auto-detection and pin the endpoint directly.
  </Accordion>

  <Accordion title="Provider details">
    GLM models are served by the `zai` runtime provider. For full provider
    configuration, regional endpoints, and additional capabilities, see
    [Z.AI provider docs](/providers/zai).
=======
    When you use the `zai-api-key` auth choice, OpenClaw inspects the key shape to determine the correct Z.AI base URL. Explicit regional choices (`zai-coding-global`, `zai-coding-cn`, `zai-global`, `zai-cn`) override auto-detection and pin the endpoint directly.
  </Accordion>

  <Accordion title="Provider details">
    GLM models are served by the `zai` runtime provider. For full provider configuration, regional endpoints, and additional capabilities, see the [Z.AI provider page](/providers/zai).
>>>>>>> upstream/main
  </Accordion>
</AccordionGroup>

## Related

<CardGroup cols={2}>
  <Card title="Z.AI provider" href="/providers/zai" icon="server">
    Full Z.AI provider configuration and regional endpoints.
  </Card>
<<<<<<< HEAD
  <Card title="Model selection" href="/concepts/model-providers" icon="layers">
    Choosing providers, model refs, and failover behavior.
  </Card>
=======
  <Card title="Model providers" href="/concepts/model-providers" icon="layers">
    Choosing providers, model refs, and failover behavior.
  </Card>
  <Card title="Thinking modes" href="/tools/thinking" icon="brain">
    `/think` levels for the reasoning-capable GLM family.
  </Card>
  <Card title="Models FAQ" href="/help/faq-models" icon="circle-question">
    Auth profiles, switching models, and resolving "no profile" errors.
  </Card>
>>>>>>> upstream/main
</CardGroup>
