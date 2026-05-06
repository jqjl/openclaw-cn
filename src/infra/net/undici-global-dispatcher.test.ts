<<<<<<< HEAD
=======
import { execFileSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";
>>>>>>> upstream/main
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const {
  Agent,
  EnvHttpProxyAgent,
  ProxyAgent,
<<<<<<< HEAD
  getGlobalDispatcher,
=======
>>>>>>> upstream/main
  setGlobalDispatcher,
  setCurrentDispatcher,
  getCurrentDispatcher,
  getDefaultAutoSelectFamily,
<<<<<<< HEAD
=======
  loadUndiciGlobalDispatcherDeps,
>>>>>>> upstream/main
} = vi.hoisted(() => {
  class Agent {
    constructor(public readonly options?: Record<string, unknown>) {}
  }

  class EnvHttpProxyAgent {
    public readonly capturedHttpProxy = process.env.HTTP_PROXY;
    constructor(public readonly options?: Record<string, unknown>) {}
  }

  class ProxyAgent {
    constructor(public readonly url: string) {}
  }

  let currentDispatcher: unknown = new Agent();

  const getGlobalDispatcher = vi.fn(() => currentDispatcher);
  const setGlobalDispatcher = vi.fn((next: unknown) => {
    currentDispatcher = next;
  });
  const setCurrentDispatcher = (next: unknown) => {
    currentDispatcher = next;
  };
  const getCurrentDispatcher = () => currentDispatcher;
  const getDefaultAutoSelectFamily = vi.fn(() => undefined as boolean | undefined);
<<<<<<< HEAD
=======
  const loadUndiciGlobalDispatcherDeps = vi.fn(() => ({
    Agent,
    EnvHttpProxyAgent,
    getGlobalDispatcher,
    setGlobalDispatcher,
  }));
>>>>>>> upstream/main

  return {
    Agent,
    EnvHttpProxyAgent,
    ProxyAgent,
    getGlobalDispatcher,
    setGlobalDispatcher,
    setCurrentDispatcher,
    getCurrentDispatcher,
    getDefaultAutoSelectFamily,
<<<<<<< HEAD
  };
});

const mockedModuleIds = ["node:net", "undici", "./proxy-env.js", "../wsl.js"] as const;

vi.mock("undici", () => ({
  Agent,
  EnvHttpProxyAgent,
  getGlobalDispatcher,
  setGlobalDispatcher,
}));
=======
    loadUndiciGlobalDispatcherDeps,
  };
});

const mockedModuleIds = ["node:net", "./proxy-env.js", "./undici-runtime.js", "../wsl.js"] as const;
>>>>>>> upstream/main

vi.mock("node:net", () => ({
  getDefaultAutoSelectFamily,
}));

vi.mock("./proxy-env.js", () => ({
  hasEnvHttpProxyAgentConfigured: vi.fn(() => false),
  resolveEnvHttpProxyAgentOptions: vi.fn(() => undefined),
}));

<<<<<<< HEAD
=======
vi.mock("./undici-runtime.js", () => ({
  loadUndiciGlobalDispatcherDeps,
}));

>>>>>>> upstream/main
vi.mock("../wsl.js", () => ({
  isWSL2Sync: vi.fn(() => false),
}));

import { isWSL2Sync } from "../wsl.js";
import { hasEnvHttpProxyAgentConfigured, resolveEnvHttpProxyAgentOptions } from "./proxy-env.js";
let DEFAULT_UNDICI_STREAM_TIMEOUT_MS: typeof import("./undici-global-dispatcher.js").DEFAULT_UNDICI_STREAM_TIMEOUT_MS;
<<<<<<< HEAD
=======
let ensureGlobalUndiciDispatcherStreamTimeouts: typeof import("./undici-global-dispatcher.js").ensureGlobalUndiciDispatcherStreamTimeouts;
>>>>>>> upstream/main
let ensureGlobalUndiciEnvProxyDispatcher: typeof import("./undici-global-dispatcher.js").ensureGlobalUndiciEnvProxyDispatcher;
let ensureGlobalUndiciStreamTimeouts: typeof import("./undici-global-dispatcher.js").ensureGlobalUndiciStreamTimeouts;
let forceResetGlobalDispatcher: typeof import("./undici-global-dispatcher.js").forceResetGlobalDispatcher;
let resetGlobalUndiciStreamTimeoutsForTests: typeof import("./undici-global-dispatcher.js").resetGlobalUndiciStreamTimeoutsForTests;
let undiciGlobalDispatcherModule: typeof import("./undici-global-dispatcher.js");

describe("ensureGlobalUndiciStreamTimeouts", () => {
  beforeAll(async () => {
    undiciGlobalDispatcherModule = await import("./undici-global-dispatcher.js");
    ({
      DEFAULT_UNDICI_STREAM_TIMEOUT_MS,
<<<<<<< HEAD
=======
      ensureGlobalUndiciDispatcherStreamTimeouts,
>>>>>>> upstream/main
      ensureGlobalUndiciEnvProxyDispatcher,
      ensureGlobalUndiciStreamTimeouts,
      forceResetGlobalDispatcher,
      resetGlobalUndiciStreamTimeoutsForTests,
    } = undiciGlobalDispatcherModule);
  });

  beforeEach(() => {
    vi.clearAllMocks();
    resetGlobalUndiciStreamTimeoutsForTests();
    setCurrentDispatcher(new Agent());
    getDefaultAutoSelectFamily.mockReturnValue(undefined);
    vi.mocked(hasEnvHttpProxyAgentConfigured).mockReturnValue(false);
    vi.mocked(resolveEnvHttpProxyAgentOptions).mockReturnValue(undefined);
  });

<<<<<<< HEAD
  it("replaces default Agent dispatcher with extended stream timeouts", () => {
=======
  it("records timeout bridge without importing undici when no env proxy is configured", () => {
>>>>>>> upstream/main
    getDefaultAutoSelectFamily.mockReturnValue(true);

    ensureGlobalUndiciStreamTimeouts();

<<<<<<< HEAD
    expect(setGlobalDispatcher).toHaveBeenCalledTimes(1);
    const next = getCurrentDispatcher() as { options?: Record<string, unknown> };
    expect(next).toBeInstanceOf(Agent);
    expect(next.options?.bodyTimeout).toBe(DEFAULT_UNDICI_STREAM_TIMEOUT_MS);
    expect(next.options?.headersTimeout).toBe(DEFAULT_UNDICI_STREAM_TIMEOUT_MS);
    expect(next.options?.connect).toEqual({
      autoSelectFamily: true,
      autoSelectFamilyAttemptTimeout: 300,
    });
=======
    expect(loadUndiciGlobalDispatcherDeps).not.toHaveBeenCalled();
    expect(setGlobalDispatcher).not.toHaveBeenCalled();
    expect(undiciGlobalDispatcherModule._globalUndiciStreamTimeoutMs).toBe(
      DEFAULT_UNDICI_STREAM_TIMEOUT_MS,
    );
  });

  it("does not initialize the undici global dispatcher in a no-proxy subprocess", () => {
    const moduleUrl = pathToFileURL(path.resolve("src/infra/net/undici-global-dispatcher.ts")).href;
    const source = `
      const dispatcherKey = Symbol.for("undici.globalDispatcher.1");
      const mod = await import(${JSON.stringify(moduleUrl)});
      mod.ensureGlobalUndiciStreamTimeouts({ timeoutMs: 1_900_000 });
      if (globalThis[dispatcherKey] !== undefined) {
        throw new Error("undici global dispatcher was initialized");
      }
      console.log("ok");
    `;
    const env = { ...process.env };
    for (const key of [
      "HTTP_PROXY",
      "HTTPS_PROXY",
      "ALL_PROXY",
      "http_proxy",
      "https_proxy",
      "all_proxy",
    ]) {
      delete env[key];
    }

    const output = execFileSync(
      process.execPath,
      ["--import", "tsx", "--input-type=module", "--eval", source],
      { cwd: process.cwd(), encoding: "utf8", env },
    );

    expect(output.trim()).toBe("ok");
  });

  it("explicitly tunes the global dispatcher when requested for embedded attempts", () => {
    getDefaultAutoSelectFamily.mockReturnValue(false);

    ensureGlobalUndiciDispatcherStreamTimeouts({ timeoutMs: 1_900_000 });

    expect(loadUndiciGlobalDispatcherDeps).toHaveBeenCalledTimes(1);
    expect(setGlobalDispatcher).toHaveBeenCalledTimes(1);
    const next = getCurrentDispatcher() as { options?: Record<string, unknown> };
    expect(next).toBeInstanceOf(Agent);
    expect(next.options).toEqual({
      bodyTimeout: 1_900_000,
      headersTimeout: 1_900_000,
      connect: {
        autoSelectFamily: false,
        autoSelectFamilyAttemptTimeout: 300,
      },
    });
    expect(undiciGlobalDispatcherModule._globalUndiciStreamTimeoutMs).toBe(1_900_000);
>>>>>>> upstream/main
  });

  it("replaces EnvHttpProxyAgent dispatcher while preserving env-proxy mode", () => {
    getDefaultAutoSelectFamily.mockReturnValue(false);
<<<<<<< HEAD
=======
    vi.mocked(hasEnvHttpProxyAgentConfigured).mockReturnValue(true);
>>>>>>> upstream/main
    setCurrentDispatcher(new EnvHttpProxyAgent());

    ensureGlobalUndiciStreamTimeouts();

    expect(setGlobalDispatcher).toHaveBeenCalledTimes(1);
    const next = getCurrentDispatcher() as { options?: Record<string, unknown> };
    expect(next).toBeInstanceOf(EnvHttpProxyAgent);
    expect(next.options?.bodyTimeout).toBe(DEFAULT_UNDICI_STREAM_TIMEOUT_MS);
    expect(next.options?.headersTimeout).toBe(DEFAULT_UNDICI_STREAM_TIMEOUT_MS);
    expect(next.options?.connect).toEqual({
      autoSelectFamily: false,
      autoSelectFamilyAttemptTimeout: 300,
    });
  });

  it("preserves explicit env proxy options when replacing EnvHttpProxyAgent dispatcher", () => {
<<<<<<< HEAD
=======
    vi.mocked(hasEnvHttpProxyAgentConfigured).mockReturnValue(true);
>>>>>>> upstream/main
    vi.mocked(resolveEnvHttpProxyAgentOptions).mockReturnValue({
      httpProxy: "socks5://proxy.test:1080",
      httpsProxy: "socks5://proxy.test:1080",
    });
    setCurrentDispatcher(new EnvHttpProxyAgent());

    ensureGlobalUndiciStreamTimeouts();

    expect(setGlobalDispatcher).toHaveBeenCalledTimes(1);
    const next = getCurrentDispatcher() as { options?: Record<string, unknown> };
    expect(next).toBeInstanceOf(EnvHttpProxyAgent);
    expect(next.options).toEqual(
      expect.objectContaining({
        httpProxy: "socks5://proxy.test:1080",
        httpsProxy: "socks5://proxy.test:1080",
        bodyTimeout: DEFAULT_UNDICI_STREAM_TIMEOUT_MS,
        headersTimeout: DEFAULT_UNDICI_STREAM_TIMEOUT_MS,
      }),
    );
  });

  it("records timeout bridge but does not override unsupported custom proxy dispatcher types", () => {
    setCurrentDispatcher(new ProxyAgent("http://proxy.test:8080"));

    ensureGlobalUndiciStreamTimeouts({ timeoutMs: 1_900_000 });

    expect(setGlobalDispatcher).not.toHaveBeenCalled();
    expect(undiciGlobalDispatcherModule._globalUndiciStreamTimeoutMs).toBe(1_900_000);
  });

  it("is idempotent for unchanged dispatcher kind and network policy", () => {
    getDefaultAutoSelectFamily.mockReturnValue(true);
<<<<<<< HEAD
=======
    vi.mocked(hasEnvHttpProxyAgentConfigured).mockReturnValue(true);
    setCurrentDispatcher(new EnvHttpProxyAgent());
>>>>>>> upstream/main

    ensureGlobalUndiciStreamTimeouts();
    ensureGlobalUndiciStreamTimeouts();

    expect(setGlobalDispatcher).toHaveBeenCalledTimes(1);
  });

  it("does not lower global stream timeouts below the default floor", () => {
    ensureGlobalUndiciStreamTimeouts({ timeoutMs: 15_000 });

<<<<<<< HEAD
    expect(setGlobalDispatcher).toHaveBeenCalledTimes(1);
    const next = getCurrentDispatcher() as { options?: Record<string, unknown> };
    expect(next.options?.bodyTimeout).toBe(DEFAULT_UNDICI_STREAM_TIMEOUT_MS);
    expect(next.options?.headersTimeout).toBe(DEFAULT_UNDICI_STREAM_TIMEOUT_MS);
=======
    expect(loadUndiciGlobalDispatcherDeps).not.toHaveBeenCalled();
    expect(setGlobalDispatcher).not.toHaveBeenCalled();
    expect(undiciGlobalDispatcherModule._globalUndiciStreamTimeoutMs).toBe(
      DEFAULT_UNDICI_STREAM_TIMEOUT_MS,
    );
>>>>>>> upstream/main
  });

  it("honors explicit global stream timeouts above the default floor", () => {
    const timeoutMs = DEFAULT_UNDICI_STREAM_TIMEOUT_MS + 1_000;

    ensureGlobalUndiciStreamTimeouts({ timeoutMs });

<<<<<<< HEAD
    expect(setGlobalDispatcher).toHaveBeenCalledTimes(1);
    const next = getCurrentDispatcher() as { options?: Record<string, unknown> };
    expect(next.options?.bodyTimeout).toBe(timeoutMs);
    expect(next.options?.headersTimeout).toBe(timeoutMs);
  });

  it("re-applies when autoSelectFamily decision changes", () => {
=======
    expect(loadUndiciGlobalDispatcherDeps).not.toHaveBeenCalled();
    expect(setGlobalDispatcher).not.toHaveBeenCalled();
    expect(undiciGlobalDispatcherModule._globalUndiciStreamTimeoutMs).toBe(timeoutMs);
  });

  it("re-applies when autoSelectFamily decision changes", () => {
    vi.mocked(hasEnvHttpProxyAgentConfigured).mockReturnValue(true);
    setCurrentDispatcher(new EnvHttpProxyAgent());
>>>>>>> upstream/main
    getDefaultAutoSelectFamily.mockReturnValue(true);
    ensureGlobalUndiciStreamTimeouts();

    getDefaultAutoSelectFamily.mockReturnValue(false);
    ensureGlobalUndiciStreamTimeouts();

    expect(setGlobalDispatcher).toHaveBeenCalledTimes(2);
    const next = getCurrentDispatcher() as { options?: Record<string, unknown> };
    expect(next.options?.connect).toEqual({
      autoSelectFamily: false,
      autoSelectFamilyAttemptTimeout: 300,
    });
  });

  it("disables autoSelectFamily on WSL2 to avoid IPv6 connectivity issues", () => {
    getDefaultAutoSelectFamily.mockReturnValue(true);
    vi.mocked(isWSL2Sync).mockReturnValue(true);
<<<<<<< HEAD
=======
    vi.mocked(hasEnvHttpProxyAgentConfigured).mockReturnValue(true);
    setCurrentDispatcher(new EnvHttpProxyAgent());
>>>>>>> upstream/main

    ensureGlobalUndiciStreamTimeouts();

    expect(setGlobalDispatcher).toHaveBeenCalledTimes(1);
    const next = getCurrentDispatcher() as { options?: Record<string, unknown> };
<<<<<<< HEAD
    expect(next).toBeInstanceOf(Agent);
=======
    expect(next).toBeInstanceOf(EnvHttpProxyAgent);
>>>>>>> upstream/main
    expect(next.options?.connect).toEqual({
      autoSelectFamily: false,
      autoSelectFamilyAttemptTimeout: 300,
    });
  });
});

describe("ensureGlobalUndiciEnvProxyDispatcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetGlobalUndiciStreamTimeoutsForTests();
    setCurrentDispatcher(new Agent());
    vi.mocked(hasEnvHttpProxyAgentConfigured).mockReturnValue(false);
    vi.mocked(resolveEnvHttpProxyAgentOptions).mockReturnValue(undefined);
  });

  it("installs EnvHttpProxyAgent when env HTTP proxy is configured on a default Agent", () => {
    vi.mocked(hasEnvHttpProxyAgentConfigured).mockReturnValue(true);

    ensureGlobalUndiciEnvProxyDispatcher();

    expect(setGlobalDispatcher).toHaveBeenCalledTimes(1);
    expect(getCurrentDispatcher()).toBeInstanceOf(EnvHttpProxyAgent);
  });

  it("installs EnvHttpProxyAgent with explicit ALL_PROXY fallback options", () => {
    vi.mocked(hasEnvHttpProxyAgentConfigured).mockReturnValue(true);
    vi.mocked(resolveEnvHttpProxyAgentOptions).mockReturnValue({
      httpProxy: "socks5://proxy.test:1080",
      httpsProxy: "socks5://proxy.test:1080",
    });

    ensureGlobalUndiciEnvProxyDispatcher();

    expect(setGlobalDispatcher).toHaveBeenCalledTimes(1);
    const next = getCurrentDispatcher() as { options?: Record<string, unknown> };
    expect(next).toBeInstanceOf(EnvHttpProxyAgent);
    expect(next.options).toEqual({
      httpProxy: "socks5://proxy.test:1080",
      httpsProxy: "socks5://proxy.test:1080",
    });
  });

  it("does not override unsupported custom proxy dispatcher types", () => {
    vi.mocked(hasEnvHttpProxyAgentConfigured).mockReturnValue(true);
    setCurrentDispatcher(new ProxyAgent("http://proxy.test:8080"));

    ensureGlobalUndiciEnvProxyDispatcher();

    expect(setGlobalDispatcher).not.toHaveBeenCalled();
  });

  it("retries proxy bootstrap after an unsupported dispatcher later becomes a default Agent", () => {
    vi.mocked(hasEnvHttpProxyAgentConfigured).mockReturnValue(true);
    setCurrentDispatcher(new ProxyAgent("http://proxy.test:8080"));

    ensureGlobalUndiciEnvProxyDispatcher();
    expect(setGlobalDispatcher).not.toHaveBeenCalled();

    setCurrentDispatcher(new Agent());
    ensureGlobalUndiciEnvProxyDispatcher();

    expect(setGlobalDispatcher).toHaveBeenCalledTimes(1);
    expect(getCurrentDispatcher()).toBeInstanceOf(EnvHttpProxyAgent);
  });

  it("is idempotent after proxy bootstrap succeeds", () => {
    vi.mocked(hasEnvHttpProxyAgentConfigured).mockReturnValue(true);

    ensureGlobalUndiciEnvProxyDispatcher();
    ensureGlobalUndiciEnvProxyDispatcher();

    expect(setGlobalDispatcher).toHaveBeenCalledTimes(1);
  });

  it("reinstalls env proxy if an external change later reverts the dispatcher to Agent", () => {
    vi.mocked(hasEnvHttpProxyAgentConfigured).mockReturnValue(true);

    ensureGlobalUndiciEnvProxyDispatcher();
    expect(setGlobalDispatcher).toHaveBeenCalledTimes(1);

    setCurrentDispatcher(new Agent());
    ensureGlobalUndiciEnvProxyDispatcher();

    expect(setGlobalDispatcher).toHaveBeenCalledTimes(2);
    expect(getCurrentDispatcher()).toBeInstanceOf(EnvHttpProxyAgent);
  });
});

describe("forceResetGlobalDispatcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetGlobalUndiciStreamTimeoutsForTests();
    vi.mocked(hasEnvHttpProxyAgentConfigured).mockReturnValue(false);
    vi.mocked(resolveEnvHttpProxyAgentOptions).mockReturnValue(undefined);
  });

<<<<<<< HEAD
  it("replaces an EnvHttpProxyAgent with a direct Agent when proxy env is cleared", () => {
=======
  it("does not import undici when proxy env is cleared", () => {
>>>>>>> upstream/main
    setCurrentDispatcher(new EnvHttpProxyAgent());

    forceResetGlobalDispatcher();

<<<<<<< HEAD
=======
    expect(loadUndiciGlobalDispatcherDeps).not.toHaveBeenCalled();
    expect(setGlobalDispatcher).not.toHaveBeenCalled();
  });

  it("restores a direct Agent when clearing a proxy dispatcher installed by OpenClaw", () => {
    vi.mocked(hasEnvHttpProxyAgentConfigured).mockReturnValue(true);
    ensureGlobalUndiciEnvProxyDispatcher();
    expect(getCurrentDispatcher()).toBeInstanceOf(EnvHttpProxyAgent);

    vi.clearAllMocks();
    vi.mocked(hasEnvHttpProxyAgentConfigured).mockReturnValue(false);

    forceResetGlobalDispatcher();

    expect(loadUndiciGlobalDispatcherDeps).toHaveBeenCalledTimes(1);
>>>>>>> upstream/main
    expect(setGlobalDispatcher).toHaveBeenCalledTimes(1);
    expect(getCurrentDispatcher()).toBeInstanceOf(Agent);
  });

  it("replaces a stale EnvHttpProxyAgent when restored proxy env is still configured", () => {
    vi.mocked(hasEnvHttpProxyAgentConfigured).mockReturnValue(true);
    vi.mocked(resolveEnvHttpProxyAgentOptions).mockReturnValue({
      httpProxy: "http://proxy-b.example:8080",
      httpsProxy: "http://proxy-b.example:8080",
    });
    setCurrentDispatcher(new EnvHttpProxyAgent());

    forceResetGlobalDispatcher();

    expect(setGlobalDispatcher).toHaveBeenCalledTimes(1);
    expect(getCurrentDispatcher()).toBeInstanceOf(EnvHttpProxyAgent);
    expect((getCurrentDispatcher() as { options?: Record<string, unknown> }).options).toEqual({
      httpProxy: "http://proxy-b.example:8080",
      httpsProxy: "http://proxy-b.example:8080",
    });
  });

  it("preserves ALL_PROXY-only EnvHttpProxyAgent options when resetting", () => {
    vi.mocked(hasEnvHttpProxyAgentConfigured).mockReturnValue(true);
    vi.mocked(resolveEnvHttpProxyAgentOptions).mockReturnValue({
      httpProxy: "http://proxy-all.example:3128",
      httpsProxy: "http://proxy-all.example:3128",
    });
    setCurrentDispatcher(new EnvHttpProxyAgent());

    forceResetGlobalDispatcher();

    expect(setGlobalDispatcher).toHaveBeenCalledTimes(1);
    expect(getCurrentDispatcher()).toBeInstanceOf(EnvHttpProxyAgent);
    expect((getCurrentDispatcher() as { options?: Record<string, unknown> }).options).toEqual({
      httpProxy: "http://proxy-all.example:3128",
      httpsProxy: "http://proxy-all.example:3128",
    });
  });
});

afterAll(() => {
  for (const id of mockedModuleIds) {
    vi.doUnmock(id);
  }
});
