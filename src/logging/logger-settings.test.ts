import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

<<<<<<< HEAD
const { readLoggingConfigMock, shouldSkipMutatingLoggingConfigReadMock } = vi.hoisted(() => ({
  readLoggingConfigMock: vi.fn<() => unknown>(() => undefined),
  shouldSkipMutatingLoggingConfigReadMock: vi.fn(() => false),
}));

vi.mock("./config.js", () => ({
  readLoggingConfig: readLoggingConfigMock,
  shouldSkipMutatingLoggingConfigRead: shouldSkipMutatingLoggingConfigReadMock,
}));

=======
>>>>>>> upstream/main
let originalTestFileLog: string | undefined;
let originalOpenClawLogLevel: string | undefined;
let logging: typeof import("../logging.js");

beforeAll(async () => {
  logging = await import("../logging.js");
});

beforeEach(() => {
  originalTestFileLog = process.env.OPENCLAW_TEST_FILE_LOG;
  originalOpenClawLogLevel = process.env.OPENCLAW_LOG_LEVEL;
  delete process.env.OPENCLAW_TEST_FILE_LOG;
  delete process.env.OPENCLAW_LOG_LEVEL;
<<<<<<< HEAD
  readLoggingConfigMock.mockReset();
  readLoggingConfigMock.mockReturnValue(undefined);
  shouldSkipMutatingLoggingConfigReadMock.mockReset();
  shouldSkipMutatingLoggingConfigReadMock.mockReturnValue(false);
=======
>>>>>>> upstream/main
  logging.resetLogger();
  logging.setLoggerOverride(null);
});

afterEach(() => {
  if (originalTestFileLog === undefined) {
    delete process.env.OPENCLAW_TEST_FILE_LOG;
  } else {
    process.env.OPENCLAW_TEST_FILE_LOG = originalTestFileLog;
  }
  if (originalOpenClawLogLevel === undefined) {
    delete process.env.OPENCLAW_LOG_LEVEL;
  } else {
    process.env.OPENCLAW_LOG_LEVEL = originalOpenClawLogLevel;
  }
  logging.resetLogger();
  logging.setLoggerOverride(null);
<<<<<<< HEAD
=======
  logging.setLoggerConfigLoaderForTests();
>>>>>>> upstream/main
  vi.restoreAllMocks();
});

describe("getResolvedLoggerSettings", () => {
  it("uses a silent fast path in default Vitest mode without config reads", () => {
<<<<<<< HEAD
    const settings = logging.getResolvedLoggerSettings();
    expect(settings.level).toBe("silent");
    expect(readLoggingConfigMock).not.toHaveBeenCalled();
=======
    const readLoggingConfig = vi.fn(() => undefined);
    logging.setLoggerConfigLoaderForTests(readLoggingConfig);

    const settings = logging.getResolvedLoggerSettings();

    expect(settings.level).toBe("silent");
    expect(readLoggingConfig).not.toHaveBeenCalled();
>>>>>>> upstream/main
  });

  it("reads logging config when test file logging is explicitly enabled", () => {
    process.env.OPENCLAW_TEST_FILE_LOG = "1";
<<<<<<< HEAD
    readLoggingConfigMock.mockReturnValue({
      level: "debug",
      file: "/tmp/openclaw-configured.log",
      maxFileBytes: 2048,
    });
=======
    logging.setLoggerConfigLoaderForTests(() => ({
      level: "debug",
      file: "/tmp/openclaw-configured.log",
      maxFileBytes: 2048,
    }));
>>>>>>> upstream/main

    const settings = logging.getResolvedLoggerSettings();

    expect(settings).toMatchObject({
      level: "debug",
      file: "/tmp/openclaw-configured.log",
      maxFileBytes: 2048,
    });
  });

<<<<<<< HEAD
  it("uses defaults when config schema skips logging config reads", () => {
    process.env.OPENCLAW_TEST_FILE_LOG = "1";
    shouldSkipMutatingLoggingConfigReadMock.mockReturnValue(true);
=======
  it("uses defaults when no logging config is available", () => {
    process.env.OPENCLAW_TEST_FILE_LOG = "1";
    logging.setLoggerConfigLoaderForTests(() => undefined);
>>>>>>> upstream/main

    const settings = logging.getResolvedLoggerSettings();

    expect(settings.level).toBe("info");
  });
});
