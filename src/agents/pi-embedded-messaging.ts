import { getChannelPlugin, normalizeChannelId } from "../channels/plugins/index.js";
import { normalizeOptionalString } from "../shared/string-coerce.js";

const CORE_MESSAGING_TOOLS = new Set(["sessions_send", "message"]);
<<<<<<< HEAD
=======
const MESSAGE_TOOL_SEND_ACTIONS = new Set([
  "send",
  "thread-reply",
  "sendWithEffect",
  "sendAttachment",
  "upload-file",
]);

export function isMessageToolSendActionName(action: unknown): boolean {
  const normalized = normalizeOptionalString(action) ?? "";
  return MESSAGE_TOOL_SEND_ACTIONS.has(normalized);
}
>>>>>>> upstream/main

// Provider docking: any plugin with `actions` opts into messaging tool handling.
export function isMessagingTool(toolName: string): boolean {
  if (CORE_MESSAGING_TOOLS.has(toolName)) {
    return true;
  }
  const providerId = normalizeChannelId(toolName);
  return Boolean(providerId && getChannelPlugin(providerId)?.actions);
}

export function isMessagingToolSendAction(
  toolName: string,
  args: Record<string, unknown>,
): boolean {
  const action = normalizeOptionalString(args.action) ?? "";
  if (toolName === "sessions_send") {
    return true;
  }
  if (toolName === "message") {
<<<<<<< HEAD
    return action === "send" || action === "thread-reply";
=======
    return isMessageToolSendActionName(action);
>>>>>>> upstream/main
  }
  const providerId = normalizeChannelId(toolName);
  if (!providerId) {
    return false;
  }
  const plugin = getChannelPlugin(providerId);
  if (!plugin?.actions?.extractToolSend) {
    return false;
  }
  return Boolean(plugin.actions.extractToolSend({ args })?.to);
}
