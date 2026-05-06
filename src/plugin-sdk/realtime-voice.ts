export type { RealtimeVoiceProviderPlugin } from "../plugins/types.js";
export type {
  RealtimeVoiceAudioFormat,
  RealtimeVoiceBargeInOptions,
  RealtimeVoiceBridge,
  RealtimeVoiceBridgeCallbacks,
  RealtimeVoiceBridgeEvent,
  RealtimeVoiceBrowserSession,
  RealtimeVoiceBrowserSessionCreateRequest,
  RealtimeVoiceBridgeCreateRequest,
<<<<<<< HEAD
=======
  RealtimeVoiceProviderCapabilities,
>>>>>>> upstream/main
  RealtimeVoiceCloseReason,
  RealtimeVoiceProviderConfig,
  RealtimeVoiceProviderConfiguredContext,
  RealtimeVoiceProviderId,
  RealtimeVoiceProviderResolveConfigContext,
  RealtimeVoiceRole,
  RealtimeVoiceTool,
  RealtimeVoiceToolCallEvent,
  RealtimeVoiceToolResultOptions,
<<<<<<< HEAD
} from "../realtime-voice/provider-types.js";
export {
  REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ,
  REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ,
} from "../realtime-voice/provider-types.js";
=======
} from "../talk/provider-types.js";
export {
  REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ,
  REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ,
} from "../talk/provider-types.js";
export {
  createTalkEventSequencer,
  TALK_EVENT_TYPES,
  type TalkBrain,
  type TalkEvent,
  type TalkEventContext,
  type TalkEventInput,
  type TalkEventSequencer,
  type TalkEventType,
  type TalkMode,
  type TalkTransport,
} from "../talk/talk-events.js";
export { createTalkDiagnosticEvent, recordTalkDiagnosticEvent } from "../talk/diagnostics.js";
export { createTalkLogRecord, recordTalkLogEvent } from "../talk/logging.js";
export { recordTalkObservabilityEvent } from "../talk/observability.js";
export {
  createTalkSessionController,
  normalizeTalkTransport,
  type TalkEnsureTurnResult,
  type TalkSessionControllerOptions,
  type TalkSessionController,
  type TalkSessionControllerParams,
  type TalkTurnFailure,
  type TalkTurnFailureReason,
  type TalkTurnResult,
  type TalkTurnSuccess,
} from "../talk/talk-session-controller.js";
>>>>>>> upstream/main
export {
  buildRealtimeVoiceAgentConsultChatMessage,
  buildRealtimeVoiceAgentConsultPrompt,
  buildRealtimeVoiceAgentConsultWorkingResponse,
  collectRealtimeVoiceAgentConsultVisibleText,
  isRealtimeVoiceAgentConsultToolPolicy,
  parseRealtimeVoiceAgentConsultArgs,
  REALTIME_VOICE_AGENT_CONSULT_TOOL,
  REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME,
  REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES,
  resolveRealtimeVoiceAgentConsultToolPolicy,
  resolveRealtimeVoiceAgentConsultTools,
  resolveRealtimeVoiceAgentConsultToolsAllow,
  type RealtimeVoiceAgentConsultArgs,
  type RealtimeVoiceAgentConsultToolPolicy,
  type RealtimeVoiceAgentConsultTranscriptEntry,
<<<<<<< HEAD
} from "../realtime-voice/agent-consult-tool.js";
=======
} from "../talk/agent-consult-tool.js";
>>>>>>> upstream/main
export {
  consultRealtimeVoiceAgent,
  type RealtimeVoiceAgentConsultResult,
  type RealtimeVoiceAgentConsultRuntime,
<<<<<<< HEAD
} from "../realtime-voice/agent-consult-runtime.js";
=======
} from "../talk/agent-consult-runtime.js";
export {
  createRealtimeVoiceAgentTalkbackQueue,
  type RealtimeVoiceAgentTalkbackQueue,
  type RealtimeVoiceAgentTalkbackQueueParams,
  type RealtimeVoiceAgentTalkbackResult,
} from "../talk/agent-talkback-runtime.js";
export {
  resolveRealtimeVoiceFastContextConsult,
  type RealtimeVoiceFastContextConfig,
  type RealtimeVoiceFastContextConsultResult,
  type RealtimeVoiceFastContextLabels,
} from "../talk/fast-context-runtime.js";
>>>>>>> upstream/main
export {
  canonicalizeRealtimeVoiceProviderId,
  getRealtimeVoiceProvider,
  listRealtimeVoiceProviders,
  normalizeRealtimeVoiceProviderId,
<<<<<<< HEAD
} from "../realtime-voice/provider-registry.js";
=======
} from "../talk/provider-registry.js";
>>>>>>> upstream/main
export {
  resolveConfiguredRealtimeVoiceProvider,
  type ResolvedRealtimeVoiceProvider,
  type ResolveConfiguredRealtimeVoiceProviderParams,
<<<<<<< HEAD
} from "../realtime-voice/provider-resolver.js";
=======
} from "../talk/provider-resolver.js";
>>>>>>> upstream/main
export {
  createRealtimeVoiceBridgeSession,
  type RealtimeVoiceAudioSink,
  type RealtimeVoiceBridgeSession,
  type RealtimeVoiceBridgeSessionParams,
  type RealtimeVoiceMarkStrategy,
<<<<<<< HEAD
} from "../realtime-voice/session-runtime.js";
=======
} from "../talk/session-runtime.js";
export {
  extendRealtimeVoiceOutputEchoSuppression,
  getRealtimeVoiceBridgeEventHealth,
  getRealtimeVoiceTranscriptHealth,
  isLikelyRealtimeVoiceAssistantEchoTranscript,
  recordRealtimeVoiceBridgeEvent,
  recordRealtimeVoiceTranscript,
  type RealtimeVoiceBridgeEventHealth,
  type RealtimeVoiceBridgeEventLogEntry,
  type RealtimeVoiceTranscriptEntry,
  type RealtimeVoiceTranscriptHealth,
} from "../talk/session-log-runtime.js";
>>>>>>> upstream/main
export {
  convertPcmToMulaw8k,
  mulawToPcm,
  pcmToMulaw,
  resamplePcm,
  resamplePcmTo8k,
<<<<<<< HEAD
} from "../realtime-voice/audio-codec.js";
=======
} from "../talk/audio-codec.js";
>>>>>>> upstream/main
