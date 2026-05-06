<<<<<<< HEAD
=======
import type { MessageReceipt } from "../../channels/message/types.js";
>>>>>>> upstream/main
import type { ChannelId } from "../../channels/plugins/channel-id.types.js";

export type OutboundDeliveryResult = {
  channel: Exclude<ChannelId, "none">;
  messageId: string;
  chatId?: string;
  channelId?: string;
  roomId?: string;
  conversationId?: string;
  timestamp?: number;
  toJid?: string;
  pollId?: string;
<<<<<<< HEAD
=======
  receipt?: MessageReceipt;
>>>>>>> upstream/main
  // Channel docking: stash channel-specific fields here to avoid core type churn.
  meta?: Record<string, unknown>;
};
