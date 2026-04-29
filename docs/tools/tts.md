---
summary: "Text-to-speech for outbound replies — providers, personas, slash commands, and per-channel output"
read_when:
  - Enabling text-to-speech for replies
  - Configuring a TTS provider, fallback chain, or persona
  - Using /tts commands or directives
title: "Text-to-speech"
sidebarTitle: "Text to speech (TTS)"
---

OpenClaw can convert outbound replies into audio across **14 speech providers**
and deliver native voice messages on Feishu, Matrix, Telegram, and WhatsApp,
audio attachments everywhere else, and PCM/Ulaw streams for telephony and Talk.

OpenClaw can convert outbound replies into audio using ElevenLabs, Google Gemini, Microsoft, MiniMax, or OpenAI.
It works anywhere OpenClaw can send audio.

<Steps>
  <Step title="Pick a provider">
    OpenAI and ElevenLabs are the most reliable hosted options. Microsoft and
    Local CLI work without an API key. See the [provider matrix](#supported-providers)
    for the full list.
  </Step>
  <Step title="Set the API key">
    Export the env var for your provider (for example `OPENAI_API_KEY`,
    `ELEVENLABS_API_KEY`). Microsoft and Local CLI need no key.
  </Step>
  <Step title="Enable in config">
    Set `messages.tts.auto: "always"` and `messages.tts.provider`:

- **ElevenLabs** (primary or fallback provider)
- **Google Gemini** (primary or fallback provider; uses Gemini API TTS)
- **Microsoft** (primary or fallback provider; current bundled implementation uses `node-edge-tts`)
- **MiniMax** (primary or fallback provider; uses the T2A v2 API)
- **OpenAI** (primary or fallback provider; also used for summaries)

  </Step>
  <Step title="Try it in chat">
    `/tts status` shows the current state. `/tts audio Hello from OpenClaw`
    sends a one-off audio reply.
  </Step>
</Steps>

<Note>
Auto-TTS is **off** by default. When `messages.tts.provider` is unset,
OpenClaw picks the first configured provider in registry auto-select order.
</Note>

## Supported providers

| Provider          | Auth                                                                                                             | Notes                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Azure Speech**  | `AZURE_SPEECH_KEY` + `AZURE_SPEECH_REGION` (also `AZURE_SPEECH_API_KEY`, `SPEECH_KEY`, `SPEECH_REGION`)          | Native Ogg/Opus voice-note output and telephony.                        |
| **DeepInfra**     | `DEEPINFRA_API_KEY`                                                                                              | OpenAI-compatible TTS. Defaults to `hexgrad/Kokoro-82M`.                |
| **ElevenLabs**    | `ELEVENLABS_API_KEY` or `XI_API_KEY`                                                                             | Voice cloning, multilingual, deterministic via `seed`.                  |
| **Google Gemini** | `GEMINI_API_KEY` or `GOOGLE_API_KEY`                                                                             | Gemini API TTS; persona-aware via `promptTemplate: "audio-profile-v1"`. |
| **Gradium**       | `GRADIUM_API_KEY`                                                                                                | Voice-note and telephony output.                                        |
| **Inworld**       | `INWORLD_API_KEY`                                                                                                | Streaming TTS API. Native Opus voice-note and PCM telephony.            |
| **Local CLI**     | none                                                                                                             | Runs a configured local TTS command.                                    |
| **Microsoft**     | none                                                                                                             | Public Edge neural TTS via `node-edge-tts`. Best-effort, no SLA.        |
| **MiniMax**       | `MINIMAX_API_KEY` (or Token Plan: `MINIMAX_OAUTH_TOKEN`, `MINIMAX_CODE_PLAN_KEY`, `MINIMAX_CODING_API_KEY`)      | T2A v2 API. Defaults to `speech-2.8-hd`.                                |
| **OpenAI**        | `OPENAI_API_KEY`                                                                                                 | Also used for auto-summary; supports persona `instructions`.            |
| **OpenRouter**    | `OPENROUTER_API_KEY` (can reuse `models.providers.openrouter.apiKey`)                                            | Default model `hexgrad/kokoro-82m`.                                     |
| **Volcengine**    | `VOLCENGINE_TTS_API_KEY` or `BYTEPLUS_SEED_SPEECH_API_KEY` (legacy AppID/token: `VOLCENGINE_TTS_APPID`/`_TOKEN`) | BytePlus Seed Speech HTTP API.                                          |
| **Vydra**         | `VYDRA_API_KEY`                                                                                                  | Shared image, video, and speech provider.                               |
| **xAI**           | `XAI_API_KEY`                                                                                                    | xAI batch TTS. Native Opus voice-note is **not** supported.             |
| **Xiaomi MiMo**   | `XIAOMI_API_KEY`                                                                                                 | MiMo TTS through Xiaomi chat completions.                               |

If you want OpenAI, ElevenLabs, Google Gemini, or MiniMax:

- `ELEVENLABS_API_KEY` (or `XI_API_KEY`)
- `GEMINI_API_KEY` (or `GOOGLE_API_KEY`)
- `MINIMAX_API_KEY`
- `OPENAI_API_KEY`

## Configuration

If multiple providers are configured, the selected provider is used first and the others are fallback options.
Auto-summary uses the configured `summaryModel` (or `agents.defaults.model.primary`),
so that provider must also be authenticated if you enable summaries.

## Service links

- [OpenAI Text-to-Speech guide](https://platform.openai.com/docs/guides/text-to-speech)
- [OpenAI Audio API reference](https://platform.openai.com/docs/api-reference/audio)
- [ElevenLabs Text to Speech](https://elevenlabs.io/docs/api-reference/text-to-speech)
- [ElevenLabs Authentication](https://elevenlabs.io/docs/api-reference/authentication)
- [MiniMax T2A v2 API](https://platform.minimaxi.com/document/T2A%20V2)
- [node-edge-tts](https://github.com/SchneeHertz/node-edge-tts)
- [Microsoft Speech output formats](https://learn.microsoft.com/azure/ai-services/speech-service/rest-text-to-speech#audio-outputs)

## Is it enabled by default?

No. Auto‑TTS is **off** by default. Enable it in config with
`messages.tts.auto` or locally with `/tts on`.

When `messages.tts.provider` is unset, OpenClaw picks the first configured
speech provider in registry auto-select order.

## Config

TTS config lives under `messages.tts` in `openclaw.json`.
Full schema is in [Gateway configuration](/gateway/configuration).

### Minimal config (enable + provider)

<Tabs>
  <Tab title="Azure Speech">
```json5
{
  messages: {
    tts: {
      auto: "always",
      provider: "azure-speech",
      providers: {
        "azure-speech": {
          apiKey: "${AZURE_SPEECH_KEY}",
          region: "eastus",
          voice: "en-US-JennyNeural",
          lang: "en-US",
          outputFormat: "audio-24khz-48kbitrate-mono-mp3",
          voiceNoteOutputFormat: "ogg-24khz-16bit-mono-opus",
        },
      },
    },
  },
}
```
  </Tab>
  <Tab title="ElevenLabs">
```json5
{
  messages: {
    tts: {
      auto: "always",
      provider: "elevenlabs",
      providers: {
        elevenlabs: {
          apiKey: "${ELEVENLABS_API_KEY}",
          model: "eleven_multilingual_v2",
          voiceId: "EXAVITQu4vr4xnSDxMaL",
        },
      },
    },
  },
}
```
  </Tab>
  <Tab title="Google Gemini">
```json5
{
  messages: {
    tts: {
      auto: "always",
      provider: "google",
      providers: {
        google: {
          apiKey: "${GEMINI_API_KEY}",
          model: "gemini-3.1-flash-tts-preview",
          voiceName: "Kore",
          // Optional natural-language style prompts:
          // audioProfile: "Speak in a calm, podcast-host tone.",
          // speakerName: "Alex",
        },
      },
    },
  },
}
```
  </Tab>
  <Tab title="Gradium">
```json5
{
  messages: {
    tts: {
      auto: "always",
      provider: "gradium",
      providers: {
        gradium: {
          apiKey: "${GRADIUM_API_KEY}",
          voiceId: "YTpq7expH9539ERJ",
        },
      },
    },
  },
}
```
  </Tab>
  <Tab title="Inworld">
```json5
{
  messages: {
    tts: {
      auto: "always",
      provider: "inworld",
      providers: {
        inworld: {
          apiKey: "${INWORLD_API_KEY}",
          modelId: "inworld-tts-1.5-max",
          voiceId: "Sarah",
          temperature: 0.7,
        },
      },
    },
  },
}
```
  </Tab>
  <Tab title="Local CLI">
```json5
{
  messages: {
    tts: {
      auto: "always",
      provider: "tts-local-cli",
      providers: {
        "tts-local-cli": {
          command: "say",
          args: ["-o", "{{OutputPath}}", "{{Text}}"],
          outputFormat: "wav",
          timeoutMs: 120000,
        },
      },
    },
  },
}
```
  </Tab>
  <Tab title="Microsoft (no key)">
```json5
{
  messages: {
    tts: {
      auto: "always",
      provider: "microsoft",
      providers: {
        microsoft: {
          enabled: true,
          voice: "en-US-MichelleNeural",
          lang: "en-US",
          outputFormat: "audio-24khz-48kbitrate-mono-mp3",
          rate: "+0%",
          pitch: "+0%",
        },
      },
    },
  },
}
```
  </Tab>
  <Tab title="MiniMax">
```json5
{
  messages: {
    tts: {
      auto: "always",
      provider: "minimax",
      providers: {
        minimax: {
          apiKey: "${MINIMAX_API_KEY}",
          model: "speech-2.8-hd",
          voiceId: "English_expressive_narrator",
          speed: 1.0,
          vol: 1.0,
          pitch: 0,
        },
      },
    },
  },
}
```
  </Tab>
  <Tab title="OpenAI + ElevenLabs">
```json5
{
  messages: {
    tts: {
      auto: "always",
      provider: "openai",
      summaryModel: "openai/gpt-4.1-mini",
      modelOverrides: { enabled: true },
      providers: {
        openai: {
          apiKey: "${OPENAI_API_KEY}",
          model: "gpt-4o-mini-tts",
          voice: "alloy",
        },
        elevenlabs: {
          apiKey: "${ELEVENLABS_API_KEY}",
          model: "eleven_multilingual_v2",
          voiceId: "EXAVITQu4vr4xnSDxMaL",
          voiceSettings: { stability: 0.5, similarityBoost: 0.75, style: 0.0, useSpeakerBoost: true, speed: 1.0 },
          applyTextNormalization: "auto",
          languageCode: "en",
        },
      },
    },
  },
}
```

Google Gemini TTS uses the Gemini API key path. A Google Cloud Console API key
restricted to the Gemini API is valid here, and it is the same style of key used
by the bundled Google image-generation provider. Resolution order is
`messages.tts.providers.google.apiKey` -> `models.providers.google.apiKey` ->
`GEMINI_API_KEY` -> `GOOGLE_API_KEY`.

### Disable Microsoft speech

```json5
{
  messages: {
    tts: {
      auto: "always",
      provider: "xiaomi",
      providers: {
        xiaomi: {
          apiKey: "${XIAOMI_API_KEY}",
          model: "mimo-v2.5-tts",
          voice: "mimo_default",
          format: "mp3",
        },
      },
    },
  },
}
```
  </Tab>
</Tabs>

### Per-agent voice overrides

Use `agents.list[].tts` when one agent should speak with a different provider,
voice, model, persona, or auto-TTS mode. The agent block deep-merges over
`messages.tts`, so provider credentials can stay in the global provider config:

```json5
{
  messages: {
    tts: {
      auto: "always",
      provider: "elevenlabs",
      providers: {
        elevenlabs: { apiKey: "${ELEVENLABS_API_KEY}", model: "eleven_multilingual_v2" },
      },
    },
  },
  agents: {
    list: [
      {
        id: "reader",
        tts: {
          providers: {
            elevenlabs: { voiceId: "EXAVITQu4vr4xnSDxMaL" },
          },
        },
      },
    ],
  },
}
```

To pin a per-agent persona, set `agents.list[].tts.persona` alongside provider
config — it overrides the global `messages.tts.persona` for that agent only.

Precedence order for automatic replies, `/tts audio`, `/tts status`, and the
`tts` agent tool:

1. `messages.tts`
2. active `agents.list[].tts`
3. channel override, when the channel supports `channels.<channel>.tts`
4. account override, when the channel passes `channels.<channel>.accounts.<id>.tts`
5. local `/tts` preferences for this host
6. inline `[[tts:...]]` directives when [model overrides](#model-driven-directives) are enabled

Channel and account overrides use the same shape as `messages.tts` and
deep-merge over the earlier layers, so shared provider credentials can stay in
`messages.tts` while a channel or bot account changes only voice, model, persona,
or auto mode:

```json5
{
  messages: {
    tts: {
      provider: "openai",
      providers: {
        openai: { apiKey: "${OPENAI_API_KEY}", model: "gpt-4o-mini-tts" },
      },
    },
  },
  channels: {
    feishu: {
      accounts: {
        english: {
          tts: {
            providers: {
              openai: { voice: "shimmer" },
            },
          },
        },
      },
    },
  },
}
```

## Personas

A **persona** is a stable spoken identity that can be applied deterministically
across providers. It can prefer one provider, define provider-neutral prompt
intent, and carry provider-specific bindings for voices, models, prompt
templates, seeds, and voice settings.

### Minimal persona

```json5
{
  messages: {
    tts: {
      auto: "always",
      persona: "narrator",
      personas: {
        narrator: {
          label: "Narrator",
          provider: "elevenlabs",
          providers: {
            elevenlabs: { voiceId: "EXAVITQu4vr4xnSDxMaL", modelId: "eleven_multilingual_v2" },
          },
        },
      },
    },
  },
}
```

### Full persona (provider-neutral prompt)

```json5
{
  messages: {
    tts: {
      auto: "always",
      persona: "alfred",
      personas: {
        alfred: {
          label: "Alfred",
          description: "Dry, warm British butler narrator.",
          provider: "google",
          fallbackPolicy: "preserve-persona",
          prompt: {
            profile: "A brilliant British butler. Dry, witty, warm, charming, emotionally expressive, never generic.",
            scene: "A quiet late-night study. Close-mic narration for a trusted operator.",
            sampleContext: "The speaker is answering a private technical request with concise confidence and dry warmth.",
            style: "Refined, understated, lightly amused.",
            accent: "British English.",
            pacing: "Measured, with short dramatic pauses.",
            constraints: ["Do not read configuration values aloud.", "Do not explain the persona."],
          },
          providers: {
            google: {
              model: "gemini-3.1-flash-tts-preview",
              voiceName: "Algieba",
              promptTemplate: "audio-profile-v1",
            },
            openai: { model: "gpt-4o-mini-tts", voice: "cedar" },
            elevenlabs: {
              voiceId: "voice_id",
              modelId: "eleven_multilingual_v2",
              seed: 42,
              voiceSettings: {
                stability: 0.65,
                similarityBoost: 0.8,
                style: 0.25,
                useSpeakerBoost: true,
                speed: 0.95,
              },
            },
          },
        },
      },
    },
  },
}
```

### Persona resolution

The active persona is selected deterministically:

1. `/tts persona <id>` local preference, if set.
2. `messages.tts.persona`, if set.
3. No persona.

- `auto`: auto‑TTS mode (`off`, `always`, `inbound`, `tagged`).
  - `inbound` only sends audio after an inbound voice message.
  - `tagged` only sends audio when the reply includes `[[tts:key=value]]` directives or a `[[tts:text]]...[[/tts:text]]` block.
- `enabled`: legacy toggle (doctor migrates this to `auto`).
- `mode`: `"final"` (default) or `"all"` (includes tool/block replies).
- `provider`: speech provider id such as `"elevenlabs"`, `"google"`, `"microsoft"`, `"minimax"`, or `"openai"` (fallback is automatic).
- If `provider` is **unset**, OpenClaw uses the first configured speech provider in registry auto-select order.
- Legacy `provider: "edge"` still works and is normalized to `microsoft`.
- `summaryModel`: optional cheap model for auto-summary; defaults to `agents.defaults.model.primary`.
  - Accepts `provider/model` or a configured model alias.
- `modelOverrides`: allow the model to emit TTS directives (on by default).
  - `allowProvider` defaults to `false` (provider switching is opt-in).
- `providers.<id>`: provider-owned settings keyed by speech provider id.
- Legacy direct provider blocks (`messages.tts.openai`, `messages.tts.elevenlabs`, `messages.tts.microsoft`, `messages.tts.edge`) are auto-migrated to `messages.tts.providers.<id>` on load.
- `maxTextLength`: hard cap for TTS input (chars). `/tts audio` fails if exceeded.
- `timeoutMs`: request timeout (ms).
- `prefsPath`: override the local prefs JSON path (provider/limit/summary).
- `apiKey` values fall back to env vars (`ELEVENLABS_API_KEY`/`XI_API_KEY`, `GEMINI_API_KEY`/`GOOGLE_API_KEY`, `MINIMAX_API_KEY`, `OPENAI_API_KEY`).
- `providers.elevenlabs.baseUrl`: override ElevenLabs API base URL.
- `providers.openai.baseUrl`: override the OpenAI TTS endpoint.
  - Resolution order: `messages.tts.providers.openai.baseUrl` -> `OPENAI_TTS_BASE_URL` -> `https://api.openai.com/v1`
  - Non-default values are treated as OpenAI-compatible TTS endpoints, so custom model and voice names are accepted.
- `providers.elevenlabs.voiceSettings`:
  - `stability`, `similarityBoost`, `style`: `0..1`
  - `useSpeakerBoost`: `true|false`
  - `speed`: `0.5..2.0` (1.0 = normal)
- `providers.elevenlabs.applyTextNormalization`: `auto|on|off`
- `providers.elevenlabs.languageCode`: 2-letter ISO 639-1 (e.g. `en`, `de`)
- `providers.elevenlabs.seed`: integer `0..4294967295` (best-effort determinism)
- `providers.minimax.baseUrl`: override MiniMax API base URL (default `https://api.minimax.io`, env: `MINIMAX_API_HOST`).
- `providers.minimax.model`: TTS model (default `speech-2.8-hd`, env: `MINIMAX_TTS_MODEL`).
- `providers.minimax.voiceId`: voice identifier (default `English_expressive_narrator`, env: `MINIMAX_TTS_VOICE_ID`).
- `providers.minimax.speed`: playback speed `0.5..2.0` (default 1.0).
- `providers.minimax.vol`: volume `(0, 10]` (default 1.0; must be greater than 0).
- `providers.minimax.pitch`: pitch shift `-12..12` (default 0).
- `providers.google.model`: Gemini TTS model (default `gemini-3.1-flash-tts-preview`).
- `providers.google.voiceName`: Gemini prebuilt voice name (default `Kore`; `voice` is also accepted).
- `providers.google.baseUrl`: override the Gemini API base URL. Only `https://generativelanguage.googleapis.com` is accepted.
  - If `messages.tts.providers.google.apiKey` is omitted, TTS can reuse `models.providers.google.apiKey` before env fallback.
- `providers.microsoft.enabled`: allow Microsoft speech usage (default `true`; no API key).
- `providers.microsoft.voice`: Microsoft neural voice name (e.g. `en-US-MichelleNeural`).
- `providers.microsoft.lang`: language code (e.g. `en-US`).
- `providers.microsoft.outputFormat`: Microsoft output format (e.g. `audio-24khz-48kbitrate-mono-mp3`).
  - See Microsoft Speech output formats for valid values; not all formats are supported by the bundled Edge-backed transport.
- `providers.microsoft.rate` / `providers.microsoft.pitch` / `providers.microsoft.volume`: percent strings (e.g. `+10%`, `-5%`).
- `providers.microsoft.saveSubtitles`: write JSON subtitles alongside the audio file.
- `providers.microsoft.proxy`: proxy URL for Microsoft speech requests.
- `providers.microsoft.timeoutMs`: request timeout override (ms).
- `edge.*`: legacy alias for the same Microsoft settings.

1. Direct overrides (CLI, gateway, Talk, allowed TTS directives).
2. `/tts provider <id>` local preference.
3. Active persona's `provider`.
4. `messages.tts.provider`.
5. Registry auto-select.

For each provider attempt, OpenClaw merges configs in this order:

1. `messages.tts.providers.<id>`
2. `messages.tts.personas.<persona>.providers.<id>`
3. Trusted request overrides
4. Allowed model-emitted TTS directive overrides

### How providers use persona prompts

Persona prompt fields (`profile`, `scene`, `sampleContext`, `style`, `accent`,
`pacing`, `constraints`) are **provider-neutral**. Each provider decides how
to use them:

<AccordionGroup>
  <Accordion title="Google Gemini">
    Wraps persona prompt fields in a Gemini TTS prompt structure **only when**
    the effective Google provider config sets `promptTemplate: "audio-profile-v1"`
    or `personaPrompt`. The older `audioProfile` and `speakerName` fields are
    still prepended as Google-specific prompt text. Inline audio tags such as
    `[whispers]` or `[laughs]` inside a `[[tts:text]]` block are preserved
    inside the Gemini transcript; OpenClaw does not generate these tags.
  </Accordion>
  <Accordion title="OpenAI">
    Maps persona prompt fields to the request `instructions` field **only when**
    no explicit OpenAI `instructions` is configured. Explicit `instructions`
    always wins.
  </Accordion>
  <Accordion title="Other providers">
    Use only the provider-specific persona bindings under
    `personas.<id>.providers.<provider>`. Persona prompt fields are ignored
    unless the provider implements its own persona-prompt mapping.
  </Accordion>
</AccordionGroup>

### Fallback policy

`fallbackPolicy` controls behavior when a persona has **no binding** for the
attempted provider:

| Policy              | Behavior                                                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `preserve-persona`  | **Default.** Provider-neutral prompt fields stay available; the provider may use them or ignore them.                                            |
| `provider-defaults` | Persona is omitted from prompt preparation for that attempt; the provider uses its neutral defaults while fallback to other providers continues. |
| `fail`              | Skip that provider attempt with `reasonCode: "not_configured"` and `personaBinding: "missing"`. Fallback providers are still tried.              |

The whole TTS request only fails when **every** attempted provider is skipped
or fails.

## Model-driven directives

By default, the assistant **can** emit `[[tts:...]]` directives to override
voice, model, or speed for a single reply, plus an optional
`[[tts:text]]...[[/tts:text]]` block for expressive cues that should appear in
audio only:

```text
Here you go.

[[tts:voiceId=pMsXgVXv3BLzUgSXRplE model=eleven_v3 speed=1.1]]
[[tts:text]](laughs) Read the song once more.[[/tts:text]]
```

When `messages.tts.auto` is `"tagged"`, **directives are required** to trigger
audio. Streaming block delivery strips directives from visible text before the
channel sees them, even when split across adjacent blocks.

- `provider` (registered speech provider id, for example `openai`, `elevenlabs`, `google`, `minimax`, or `microsoft`; requires `allowProvider: true`)
- `voice` (OpenAI voice), `voiceName` / `voice_name` / `google_voice` (Google voice), or `voiceId` (ElevenLabs / MiniMax)
- `model` (OpenAI TTS model, ElevenLabs model id, or MiniMax model) or `google_model` (Google TTS model)
- `stability`, `similarityBoost`, `style`, `speed`, `useSpeakerBoost`
- `vol` / `volume` (MiniMax volume, 0–10)
- `pitch` (MiniMax integer pitch, −12 to 12; fractional values are truncated)
- `emotion` (Volcengine emotion tag)
- `applyTextNormalization` (`auto|on|off`)
- `languageCode` (ISO 639-1)
- `seed`

**Disable model overrides entirely:**

```json5
{ messages: { tts: { modelOverrides: { enabled: false } } } }
```

**Allow provider switching while keeping other knobs configurable:**

```json5
{ messages: { tts: { modelOverrides: { enabled: true, allowProvider: true, allowSeed: false } } } }
```

## Slash commands

Single command `/tts`. On Discord, OpenClaw also registers `/voice` because
`/tts` is a built-in Discord command — text `/tts ...` still works.

```text
/tts off | on | status
/tts chat on | off | default
/tts latest
/tts provider <id>
/tts persona <id> | off
/tts limit <chars>
/tts summary off
/tts audio <text>
```

<Note>
Commands require an authorized sender (allowlist/owner rules apply) and either
`commands.text` or native command registration must be enabled.
</Note>

Behavior notes:

- `/tts on` writes the local TTS preference to `always`; `/tts off` writes it to `off`.
- `/tts chat on|off|default` writes a session-scoped auto-TTS override for the current chat.
- `/tts persona <id>` writes the local persona preference; `/tts persona off` clears it.
- `/tts latest` reads the latest assistant reply from the current session transcript and sends it as audio once. It stores only a hash of that reply on the session entry to suppress duplicate voice sends.
- `/tts audio` generates a one-off audio reply (does **not** toggle TTS on).
- `limit` and `summary` are stored in **local prefs**, not the main config.
- `/tts status` includes fallback diagnostics for the latest attempt — `Fallback: <primary> -> <used>`, `Attempts: ...`, and per-attempt detail (`provider:outcome(reasonCode) latency`).
- `/status` shows the active TTS mode plus configured provider, model, voice, and sanitized custom endpoint metadata when TTS is enabled.

## Per-user preferences

Slash commands write local overrides to `prefsPath`. The default is
`~/.openclaw/settings/tts.json`; override with the `OPENCLAW_TTS_PREFS` env var
or `messages.tts.prefsPath`.

| Stored field | Effect                                       |
| ------------ | -------------------------------------------- |
| `auto`       | Local auto-TTS override (`always`, `off`, …) |
| `provider`   | Local primary provider override              |
| `persona`    | Local persona override                       |
| `maxLength`  | Summary threshold (default `1500` chars)     |
| `summarize`  | Summary toggle (default `true`)              |

These override the effective config from `messages.tts` plus the active
`agents.list[].tts` block for that host.

## Output formats (fixed)

TTS voice delivery is channel-capability driven. Channel plugins advertise
whether voice-style TTS should ask providers for a native `voice-note` target or
keep normal `audio-file` synthesis and only mark compatible output for voice
delivery.

- **Voice-note capable channels**: voice-note replies prefer Opus (`opus_48000_64` from ElevenLabs, `opus` from OpenAI).
  - 48kHz / 64kbps is a good voice message tradeoff.
- **Feishu / WhatsApp**: when a voice-note reply is produced as MP3/WebM/WAV/M4A
  or another likely audio file, the channel plugin transcodes it to 48kHz
  Ogg/Opus with `ffmpeg` before sending the native voice message. WhatsApp sends
  the result through the Baileys `audio` payload with `ptt: true` and
  `audio/ogg; codecs=opus`. If conversion fails, Feishu receives the original
  file as an attachment; WhatsApp send fails rather than posting an incompatible
  PTT payload.
- **BlueBubbles**: keeps provider synthesis on the normal audio-file path; MP3
  and CAF outputs are marked for iMessage voice memo delivery.
- **Other channels**: MP3 (`mp3_44100_128` from ElevenLabs, `mp3` from OpenAI).
  - 44.1kHz / 128kbps is the default balance for speech clarity.
- **MiniMax**: MP3 (`speech-2.8-hd` model, 32kHz sample rate). Voice-note format not natively supported; use OpenAI or ElevenLabs for guaranteed Opus voice messages.
- **Google Gemini**: Gemini API TTS returns raw 24kHz PCM. OpenClaw wraps it as WAV for audio attachments and returns PCM directly for Talk/telephony. Native Opus voice-note format is not supported by this path.
- **Microsoft**: uses `microsoft.outputFormat` (default `audio-24khz-48kbitrate-mono-mp3`).
  - The bundled transport accepts an `outputFormat`, but not all formats are available from the service.
  - Output format values follow Microsoft Speech output formats (including Ogg/WebM Opus).
  - Telegram `sendVoice` accepts OGG/MP3/M4A; use OpenAI/ElevenLabs if you need
    guaranteed Opus voice messages.
  - If the configured Microsoft output format fails, OpenClaw retries with MP3.

OpenAI/ElevenLabs output formats are fixed per channel (see above).

## Auto-TTS behavior

When `messages.tts.auto` is enabled, OpenClaw:

- Skips TTS if the reply already contains media or a `MEDIA:` directive.
- Skips very short replies (under 10 chars).
- Summarizes long replies when summaries are enabled, using
  `summaryModel` (or `agents.defaults.model.primary`).
- Attaches the generated audio to the reply.
- In `mode: "final"`, still sends audio-only TTS for streamed final replies
  after the text stream completes; the generated media goes through the same
  channel media normalization as normal reply attachments.

If the reply exceeds `maxLength` and summary is off (or no API key for the
summary model), audio is skipped and the normal text reply is sent.

```text
Reply -> TTS enabled?
  no  -> send text
  yes -> has media / MEDIA: / short?
          yes -> send text
          no  -> length > limit?
                   no  -> TTS -> attach audio
                   yes -> summary enabled?
                            no  -> send text
                            yes -> summarize -> TTS -> attach audio
```

## Output formats by channel

| Target                                | Format                                                                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Feishu / Matrix / Telegram / WhatsApp | Voice-note replies prefer **Opus** (`opus_48000_64` from ElevenLabs, `opus` from OpenAI). 48 kHz / 64 kbps balances clarity and size. |
| Other channels                        | **MP3** (`mp3_44100_128` from ElevenLabs, `mp3` from OpenAI). 44.1 kHz / 128 kbps default for speech.                                 |
| Talk / telephony                      | Provider-native **PCM** (Inworld 22050 Hz, Google 24 kHz), or `ulaw_8000` from Gradium for telephony.                                 |

Per-provider notes:

- **Feishu / WhatsApp transcoding:** When a voice-note reply lands as MP3/WebM/WAV/M4A, the channel plugin transcodes to 48 kHz Ogg/Opus with `ffmpeg`. WhatsApp sends through Baileys with `ptt: true` and `audio/ogg; codecs=opus`. If conversion fails: Feishu falls back to attaching the original file; WhatsApp send fails rather than posting an incompatible PTT payload.
- **MiniMax / Xiaomi MiMo:** Default MP3 (32 kHz for MiniMax `speech-2.8-hd`); transcoded to 48 kHz Opus for voice-note targets via `ffmpeg`.
- **Local CLI:** Uses configured `outputFormat`. Voice-note targets are converted to Ogg/Opus and telephony output to raw 16 kHz mono PCM.
- **Google Gemini:** Returns raw 24 kHz PCM. OpenClaw wraps as WAV for attachments, transcodes to 48 kHz Opus for voice-note targets, returns PCM directly for Talk/telephony.
- **Inworld:** MP3 attachments, native `OGG_OPUS` voice-note, raw `PCM` 22050 Hz for Talk/telephony.
- **xAI:** MP3 by default; `responseFormat` may be `mp3|wav|pcm|mulaw|alaw`. Uses xAI's batch REST endpoint — streaming WebSocket TTS is **not** used. Native Opus voice-note format is **not** supported.
- **Microsoft:** Uses `microsoft.outputFormat` (default `audio-24khz-48kbitrate-mono-mp3`). Telegram `sendVoice` accepts OGG/MP3/M4A; use OpenAI/ElevenLabs if you need guaranteed Opus voice messages. If the configured Microsoft format fails, OpenClaw retries with MP3.

OpenAI and ElevenLabs output formats are fixed per channel as listed above.

## Field reference

<AccordionGroup>
  <Accordion title="Top-level messages.tts.*">
    <ParamField path="auto" type='"off" | "always" | "inbound" | "tagged"'>
      Auto-TTS mode. `inbound` only sends audio after an inbound voice message; `tagged` only sends audio when the reply includes `[[tts:...]]` directives or a `[[tts:text]]` block.
    </ParamField>
    <ParamField path="enabled" type="boolean" deprecated>
      Legacy toggle. `openclaw doctor --fix` migrates this to `auto`.
    </ParamField>
    <ParamField path="mode" type='"final" | "all"' default="final">
      `"all"` includes tool/block replies in addition to final replies.
    </ParamField>
    <ParamField path="provider" type="string">
      Speech provider id. When unset, OpenClaw uses the first configured provider in registry auto-select order. Legacy `provider: "edge"` is rewritten to `"microsoft"` by `openclaw doctor --fix`.
    </ParamField>
    <ParamField path="persona" type="string">
      Active persona id from `personas`. Normalized to lowercase.
    </ParamField>
    <ParamField path="personas.<id>" type="object">
      Stable spoken identity. Fields: `label`, `description`, `provider`, `fallbackPolicy`, `prompt`, `providers.<provider>`. See [Personas](#personas).
    </ParamField>
    <ParamField path="summaryModel" type="string">
      Cheap model for auto-summary; defaults to `agents.defaults.model.primary`. Accepts `provider/model` or a configured model alias.
    </ParamField>
    <ParamField path="modelOverrides" type="object">
      Allow the model to emit TTS directives. `enabled` defaults to `true`; `allowProvider` defaults to `false`.
    </ParamField>
    <ParamField path="providers.<id>" type="object">
      Provider-owned settings keyed by speech provider id. Legacy direct blocks (`messages.tts.openai`, `.elevenlabs`, `.microsoft`, `.edge`) are rewritten by `openclaw doctor --fix`; commit only `messages.tts.providers.<id>`.
    </ParamField>
    <ParamField path="maxTextLength" type="number">
      Hard cap for TTS input characters. `/tts audio` fails if exceeded.
    </ParamField>
    <ParamField path="timeoutMs" type="number">
      Request timeout in milliseconds.
    </ParamField>
    <ParamField path="prefsPath" type="string">
      Override the local prefs JSON path (provider/limit/summary). Default `~/.openclaw/settings/tts.json`.
    </ParamField>
  </Accordion>

  <Accordion title="Azure Speech">
    <ParamField path="apiKey" type="string">Env: `AZURE_SPEECH_KEY`, `AZURE_SPEECH_API_KEY`, or `SPEECH_KEY`.</ParamField>
    <ParamField path="region" type="string">Azure Speech region (e.g. `eastus`). Env: `AZURE_SPEECH_REGION` or `SPEECH_REGION`.</ParamField>
    <ParamField path="endpoint" type="string">Optional Azure Speech endpoint override (alias `baseUrl`).</ParamField>
    <ParamField path="voice" type="string">Azure voice ShortName. Default `en-US-JennyNeural`.</ParamField>
    <ParamField path="lang" type="string">SSML language code. Default `en-US`.</ParamField>
    <ParamField path="outputFormat" type="string">Azure `X-Microsoft-OutputFormat` for standard audio. Default `audio-24khz-48kbitrate-mono-mp3`.</ParamField>
    <ParamField path="voiceNoteOutputFormat" type="string">Azure `X-Microsoft-OutputFormat` for voice-note output. Default `ogg-24khz-16bit-mono-opus`.</ParamField>
  </Accordion>

  <Accordion title="ElevenLabs">
    <ParamField path="apiKey" type="string">Falls back to `ELEVENLABS_API_KEY` or `XI_API_KEY`.</ParamField>
    <ParamField path="model" type="string">Model id (e.g. `eleven_multilingual_v2`, `eleven_v3`).</ParamField>
    <ParamField path="voiceId" type="string">ElevenLabs voice id.</ParamField>
    <ParamField path="voiceSettings" type="object">
      `stability`, `similarityBoost`, `style` (each `0..1`), `useSpeakerBoost` (`true|false`), `speed` (`0.5..2.0`, `1.0` = normal).
    </ParamField>
    <ParamField path="applyTextNormalization" type='"auto" | "on" | "off"'>Text normalization mode.</ParamField>
    <ParamField path="languageCode" type="string">2-letter ISO 639-1 (e.g. `en`, `de`).</ParamField>
    <ParamField path="seed" type="number">Integer `0..4294967295` for best-effort determinism.</ParamField>
    <ParamField path="baseUrl" type="string">Override ElevenLabs API base URL.</ParamField>
  </Accordion>

  <Accordion title="Google Gemini">
    <ParamField path="apiKey" type="string">Falls back to `GEMINI_API_KEY` / `GOOGLE_API_KEY`. If omitted, TTS can reuse `models.providers.google.apiKey` before env fallback.</ParamField>
    <ParamField path="model" type="string">Gemini TTS model. Default `gemini-3.1-flash-tts-preview`.</ParamField>
    <ParamField path="voiceName" type="string">Gemini prebuilt voice name. Default `Kore`. Alias: `voice`.</ParamField>
    <ParamField path="audioProfile" type="string">Natural-language style prompt prepended before spoken text.</ParamField>
    <ParamField path="speakerName" type="string">Optional speaker label prepended before spoken text when your prompt uses a named speaker.</ParamField>
    <ParamField path="promptTemplate" type='"audio-profile-v1"'>Set to `audio-profile-v1` to wrap active persona prompt fields in a deterministic Gemini TTS prompt structure.</ParamField>
    <ParamField path="personaPrompt" type="string">Google-specific extra persona prompt text appended to the template's Director's Notes.</ParamField>
    <ParamField path="baseUrl" type="string">Only `https://generativelanguage.googleapis.com` is accepted.</ParamField>
  </Accordion>

  <Accordion title="Gradium">
    <ParamField path="apiKey" type="string">Env: `GRADIUM_API_KEY`.</ParamField>
    <ParamField path="baseUrl" type="string">Default `https://api.gradium.ai`.</ParamField>
    <ParamField path="voiceId" type="string">Default Emma (`YTpq7expH9539ERJ`).</ParamField>
  </Accordion>

  <Accordion title="Inworld">
    <ParamField path="apiKey" type="string">Env: `INWORLD_API_KEY`.</ParamField>
    <ParamField path="baseUrl" type="string">Default `https://api.inworld.ai`.</ParamField>
    <ParamField path="modelId" type="string">Default `inworld-tts-1.5-max`. Also: `inworld-tts-1.5-mini`, `inworld-tts-1-max`, `inworld-tts-1`.</ParamField>
    <ParamField path="voiceId" type="string">Default `Sarah`.</ParamField>
    <ParamField path="temperature" type="number">Sampling temperature `0..2`.</ParamField>
  </Accordion>

  <Accordion title="Local CLI (tts-local-cli)">
    <ParamField path="command" type="string">Local executable or command string for CLI TTS.</ParamField>
    <ParamField path="args" type="string[]">Command arguments. Supports `{{Text}}`, `{{OutputPath}}`, `{{OutputDir}}`, `{{OutputBase}}` placeholders.</ParamField>
    <ParamField path="outputFormat" type='"mp3" | "opus" | "wav"'>Expected CLI output format. Default `mp3` for audio attachments.</ParamField>
    <ParamField path="timeoutMs" type="number">Command timeout in milliseconds. Default `120000`.</ParamField>
    <ParamField path="cwd" type="string">Optional command working directory.</ParamField>
    <ParamField path="env" type="Record<string, string>">Optional environment overrides for the command.</ParamField>
  </Accordion>

  <Accordion title="Microsoft (no API key)">
    <ParamField path="enabled" type="boolean" default="true">Allow Microsoft speech usage.</ParamField>
    <ParamField path="voice" type="string">Microsoft neural voice name (e.g. `en-US-MichelleNeural`).</ParamField>
    <ParamField path="lang" type="string">Language code (e.g. `en-US`).</ParamField>
    <ParamField path="outputFormat" type="string">Microsoft output format. Default `audio-24khz-48kbitrate-mono-mp3`. Not all formats are supported by the bundled Edge-backed transport.</ParamField>
    <ParamField path="rate / pitch / volume" type="string">Percent strings (e.g. `+10%`, `-5%`).</ParamField>
    <ParamField path="saveSubtitles" type="boolean">Write JSON subtitles alongside the audio file.</ParamField>
    <ParamField path="proxy" type="string">Proxy URL for Microsoft speech requests.</ParamField>
    <ParamField path="timeoutMs" type="number">Request timeout override (ms).</ParamField>
    <ParamField path="edge.*" type="object" deprecated>Legacy alias. Run `openclaw doctor --fix` to rewrite persisted config to `providers.microsoft`.</ParamField>
  </Accordion>

  <Accordion title="MiniMax">
    <ParamField path="apiKey" type="string">Falls back to `MINIMAX_API_KEY`. Token Plan auth via `MINIMAX_OAUTH_TOKEN`, `MINIMAX_CODE_PLAN_KEY`, or `MINIMAX_CODING_API_KEY`.</ParamField>
    <ParamField path="baseUrl" type="string">Default `https://api.minimax.io`. Env: `MINIMAX_API_HOST`.</ParamField>
    <ParamField path="model" type="string">Default `speech-2.8-hd`. Env: `MINIMAX_TTS_MODEL`.</ParamField>
    <ParamField path="voiceId" type="string">Default `English_expressive_narrator`. Env: `MINIMAX_TTS_VOICE_ID`.</ParamField>
    <ParamField path="speed" type="number">`0.5..2.0`. Default `1.0`.</ParamField>
    <ParamField path="vol" type="number">`(0, 10]`. Default `1.0`.</ParamField>
    <ParamField path="pitch" type="number">Integer `-12..12`. Default `0`. Fractional values are truncated before the request.</ParamField>
  </Accordion>

  <Accordion title="OpenAI">
    <ParamField path="apiKey" type="string">Falls back to `OPENAI_API_KEY`.</ParamField>
    <ParamField path="model" type="string">OpenAI TTS model id (e.g. `gpt-4o-mini-tts`).</ParamField>
    <ParamField path="voice" type="string">Voice name (e.g. `alloy`, `cedar`).</ParamField>
    <ParamField path="instructions" type="string">Explicit OpenAI `instructions` field. When set, persona prompt fields are **not** auto-mapped.</ParamField>
    <ParamField path="baseUrl" type="string">
      Override the OpenAI TTS endpoint. Resolution order: config → `OPENAI_TTS_BASE_URL` → `https://api.openai.com/v1`. Non-default values are treated as OpenAI-compatible TTS endpoints, so custom model and voice names are accepted.
    </ParamField>
  </Accordion>

  <Accordion title="OpenRouter">
    <ParamField path="apiKey" type="string">Env: `OPENROUTER_API_KEY`. Can reuse `models.providers.openrouter.apiKey`.</ParamField>
    <ParamField path="baseUrl" type="string">Default `https://openrouter.ai/api/v1`. Legacy `https://openrouter.ai/v1` is normalized.</ParamField>
    <ParamField path="model" type="string">Default `hexgrad/kokoro-82m`. Alias: `modelId`.</ParamField>
    <ParamField path="voice" type="string">Default `af_alloy`. Alias: `voiceId`.</ParamField>
    <ParamField path="responseFormat" type='"mp3" | "pcm"'>Default `mp3`.</ParamField>
    <ParamField path="speed" type="number">Provider-native speed override.</ParamField>
  </Accordion>

  <Accordion title="Volcengine (BytePlus Seed Speech)">
    <ParamField path="apiKey" type="string">Env: `VOLCENGINE_TTS_API_KEY` or `BYTEPLUS_SEED_SPEECH_API_KEY`.</ParamField>
    <ParamField path="resourceId" type="string">Default `seed-tts-1.0`. Env: `VOLCENGINE_TTS_RESOURCE_ID`. Use `seed-tts-2.0` when your project has TTS 2.0 entitlement.</ParamField>
    <ParamField path="appKey" type="string">App key header. Default `aGjiRDfUWi`. Env: `VOLCENGINE_TTS_APP_KEY`.</ParamField>
    <ParamField path="baseUrl" type="string">Override the Seed Speech TTS HTTP endpoint. Env: `VOLCENGINE_TTS_BASE_URL`.</ParamField>
    <ParamField path="voice" type="string">Voice type. Default `en_female_anna_mars_bigtts`. Env: `VOLCENGINE_TTS_VOICE`.</ParamField>
    <ParamField path="speedRatio" type="number">Provider-native speed ratio.</ParamField>
    <ParamField path="emotion" type="string">Provider-native emotion tag.</ParamField>
    <ParamField path="appId / token / cluster" type="string" deprecated>Legacy Volcengine Speech Console fields. Env: `VOLCENGINE_TTS_APPID`, `VOLCENGINE_TTS_TOKEN`, `VOLCENGINE_TTS_CLUSTER` (default `volcano_tts`).</ParamField>
  </Accordion>

  <Accordion title="xAI">
    <ParamField path="apiKey" type="string">Env: `XAI_API_KEY`.</ParamField>
    <ParamField path="baseUrl" type="string">Default `https://api.x.ai/v1`. Env: `XAI_BASE_URL`.</ParamField>
    <ParamField path="voiceId" type="string">Default `eve`. Live voices: `ara`, `eve`, `leo`, `rex`, `sal`, `una`.</ParamField>
    <ParamField path="language" type="string">BCP-47 language code or `auto`. Default `en`.</ParamField>
    <ParamField path="responseFormat" type='"mp3" | "wav" | "pcm" | "mulaw" | "alaw"'>Default `mp3`.</ParamField>
    <ParamField path="speed" type="number">Provider-native speed override.</ParamField>
  </Accordion>

  <Accordion title="Xiaomi MiMo">
    <ParamField path="apiKey" type="string">Env: `XIAOMI_API_KEY`.</ParamField>
    <ParamField path="baseUrl" type="string">Default `https://api.xiaomimimo.com/v1`. Env: `XIAOMI_BASE_URL`.</ParamField>
    <ParamField path="model" type="string">Default `mimo-v2.5-tts`. Env: `XIAOMI_TTS_MODEL`. Also supports `mimo-v2-tts`.</ParamField>
    <ParamField path="voice" type="string">Default `mimo_default`. Env: `XIAOMI_TTS_VOICE`.</ParamField>
    <ParamField path="format" type='"mp3" | "wav"'>Default `mp3`. Env: `XIAOMI_TTS_FORMAT`.</ParamField>
    <ParamField path="style" type="string">Optional natural-language style instruction sent as the user message; not spoken.</ParamField>
  </Accordion>
</AccordionGroup>

## Agent tool

The `tts` tool converts text to speech and returns an audio attachment for
reply delivery. On Feishu, Matrix, Telegram, and WhatsApp, the audio is
delivered as a voice message rather than a file attachment. Feishu and
WhatsApp can transcode non-Opus TTS output on this path when `ffmpeg` is
available.

WhatsApp sends audio through Baileys as a PTT voice note (`audio` with
`ptt: true`) and sends visible text **separately** from PTT audio because
clients do not consistently render captions on voice notes.

The tool accepts optional `channel` and `timeoutMs` fields; `timeoutMs` is a
per-call provider request timeout in milliseconds.

## Gateway RPC

| Method            | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `tts.status`      | Read current TTS state and last attempt. |
| `tts.enable`      | Set local auto preference to `always`.   |
| `tts.disable`     | Set local auto preference to `off`.      |
| `tts.convert`     | One-off text → audio.                    |
| `tts.setProvider` | Set local provider preference.           |
| `tts.setPersona`  | Set local persona preference.            |
| `tts.providers`   | List configured providers and status.    |

## Service links

- [OpenAI text-to-speech guide](https://platform.openai.com/docs/guides/text-to-speech)
- [OpenAI Audio API reference](https://platform.openai.com/docs/api-reference/audio)
- [Azure Speech REST text-to-speech](https://learn.microsoft.com/azure/ai-services/speech-service/rest-text-to-speech)
- [Azure Speech provider](/providers/azure-speech)
- [ElevenLabs Text to Speech](https://elevenlabs.io/docs/api-reference/text-to-speech)
- [ElevenLabs Authentication](https://elevenlabs.io/docs/api-reference/authentication)
- [Gradium](/providers/gradium)
- [Inworld TTS API](https://docs.inworld.ai/tts/tts)
- [MiniMax T2A v2 API](https://platform.minimaxi.com/document/T2A%20V2)
- [Volcengine TTS HTTP API](/providers/volcengine#text-to-speech)
- [Xiaomi MiMo speech synthesis](/providers/xiaomi#text-to-speech)
- [node-edge-tts](https://github.com/SchneeHertz/node-edge-tts)
- [Microsoft Speech output formats](https://learn.microsoft.com/azure/ai-services/speech-service/rest-text-to-speech#audio-outputs)
- [xAI text to speech](https://docs.x.ai/developers/rest-api-reference/inference/voice#text-to-speech-rest)

## Related

- [Media overview](/tools/media-overview)
- [Music generation](/tools/music-generation)
- [Video generation](/tools/video-generation)
- [Slash commands](/tools/slash-commands)
- [Voice call plugin](/plugins/voice-call)
