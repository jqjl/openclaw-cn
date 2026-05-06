import { describe, expect, it, vi, beforeEach } from "vitest";
import { resolveGoogleMeetConfig } from "./config.js";
<<<<<<< HEAD
import { joinMeetViaVoiceCallGateway } from "./voice-call-gateway.js";
=======
import {
  endMeetVoiceCallGatewayCall,
  getMeetVoiceCallGatewayCall,
  joinMeetViaVoiceCallGateway,
} from "./voice-call-gateway.js";
>>>>>>> upstream/main

const gatewayMocks = vi.hoisted(() => ({
  request: vi.fn(),
  stopAndWait: vi.fn(async () => {}),
  startGatewayClientWhenEventLoopReady: vi.fn(async () => ({ ready: true, aborted: false })),
}));

vi.mock("openclaw/plugin-sdk/gateway-runtime", () => ({
  GatewayClient: vi.fn(function MockGatewayClient(params: { onHelloOk?: () => void }) {
    queueMicrotask(() => params.onHelloOk?.());
    return {
      request: gatewayMocks.request,
      stopAndWait: gatewayMocks.stopAndWait,
    };
  }),
  startGatewayClientWhenEventLoopReady: gatewayMocks.startGatewayClientWhenEventLoopReady,
}));

describe("Google Meet voice-call gateway", () => {
  beforeEach(() => {
    vi.useRealTimers();
    gatewayMocks.request.mockReset();
    gatewayMocks.request.mockResolvedValue({ callId: "call-1" });
    gatewayMocks.stopAndWait.mockClear();
    gatewayMocks.startGatewayClientWhenEventLoopReady.mockClear();
  });

<<<<<<< HEAD
  it("starts Twilio Meet calls, sends delayed DTMF, then speaks the intro without TwiML fallback", async () => {
=======
  it("starts Twilio Meet calls with pre-connect DTMF, then speaks the intro without TwiML fallback", async () => {
>>>>>>> upstream/main
    const config = resolveGoogleMeetConfig({
      voiceCall: {
        gatewayUrl: "ws://127.0.0.1:18789",
        dtmfDelayMs: 1,
        postDtmfSpeechDelayMs: 2,
      },
      realtime: { introMessage: "Say exactly: I'm here and listening." },
    });

    const join = joinMeetViaVoiceCallGateway({
      config,
      dialInNumber: "+15551234567",
      dtmfSequence: "123456#",
      message: "Say exactly: I'm here and listening.",
<<<<<<< HEAD
=======
      requesterSessionKey: "agent:main:discord:channel:general",
      sessionKey: "voice:google-meet:meet-1",
>>>>>>> upstream/main
    });

    await join;

    expect(gatewayMocks.request).toHaveBeenNthCalledWith(
      1,
      "voicecall.start",
      {
        to: "+15551234567",
        mode: "conversation",
<<<<<<< HEAD
=======
        dtmfSequence: "123456#",
        requesterSessionKey: "agent:main:discord:channel:general",
        sessionKey: "voice:google-meet:meet-1",
>>>>>>> upstream/main
      },
      { timeoutMs: 30_000 },
    );
    expect(gatewayMocks.request).toHaveBeenNthCalledWith(
      2,
<<<<<<< HEAD
      "voicecall.dtmf",
      {
        callId: "call-1",
        digits: "123456#",
      },
      { timeoutMs: 30_000 },
    );
    expect(gatewayMocks.request).toHaveBeenNthCalledWith(
      3,
=======
>>>>>>> upstream/main
      "voicecall.speak",
      {
        callId: "call-1",
        allowTwimlFallback: false,
        message: "Say exactly: I'm here and listening.",
      },
      { timeoutMs: 30_000 },
    );
<<<<<<< HEAD
    expect(gatewayMocks.request).toHaveBeenCalledTimes(3);
=======
    expect(gatewayMocks.request).toHaveBeenCalledTimes(2);
>>>>>>> upstream/main
  });

  it("skips the intro without failing when the realtime bridge is not ready", async () => {
    gatewayMocks.request
      .mockResolvedValueOnce({ callId: "call-1" })
<<<<<<< HEAD
      .mockResolvedValueOnce({ success: true })
=======
>>>>>>> upstream/main
      .mockResolvedValueOnce({ success: false, error: "No active realtime bridge for call" });
    const config = resolveGoogleMeetConfig({
      voiceCall: {
        gatewayUrl: "ws://127.0.0.1:18789",
        dtmfDelayMs: 1,
        postDtmfSpeechDelayMs: 1,
      },
    });
    const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() };

    const result = await joinMeetViaVoiceCallGateway({
      config,
      dialInNumber: "+15551234567",
      dtmfSequence: "123456#",
      logger,
      message: "Say exactly: I'm here and listening.",
    });

    expect(result).toMatchObject({ callId: "call-1", dtmfSent: true, introSent: false });
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining("Skipped intro speech because realtime bridge was not ready"),
    );
  });
<<<<<<< HEAD
=======

  it("treats missing delegated calls as already ended", async () => {
    gatewayMocks.request.mockRejectedValueOnce(new Error("Call not found"));
    const config = resolveGoogleMeetConfig({
      voiceCall: { gatewayUrl: "ws://127.0.0.1:18789" },
    });

    await expect(
      endMeetVoiceCallGatewayCall({ config, callId: "call-1" }),
    ).resolves.toBeUndefined();

    expect(gatewayMocks.request).toHaveBeenCalledWith(
      "voicecall.end",
      { callId: "call-1" },
      { timeoutMs: 30_000 },
    );
  });

  it("reads delegated call status from the gateway", async () => {
    gatewayMocks.request.mockResolvedValueOnce({ found: false });
    const config = resolveGoogleMeetConfig({
      voiceCall: { gatewayUrl: "ws://127.0.0.1:18789" },
    });

    await expect(getMeetVoiceCallGatewayCall({ config, callId: "call-1" })).resolves.toEqual({
      found: false,
    });

    expect(gatewayMocks.request).toHaveBeenCalledWith(
      "voicecall.status",
      { callId: "call-1" },
      { timeoutMs: 30_000 },
    );
  });
>>>>>>> upstream/main
});
