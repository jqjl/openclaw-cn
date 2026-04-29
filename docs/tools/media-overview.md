---
summary: "Image, video, music, speech, and media-understanding capabilities at a glance"
read_when:
  - Looking for an overview of OpenClaw's media capabilities
  - Deciding which media provider to configure
  - Understanding how async media generation works
title: "Media overview"
sidebarTitle: "Media overview"
---

OpenClaw generates images, videos, and music, understands inbound media
(images, audio, video), and speaks replies aloud with text-to-speech. All
media capabilities are tool-driven: the agent decides when to use them based
on the conversation, and each tool only appears when at least one backing
provider is configured.

## Capabilities

## Capabilities at a glance

| Capability           | Tool             | Providers                                                                                    | What it does                                            |
| -------------------- | ---------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Image generation     | `image_generate` | ComfyUI, fal, Google, MiniMax, OpenAI, Vydra                                                 | Creates or edits images from text prompts or references |
| Video generation     | `video_generate` | Alibaba, BytePlus, ComfyUI, fal, Google, MiniMax, OpenAI, Qwen, Runway, Together, Vydra, xAI | Creates videos from text, images, or existing videos    |
| Music generation     | `music_generate` | ComfyUI, Google, MiniMax                                                                     | Creates music or audio tracks from text prompts         |
| Text-to-speech (TTS) | `tts`            | ElevenLabs, Microsoft, MiniMax, OpenAI                                                       | Converts outbound replies to spoken audio               |
| Media understanding  | (automatic)      | Any vision/audio-capable model provider, plus CLI fallbacks                                  | Summarizes inbound images, audio, and video             |

## Provider capability matrix

This table shows which providers support which media capabilities across the platform.

| Provider   | Image | Video | Music | TTS | STT / Transcription | Media Understanding |
| ---------- | ----- | ----- | ----- | --- | ------------------- | ------------------- |
| Alibaba    |       | Yes   |       |     |                     |                     |
| BytePlus   |       | Yes   |       |     |                     |                     |
| ComfyUI    | Yes   | Yes   | Yes   |     |                     |                     |
| Deepgram   |       |       |       |     | Yes                 |                     |
| ElevenLabs |       |       |       | Yes |                     |                     |
| fal        | Yes   | Yes   |       |     |                     |                     |
| Google     | Yes   | Yes   | Yes   |     |                     | Yes                 |
| Microsoft  |       |       |       | Yes |                     |                     |
| MiniMax    | Yes   | Yes   | Yes   | Yes |                     |                     |
| OpenAI     | Yes   | Yes   |       | Yes | Yes                 | Yes                 |
| Qwen       |       | Yes   |       |     |                     |                     |
| Runway     |       | Yes   |       |     |                     |                     |
| Together   |       | Yes   |       |     |                     |                     |
| Vydra      | Yes   | Yes   |       |     |                     |                     |
| xAI        |       | Yes   |       |     |                     |                     |

<Note>
Media understanding uses any vision-capable or audio-capable model registered
in your provider config. The matrix above lists providers with dedicated
media-understanding support; most multimodal LLM providers (Anthropic, Google,
OpenAI, etc.) can also understand inbound media when configured as the active
reply model.
</Note>

## Async vs synchronous

| Capability      | Mode         | Why                                                                |
| --------------- | ------------ | ------------------------------------------------------------------ |
| Image           | Synchronous  | Provider responses return in seconds; completes inline with reply. |
| Text-to-speech  | Synchronous  | Provider responses return in seconds; attached to the reply audio. |
| Video           | Asynchronous | Provider processing takes 30 s to several minutes.                 |
| Music (shared)  | Asynchronous | Same provider-processing characteristic as video.                  |
| Music (ComfyUI) | Synchronous  | Local workflow runs inline against the configured ComfyUI server.  |

## Quick links

Deepgram, ElevenLabs, Mistral, OpenAI, and xAI also register Voice Call
streaming STT providers, so live phone audio can be forwarded to the selected
vendor without waiting for a completed recording.

## Provider mappings (how vendors split across surfaces)

<AccordionGroup>
  <Accordion title="Google">
    Image, video, music, batch TTS, backend realtime voice, and
    media-understanding surfaces.
  </Accordion>
  <Accordion title="OpenAI">
    Image, video, batch TTS, batch STT, Voice Call streaming STT, backend
    realtime voice, and memory-embedding surfaces.
  </Accordion>
  <Accordion title="DeepInfra">
    Chat/model routing, image generation/editing, text-to-video, batch TTS,
    batch STT, image media understanding, and memory-embedding surfaces.
    DeepInfra-native rerank/classification/object-detection models are not
    registered until OpenClaw has dedicated provider contracts for those
    categories.
  </Accordion>
  <Accordion title="xAI">
    Image, video, search, code-execution, batch TTS, batch STT, and Voice
    Call streaming STT. xAI Realtime voice is an upstream capability but is
    not registered in OpenClaw until the shared realtime-voice contract can
    represent it.
  </Accordion>
</AccordionGroup>

## Related

- [Image generation](/tools/image-generation)
- [Video generation](/tools/video-generation)
- [Music generation](/tools/music-generation)
- [Text-to-speech](/tools/tts)
- [Media understanding](/nodes/media-understanding)
- [Audio nodes](/nodes/audio)
