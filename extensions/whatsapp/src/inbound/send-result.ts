import type { WAMessage, WAMessageKey } from "@whiskeysockets/baileys";
<<<<<<< HEAD
=======
import {
  createMessageReceiptFromOutboundResults,
  listMessageReceiptPlatformIds,
  type MessageReceipt,
  type MessageReceiptPartKind,
  type MessageReceiptSourceResult,
} from "openclaw/plugin-sdk/channel-message";
>>>>>>> upstream/main

export type WhatsAppSendKind = "media" | "poll" | "reaction" | "text";

type WhatsAppSendKey = Omit<
  Pick<WAMessageKey, "fromMe" | "id" | "participant" | "remoteJid">,
  "id"
> & {
  id: string;
};

export type WhatsAppSendResult = {
  kind: WhatsAppSendKind;
  messageId: string;
<<<<<<< HEAD
  messageIds: string[];
=======
  receipt?: MessageReceipt;
>>>>>>> upstream/main
  keys: WhatsAppSendKey[];
  providerAccepted: boolean;
};

<<<<<<< HEAD
=======
function resolveWhatsAppReceiptKind(kind: WhatsAppSendKind): MessageReceiptPartKind {
  if (kind === "media" || kind === "text") {
    return kind;
  }
  return "unknown";
}

function toReceiptSourceResult(key: WhatsAppSendKey): MessageReceiptSourceResult {
  return {
    channel: "whatsapp",
    messageId: key.id,
    ...(key.remoteJid ? { toJid: key.remoteJid } : {}),
    meta: {
      fromMe: key.fromMe,
      participant: key.participant,
    },
  };
}

function createWhatsAppSendReceipt(
  kind: WhatsAppSendKind,
  keys: readonly WhatsAppSendKey[],
): MessageReceipt {
  return createMessageReceiptFromOutboundResults({
    kind: resolveWhatsAppReceiptKind(kind),
    results: keys.map(toReceiptSourceResult),
  });
}

>>>>>>> upstream/main
function normalizeKey(key: WAMessageKey | undefined): WhatsAppSendKey | undefined {
  const id = typeof key?.id === "string" ? key.id.trim() : "";
  if (!id) {
    return undefined;
  }
  return {
    id,
    remoteJid: key?.remoteJid,
    fromMe: key?.fromMe,
    participant: key?.participant,
  };
}

export function normalizeWhatsAppSendResult(
  result: WAMessage | undefined,
  kind: WhatsAppSendKind,
): WhatsAppSendResult {
  const key = normalizeKey(result?.key);
  const messageId = key?.id ?? "unknown";
  return {
    kind,
    messageId,
<<<<<<< HEAD
    messageIds: key ? [key.id] : [],
=======
    receipt: createWhatsAppSendReceipt(kind, key ? [key] : []),
>>>>>>> upstream/main
    keys: key ? [key] : [],
    providerAccepted: Boolean(key),
  };
}

export function combineWhatsAppSendResults(
  kind: WhatsAppSendKind,
  results: readonly WhatsAppSendResult[],
): WhatsAppSendResult {
<<<<<<< HEAD
  const messageIds = [...new Set(results.flatMap((result) => result.messageIds))];
=======
  const messageIds = [...new Set(results.flatMap(listWhatsAppSendResultMessageIds))];
>>>>>>> upstream/main
  const keys = results.flatMap((result) => result.keys);
  return {
    kind,
    messageId: messageIds[0] ?? "unknown",
<<<<<<< HEAD
    messageIds,
=======
    receipt: createWhatsAppSendReceipt(kind, keys),
>>>>>>> upstream/main
    keys,
    providerAccepted: results.some((result) => result.providerAccepted),
  };
}
<<<<<<< HEAD
=======

export function listWhatsAppSendResultMessageIds(result: WhatsAppSendResult): string[] {
  const receiptIds = result.receipt ? listMessageReceiptPlatformIds(result.receipt) : [];
  if (receiptIds.length > 0) {
    return receiptIds;
  }
  const keyIds = result.keys.map((key) => key.id.trim()).filter(Boolean);
  if (keyIds.length > 0) {
    return [...new Set(keyIds)];
  }
  return [];
}
>>>>>>> upstream/main
