---
summary: "CI job graph, scope gates, and local command equivalents"
title: CI pipeline
read_when:
  - You need to understand why a CI job did or did not run
  - You are debugging failing GitHub Actions checks
---

The CI runs on every push to `main` and every pull request. It uses smart scoping to skip expensive jobs when only unrelated areas changed. Manual `workflow_dispatch` runs intentionally bypass smart scoping and fan out the full normal CI graph for release candidates or broad validation, with Android lanes opt-in through `include_android` for standalone manual runs. Release-only plugin prerelease lanes live in the separate `Plugin Prerelease` workflow and run only from `Full Release Validation` or an explicit manual dispatch.

The `check-dependencies` shard runs `pnpm deadcode:dependencies`, a production Knip dependency-only pass pinned to the latest Knip version used by that script, with pnpm's minimum release age disabled for the `dlx` install. It gates newly unused, unlisted, unresolved, binary, or catalog dependencies without enabling Knip's full unused-file mode, which remains a manual audit because OpenClaw intentionally loads many plugin and runtime surfaces through manifests and string specifiers.

`Full Release Validation` is the manual umbrella workflow for "run everything
before release." It accepts a branch, tag, or full commit SHA, dispatches the
manual `CI` workflow with that target, dispatches `Plugin Prerelease` for
release-only plugin/package/static/Docker proof, and dispatches
`OpenClaw Release Checks` for install smoke, package acceptance, Docker
release-path suites, live/E2E, OpenWebUI, QA Lab parity, Matrix, and Telegram
lanes. It can also run the post-publish `NPM Telegram Beta E2E` workflow when a
published package spec is provided. `release_profile=minimum|stable|full` controls the live/provider
breadth passed into release checks: `minimum` keeps the fastest OpenAI/core
release-critical lanes, `stable` adds the stable provider/backend set, and
`full` runs the broad advisory provider/media matrix. The umbrella records the
dispatched child run ids, and the final `Verify full validation` job re-checks
the current child run conclusions and appends slowest-job tables for each child
run. If a child workflow is rerun and turns green, rerun only the parent
verifier job to refresh the umbrella result and timing summary.

For recovery, `Full Release Validation` and `OpenClaw Release Checks` both
accept `rerun_group`. Use `all` for a release candidate, `ci` for only the
normal full CI child, `release-checks` for every release child, or a narrower
release group: `install-smoke`, `cross-os`, `live-e2e`, `package`, `qa`,
`qa-parity`, `qa-live`, or `npm-telegram` on the umbrella. This keeps a failed
release box rerun bounded after a focused fix.

The release live/E2E child keeps broad native `pnpm test:live` coverage, but it
runs it as named shards (`native-live-src-agents`,
`native-live-src-gateway-core`, provider-filtered
`native-live-src-gateway-profiles` jobs,
`native-live-src-gateway-backends`, `native-live-test`,
`native-live-extensions-a-k`, `native-live-extensions-l-n`,
`native-live-extensions-openai`, `native-live-extensions-o-z-other`,
`native-live-extensions-xai`, split media audio/video shards, and
provider-filtered music shards) through `scripts/test-live-shard.mjs` instead
of one serial job. That keeps the same file coverage while making slow live
provider failures easier to rerun and diagnose. The aggregate
`native-live-extensions-o-z`, `native-live-extensions-media`, and
`native-live-extensions-media-music` shard names remain valid for manual
one-shot reruns.

The native live media shards run in
`ghcr.io/openclaw/openclaw-live-media-runner:ubuntu-24.04`, built by the
`Live Media Runner Image` workflow. That image preinstalls `ffmpeg` and
`ffprobe`; media jobs only verify the binaries before setup. Keep Docker-backed
live suites on normal Blacksmith runners, because container jobs are the wrong
place to launch nested Docker tests.

Docker-backed live model/backend shards use a separate shared
`ghcr.io/openclaw/openclaw-live-test:<sha>` image per selected commit. The live
release workflow builds and pushes that image once, then the Docker live model,
gateway, CLI backend, ACP bind, and Codex harness shards run with
`OPENCLAW_SKIP_DOCKER_BUILD=1`. If those shards rebuild the full source Docker
target independently, the release run is misconfigured and will waste the wall
clock on duplicate image builds.

`OpenClaw Release Checks` uses the trusted workflow ref to resolve the selected
ref once into a `release-package-under-test` tarball, then passes that artifact
to both the live/E2E release-path Docker workflow and the package acceptance
shard. That keeps the package bytes consistent across release boxes and avoids
repacking the same candidate in multiple child jobs.

`Package Acceptance` is the side-run workflow for validating a package artifact
without blocking the release workflow. It resolves one candidate from a
published npm spec, a trusted `package_ref` built with the selected
`workflow_ref` harness, an HTTPS tarball URL with SHA-256, or a tarball artifact
from another GitHub Actions run, uploads it as `package-under-test`, then reuses
the Docker release/E2E scheduler with that tarball instead of repacking the
workflow checkout. Profiles cover smoke, package, product, full, and custom
Docker lane selections. The `package` profile uses offline plugin coverage so
published-package validation is not gated on live ClawHub availability. The
optional Telegram lane reuses the
`package-under-test` artifact in the `NPM Telegram Beta E2E` workflow, with the
published npm spec path kept for standalone dispatches.

## Package acceptance

Use `Package Acceptance` when the question is "does this installable OpenClaw
package work as a product?" It is different from normal CI: normal CI validates
the source tree, while package acceptance validates a single tarball through the
same Docker E2E harness users exercise after install or update.

The workflow has four jobs:

1. `resolve_package` checks out `workflow_ref`, resolves one package candidate,
   writes `.artifacts/docker-e2e-package/openclaw-current.tgz`, writes
   `.artifacts/docker-e2e-package/package-candidate.json`, uploads both as the
   `package-under-test` artifact, and prints the source, workflow ref, package
   ref, version, SHA-256, and profile in the GitHub step summary.
2. `docker_acceptance` calls
   `openclaw-live-and-e2e-checks-reusable.yml` with `ref=workflow_ref` and
   `package_artifact_name=package-under-test`. The reusable workflow downloads
   that artifact, validates the tarball inventory, prepares package-digest
   Docker images when needed, and runs the selected Docker lanes against that
   package instead of packing the workflow checkout. When a profile selects
   multiple targeted `docker_lanes`, the reusable workflow prepares the package
   and shared images once, then fans those lanes out as parallel targeted Docker
   jobs with unique artifacts.
3. `package_telegram` optionally calls `NPM Telegram Beta E2E`. It runs when
   `telegram_mode` is not `none` and installs the same `package-under-test`
   artifact when Package Acceptance resolved one; standalone Telegram dispatch
   can still install a published npm spec.
4. `summary` fails the workflow if package resolution, Docker acceptance, or
   the optional Telegram lane failed.

Candidate sources:

- `source=npm`: accepts only `openclaw@beta`, `openclaw@latest`, or an exact
  OpenClaw release version such as `openclaw@2026.4.27-beta.2`. Use this for
  published beta/stable acceptance.
- `source=ref`: packs a trusted `package_ref` branch, tag, or full commit SHA.
  The resolver fetches OpenClaw branches/tags, verifies the selected commit is
  reachable from repository branch history or a release tag, installs deps in a
  detached worktree, and packs it with `scripts/package-openclaw-for-docker.mjs`.
- `source=url`: downloads an HTTPS `.tgz`; `package_sha256` is required.
- `source=artifact`: downloads one `.tgz` from `artifact_run_id` and
  `artifact_name`; `package_sha256` is optional but should be supplied for
  externally shared artifacts.

Keep `workflow_ref` and `package_ref` separate. `workflow_ref` is the trusted
workflow/harness code that runs the test. `package_ref` is the source commit
that gets packed when `source=ref`. This lets the current test harness validate
older trusted source commits without running old workflow logic.

Profiles map to Docker coverage:

- `smoke`: `npm-onboard-channel-agent`, `gateway-network`, `config-reload`
- `package`: `npm-onboard-channel-agent`, `doctor-switch`,
  `update-channel-switch`, `bundled-channel-deps-compat`, `plugins-offline`,
  `plugin-update`
- `product`: `package` plus `mcp-channels`, `cron-mcp-cleanup`,
  `openai-web-search-minimal`, `openwebui`
- `full`: full Docker release-path chunks with OpenWebUI
- `custom`: exact `docker_lanes`; required when `suite_profile=custom`

Release checks call Package Acceptance with `source=ref`,
`package_ref=<release-ref>`, `workflow_ref=<release workflow ref>`,
`suite_profile=custom`,
`docker_lanes='bundled-channel-deps-compat plugins-offline'`, and
`telegram_mode=mock-openai`. The release-path Docker
chunks cover the overlapping package/update/plugin lanes, while Package
Acceptance keeps the artifact-native bundled-channel compat, offline plugin, and
Telegram proof against the same resolved package tarball.
Cross-OS release checks still cover OS-specific onboarding, installer, and
platform behavior; package/update product validation should start with Package
Acceptance. The Windows packaged and installer fresh lanes also verify that an
installed package can import a browser-control override from a raw absolute
Windows path.

Package Acceptance has bounded legacy-compatibility windows for already
published packages. Packages through `2026.4.25`, including `2026.4.25-beta.*`,
may use the compatibility path for known private QA entries in
`dist/postinstall-inventory.json` that point at tarball-omitted files,
`doctor-switch` may skip the `gateway install --wrapper` persistence subcase
when the package does not expose that flag, `update-channel-switch` may prune
missing `pnpm.patchedDependencies` from the tarball-derived fake git fixture and
may log missing persisted `update.channel`, plugin smokes may read legacy
install-record locations or accept missing marketplace install-record
persistence, and `plugin-update` may allow config metadata migration while still
requiring the install record and no-reinstall behavior to stay unchanged. The
published `2026.4.26` package may also warn for local build metadata stamp files
that were already shipped. Later packages must satisfy the modern contracts; the
same conditions fail instead of warn or skip.

Examples:

```bash
# Validate the current beta package with product-level coverage.
gh workflow run package-acceptance.yml \
  --ref main \
  -f workflow_ref=main \
  -f source=npm \
  -f package_spec=openclaw@beta \
  -f suite_profile=product \
  -f telegram_mode=mock-openai

# Pack and validate a release branch with the current harness.
gh workflow run package-acceptance.yml \
  --ref main \
  -f workflow_ref=main \
  -f source=ref \
  -f package_ref=release/YYYY.M.D \
  -f suite_profile=package \
  -f telegram_mode=mock-openai

# Validate a tarball URL. SHA-256 is mandatory for source=url.
gh workflow run package-acceptance.yml \
  --ref main \
  -f workflow_ref=main \
  -f source=url \
  -f package_url=https://example.com/openclaw-current.tgz \
  -f package_sha256=<64-char-sha256> \
  -f suite_profile=smoke

# Reuse a tarball uploaded by another Actions run.
gh workflow run package-acceptance.yml \
  --ref main \
  -f workflow_ref=main \
  -f source=artifact \
  -f artifact_run_id=<run-id> \
  -f artifact_name=package-under-test \
  -f suite_profile=custom \
  -f docker_lanes='install-e2e plugin-update'
```

When debugging a failed package acceptance run, start at the `resolve_package`
summary to confirm the package source, version, and SHA-256. Then inspect the
`docker_acceptance` child run and its Docker artifacts:
`.artifacts/docker-tests/**/summary.json`, `failures.json`, lane logs, phase
timings, and rerun commands. Prefer rerunning the failed package profile or
exact Docker lanes instead of rerunning full release validation.

## Job Overview

| Job                              | Purpose                                                                                      | When it runs                        |
| -------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------- |
| `preflight`                      | Detect docs-only changes, changed scopes, changed extensions, and build the CI manifest      | Always on non-draft pushes and PRs  |
| `security-scm-fast`              | Private key detection and workflow audit via `zizmor`                                        | Always on non-draft pushes and PRs  |
| `security-dependency-audit`      | Dependency-free production lockfile audit against npm advisories                             | Always on non-draft pushes and PRs  |
| `security-fast`                  | Required aggregate for the fast security jobs                                                | Always on non-draft pushes and PRs  |
| `build-artifacts`                | Build `dist/` and the Control UI once, upload reusable artifacts for downstream jobs         | Node-relevant changes               |
| `checks-fast-core`               | Fast Linux correctness lanes such as bundled/plugin-contract/protocol checks                 | Node-relevant changes               |
| `checks-fast-contracts-channels` | Sharded channel contract checks with a stable aggregate check result                         | Node-relevant changes               |
| `checks-node-extensions`         | Full bundled-plugin test shards across the extension suite                                   | Node-relevant changes               |
| `checks-node-core-test`          | Core Node test shards, excluding channel, bundled, contract, and extension lanes             | Node-relevant changes               |
| `extension-fast`                 | Focused tests for only the changed bundled plugins                                           | When extension changes are detected |
| `check`                          | Sharded main local gate equivalent: prod types, lint, guards, test types, and strict smoke   | Node-relevant changes               |
| `check-additional`               | Architecture, boundary, extension-surface guards, package-boundary, and gateway-watch shards | Node-relevant changes               |
| `build-smoke`                    | Built-CLI smoke tests and startup-memory smoke                                               | Node-relevant changes               |
| `checks`                         | Remaining Linux Node lanes: channel tests and push-only Node 22 compatibility                | Node-relevant changes               |
| `check-docs`                     | Docs formatting, lint, and broken-link checks                                                | Docs changed                        |
| `skills-python`                  | Ruff + pytest for Python-backed skills                                                       | Python-skill-relevant changes       |
| `checks-windows`                 | Windows-specific test lanes                                                                  | Windows-relevant changes            |
| `macos-node`                     | macOS TypeScript test lane using the shared built artifacts                                  | macOS-relevant changes              |
| `macos-swift`                    | Swift lint, build, and tests for the macOS app                                               | macOS-relevant changes              |
| `android`                        | Android build and test matrix                                                                | Android-relevant changes            |

The `CodeQL Android Critical Security` workflow is the scheduled Android
security shard. It builds the Android app manually for CodeQL on the smallest
Blacksmith Linux runner label accepted by workflow sanity and uploads results
under the `/codeql-critical-security/android` category.

The `CodeQL macOS Critical Security` workflow is the weekly/manual macOS
security shard. It builds the macOS app manually for CodeQL on Blacksmith macOS,
filters dependency build results out of the uploaded SARIF, and uploads results
under the `/codeql-critical-security/macos` category. Keep it outside the daily
default workflow because the macOS build dominates runtime even when clean.

The `CodeQL Critical Quality` workflow is the matching non-security shard. It
runs only error-severity, non-security JavaScript/TypeScript quality queries
over narrow high-value surfaces on the smaller Blacksmith Linux runner. Its
core-auth-secrets job scans auth, secrets, sandbox, cron, and gateway security
boundary code under the separate `/codeql-critical-quality/core-auth-secrets`
category. The config-boundary
job scans config schema, migration, normalization, and IO contracts under the
separate `/codeql-critical-quality/config-boundary` category. The
gateway-runtime-boundary job scans gateway protocol schemas and server method
contracts under the separate
`/codeql-critical-quality/gateway-runtime-boundary` category. The
channel-runtime-boundary job scans core channel implementation contracts under
the separate `/codeql-critical-quality/channel-runtime-boundary` category. The
agent-runtime-boundary job scans command execution, model/provider dispatch,
auto-reply dispatch and queues, and ACP control-plane runtime contracts under
the separate `/codeql-critical-quality/agent-runtime-boundary` category. The
mcp-process-runtime-boundary job scans MCP servers and tool bridges, process
supervision helpers, and outbound delivery contracts under the separate
`/codeql-critical-quality/mcp-process-runtime-boundary` category. The
memory-runtime-boundary job scans the memory host SDK, memory runtime facades,
memory Plugin SDK aliases, memory runtime activation glue, and memory doctor
commands under the separate `/codeql-critical-quality/memory-runtime-boundary`
category. The
ui-control-plane job scans Control UI bootstrap, local persistence, gateway
control flows, and task control-plane runtime contracts under the separate
`/codeql-critical-quality/ui-control-plane` category. The
web-media-runtime-boundary job scans core web fetch/search, media IO, media
understanding, image-generation, and media-generation runtime contracts under
the separate `/codeql-critical-quality/web-media-runtime-boundary` category. The
plugin-boundary job scans loader, registry, public-surface, and Plugin SDK
entrypoint contracts under a separate `/codeql-critical-quality/plugin-boundary`
category. Keep the workflow separate from security so quality findings can be
scheduled, measured, disabled, or expanded without obscuring security signal.
Swift, Python, and bundled-plugin CodeQL expansion should be added back as
scoped or sharded follow-up work only after the narrow profiles have stable
runtime and signal.

The `Docs Agent` workflow is an event-driven Codex maintenance lane for keeping
existing docs aligned with recently landed changes. It has no pure schedule: a
successful non-bot push CI run on `main` can trigger it, and manual dispatch can
run it directly. Workflow-run invocations skip when `main` has moved on or when
another non-skipped Docs Agent run was created in the last hour. When it runs, it
reviews the commit range from the previous non-skipped Docs Agent source SHA to
current `main`, so one hourly run can cover all main changes accumulated since
the last docs pass.

The `Test Performance Agent` workflow is an event-driven Codex maintenance lane
for slow tests. It has no pure schedule: a successful non-bot push CI run on
`main` can trigger it, but it skips if another workflow-run invocation already
ran or is running that UTC day. Manual dispatch bypasses that daily activity
gate. The lane builds a full-suite grouped Vitest performance report, lets Codex
make only small coverage-preserving test performance fixes instead of broad
refactors, then reruns the full-suite report and rejects changes that reduce the
passing baseline test count. If the baseline has failing tests, Codex may fix
only obvious failures and the after-agent full-suite report must pass before
anything is committed. When `main` advances before the bot push lands, the lane
rebases the validated patch, reruns `pnpm check:changed`, and retries the push;
conflicting stale patches are skipped. It uses GitHub-hosted Ubuntu so the Codex
action can keep the same drop-sudo safety posture as the docs agent.

```bash
gh workflow run duplicate-after-merge.yml \
  -f landed_pr=70532 \
  -f duplicate_prs='70530,70592' \
  -f apply=true
```

## Job overview

| Job                              | Purpose                                                                                      | When it runs                       |
| -------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------- |
| `preflight`                      | Detect docs-only changes, changed scopes, changed extensions, and build the CI manifest      | Always on non-draft pushes and PRs |
| `security-scm-fast`              | Private key detection and workflow audit via `zizmor`                                        | Always on non-draft pushes and PRs |
| `security-dependency-audit`      | Dependency-free production lockfile audit against npm advisories                             | Always on non-draft pushes and PRs |
| `security-fast`                  | Required aggregate for the fast security jobs                                                | Always on non-draft pushes and PRs |
| `build-artifacts`                | Build `dist/`, Control UI, built-artifact checks, and reusable downstream artifacts          | Node-relevant changes              |
| `checks-fast-core`               | Fast Linux correctness lanes such as bundled/plugin-contract/protocol checks                 | Node-relevant changes              |
| `checks-fast-contracts-channels` | Sharded channel contract checks with a stable aggregate check result                         | Node-relevant changes              |
| `checks-node-core-test`          | Core Node test shards, excluding channel, bundled, contract, and extension lanes             | Node-relevant changes              |
| `check`                          | Sharded main local gate equivalent: prod types, lint, guards, test types, and strict smoke   | Node-relevant changes              |
| `check-additional`               | Architecture, boundary, extension-surface guards, package-boundary, and gateway-watch shards | Node-relevant changes              |
| `build-smoke`                    | Built-CLI smoke tests and startup-memory smoke                                               | Node-relevant changes              |
| `checks`                         | Verifier for built-artifact channel tests                                                    | Node-relevant changes              |
| `checks-node-compat-node22`      | Node 22 compatibility build and smoke lane                                                   | Manual CI dispatch for releases    |
| `check-docs`                     | Docs formatting, lint, and broken-link checks                                                | Docs changed                       |
| `skills-python`                  | Ruff + pytest for Python-backed skills                                                       | Python-skill-relevant changes      |
| `checks-windows`                 | Windows-specific process/path tests plus shared runtime import specifier regressions         | Windows-relevant changes           |
| `macos-node`                     | macOS TypeScript test lane using the shared built artifacts                                  | macOS-relevant changes             |
| `macos-swift`                    | Swift lint, build, and tests for the macOS app                                               | macOS-relevant changes             |
| `android`                        | Android unit tests for both flavors plus one debug APK build                                 | Android-relevant changes           |
| `test-performance-agent`         | Daily Codex slow-test optimization after trusted activity                                    | Main CI success or manual dispatch |

Manual CI dispatches run the same job graph as normal CI but force every
non-Android scoped lane on: Linux Node shards, bundled-plugin shards, channel
contracts, Node 22 compatibility, `check`, `check-additional`, build smoke, docs
checks, Python skills, Windows, macOS, and Control UI i18n. Standalone manual CI
dispatches run Android only with `include_android=true`; the full release
umbrella enables Android by passing `include_android=true`. Plugin prerelease
static checks, the release-only `agentic-plugins` shard, the full extension
batch sweep, and plugin prerelease Docker lanes are excluded from CI. The Docker
prerelease suite runs only when `Full Release Validation` dispatches the
separate `Plugin Prerelease` workflow with the release-validation gate enabled.
Manual runs use a
unique concurrency group so a release-candidate full suite is not cancelled by
another push or PR run on the same ref. The optional `target_ref` input lets a
trusted caller run that graph against a branch, tag, or full commit SHA while
using the workflow file from the selected dispatch ref.

```bash
gh workflow run ci.yml --ref release/YYYY.M.D
gh workflow run ci.yml --ref main -f target_ref=<branch-or-sha> -f include_android=true
gh workflow run full-release-validation.yml --ref main -f ref=<branch-or-sha>
```

## Fail-fast order

Jobs are ordered so cheap checks fail before expensive ones run:

1. `preflight` decides which lanes exist at all. The `docs-scope` and `changed-scope` logic are steps inside this job, not standalone jobs.
2. `security-scm-fast`, `security-dependency-audit`, `security-fast`, `check`, `check-additional`, `check-docs`, and `skills-python` fail quickly without waiting on the heavier artifact and platform matrix jobs.
3. `build-artifacts` overlaps with the fast Linux lanes so downstream consumers can start as soon as the shared build is ready.
4. Heavier platform and runtime lanes fan out after that: `checks-fast-core`, `checks-fast-contracts-channels`, `checks-node-extensions`, `checks-node-core-test`, `extension-fast`, `checks`, `checks-windows`, `macos-node`, `macos-swift`, and `android`.

Scope logic lives in `scripts/ci-changed-scope.mjs` and is covered by unit tests in `src/scripts/ci-changed-scope.test.ts`.
The separate `install-smoke` workflow reuses the same scope script through its own `preflight` job. It computes `run_install_smoke` from the narrower changed-smoke signal, so Docker/install smoke only runs for install, packaging, and container-relevant changes.

Local changed-lane logic lives in `scripts/changed-lanes.mjs` and is executed by `scripts/check-changed.mjs`. That local gate is stricter about architecture boundaries than the broad CI platform scope: core production changes run core prod typecheck plus core tests, core test-only changes run only core test typecheck/tests, extension production changes run extension prod typecheck plus extension tests, and extension test-only changes run only extension test typecheck/tests. Public Plugin SDK or plugin-contract changes expand to extension validation because extensions depend on those core contracts. Unknown root/config changes fail safe to all lanes.

Local changed-lane logic lives in `scripts/changed-lanes.mjs` and is executed by `scripts/check-changed.mjs`. That local check gate is stricter about architecture boundaries than the broad CI platform scope: core production changes run core prod and core test typecheck plus core lint/guards, core test-only changes run only core test typecheck plus core lint, extension production changes run extension prod and extension test typecheck plus extension lint, and extension test-only changes run extension test typecheck plus extension lint. Public Plugin SDK or plugin-contract changes expand to extension typecheck because extensions depend on those core contracts, but Vitest extension sweeps are explicit test work. Release metadata-only version bumps run targeted version/config/root-dependency checks. Unknown root/config changes fail safe to all check lanes.
Local changed-test routing lives in `scripts/test-projects.test-support.mjs` and
is intentionally cheaper than `check:changed`: direct test edits run themselves,
source edits prefer explicit mappings, then sibling tests and import-graph
dependents. Shared group-room delivery config is one of the explicit mappings:
changes to the group visible-reply config, source reply delivery mode, or the
message-tool system prompt route through the core reply tests plus Discord and
Slack delivery regressions so a shared default change fails before the first PR
push. Use `OPENCLAW_TEST_CHANGED_BROAD=1 pnpm test:changed` only when the change
is harness-wide enough that the cheap mapped set is not a trustworthy proxy.

The slowest Node test families are split into include-file shards so each job stays small: channel contracts split registry and core coverage into eight weighted shards each, auto-reply reply command tests split into four include-pattern shards, and the other large auto-reply reply prefix groups split into two shards each. `check-additional` also separates package-boundary compile/canary work from runtime topology gateway/architecture work.

GitHub may mark superseded jobs as `cancelled` when a newer push lands on the same PR or `main` ref. Treat that as CI noise unless the newest run for the same ref is also failing. The aggregate shard checks call out this cancellation case explicitly so it is easier to distinguish from a test failure.

## Runners

| Runner                           | Jobs                                                                                                                                                   |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `blacksmith-16vcpu-ubuntu-2404`  | `preflight`, `security-scm-fast`, `security-dependency-audit`, `security-fast`, `build-artifacts`, Linux checks, docs checks, Python skills, `android` |
| `blacksmith-32vcpu-windows-2025` | `checks-windows`                                                                                                                                       |
| `macos-latest`                   | `macos-node`, `macos-swift`                                                                                                                            |

## Local equivalents

```bash
pnpm changed:lanes   # inspect the local changed-lane classifier for origin/main...HEAD
pnpm check:changed   # smart local check gate: changed typecheck/lint/guards by boundary lane
pnpm check          # fast local gate: production tsgo + sharded lint + parallel fast guards
pnpm check:test-types
pnpm check:timed    # same gate with per-stage timings
pnpm build:strict-smoke
pnpm check:architecture
pnpm test:gateway:watch-regression
pnpm test           # vitest tests
pnpm test:changed   # cheap smart changed Vitest targets
pnpm test:channels
pnpm test:contracts:channels
pnpm check:docs     # docs format + lint + broken links
pnpm build          # build dist when CI artifact/build-smoke lanes matter
```

## Related

- [Install overview](/install)
- [Release channels](/install/development-channels)
