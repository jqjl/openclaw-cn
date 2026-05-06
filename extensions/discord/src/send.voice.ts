<<<<<<< HEAD
import crypto from "node:crypto";
=======
>>>>>>> upstream/main
import fs from "node:fs/promises";
import path from "node:path";
import { recordChannelActivity } from "openclaw/plugin-sdk/channel-activity-runtime";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-types";
import {
  extensionForMime,
  maxBytesForKind,
  unlinkIfExists,
} from "openclaw/plugin-sdk/media-runtime";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
import type { RetryConfig } from "openclaw/plugin-sdk/retry-runtime";
<<<<<<< HEAD
import { resolvePreferredOpenClawTmpDir } from "openclaw/plugin-sdk/temp-path";
=======
import { tempWorkspace, resolvePreferredOpenClawTmpDir } from "openclaw/plugin-sdk/temp-path";
>>>>>>> upstream/main
import { loadWebMediaRaw } from "openclaw/plugin-sdk/web-media";
import { resolveDiscordAccount } from "./accounts.js";
import type { RequestClient } from "./internal/discord.js";
import { parseAndResolveRecipient } from "./recipient-resolution.js";
<<<<<<< HEAD
=======
import { createDiscordSendResult } from "./send.receipt.js";
>>>>>>> upstream/main
import { buildDiscordSendError, createDiscordClient, resolveChannelId } from "./send.shared.js";
import type { DiscordSendResult } from "./send.types.js";
import {
  ensureOggOpus,
  getVoiceMessageMetadata,
  sendDiscordVoiceMessage,
} from "./voice-message.js";

type VoiceMessageOpts = {
  cfg: OpenClawConfig;
  token?: string;
  accountId?: string;
  verbose?: boolean;
  rest?: RequestClient;
  replyTo?: string;
  retry?: RetryConfig;
  silent?: boolean;
};

function toDiscordSendResult(
  result: { id?: string | null; channel_id?: string | null },
  fallbackChannelId: string,
): DiscordSendResult {
<<<<<<< HEAD
  return {
    messageId: result.id || "unknown",
    channelId: result.channel_id ?? fallbackChannelId,
  };
}

async function materializeVoiceMessageInput(mediaUrl: string): Promise<{ filePath: string }> {
=======
  return createDiscordSendResult({
    result,
    fallbackChannelId,
    kind: "voice",
  });
}

async function materializeVoiceMessageInput(
  mediaUrl: string,
): Promise<{ filePath: string; cleanup: () => Promise<void> }> {
>>>>>>> upstream/main
  // Security: reuse the standard media loader so we apply SSRF guards + allowed-local-root checks.
  // Then write to a private temp file so ffmpeg/ffprobe never sees the original URL/path string.
  const media = await loadWebMediaRaw(mediaUrl, maxBytesForKind("audio"));
  const extFromName = media.fileName ? path.extname(media.fileName) : "";
  const extFromMime = media.contentType ? extensionForMime(media.contentType) : "";
  const ext = extFromName || extFromMime || ".bin";
<<<<<<< HEAD
  const tempDir = resolvePreferredOpenClawTmpDir();
  const filePath = path.join(tempDir, `voice-src-${crypto.randomUUID()}${ext}`);
  await fs.writeFile(filePath, media.buffer, { mode: 0o600 });
  return { filePath };
=======
  const workspace = await tempWorkspace({
    rootDir: resolvePreferredOpenClawTmpDir(),
    prefix: "voice-src-",
  });
  const filePath = await workspace.write(`input${ext}`, media.buffer);
  return { filePath, cleanup: async () => await workspace.cleanup() };
>>>>>>> upstream/main
}

/**
 * Send a voice message to Discord.
 *
 * Voice messages are a special Discord feature that displays audio with a waveform
 * visualization. They require OGG/Opus format and cannot include text content.
 *
 * @param to - Recipient (user ID for DM or channel ID)
 * @param audioPath - Path to local audio file (will be converted to OGG/Opus if needed)
 * @param opts - Send options
 */
export async function sendVoiceMessageDiscord(
  to: string,
  audioPath: string,
  opts: VoiceMessageOpts,
): Promise<DiscordSendResult> {
<<<<<<< HEAD
  const { filePath: localInputPath } = await materializeVoiceMessageInput(audioPath);
=======
  const { filePath: localInputPath, cleanup: cleanupLocalInput } =
    await materializeVoiceMessageInput(audioPath);
>>>>>>> upstream/main
  let oggPath: string | null = null;
  let oggCleanup = false;
  let token: string | undefined;
  let rest: RequestClient | undefined;
  let channelId: string | undefined;
  const cfg = requireRuntimeConfig(opts.cfg, "Discord voice send");

  try {
    const accountInfo = resolveDiscordAccount({
      cfg,
      accountId: opts.accountId,
    });
    const client = createDiscordClient({ ...opts, cfg });
    token = client.token;
    rest = client.rest;
    const request = client.request;
    const recipient = await parseAndResolveRecipient(to, cfg, opts.accountId);
    channelId = (await resolveChannelId(rest, recipient, request)).channelId;

    const ogg = await ensureOggOpus(localInputPath);
    oggPath = ogg.path;
    oggCleanup = ogg.cleanup;

    const metadata = await getVoiceMessageMetadata(oggPath);
    const audioBuffer = await fs.readFile(oggPath);
    const result = await sendDiscordVoiceMessage(
      rest,
      channelId,
      audioBuffer,
      metadata,
      opts.replyTo,
      request,
      opts.silent,
      token,
    );

    recordChannelActivity({
      channel: "discord",
      accountId: accountInfo.accountId,
      direction: "outbound",
    });

    return toDiscordSendResult(result, channelId);
  } catch (err) {
    if (channelId && rest && token) {
      throw await buildDiscordSendError(err, {
        channelId,
        cfg,
        rest,
        token,
        hasMedia: true,
      });
    }
    throw err;
  } finally {
    await unlinkIfExists(oggCleanup ? oggPath : null);
<<<<<<< HEAD
    await unlinkIfExists(localInputPath);
=======
    await cleanupLocalInput();
>>>>>>> upstream/main
  }
}
