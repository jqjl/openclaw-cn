<<<<<<< HEAD
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadOpenClawPlugins } from "./loader.js";

describe("source checkout bundled plugin runtime", () => {
  it("loads enabled bundled plugins from built dist or source checkout", () => {
    const registry = loadOpenClawPlugins({
      cache: false,
      onlyPluginIds: ["twitch"],
      config: {
        plugins: {
          entries: {
            twitch: { enabled: true },
=======
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { setBundledPluginsDirOverrideForTest } from "./bundled-dir.js";
import { loadOpenClawPlugins } from "./loader.js";

describe("source checkout bundled plugin runtime", () => {
  beforeEach(() => {
    setBundledPluginsDirOverrideForTest(path.join(process.cwd(), "extensions"));
  });

  afterEach(() => {
    setBundledPluginsDirOverrideForTest(undefined);
  });

  it("loads enabled bundled plugins from source checkout", () => {
    const registry = loadOpenClawPlugins({
      cache: false,
      onlyPluginIds: ["tokenjuice"],
      config: {
        plugins: {
          entries: {
            tokenjuice: { enabled: true },
>>>>>>> upstream/main
          },
        },
      },
    });

<<<<<<< HEAD
    const twitch = registry.plugins.find((plugin) => plugin.id === "twitch");
    expect(twitch).toMatchObject({
=======
    const tokenjuice = registry.plugins.find((plugin) => plugin.id === "tokenjuice");
    expect(tokenjuice).toMatchObject({
>>>>>>> upstream/main
      status: "loaded",
      origin: "bundled",
    });

<<<<<<< HEAD
    const builtRuntime = path.join(process.cwd(), "dist", "extensions", "twitch", "index.js");
    const expectedRuntime = fs.existsSync(builtRuntime)
      ? `${path.sep}dist${path.sep}extensions${path.sep}twitch${path.sep}index.js`
      : `${path.sep}extensions${path.sep}twitch${path.sep}index.ts`;
    const expectedRoot = fs.existsSync(builtRuntime)
      ? `${path.sep}dist${path.sep}extensions${path.sep}twitch`
      : `${path.sep}extensions${path.sep}twitch`;

    expect(twitch?.source).toContain(expectedRuntime);
    expect(twitch?.rootDir).toContain(expectedRoot);
=======
    const expectedRuntime = `${path.sep}extensions${path.sep}tokenjuice${path.sep}index.ts`;
    const expectedRoot = `${path.sep}extensions${path.sep}tokenjuice`;

    expect(tokenjuice?.source).toContain(expectedRuntime);
    expect(tokenjuice?.rootDir).toContain(expectedRoot);
>>>>>>> upstream/main
  });
});
