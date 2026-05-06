---
summary: "Cerebras setup (auth + model selection)"
title: "Cerebras"
read_when:
  - You want to use Cerebras with OpenClaw
  - You need the Cerebras API key env var or CLI auth choice
---

<<<<<<< HEAD
[Cerebras](https://www.cerebras.ai) provides high-speed OpenAI-compatible inference.

| Property | Value                        |
| -------- | ---------------------------- |
| Provider | `cerebras`                   |
| Auth     | `CEREBRAS_API_KEY`           |
| API      | OpenAI-compatible            |
| Base URL | `https://api.cerebras.ai/v1` |

## Getting Started
=======
[Cerebras](https://www.cerebras.ai) provides high-speed OpenAI-compatible inference on custom inference hardware. OpenClaw includes a bundled Cerebras provider plugin with a static four-model catalog.

| Property        | Value                                    |
| --------------- | ---------------------------------------- |
| Provider id     | `cerebras`                               |
| Plugin          | bundled, `enabledByDefault: true`        |
| Auth env var    | `CEREBRAS_API_KEY`                       |
| Onboarding flag | `--auth-choice cerebras-api-key`         |
| Direct CLI flag | `--cerebras-api-key <key>`               |
| API             | OpenAI-compatible (`openai-completions`) |
| Base URL        | `https://api.cerebras.ai/v1`             |
| Default model   | `cerebras/zai-glm-4.7`                   |

## Getting started
>>>>>>> upstream/main

<Steps>
  <Step title="Get an API key">
    Create an API key in the [Cerebras Cloud Console](https://cloud.cerebras.ai).
  </Step>
  <Step title="Run onboarding">
<<<<<<< HEAD
    ```bash
    openclaw onboard --auth-choice cerebras-api-key
    ```
=======
    <CodeGroup>

```bash Onboarding
openclaw onboard --auth-choice cerebras-api-key
```

```bash Direct flag
openclaw onboard --non-interactive \
  --auth-choice cerebras-api-key \
  --cerebras-api-key "$CEREBRAS_API_KEY"
```

```bash Env only
export CEREBRAS_API_KEY=csk-...
```

    </CodeGroup>

>>>>>>> upstream/main
  </Step>
  <Step title="Verify models are available">
    ```bash
    openclaw models list --provider cerebras
    ```
<<<<<<< HEAD
  </Step>
</Steps>

### Non-Interactive Setup
=======

    The list should include all four bundled models. If `CEREBRAS_API_KEY` is unresolved, `openclaw models status --json` reports the missing credential under `auth.unusableProfiles`.

  </Step>
</Steps>

## Non-interactive setup
>>>>>>> upstream/main

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice cerebras-api-key \
  --cerebras-api-key "$CEREBRAS_API_KEY"
```

<<<<<<< HEAD
## Built-In Catalog

OpenClaw ships a static Cerebras catalog for the public OpenAI-compatible endpoint:

| Model ref                                 | Name                 | Notes                                  |
| ----------------------------------------- | -------------------- | -------------------------------------- |
| `cerebras/zai-glm-4.7`                    | Z.ai GLM 4.7         | Default model; preview reasoning model |
| `cerebras/gpt-oss-120b`                   | GPT OSS 120B         | Production reasoning model             |
| `cerebras/qwen-3-235b-a22b-instruct-2507` | Qwen 3 235B Instruct | Preview non-reasoning model            |
| `cerebras/llama3.1-8b`                    | Llama 3.1 8B         | Production speed-focused model         |

<Warning>
Cerebras marks `zai-glm-4.7` and `qwen-3-235b-a22b-instruct-2507` as preview models, and `llama3.1-8b` / `qwen-3-235b-a22b-instruct-2507` are documented for deprecation on May 27, 2026. Check Cerebras' supported-models page before relying on them for production.
</Warning>

## Manual Config

The bundled plugin usually means you only need the API key. Use explicit
`models.providers.cerebras` config when you want to override model metadata:

```json5
{
  env: { CEREBRAS_API_KEY: "sk-..." },
=======
## Built-in catalog

OpenClaw ships a static Cerebras catalog that mirrors the public OpenAI-compatible endpoint. All four models share a 128k context and 8,192 max-output tokens.

| Model ref                                 | Name                 | Reasoning | Notes                                  |
| ----------------------------------------- | -------------------- | --------- | -------------------------------------- |
| `cerebras/zai-glm-4.7`                    | Z.ai GLM 4.7         | yes       | Default model; preview reasoning model |
| `cerebras/gpt-oss-120b`                   | GPT OSS 120B         | yes       | Production reasoning model             |
| `cerebras/qwen-3-235b-a22b-instruct-2507` | Qwen 3 235B Instruct | no        | Preview non-reasoning model            |
| `cerebras/llama3.1-8b`                    | Llama 3.1 8B         | no        | Production speed-focused model         |

<Warning>
  Cerebras marks `zai-glm-4.7` and `qwen-3-235b-a22b-instruct-2507` as preview models, and `llama3.1-8b` plus `qwen-3-235b-a22b-instruct-2507` are documented for deprecation on May 27, 2026. Check Cerebras' supported-models page before relying on them for production workloads.
</Warning>

## Manual config

The bundled plugin usually means you only need the API key. Use explicit `models.providers.cerebras` config when you want to override model metadata or run in `mode: "merge"` against the static catalog:

```json5
{
  env: { CEREBRAS_API_KEY: "csk-..." },
>>>>>>> upstream/main
  agents: {
    defaults: {
      model: { primary: "cerebras/zai-glm-4.7" },
    },
  },
  models: {
    mode: "merge",
    providers: {
      cerebras: {
        baseUrl: "https://api.cerebras.ai/v1",
        apiKey: "${CEREBRAS_API_KEY}",
        api: "openai-completions",
        models: [
          { id: "zai-glm-4.7", name: "Z.ai GLM 4.7" },
          { id: "gpt-oss-120b", name: "GPT OSS 120B" },
        ],
      },
    },
  },
}
```

<Note>
<<<<<<< HEAD
If the Gateway runs as a daemon (launchd/systemd), make sure `CEREBRAS_API_KEY`
is available to that process, for example in `~/.openclaw/.env` or through
`env.shellEnv`.
</Note>
=======
  If the Gateway runs as a daemon (launchd, systemd, Docker), make sure `CEREBRAS_API_KEY` is available to that process — for example in `~/.openclaw/.env` or through `env.shellEnv`. A key sitting only in `~/.profile` will not help a managed service unless the env is imported separately.
</Note>

## Related

<CardGroup cols={2}>
  <Card title="Model providers" href="/concepts/model-providers" icon="layers">
    Choosing providers, model refs, and failover behavior.
  </Card>
  <Card title="Thinking modes" href="/tools/thinking" icon="brain">
    Reasoning effort levels for the two reasoning-capable Cerebras models.
  </Card>
  <Card title="Configuration reference" href="/gateway/config-agents#agent-defaults" icon="gear">
    Agent defaults and model configuration.
  </Card>
  <Card title="Models FAQ" href="/help/faq-models" icon="circle-question">
    Auth profiles, switching models, and resolving "no profile" errors.
  </Card>
</CardGroup>
>>>>>>> upstream/main
