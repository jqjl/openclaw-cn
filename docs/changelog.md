# OpenClaw 中文版 - 更新日志

本文档记录 OpenClaw 官方版本的最新更新，实时同步。

## 🚀 v2026.4.20 (2026年4月20日)

### ✨ 新增功能与改进

- Onboard/wizard: restyle the setup security disclaimer with a single yellow warning banner, section headings and bulleted checklists, and un-dim the note body so key guidance is easy to scan; add a loading spinner during the initial model catalog load so the wizard no longer goes blank while it runs; add an "API key" placeholder to provider API key prompts. (#69553) 感谢 @Patrick-Erichsen.
- Agents/prompts: strengthen the default system prompt and OpenAI GPT-5 overlay with clearer completion bias, live-state checks, weak-result recovery, and verification-before-final guidance.
- Models/costs: support tiered model pricing from cached catalogs and configured models, and include bundled Moonshot Kimi K2.6/K2.5 cost estimates for token-usage reports. (#67605) 感谢 @sliverp.
- Sessions/Maintenance: enforce the built-in entry cap and age prune by default, and prune oversized stores at load time so accumulated cron/executor session backlogs cannot OOM the gateway before the write path runs. (#69404) 感谢 @bobrenze-bot.
- Plugins/tests: reuse plugin loader alias and Jiti config resolution across repeated same-context loads, reducing import-heavy test overhead. (#69316) 感谢 @amknight.
- Cron: split runtime execution state into `jobs-state.json` so `jobs.json` stays stable for git-tracked job definitions. (#63105) 感谢 @Feelw00.
- Agents/compaction: send opt-in start and completion notices during context compaction. (#67830) 感谢 @feniix.
- Moonshot/Kimi: default bundled Moonshot setup, web search, and media-understanding surfaces to `kimi-k2.6` while keeping `kimi-k2.5` available for compatibility. (#69477) 感谢 @scoootscooob.
- Moonshot/Kimi: allow `thinking.keep = "all"` on `moonshot/kimi-k2.6`, and strip it for other Moonshot models or requests where pinned `tool_choice` disables thinking. (#68816) 感谢 @aniaan.
- BlueBubbles/groups: forward per-group `systemPrompt` config into inbound context `GroupSystemPrompt` so configured group-specific behavioral instructions (for example threaded-reply and tapback conventions) are injected on every turn. Supports `"*"` wildcard fallback matching the existing `requireMention` pattern. Closes #60665. (#69198) 感谢 @omarshahine.
- Plugins/tasks: add a detached runtime registration contract so plugin executors can own detached task lifecycle and cancellation without reaching into core task internals. (#68915) 感谢 @mbelinky.
- Terminal/logging: optimize `sanitizeForLog()` by replacing the iterative control-character stripping loop with a single regex pass while preserving the existing ANSI-first sanitization behavior. (#67205) 感谢 @bulutmuf.
- QA/CI: make `openclaw qa suite` and `openclaw qa telegram` fail by default when scenarios fail, add `--allow-failures` for artifact-only runs, and tighten live-lane defaults for CI automation. (#69122) 感谢 @joshavant.
- Mattermost: stream thinking, tool activity, and partial reply text into a single draft preview post that finalizes in place when safe. (#47838) thanks @ninjaa.

### 🐛 问题修复

- Exec/YOLO: stop rejecting gateway-host exec in `security=full` plus `ask=off` mode via the Python/Node script preflight hardening path, so promptless YOLO exec once again runs direct interpreter stdin and heredoc forms such as `node <<'NODE' ... NODE`.
- OpenAI Codex: normalize legacy `openai-completions` transport overrides on default OpenAI/Codex and GitHub Copilot-compatible hosts back to the native Codex Responses transport while leaving custom proxies untouched. (#45304, #42194) 感谢 @dyss1992 and @DeadlySilent.
- Anthropic/plugins: scope Anthropic `api: "anthropic-messages"` defaulting to Anthropic-owned providers, so `openai-codex` and other providers without an explicit `api` no longer get rewritten to the wrong transport. Fixes #64534.
- fix(qqbot): add SSRF guard to direct-upload URL paths in uploadC2CMedia and uploadGroupMedia [AI-assisted]. (#69595) 感谢 @pgondhi987.
- fix(gateway): enforce allowRequestSessionKey gate on template-rendered mapping sessionKeys. (#69381) 感谢 @pgondhi987.
- Browser/Chrome MCP: surface `DevToolsActivePort` attach failures as browser-connectivity errors instead of a generic "waiting for tabs" timeout, and point signed-out fallbacks toward the managed `openclaw` profile.
- Webchat/images: treat inline image attachments as media for empty-turn gating while still ignoring metadata-only blank turns. (#69474) 感谢 @Jaswir.
- Discord/think: only show `adaptive` in `/think` autocomplete for provider/model pairs that actually support provider-managed adaptive thinking, so GPT/OpenAI models no longer advertise an Anthropic-only option.
- Thinking: only expose `max` for models that explicitly support provider max reasoning, and remap stored `max` settings to the largest supported thinking mode when users switch to another model.
- Thinking/UI: drive `/think` options and chat/Sessions pickers from provider-owned thinking profiles, so custom model level sets such as binary `on/off`, Gemini 3 Pro `off/low/high`, Anthropic `adaptive/max`, and OpenAI `xhigh` stay in one runtime contract.
- Gateway/usage: bound the cost usage cache with FIFO eviction so date/range lookups cannot grow unbounded. (#68842) 感谢 @Feelw00.
- OpenAI/Responses: resolve `/think` levels against each GPT model's supported reasoning efforts so `/think off` no longer becomes high reasoning or sends unsupported `reasoning.effort: "none"` payloads.
- Lobster/TaskFlow: allow managed approval resumes to use `approvalId` without a resume token, and persist that id in approval wait state. (#69559) 感谢 @kirkluokun.
- Plugins/startup: install bundled runtime dependencies into each plugin's own runtime directory, reuse source-checkout repair caches after rebuilds, and log only packages that were actually installed so repeated Gateway starts stay quiet once deps are present.
- Plugins/startup: ignore pnpm's `npm_execpath` when repairing bundled plugin runtime dependencies and skip workspace-only package specs so npm-only install flags or local workspace links do not break packaged plugin startup.
- MCP: block interpreter-startup env keys such as `NODE_OPTIONS` for stdio servers while preserving ordinary credential and proxy env vars. (#69540) 感谢 @drobison00.
- Agents/shell: ignore non-interactive placeholder shells like `/usr/bin/false` and `/sbin/nologin`, falling back to `sh` so service-user exec runs no longer exit immediately. (#69308) 感谢 @sk7n4k3d.
- Setup/TUI: relaunch the setup hatch TUI in a fresh process while preserving the configured gateway target and auth source, so onboarding recovers terminal state cleanly without exposing gateway secrets on command-line args. (#69524) 感谢 @shakkernerd.
- Codex: avoid re-exposing the image-generation tool on native vision turns with inbound images, and keep bare image-model overrides on the configured image provider. (#65061) 感谢 @zhulijin1991.
- Sessions/reset: clear auto-sourced model, provider, and auth-profile overrides on `/new` and `/reset` while preserving explicit user selections, so channel sessions stop staying pinned to runtime fallback choices. (#69419) 感谢 @sk7n4k3d.
- Sessions/costs: snapshot `estimatedCostUsd` like token counters so repeated persist paths no longer compound the same run cost by up to dozens of times. (#69403) 感谢 @MrMiaigi.
- OpenAI Codex: route ChatGPT/Codex OAuth Responses requests through the `/backend-api/codex` endpoint so `openai-codex/gpt-5.4` no longer hits the removed `/backend-api/responses` alias. (#69336) 感谢 @mzogithub.
- OpenAI/Responses: omit disabled reasoning payloads when `/think off` is active, so GPT reasoning models no longer receive unsupported `reasoning.effort: "none"` requests. (#61982) 感谢 @a-tokyo.
- Gateway/pairing: treat loopback shared-secret node-host, TUI, and gateway clients as local for pairing decisions, so trusted local tools no longer reconnect as remote clients and fail with `pairing required`. (#69431) 感谢 @SARAMALI15792.
- Active Memory: degrade gracefully when memory recall fails during prompt building, logging a warning and letting the reply continue without memory context instead of failing the whole turn. (#69485) 感谢 @Magicray1217.
- Ollama: add provider-policy defaults for `baseUrl` and `models` so implicit local discovery can run before config validation rejects a minimal Ollama provider config. (#69370) 感谢 @PratikRai0101.
- Agents/model selection: clear transient auto-failover session overrides before each turn so recovered primary models are retried immediately without emitting user-override reset warnings. (#69365) 感谢 @hitesh-github99.
- Auto-reply: apply silent `NO_REPLY` policy per conversation type, so direct chats get a helpful rewritten reply while groups and internal deliveries can remain quiet. (#68644) 感谢 @Takhoffman.
- Telegram/status reactions: honor `messages.removeAckAfterReply` when lifecycle status reactions are enabled, clearing or restoring the reaction after success/error using the configured hold timings. (#68067) 感谢 @poiskgit.
- Web search/plugins: resolve plugin-scoped SecretRef API keys for bundled Exa, Firecrawl, Gemini, Kimi, Perplexity, Tavily, and Grok web-search providers when they are selected through the shared web-search config. (#68424) 感谢 @afurm.
- Telegram/polling: raise the default polling watchdog threshold from 90s to 120s and add configurable `channels.telegram.pollingStallThresholdMs` (also per-account) so long-running Telegram work gets more room before polling is treated as stalled. (#57737) 感谢 @Vitalcheffe.
- Telegram/polling: bound the persisted-offset confirmation `getUpdates` probe with a client-side timeout so a zombie socket cannot hang polling recovery before the runner watchdog starts. (#50368) 感谢 @boticlaw.
- Agents/Pi runner: retry silent `stopReason=error` turns with no output when no side effects ran, so non-frontier providers that briefly return empty error turns get another chance instead of ending the session early. (#68310) 感谢 @Chased1k.
- Plugins/memory: preserve the active memory capability when read-only snapshot plugin loads run, so status and provider discovery paths no longer wipe memory public artifacts. (#69219) 感谢 @zeroaltitude.
- Plugins: keep only the highest-precedence manifest when distinct discovered plugins share an id, so lower-precedence global or workspace duplicates no longer load beside bundled or config-selected plugins. (#41626) 感谢 @Tortes.
- fix(security): block MINIMAX_API_HOST workspace env injection and remove env-driven URL routing [AI-assisted]. (#67300) 感谢 @pgondhi987.
- Cron/delivery: treat explicit `delivery.mode: "none"` runs as not requested even if the runner reports `delivered: false`, so no-delivery cron jobs no longer persist false delivery failures or errors. (#69285) 感谢 @matsuri1987.
- Plugins/install: repair active and default-enabled bundled plugin runtime dependencies before import in packaged installs, so bundled Discord, WhatsApp, Slack, Telegram, and provider plugins work without putting their dependency trees in core.
- BlueBubbles: raise the outbound `/api/v1/message/text` send timeout default from 10s to 30s, and add a configurable `channels.bluebubbles.sendTimeoutMs` (also per-account) so macOS 26 setups where Private API iMessage sends stall for 60+ seconds no longer silently lose messages at the 10s abort. Probes, chat lookups, and health checks keep the shorter 10s default. Fixes #67486. (#69193) 感谢 @omarshahine.
- Agents/bootstrap: budget truncation markers against per-file caps, preserve source content instead of silently wasting bootstrap bytes, and avoid marker-only output in tiny-budget truncation cases. (#69114) 感谢 @BKF-Gitty.
- Context engine/plugins: stop rejecting third-party context engines whose `info.id` differs from the registered plugin slot id. The strict-match contract added in 2026.4.14 broke `lossless-claw` and other plugins whose internal engine id does not equal the slot id they are registered under, producing repeated `info.id must match registered id` lane failures on every turn. Fixes #66601. (#66678) 感谢 @GodsBoy.
- Agents/compaction: rename embedded Pi compaction lifecycle events to `compaction_start` / `compaction_end` so OpenClaw stays aligned with `pi-coding-agent` 0.66.1 event naming. (#67713) 感谢 @mpz4life.
- Security/dotenv: block all `OPENCLAW_*` keys from untrusted workspace `.env` files so workspace-local env loading fails closed for new runtime-control variables instead of silently inheriting them.（#473）
- Gateway/device pairing: restrict non-admin paired-device sessions (device-token auth) to their own pairing list, approve, and reject actions so a paired device cannot enumerate other devices or approve/reject pairing requests authored by another device. Admin and shared-secret operator sessions retain full visibility. (#69375) 感谢 @eleqtrizit.
- Agents/gateway tool: extend the agent-facing `gateway` tool's config mutation guard so model-driven `config.patch` and `config.apply` cannot rewrite operator-trusted paths (sandbox, plugin trust, gateway auth/TLS, hook routing and tokens, SSRF policy, MCP servers, workspace filesystem hardening) and cannot bypass the guard by editing per-agent sandbox, tools, or embedded-Pi overrides in place under `agents.list[]`. (#69377) 感谢 @eleqtrizit.
- Gateway/websocket broadcasts: require `operator.read` (or higher) for chat, agent, and tool-result event frames so pairing-scoped and node-role sessions no longer passively receive session chat content, and scope-gate unknown broadcast events by default. Plugin-defined `plugin.*` broadcasts are scoped to operator.write/admin, and status/transport events (`heartbeat`, `presence`, `tick`, etc.) remain unrestricted. Per-client sequence numbers preserve per-connection monotonicity. (#69373) 感谢 @eleqtrizit.
- Agents/compaction: always reload embedded Pi resources through an explicit loader and reapply reserve-token overrides so runs without extension factories no longer silently lose compaction settings before session start. (#67146) 感谢 @ly85206559.
- Memory-core/dreaming: normalize sweep timestamps and reuse hashed narrative session keys for fallback cleanup so Dreaming narrative sub-sessions stop leaking. (#67023) 感谢 @chiyouYCH.
- Gateway/startup: delay HTTP bind until websocket handlers are attached, so immediate post-startup websocket health/connect probes no longer hit the startup race window. (#43392) 感谢 @dalefrieswthat.
- Codex/app-server: release the session lane when a downstream consumer throws while draining the `turn/completed` notification, so follow-up messages after a Codex plugin reply stop queueing behind a stale lane lock. Fixes #67996. (#69072) 感谢 @ayeshakhalid192007-dev.
- Codex/app-server: default approval handling to `on-request` so Codex harness sessions do not start with overly permissive tool approvals. (#68721) 感谢 @Lucenx9.
- Cron/delivery: keep isolated cron chat delivery tools available, resolve `channel: "last"` targets from the gateway, show delivery previews in `cron list/show`, and avoid duplicate fallback sends after direct message-tool delivery. (#69587) 感谢 @obviyus.
- BlueBubbles: add opt-in `channels.bluebubbles.coalesceSameSenderDms` so a single composed message with text + pasted URL (which Apple splits into two webhooks ~0.8-2.0 s apart) arrives as one agent turn instead of two. When enabled, DM messages that are not linked via `associatedMessageGuid` hash to `dm:<chat>:<sender>` so the inbound debounce window merges them into a single merged turn — including URL-preview balloon events, DM control-command sends (which normally bypass debouncing), and rapid same-sender follow-ups. The default inbound debounce window widens from 500 ms to 2500 ms when the flag is set without an explicit `messages.inbound.byChannel.bluebubbles`, covering the observed Apple split-send cadence. Every source `messageId` folded into the merged view is committed to the inbound dedupe store after processing, so a later MessagePoller replay of any individual source event is recognized as a duplicate. Merged output is bounded (≤4000 chars text with an explicit `…[truncated]` marker, ≤20 attachments, first-plus-latest sampling beyond 10 source entries) so a rapid-fire flood inside the window cannot amplify the downstream prompt. Group chats and existing text+balloon follow-ups continue to key per-message. See [Coalescing split-send DMs](https://docs.openclaw.ai/channels/bluebubbles#coalescing-split-send-dms-command--url-in-one-composition) for scenarios, tuning, and troubleshooting. (#69258) 感谢 @omarshahine.
- Cron/Telegram: key isolated direct-delivery dedupe to each cron execution instead of the reused session id, so recurring Telegram announce runs no longer report delivered while silently skipping later sends. (#69000) 感谢 @obviyus.
- Models/Kimi: default bundled Kimi thinking to off and normalize Anthropic-compatible `thinking` payloads so stale session `/think` state no longer silently re-enables reasoning on Kimi runs. (#68907) 感谢 @frankekn.
- Control UI/cron: keep the runtime-only `last` delivery sentinel from being materialized into persisted cron delivery and failure-alert channel configs when jobs are created or edited. (#68829) 感谢 @tianhaocui.
- OpenAI/Responses: strip orphaned reasoning blocks before outbound Responses API calls so compacted or restored histories no longer fail on standalone reasoning items. (#55787) 感谢 @suboss87.
- Cron/CLI: parse PowerShell-style `--tools` allow-lists the same way as comma-separated input, so `cron add` and `cron edit` no longer persist `exec read write` as one combined tool entry on Windows. (#68858) 感谢 @chen-zhang-cs-code.
- Browser/user-profile: let existing-session `profile="user"` tool calls auto-route to a connected browser node or use explicit `target="node"`, while still honoring explicit `target="host"` pinning.（#48677）
- Discord/slash commands: tolerate partial Discord channel metadata in slash-command and model-picker flows so partial channel objects no longer crash when channel names, topics, or thread parent metadata are unavailable. (#68953) 感谢 @dutifulbob.
- BlueBubbles: consolidate outbound HTTP through a typed `BlueBubblesClient` that resolves the SSRF policy once at construction so image attachments stop getting blocked on localhost and reactions stop getting blocked on private-IP BB deployments. Fixes #34749 and #59722. (#68234) 感谢 @omarshahine.
- Cron/gateway: reject ambiguous announce delivery config at add/update time so invalid multi-channel or target-id provider settings fail early instead of persisting broken cron jobs. (#69015) 感谢 @obviyus.
- Cron/main-session delivery: preserve `heartbeat.target="last"` through deferred wake queuing, gateway wake forwarding, and same-target wake coalescing so queued cron replies still return to the last active chat. (#69021) 感谢 @obviyus.
- Cron/gateway: ignore disabled channels when announce delivery ambiguity is checked, and validate main-session delivery patches against the live cron service default agent so hot-reloaded agent config does not falsely reject valid updates. (#69040) 感谢 @obviyus.
- Matrix/allowlists: hot-reload `dm.allowFrom` and `groupAllowFrom` entries on inbound messages while keeping config removals authoritative, so Matrix allowlist changes no longer require a channel restart to add or revoke a sender. (#68546) 感谢 @johnlanni.
- BlueBubbles: always set `method` explicitly on outbound text sends (`"private-api"` when available, `"apple-script"` otherwise), and prefer Private API on macOS 26 even for plain text. Fixes silent delivery failure on macOS setups without Private API where an omitted `method` let BB Server fall back to version-dependent default behavior that silently drops the message (#64480), and the AppleScript `-1700` error on macOS 26 Tahoe plain text sends (#53159). (#69070) 感谢 @xqing3.
- Matrix/commands: recognize slash commands that are prefixed with the bot's Matrix mention, so room messages like `@bot:server /new` trigger the command path without requiring custom mention regexes. (#68570) 感谢 @nightq and @johnlanni.
- Gateway/pairing: return reason-specific `PAIRING_REQUIRED` details, remediation hints, and request ids so unapproved-device and scope-upgrade failures surface actionable recovery guidance in the CLI and Control UI. (#69227) 感谢 @obviyus.
- Agents/subagents: include requested role and runtime timing on subagent failure payloads so parent agents can correlate failed or timed-out child work. (#68726) 感谢 @BKF-Gitty.
- Gateway/sessions: reject stale agent-scoped sessions after an agent is removed from config while preserving legacy default-agent main-session aliases. (#65986) 感谢 @bittoby.
- Doctor/gateway: surface pending device pairing requests, scope-upgrade approval drift, and stale device-token mismatch repair steps so `openclaw doctor --fix` no longer leaves pairing/auth setup failures unexplained. (#69210) 感谢 @obviyus.
- Cron/isolated-agent: preserve explicit `delivery.mode: "none"` message targets for isolated runs without inheriting implicit `last` routing, so agent-initiated Telegram sends keep their authored destination while bare `mode:none` jobs stay targetless. (#69153) 感谢 @obviyus.
- Cron/isolated-agent: keep `delivery.mode: "none"` account-only or thread-only configs from inheriting a stale implicit recipient, so isolated runs only resolve message routing when the job authored an explicit `to` target. (#69163) 感谢 @obviyus.
- Gateway/TUI: retry session history while the local gateway is still finishing startup, so `openclaw tui` reconnects no longer fail on transient `chat.history unavailable during gateway startup` errors. (#69164) 感谢 @shakkernerd.
- BlueBubbles/reactions: fall back to `love` when an agent reacts with an emoji outside the iMessage tapback set (`love`/`like`/`dislike`/`laugh`/`emphasize`/`question`), so wider-vocabulary model reactions like `👀` still produce a visible tapback instead of failing the whole reaction request. Configured ack reactions still validate strictly via the new `normalizeBlueBubblesReactionInputStrict` path. (#64693) 感谢 @zqchris.
- BlueBubbles: prefer iMessage over SMS when both chats exist for the same handle, honor explicit `sms:` targets, and never silently downgrade iMessage-available recipients. (#61781) 感谢 @rmartin.
- Telegram/setup: require numeric `allowFrom` user IDs during setup instead of offering unsupported `@username` DM resolution, and point operators to `from.id`/`getUpdates` for discovery. (#69191) 感谢 @obviyus.
- GitHub Copilot/onboarding: default GitHub Copilot setup to `claude-opus-4.6` and keep the bundled default model list aligned, so new Copilot setups no longer start on the older `gpt-4o` default. (#69207) 感谢 @obviyus.
- Gateway/status: separate reachability, capability, and read-probe reporting so connect-only or scope-limited sessions no longer look fully healthy, and normalize SSH targets entered as `ssh user@host`. (#69215) 感谢 @obviyus.
- Slack: fix outbound replies failing with "unresolved SecretRef" for accounts configured via `file` or `exec` secret sources; the send path now tolerates the runtime snapshot retaining an unresolved channel SecretRef when a boot-resolved token override is already available. (#68954) 感谢 @openperf.
- Control UI/device pairing: explain scope and role approval upgrades during reconnects, and show requested versus approved access in the Control UI and `openclaw devices` so broader reconnects no longer look like lost pairings. (#69221) 感谢 @obviyus.
- Gateway/Control UI: surface pending scope, role, and device-metadata pairing approvals in auth errors and Control UI hints so broader reconnects no longer look like random auth breakage. (#69226) 感谢 @obviyus.
- Telegram/media: parse lowercase media directives in block replies and preserve outbound attachment filenames, so generated files send once with their original names. (#69641) 感谢 @obviyus.
- Agents/Anthropic: honor explicit `cacheRetention: "long"` for custom `anthropic-messages` endpoints by applying the 1-hour ephemeral cache TTL independently of the Anthropic/Vertex hostname allowlist. Implicit and env-driven long retention still require an allowlisted host. (#67800) 感谢 @MonkeyLeeT.

## 🚀 v2026.4.19-beta.2 (2026年4月19日)

### 🐛 问题修复

- Agents/openai-completions: always send `stream_options.include_usage` on streaming requests, so local and custom OpenAI-compatible backends report real context usage instead of showing 0%. (#68746) 感谢 @kagura-agent.
- Agents/nested lanes: scope nested agent work per target session so a long-running nested run on one session no longer head-of-line blocks unrelated sessions across the gateway. (#67785) 感谢 @stainlu.
- Agents/status: preserve carried-forward session token totals for providers that omit usage metadata, so `/status` and `openclaw sessions` keep showing the last known context usage instead of dropping back to unknown/0%. (#67695) 感谢 @stainlu.
- Install/update: keep legacy update verification compatible with the QA Lab runtime shim, so updating older global installs to beta no longer fails after npm installs the package successfully.

## 🚀 v2026.4.19-beta.1 (2026年4月19日)

### 🐛 问题修复

- Agents/channels: route cross-agent subagent spawns through the target agent's bound channel account while preserving peer and workspace/role-scoped bindings, so child sessions no longer inherit the caller's account in shared rooms, workspaces, or multi-account setups. (#67508) 感谢 @lukeboyett and @gumadeiras.
- Telegram/callbacks: treat permanent callback edit errors as completed updates so stale command pagination buttons no longer wedge the update watermark and block newer Telegram updates. (#68588) 感谢 @Lucenx9.
- Browser/CDP: allow the selected remote CDP profile host for CDP health and control checks without widening browser navigation SSRF policy, so WSL-to-Windows Chrome endpoints no longer appear offline under strict defaults. Fixes #68108. (#68207) 感谢 @Mlightsnow.
- Codex: stop cumulative app-server token totals from being treated as fresh context usage, so session status no longer reports inflated context percentages after long Codex threads. (#64669) 感谢 @cyrusaf.
- Browser/CDP: add phase-specific CDP readiness diagnostics and normalize loopback WebSocket host aliases, so Windows browser startup failures surface whether HTTP discovery, WebSocket discovery, SSRF validation, or the `Browser.getVersion` health check failed.
- Browser/CDP: discover Chrome’s real DevTools websocket from bare `ws://host:port` attach-only roots before declaring the profile down, while still falling back to direct websocket providers that do not expose `/json/version`. Fixes #68027. (#68715) 感谢 @visionik.

## 🚀 v2026.4.18 (2026年4月18日)

### ✨ 新增功能与改进

- Anthropic/models: add Claude Opus 4.7 `xhigh` reasoning effort support and keep it separate from adaptive thinking.
- Control UI/settings: overhaul the settings and slash-command experience with faster presets, quick-create flows, and refreshed command discovery. (#67819) 感谢 @BunsDev.
- macOS/gateway: add `screen.snapshot` support for macOS app nodes, including runtime plumbing, default macOS allowlisting, and docs for monitor preview flows. (#67954) 感谢 @BunsDev.

### 🐛 问题修复

- Codex/gateway: fix gateway crashes when the codex-acp subprocess terminates abruptly; pending requests now shut down gracefully instead of propagating an uncaught EPIPE through the gateway daemon and connected channels. Fixes #67886. (#67947) 感谢 @openperf.
- Agents/bootstrap: resolve bootstrap from workspace truth instead of stale session transcript markers, keep embedded bootstrap instructions on a hidden user-context prelude, suppress normal `/new` and `/reset` greetings while `BOOTSTRAP.md` is still pending, and make the embedded runner read the bootstrap ritual before replying normally.
- Agents/bootstrap: dedupe repeated bootstrap-truncation warnings so startup logs stay actionable. (#67906) 感谢 @rubencu.
- WhatsApp/multi-account: centralize named-account inbound policy, isolate per-account group activation and scoped session keys, preserve legacy activation backfill, and keep `accounts.default` shared defaults aligned across runtime, setup, and compat migration paths. 感谢 @mcaxtr.
- Cron/delivery: clean up isolated sessions after direct deliveries when `deleteAfterRun` is enabled, covering structured and threaded branches that previously bypassed cleanup. (#67807) 感谢 @MonkeyLeeT.
- Gateway/hello-ok: always report negotiated auth metadata and preserve scopes for reused device tokens on successful shared-auth handshakes, including control-ui bypass coverage when no device token is issued. (#67810, #68039) 感谢 @BunsDev.
- Onboarding/non-interactive: preserve existing gateway auth tokens during re-onboard so active local gateway clients are not disconnected by an implicit token rotation. (#67821) 感谢 @BKF-Gitty.
- OpenAI Codex/Responses: unify native Responses API capability detection so Codex OAuth requests emit the required `store: false` field on the native Responses path. (#67918) 感谢 @obviyus.
- WhatsApp/setup: guard personal-phone and allowlist prompt values so setup fails with clear validation errors instead of crashing on undefined prompt text. (#67895) 感谢 @lawrence3699.
- Models/config: preserve an existing `models.json` provider `baseUrl` during merge-mode regeneration so custom endpoints do not get reset on restart. (#67893) 感谢 @lawrence3699.
- Plugin SDK: preserve `secret-input-runtime` function exports in published builds so provider plugins can read SecretRef-backed setup inputs.
- Plugins/discovery: reuse bundled and global plugin discovery results across workspace cache misses so Windows multi-workspace startup stops redoing the shared synchronous scan. (#67940) 感谢 @obviyus.
- Bundled plugins/install: keep staged bundled plugin runtime imports resolving through the packaged Plugin SDK while omitting checkout-only aliases from the dist inventory, so published installs do not fail on repo-local paths.
- Plugins/webhooks: enforce synchronous plugin registration with full rollback of failed plugin side effects, and cache SecretRef-backed webhook auth per route so plugin startup and inbound webhook auth stay deterministic. (#67941) 感谢 @obviyus.
- Telegram/polling transport: give the Telegram undici dispatcher pool bounded keep-alive defaults and an explicit lifecycle. Previously every recoverable network error and stall watchdog trip silently replaced the transport, abandoning the old dispatcher pool and its sockets; long-running gateway processes accumulated hundreds of ESTABLISHED connections to `api.telegram.org`, saturating per-IP upstream proxy quotas and causing the actively-used outbound proxy node to time out while every other node still tested healthy. Transports now expose `close()`, `TelegramPollingTransportState` destroys the stale transport on dirty-rebuild, and `TelegramPollingSession` disposes the transport when polling exits — backed by a strict per-origin pool cap on every constructed `Agent`, `ProxyAgent`, and `EnvHttpProxyAgent` as defence in depth.
- Telegram/polling: publish successful `getUpdates` calls as account health liveness, avoid false stall restarts after recoverable `getUpdates` errors, and force Telegram API dispatchers to HTTP/1.1 so stalled polling recovers instead of sitting connected-but-dead.
- Telegram/ACP bindings: drop persisted DM bindings that still point at missing or failed ACP sessions on restart, while preserving plugin-owned bindings and uncertain store reads. (#67822) 感谢 @chinar-amrutkar.
- Telegram/streaming: keep a transient preview on the same Telegram message when auto-compaction retries an in-flight answer, so streamed replies no longer appear duplicated after compaction. (#66939) 感谢 @rubencu.
- Memory/sqlite-vec: emit the degraded sqlite-vec warning once per degraded episode instead of repeating it for every file write, while preserving the latch across safe-reindex rollback and resetting it when vector state is genuinely rebuilt. (#67898) 感谢 @rubencu.
- Memory-core: preserve stored vector dimensions during read-only recovery so memory indexes do not lose vector metadata while repairing read-only state.
- Reply/block streaming: preserve post-stream incomplete-turn error payloads after block streaming already emitted content, so users get the warning instead of silence. (#67991) 感谢 @obviyus.
- Telegram/streaming: clear the compaction replay guard after visible non-final boundaries so a post-tool assistant reply rotates to a fresh preview instead of editing the pre-compaction message. (#67993) 感谢 @obviyus.
- Matrix: fix `sessions_spawn --thread` subagent session spawning — thread binding creation, cleanup on session end, and completion-message delivery target resolution now work end-to-end. (#67643) 感谢 @eejohnso-ops and @gumadeiras.
- Slack/streaming: resolve native streaming recipient teams from the inbound user when available, with a monitor-team fallback, so DM and shared-workspace streams target the right recipient more reliably.
- macOS/webchat: enable Undo and Redo in the composer text input by turning on the native `NSTextView` undo manager. (#34962) 感谢 @tylerbittner.
- macOS/remote SSH: require an already-trusted host key on the macOS remote command, gateway probe, port tunnel, and pairing probe paths by switching `StrictHostKeyChecking=accept-new` to `StrictHostKeyChecking=yes` and centralizing the shared SSH option fragments in `CommandResolver`, so first-time macOS remote connections no longer silently accept an unknown host key and must be trusted ahead of time via `~/.ssh/known_hosts`.（#68199）
- CLI/configure: show the channel picker before probing statuses and let remove mode delete configured channel blocks directly from config. (#68007) 感谢 @gumadeiras.
- Control UI/settings: reset scroll position when switching settings pages and align details headers. (#68150) 感谢 @BunsDev.
- WhatsApp/gateway: harden WhatsApp auth persistence and backup recovery, model unstable auth state explicitly in setup/status/health, recover backup-backed login without forcing a fresh QR, and keep local gateway handoff and channel restarts truthful after login. 感谢 @mcaxtr.
- OpenAI Codex/OAuth: keep OpenClaw as the canonical owner for imported Codex CLI OAuth sessions, stop writing refreshed credentials back into `.codex`, and prefer fresher OpenClaw credentials over stale imported CLI state so refresh recovery stays stable. 感谢 @vincentkoc.
- OpenAI Codex/OAuth: treat the OpenAI TLS prerequisites probe as advisory instead of a hard blocker, so Codex sign-in can still proceed when the speculative Node/OpenSSL precheck fails but the real OAuth flow still works. 感谢 @vincentkoc.
- Models status/OAuth health: align OAuth health reporting with the same effective credential view runtime uses, so expired refreshable sessions stop showing healthy by default and fresher imported Codex CLI credentials surface correctly in `models status`, doctor, and gateway auth status. 感谢 @vincentkoc.
- OpenAI Codex/OAuth: keep external CLI OAuth imports runtime-only by overlaying fresher Codex CLI credentials without mutating `auth-profiles.json`, so `.codex` stays a bootstrap/runtime input instead of becoming durable OpenClaw state. 感谢 @vincentkoc.
- OpenAI Codex/OAuth: drop legacy CLI-manager routing from the remaining bootstrap path so Codex and MiniMax CLI imports are matched by their canonical OpenClaw profile ids instead of stale `managedBy` metadata. 感谢 @vincentkoc.
- OpenAI Codex/OAuth: only bootstrap from external CLI OAuth when the local OpenClaw profile is missing or unusable, so healthy local sessions are no longer overridden by fresher `.codex` tokens. 感谢 @vincentkoc.
- OpenAI Codex/OAuth: rename the external CLI bootstrap helper, reuse the same usable-oauth check across runtime fallback paths, and add debug logs plus health coverage so bootstrap decisions stay legible. 感谢 @vincentkoc.
- Twitch/setup: load Twitch through the bundled setup-entry discovery path and keep setup/status account detection aligned with runtime config. (#68008) 感谢 @gumadeiras.
- Feishu/card actions: resolve card-action chat type from the Feishu chat API when stored context is missing, preferring `chat_mode` over `chat_type`, so DM-originated card actions no longer bypass `dmPolicy` by falling through to the group handling path.（#68201）
- Cron/isolated-agent: preserve `trusted: false` on isolated cron awareness events mirrored into the main session, and forward the optional `trusted` flag through the gateway cron wrapper so explicit trust downgrades survive session-key scoping.（#68210）
- Agents/fallback: recognize bare leading ZenMux `402 ...` quota-refresh errors without misclassifying plain numeric `402 ...` text, and keep the embedded fallback regression coverage stable. (#47579) 感谢 @bwjoke.
- Failover/google: only treat `INTERNAL` status payloads as retryable timeouts when they also carry a `500` code, so malformed non-500 payloads do not enter the retry path. (#68238) 感谢 @altaywtf and @Openbling.
- Agents/tools: filter bundled MCP/LSP tools through the final owner-only and tool-policy pipeline after merging them into the effective tool list, so existing allowlists, deny rules, sandbox policy, subagent policy, and owner-only restrictions apply to bundled tools the same way they apply to core tools.（#68195）
- Gateway/assistant media: require `operator.read` scope for assistant-media file and metadata requests on identity-bearing HTTP auth paths so callers without a read scope can no longer access assistant media. (#68175) 感谢 @eleqtrizit.
- Gateway/web: allow same-origin microphone access in the Permissions-Policy header so browser voice capture can work from the Control UI and webchat origin.（#68368）
- Exec approvals/display: escape raw control characters (including newline and carriage return) in the shared and macOS approval-prompt command sanitizers, so trailing command payloads no longer render on hidden extra lines in the approval UI.（#68198）
- Telegram/streaming: fence same-session stale preview and finalization work after aborts so Telegram no longer replays an older reply or flushes a hidden short preview after the abort confirmation lands. (#68100) 感谢 @rubencu.
- OpenAI Codex/OAuth + Pi: keep imported Codex CLI OAuth bootstrap, Pi auth export, and runtime overlay handling aligned so Codex sessions survive refresh and health checks without leaking transient CLI state into saved auth files. 感谢 @vincentkoc.
- OpenAI Codex/OAuth: keep Codex-specific auth bridging inside the owning plugins, preserve canonical imported CLI profiles, and allow legacy identity-less main-store OAuth sessions to upgrade during refresh mirroring. (#68284) 感谢 @vincentkoc.
- Config/redact: add `browser.cdpUrl` and `browser.profiles.*.cdpUrl` to sensitive URL config paths so embedded credentials (query tokens and HTTP Basic auth) are properly redacted in `config.get` API responses and availability error messages. (#67679) 感谢 @Ziy1-Tan.
- Agents/TTS: report failed speech synthesis as a real tool error so unconfigured providers no longer feed successful TTS failure output back into agent loops. (#67980) 感谢 @lawrence3699.
- Gateway/wake: allow unknown properties on wake payloads so external senders like Paperclip can attach opaque metadata without failing schema validation. (#68355) 感谢 @kagura-agent.
- Matrix: honor `channels.matrix.network.dangerouslyAllowPrivateNetwork` when creating clients for private-network homeservers. (#68332) 感谢 @kagura-agent.
- Cron/message tool: keep cron-owned runs with `delivery.mode: "none"` on the normal message-tool path so they can still send explicit messages, create threads, and route conditionally when no runner-owned delivery target is active. (#68482) 感谢 @obviyus.
- Agents/failover: avoid treating bare leading `402 ...` prose as billing errors while still recognizing proxy subscription failures. (#45827) 感谢 @junyuc25.
- Config/$schema: preserve root-authored `$schema` during partial config rewrites without injecting include-only schema URLs into the root config. (#47322) 感谢 @EfeDurmaz16.
- Agents/CLI delivery: run the same reply-media path normalizer the auto-reply flow uses before shipping `openclaw agent --deliver` payloads, so relative `MEDIA:./out/photo.png` tokens resolve against the agent workspace instead of being rejected downstream with `LocalMediaAccessError: Local media path is not under an allowed directory`. 感谢 @frankekn.
- Agents/Google: strip `thinkingBudget=0` for the thinking-required `gemini-2.5-pro` model in embedded-runner and native Google payloads, so requests no longer fail with `Budget 0 is invalid. This model only works in thinking mode.` and the API uses its default thinking behavior instead. (#68607) 感谢 @josmithiii.
- Slack/threads: log failed thread starter and history fetches at verbose level while preserving best-effort fallback behavior, so missing Slack thread context is diagnosable without interrupting inbound handling. (#68594) 感谢 @martingarramon.
- Gateway/restart: keep stale-gateway cleanup from terminating the current process's parent or ancestors, so plugin sidecars like WeChat no longer kill the active gateway and trigger an infinite supervisor restart loop. Fixes #68451. (#68517) 感谢 @openperf.
- Gateway/auth: reject gateway auth credentials that match published example placeholders at startup and secret reload, and keep cloud install snippets from publishing copy-paste gateway/keyring secrets. (#68404) 感谢 @coygeek.
- CLI/update: preserve macOS restart helper launchctl failures in the update restart log without letting log setup block the restart path. (#68492) 感谢 @hclsys.
- Slack/threads: keep file-only root messages as starter context so first thread replies can still hydrate starter media. (#68594) 感谢 @martingarramon.
- Google/Antigravity: resolve forward-compatible Gemini 3.1 Pro custom-tools and Flash variants from the bundled Google plugin templates, so `google-antigravity/gemini-3.1-pro-preview-customtools` no longer falls through to an unknown-model error. Fixes #35512.
- Active Memory: raise the blocking recall timeout ceiling to 120 seconds and reject larger config values during plugin schema validation. Fixes #68410. (#68480) 感谢 @Bartok9.
- Control UI/chat: keep history-backed user image uploads visible after chat reload while filtering blocked or non-image transcript media paths. (#68415) 感谢 @mraleko.
- Matrix/plugins: keep remaining Matrix event helpers on the canonical `matrix-js-sdk` subpath so build and plugin-load entrypoint checks stay consistent. (#68498) 感谢 @masatohoshino.

## 🚀 v2026.4.15 (2026年4月15日)

### ✨ 新增功能与改进

- Anthropic/models: default Anthropic selections, `opus` aliases, Claude CLI defaults, and bundled image understanding to Claude Opus 4.7.
- Google/TTS: add Gemini text-to-speech support to the bundled `google` plugin, including provider registration, voice selection, WAV reply output, PCM telephony output, and setup/docs guidance. (#67515) 感谢 @barronlroth.
- Control UI/Overview: add a Model Auth status card showing OAuth token health and provider rate-limit pressure at a glance, with attention callouts when OAuth tokens are expiring or expired. Backed by a new `models.authStatus` gateway method that strips credentials and caches for 60s. (#66211) 感谢 @omarshahine.
- Memory/LanceDB: add cloud storage support to `memory-lancedb` so durable memory indexes can run on remote object storage instead of local disk only. (#63502) 感谢 @rugvedS07.
- GitHub Copilot/memory search: add a GitHub Copilot embedding provider for memory search, and expose a dedicated Copilot embedding host helper so plugins can reuse the transport while honoring remote overrides, token refresh, and safer payload validation. (#61718) 感谢 @feiskyer and @vincentkoc.
- Agents/local models: add experimental `agents.defaults.experimental.localModelLean: true` to drop heavyweight default tools like `browser`, `cron`, and `message`, reducing prompt size for weaker local-model setups without changing the normal path. (#66495) 感谢 @ImLukeF.
- Packaging/plugins: localize bundled plugin runtime deps to their owning extensions, trim the published docs payload, and tighten install/package-manager guardrails so published builds stay leaner and core stops carrying extension-owned runtime baggage. (#67099) 感谢 @vincentkoc.
- QA/Matrix: split Matrix live QA into a source-linked `qa-matrix` runner and keep repo-private `qa-*` surfaces out of packaged and published builds. (#66723) 感谢 @gumadeiras.
- Docs/showcase: add a scannable hero, complete section jump links, and a responsive video grid for community examples. (#48493) 感谢 @jchopard69.

### 🐛 问题修复

- Gateway/tools: anchor trusted local `MEDIA:` tool-result passthrough on the exact raw name of this run's registered built-in tools, and reject client tool definitions whose names normalize-collide with a built-in or with another client tool in the same request (`400 invalid_request_error` on both JSON and SSE paths), so a client-supplied tool named like a built-in can no longer inherit its local-media trust.（#67303）
- Agents/replay recovery: classify the provider wording `401 input item ID does not belong to this connection` as replay-invalid, so users get the existing `/new` session reset guidance instead of a raw 401-style failure. (#66475) 感谢 @dallylee.
- Gateway/webchat: enforce localRoots containment on webchat audio embedding path [AI-assisted]. (#67298) 感谢 @pgondhi987.
- Matrix/pairing: block DM pairing-store entries from authorizing room control commands [AI-assisted]. (#67294) 感谢 @pgondhi987.
- Docker/build: verify `@matrix-org/matrix-sdk-crypto-nodejs` native bindings with `find` under `node_modules` instead of a hardcoded `.pnpm/...` path so pnpm v10+ virtual-store layouts no longer fail the image build. (#67143) thanks @ly85206559.
- Matrix/E2EE: keep startup bootstrap conservative for passwordless token-auth bots, still attempt the guarded repair pass without requiring `channels.matrix.password`, and document the remaining password-UIA limitation. (#66228) 感谢 @SARAMALI15792.
- Cron/announce delivery: suppress mixed-content isolated cron announce replies that end with `NO_REPLY` so trailing silent sentinels no longer leak summary text to the target channel. (#65004) thanks @neo1027144-creator.
- Plugins/bundled channels: partition bundled channel lazy caches by active bundled root so `OPENCLAW_BUNDLED_PLUGINS_DIR` flips stop reusing stale plugin, setup, secrets, and runtime state. (#67200) 感谢 @gumadeiras.
- Packaging/plugins: prune common test/spec cargo from bundled plugin runtime dependencies and fail npm release validation if packaged test cargo reappears, keeping published tarballs leaner without plugin-specific special cases. (#67275) thanks @gumadeiras.
- Agents/context + Memory: trim default startup/skills prompt budgets, cap `memory_get` excerpts by default with explicit continuation metadata, and keep QMD reads aligned with the same bounded excerpt contract so long sessions pull less context by default without losing deterministic follow-up reads.
- Matrix/commands: skip DM pairing-store reads on room traffic now that room control-command authorization ignores pairing-store entries, keeping the room path narrower without changing room auth behavior. (#67325) 感谢 @gumadeiras.
- Memory-core/dreaming: skip dreaming narrative transcripts from session-store metadata before bootstrap records land so dream diary prompt/prose lines do not pollute session ingestion. (#67315) thanks @jalehman.
- Agents/local models: clarify low-context preflight hints for self-hosted models, point config-backed caps at the relevant OpenClaw setting, and stop suggesting larger models when `agents.defaults.contextTokens` is the real limit. (#66236) 感谢 @ImLukeF.
- Dreaming/memory-core: change the default `dreaming.storage.mode` from `inline` to `separate` so Dreaming phase blocks (`## Light Sleep`, `## REM Sleep`) land in `memory/dreaming/{phase}/YYYY-MM-DD.md` instead of being injected into `memory/YYYY-MM-DD.md`. Daily memory files no longer get dominated by structured candidate output, and the daily-ingestion scanner that already strips dream marker blocks no longer has to compete with hundreds of phase-block lines on every run. Operators who want the previous behavior can opt in by setting `plugins.entries.memory-core.config.dreaming.storage.mode: "inline"`. (#66412) 感谢 @mjamiv.
- Control UI/Overview: fix false-positive "missing" alerts on the Model Auth status card for aliased providers, env-backed OAuth with auth.profiles, and unresolvable env SecretRefs. (#67253) 感谢 @omarshahine.
- Dashboard: constrain exec approval modal overflow on desktop so long command content no longer pushes action buttons out of view. (#67082) 感谢 @Ziy1-Tan.
- Agents/CLI transcripts: persist successful CLI-backed turns into the OpenClaw session transcript so google-gemini-cli replies appear in session history and the Control UI again. (#67490) 感谢 @obviyus.
- Discord/tool-call text: strip standalone Gemma-style `<function>...</function>` tool-call payloads from visible assistant text without truncating prose examples or trailing replies. (#67318) 感谢 @joelnishanth.
- WhatsApp/web-session: drain the pending per-auth creds save queue before reopening sockets so reconnect-time auth bootstrap no longer races in-flight `creds.json` writes and falsely restores from backup. (#67464) 感谢 @neeravmakwana.
- BlueBubbles/catchup: add a per-message retry ceiling (`catchup.maxFailureRetries`, default 10) so a persistently-failing message with a malformed payload no longer wedges the catchup cursor forever. After N consecutive `processMessage` failures against the same GUID, catchup logs a WARN, skips that message on subsequent sweeps, and lets the cursor advance past it. Transient failures still retry from the same point as before. Also fixes a lost-update race in the persistent dedupe file lock that silently dropped inbound GUIDs on concurrent writes, a dedupe file naming migration gap on version upgrade, and a balloon-event bypass that let catchup replay debouncer-coalesced events as standalone messages. (#67426, #66870) 感谢 @omarshahine.
- Ollama/chat: strip the `ollama/` provider prefix from Ollama chat request model ids so configured refs like `ollama/qwen3:14b-q8_0` stop 404ing against the Ollama API. (#67457) 感谢 @suboss87.
- Agents/tools: resolve non-workspace host tilde paths against the OS home directory and keep edit recovery aligned with that same path target, so `~/...` host edit/write operations stop failing or reading back the wrong file when `OPENCLAW_HOME` differs. (#62804) 感谢 @stainlu.
- Speech/TTS: auto-enable the bundled Microsoft and ElevenLabs speech providers, and route generic TTS directive tokens through the explicit or active provider first so overrides like `[[tts:speed=1.2]]` stop silently landing on the wrong provider. (#62846) 感谢 @stainlu.
- OpenAI Codex/models: normalize stale native transport metadata in both runtime resolution and discovery/listing so legacy `openai-codex` rows with missing `api` or `https://chatgpt.com/backend-api/v1` self-heal to the canonical Codex transport instead of routing requests through broken HTML/Cloudflare paths, combining the original fixes proposed in #66969 (saamuelng601-pixel) and #67159 (hclsys).（#67635）
- Agents/failover: treat HTML provider error pages as upstream transport failures for CDN-style 5xx responses without misclassifying embedded body text as API rate limits, while still preserving auth remediation for HTML 401/403 pages and proxy remediation for HTML 407 pages. (#67642) 感谢 @stainlu.
- Gateway/skills: bump the cached skills-snapshot version whenever a config write touches `skills.*` (for example `skills.allowBundled`, `skills.entries.<id>.enabled`, or `skills.profile`). Existing agent sessions persist a `skillsSnapshot` in `sessions.json` that reuses the skill list frozen at session creation; without this invalidation, removing a bundled skill from the allowlist left the old snapshot live and the model kept calling the disabled tool, producing `Tool <name> not found` loops that ran until the embedded-run timeout. (#67401) 感谢 @xantorres.
- Agents/tool-loop: enable the unknown-tool stream guard by default. Previously `resolveUnknownToolGuardThreshold` returned `undefined` unless `tools.loopDetection.enabled` was explicitly set to `true`, which left the protection off in the default configuration. A hallucinated or removed tool (for example `himalaya` after it was dropped from `skills.allowBundled`) would then loop "Tool X not found" attempts until the full embedded-run timeout. The guard has no false-positive surface because it only triggers on tools that are objectively not registered in the run, so it now stays on regardless of `tools.loopDetection.enabled` and still accepts `tools.loopDetection.unknownToolThreshold` as a per-run override (default 10). (#67401) 感谢 @xantorres.
- TUI/streaming: add a client-side streaming watchdog to `tui-event-handlers` so the `streaming · Xm Ys` activity indicator resets to `idle` after 30s of delta silence on the active run. Guards against lost or late `state: "final"` chat events (WS reconnects, gateway restarts, etc.) leaving the TUI stuck on `streaming` indefinitely; a new system log line surfaces the reset so users know to send a new message to resync. The window is configurable via the new `streamingWatchdogMs` context option (set to `0` to disable), and the handler now exposes a `dispose()` that clears the pending timer on shutdown. (#67401) 感谢 @xantorres.
- Extensions/lmstudio: add exponential backoff to the inference-preload wrapper so an LM Studio model-load failure (for example the built-in memory guardrail rejecting a load because the swap is saturated) no longer produces a WARN line every ~2s for every chat request. The wrapper now records consecutive preload failures per `(baseUrl, modelKey, contextLength)` tuple with a 5s → 10s → 20s → … → 5min cooldown and skips the preload step entirely while a cooldown is active, letting chat requests proceed directly to the stream (the model is often already loaded via the LM Studio UI). The combined `preload failed` log line now reports consecutive-failure count and remaining cooldown so operators can act on the real issue instead of drowning in repeated warnings. (#67401) 感谢 @xantorres.
- Agents/replay: re-run tool/result pairing after strict replay tool-call ID sanitization on outbound requests so Anthropic-compatible providers like MiniMax no longer receive malformed orphan tool-result IDs such as `...toolresult1` during compaction and retry flows. (#67620) 感谢 @stainlu.
- Gateway/startup: fix spurious SIGUSR1 restart loop on Linux/systemd when plugin auto-enable is the only startup config write; the config hash guard was not captured for that write path, causing chokidar to treat each boot write as an external change and trigger a reload → restart cycle that corrupts manifest.db after repeated cycles. Fixes #67436. (#67557) thanks @openperf
- Codex/harness: auto-enable the Codex plugin when `codex` is selected as an embedded agent harness runtime, including forced default, per-agent, and `OPENCLAW_AGENT_RUNTIME` paths. (#67474) 感谢 @duqaXxX.
- OpenAI Codex/CLI: keep resumed `codex exec resume` runs on the safe non-interactive path without reintroducing the removed dangerous bypass flag by passing the supported `--skip-git-repo-check` resume arg plus Codex's native `sandbox_mode="workspace-write"` config override. (#67666) 感谢 @plgonzalezrx8.
- Codex/app-server: parse Desktop-originated app-server user agents such as `Codex Desktop/0.118.0`, keeping the version gate working when the Codex CLI inherits a multi-word originator. (#64666) 感谢 @cyrusaf.
- Cron/announce delivery: keep isolated announce `NO_REPLY` stripping case-insensitive across direct and text delivery, preserve structured media-only sends when a caption strips silent, and derive main-session awareness from the cleaned payloads so silent captions no longer leak stale `NO_REPLY` text. (#65016) 感谢 @BKF-Gitty.
- Sessions/Codex: skip redundant `delivery-mirror` transcript appends only when the latest assistant message has the same visible text, preventing duplicate visible replies on Codex-backed turns without suppressing repeated answers across turns. (#67185) 感谢 @andyylin.
- Auto-reply/prompt-cache: keep volatile inbound chat IDs out of the stable system prompt so task-scoped adapters can reuse prompt caches across runs, while preserving conversation metadata for the user turn and media-only messages. (#65071) 感谢 @MonkeyLeeT.
- BlueBubbles/inbound: restore inbound image attachment downloads on Node 22+ by stripping incompatible bundled-undici dispatchers from the non-SSRF fetch path, accept `updated-message` webhooks carrying attachments, use event-type-aware dedup keys so attachment follow-ups are not rejected as duplicates, and retry attachment fetch from the BB API when the initial webhook arrives with an empty array. (#64105, #61861, #65430, #67510) 感谢 @omarshahine.
- Agents/skills: sort prompt-facing `available_skills` entries by skill name after merging sources so `skills.load.extraDirs` order no longer changes prompt-cache prefixes. (#64198) 感谢 @Bartok9.
- Agents/OpenAI Responses: add `models.providers.*.models.*.compat.supportsPromptCacheKey` so OpenAI-compatible proxies that forward `prompt_cache_key` can keep prompt caching enabled while incompatible endpoints can still force stripping. (#67427) 感谢 @damselem.
- Agents/context engines: keep loop-hook and final `afterTurn` prompt-cache touch metadata aligned with the current assistant turn so cache-aware context engines retain accurate cache TTL state during tool loops. (#67767) thanks @jalehman.
- Memory/dreaming: strip AI-facing inbound metadata envelopes from session-corpus user turns before normalization so REM topic extraction sees the user's actual message text, including array-shaped split envelopes. (#66548) 感谢 @zqchris.
- Agents/errors: detect standalone Cloudflare/CDN HTML challenge pages before transport DNS classification so provider block pages no longer appear as local DNS lookup failures. (#67704) 感谢 @chris-yyau.
- Security/approvals: redact secrets in exec approval prompts so inline approval review can no longer leak credential material in rendered prompt content. (#61077, #64790)
- CLI/configure: re-read the persisted config hash after writes so config updates stop failing with stale-hash races. (#64188, #66528)
- CLI/update: prune stale packaged `dist` chunks after npm upgrades and keep downgrade/verify inventory checks compat-safe so global upgrades stop failing on stale chunk imports. (#66959) 感谢 @obviyus.
- Onboarding/CLI: fix channel-selection crashes on globally installed CLI setups during onboarding.（#66736）
- Video generation/live tests: bound provider polling for live video smoke, default to the fast non-FAL text-to-video path, and use a one-second lobster prompt so release validation no longer waits indefinitely on slow provider queues.
- Memory-core/QMD `memory_get`: reject reads of arbitrary workspace markdown paths and only allow canonical memory files (`MEMORY.md`, `memory.md`, `DREAMS.md`, `dreams.md`, `memory/**`) plus exact paths of active indexed QMD workspace documents, so the QMD memory backend can no longer be used as a generic workspace-file read shim that bypasses `read` tool-policy denials. (#66026) 感谢 @eleqtrizit.
- Cron/agents: forward embedded-run tool policy and internal event params into the attempt layer so `--tools` allowlists, cron-owned message-tool suppression, explicit message targeting, and command-path internal events all take effect at runtime again. (#62675) 感谢 @hexsprite.
- Setup/providers: guard preferred-provider lookup during setup so malformed plugin metadata with a missing provider id no longer crashes the wizard with `Cannot read properties of undefined (reading 'trim')`. (#66649) 感谢 @Tianworld.
- Matrix/security: normalize sandboxed profile avatar params, preserve `mxc://` avatar URLs, and surface gmail watcher stop failures during reload. (#64701) 感谢 @slepybear.
- Telegram/documents: drop leaked binary caption bytes from inbound Telegram text handling so document uploads like `.mobi` or `.epub` no longer explode prompt token counts. (#66663) 感谢 @joelnishanth.
- Gateway/auth: resolve the active gateway bearer per-request on the HTTP server and the HTTP upgrade handler via `getResolvedAuth()`, mirroring the WebSocket path, so a secret rotated through `secrets.reload` or config hot-reload stops authenticating on `/v1/*`, `/tools/invoke`, plugin HTTP routes, and the canvas upgrade path immediately instead of remaining valid on HTTP until gateway restart. (#66651) 感谢 @mmaps.
- Agents/compaction: cap the compaction reserve-token floor to the model context window so small-context local models (e.g. Ollama with 16K tokens) no longer trigger context-overflow errors or infinite compaction loops on every prompt. (#65671) 感谢 @openperf.
- Agents/OpenAI Responses: classify the exact `Unknown error (no error details in response)` transport failure as failover reason `unknown` so assistant/model fallback still runs for that no-details failure path. (#65254) 感谢 @OpenCodeEngineer.
- Models/probe: surface invalid-model probe failures as `format` instead of `unknown` in `models list --probe`, and lock the invalid-model fallback path in with regression coverage. (#50028) 感谢 @xiwuqi.
- Agents/failover: classify OpenAI-compatible `finish_reason: network_error` stream failures as timeout so model fallback retries continue instead of stopping with an unknown failover reason. (#61784) thanks @lawrence3699.
- Onboarding/channels: normalize channel setup metadata before discovery and validation so malformed or mixed-shape channel plugin metadata no longer breaks setup and onboarding channel lists. (#66706) 感谢 @darkamenosa.
- Slack/native commands: fix option menus for slash commands such as `/verbose` when Slack renders native buttons by giving each button a unique action ID while still routing them through the shared `openclaw_cmdarg*` listener. 感谢 @Wangmerlyn.
- Feishu/webhook: harden the webhook transport and card-action replay guards to fail closed on missing `encryptKey` and blank callback tokens — refuse to start the webhook transport without an `encryptKey`, reject unsigned requests when no key is present instead of accepting them, and drop blank card-action tokens before the dedupe claim and dispatcher. Defense-in-depth over the already-closed monitor-account layer. (#66707) 感谢 @eleqtrizit.
- Agents/workspace files: route `agents.files.get`, `agents.files.set`, and workspace listing through the shared `fs-safe` helpers (`openFileWithinRoot`/`readFileWithinRoot`/`writeFileWithinRoot`), reject symlink aliases for allowlisted agent files, and have `fs-safe` resolve opened-file real paths from the file descriptor before falling back to path-based `realpath` so a symlink swap between `open` and `realpath` can no longer redirect the validated path off the intended inode. (#66636) 感谢 @eleqtrizit.
- Gateway/MCP loopback: switch the `/mcp` bearer comparison from plain `!==` to constant-time `safeEqualSecret` (matching the convention every other auth surface in the codebase uses), and reject non-loopback browser-origin requests via `checkBrowserOrigin` before the auth gate runs. Loopback origins (`127.0.0.1:*`, `localhost:*`, same-origin) still go through, including the `localhost`↔`127.0.0.1` host mismatch that browsers flag as `Sec-Fetch-Site: cross-site`. (#66665) 感谢 @eleqtrizit.
- Auto-reply/billing: classify pure billing cooldown fallback summaries from structured fallback reasons so users see billing guidance instead of the generic failure reply. (#66363) 感谢 @Rohan5commit.
- Agents/fallback: preserve the original prompt body on model fallback retries with session history so the retrying model keeps the active task instead of only seeing a generic continue message. (#66029) 感谢 @WuKongAI-CMU.
- Reply/secrets: resolve active reply channel/account SecretRefs before reply-run message-action discovery so channel token SecretRefs (for example Discord) do not degrade into discovery-time unresolved-secret failures. (#66796) 感谢 @joshavant.
- Agents/Anthropic: ignore non-positive Anthropic Messages token overrides and fail locally when no positive token budget remains, so invalid `max_tokens` values no longer reach the provider API. (#66664) thanks @jalehman
- Agents/context engines: preserve prompt-only token counts, not full request totals, when deferred maintenance reuses after-turn runtime context so background compaction bookkeeping matches the active prompt window. (#66820) thanks @jalehman.
- BlueBubbles/inbound: add a persistent file-backed GUID dedupe so MessagePoller webhook replays after BB Server restart or reconnect no longer cause the agent to re-reply to already-handled messages. (#19176, #12053, #66816) 感谢 @omarshahine.
- Secrets/plugins/status: align SecretRef inspect-vs-strict handling across plugin preload, read-only status/agents surfaces, and runtime auth paths so unresolved refs no longer crash read-only CLI flows while runtime-required non-env refs stay strict. (#66818) 感谢 @joshavant.
- Memory/dreaming: stop ordinary transcripts that merely quote the dream-diary prompt from being classified as internal dreaming runs and silently dropped from session recall ingestion. (#66852) 感谢 @gumadeiras.
- Telegram/documents: sanitize binary reply context and ZIP-like archive extraction so `.epub` and `.mobi` uploads can no longer leak raw binary into prompt context through reply metadata or archive-to-`text/plain` coercion. (#66877) 感谢 @martinfrancois.
- Telegram/native commands: restore plugin-registry-backed auto defaults for native commands and native skills so Telegram slash commands keep registering when `commands.native` and `commands.nativeSkills` stay on `auto`. (#66843) 感谢 @kashevk0.
- OpenRouter/Qwen3: parse `reasoning_details` stream deltas as thinking content without skipping same-chunk tool calls, so Qwen3 replies no longer fail empty on OpenRouter and mixed reasoning/tool-call chunks still execute normally. (#66905) 感谢 @bladin.
- BlueBubbles/catchup: replay missed webhook messages after gateway restart via a persistent per-account cursor and `/api/v1/message/query?after=<ts>` pass, so messages delivered while the gateway was down no longer disappear. Uses the existing `processMessage` path and is deduped by #66816's inbound GUID cache. (#66857, #66721) 感谢 @omarshahine.
- Telegram/native commands: keep Telegram command-sync cache process-local so gateway restarts re-register the menu instead of trusting stale on-disk sync state after Telegram cleared commands out-of-band. (#66730) 感谢 @nightq.
- Audio/self-hosted STT: restore `models.providers.*.request.allowPrivateNetwork` for audio transcription so private or LAN speech-to-text endpoints stop tripping SSRF blocks after the v2026.4.14 regression. (#66692) 感谢 @jhsmith409.
- Auto-reply/media: allow workspace-rooted absolute media paths in auto-reply send flows so valid local media references no longer fail path validation.（#66689）
- WhatsApp/Baileys media upload: harden encrypted upload handling so large outbound media sends avoid buffer spikes and reliability regressions. (#65966) 感谢 @frankekn.
- QQBot/cron: guard against undefined `event.content` in `parseFaceTags` and `filterInternalMarkers` so cron-triggered agent turns with no content payload no longer crash with `TypeError: Cannot read properties of undefined (reading 'startsWith')`. (#66302) 感谢 @xinmotlanthua.
- CLI/plugins: stop `--dangerously-force-unsafe-install` plugin installs from falling back to hook-pack installs after security scan failures, while still preserving non-security fallback behavior for real hook packs. (#58909) 感谢 @hxy91819.
- Claude CLI/sessions: classify `No conversation found with session ID` as `session_expired` so expired CLI-backed conversations clear the stale binding and recover on the next turn. (#65028) thanks @Ivan-Fn.
- Context Engine: gracefully fall back to the legacy engine when a third-party context engine plugin fails at resolution time (unregistered id, factory throw, or contract violation), preventing a full gateway outage on every channel. (#66930) 感谢 @openperf.
- Control UI/chat: keep optimistic user message cards visible during active sends by deferring same-session history reloads until the active run ends, including aborted and errored runs. (#66997) 感谢 @scotthuang and @vincentkoc.
- Media/Slack: allow host-local CSV and Markdown uploads only when the fallback buffer actually decodes as text, so real plain-text files work without letting opaque non-text blobs renamed to `.csv` or `.md` slip past the host-read guard. (#67047) 感谢 @Unayung.
- Ollama/onboarding: split setup into `Cloud + Local`, `Cloud only`, and `Local only`, support direct `OLLAMA_API_KEY` cloud setup without a local daemon, and keep Ollama web search on the local-host path. (#67005) 感谢 @obviyus.
- Webchat/security: reject remote-host `file://` URLs in the media embedding path. (#67293) 感谢 @pgondhi987.
- Dreaming/memory-core: use the ingestion day, not the source file day, for daily recall dedupe so repeat sweeps of the same daily note can increment `dailyCount` across days instead of stalling at `1`. (#67091) 感谢 @Bartok9.
- Node-host/tools.exec: let approval binding distinguish known native binaries from mutable shell payload files, while still fail-closing unknown or racy file probes so absolute-path node-host commands like `/usr/bin/whoami` no longer get rejected as unsafe interpreter/runtime commands. (#66731) 感谢 @tmimmanuel.
- Codex/gateway: fix gateway crash when the codex-acp subprocess terminates abruptly; an unhandled EPIPE on the child stdin stream now routes through graceful client shutdown, rejecting pending requests instead of propagating as an uncaught exception that crashes the entire gateway daemon and all connected channels. Fixes #67886. (#67947) thanks @openperf
- Slack/streaming: resolve native streaming recipient teams from the inbound user when available, with a monitor-team fallback, so DM and shared-workspace streams target the right recipient more reliably.
- OpenRouter/streaming: treat `reasoning_details.response.output_text` and `reasoning_details.response.text` as visible assistant output on OpenRouter-compatible completions streams, while keeping `reasoning.text` hidden and refusing to surface ambiguous bare `text` items by default so visible replies, thinking blocks, and tool calls can coexist in the same chunk. (#67410) 感谢 @neeravmakwana.
- Models/OpenRouter aliases: resolve `openrouter:auto` to the canonical `openrouter/auto` model and map `openrouter:free` to the first configured concrete `openrouter/...:free` model instead of mis-resolving these compatibility aliases under the default provider. (#57066) 感谢 @sumiisiaran.
- OpenRouter/Arcee: canonicalize stale OpenRouter `https://openrouter.ai/v1` base URLs during provider config normalization and runtime model/transport resolution, so fresh `models.json` writes and previously discovered rows self-heal back to `https://openrouter.ai/api/v1` instead of breaking OpenRouter-routed requests. (#67295) 感谢 @achalkov.

## 🚀 v2026.4.14 (2026年4月14日)

### ✨ 新增功能与改进

- OpenAI Codex/models: add forward-compat support for `gpt-5.4-pro`, including Codex pricing/limits and list/status visibility before the upstream catalog catches up. (#66453) 感谢 @jepson-liu.
- Telegram/forum topics: surface human topic names in agent context, prompt metadata, and plugin hook metadata by learning names from Telegram forum service messages. (#65973) 感谢 @ptahdunbar.

### 🐛 问题修复

- Agents/Ollama: forward the configured embedded-run timeout into the global undici stream timeout tuning so slow local Ollama runs no longer inherit the default stream cutoff instead of the operator-set run timeout. (#63175) 感谢 @mindcraftreader and @vincentkoc.
- Models/Codex: include `apiKey` in the codex provider catalog output so the Pi ModelRegistry validator no longer rejects the entry and silently drops all custom models from every provider in `models.json`. (#66180) 感谢 @hoyyeva.
- Tools/image+pdf: normalize configured provider/model refs before media-tool registry lookup so image and PDF tool runs stop rejecting valid Ollama vision models as unknown just because the tool path skipped the usual model-ref normalization step. (#59943) 感谢 @yqli2420 and @vincentkoc.
- Slack/interactions: apply the configured global `allowFrom` owner allowlist to channel block-action and modal interactive events, require an expected sender id for cross-verification, and reject ambiguous channel types so interactive triggers can no longer bypass the documented allowlist intent in channels without a `users` list. Open-by-default behavior is preserved when no allowlists are configured. (#66028) 感谢 @eleqtrizit.
- Media-understanding/attachments: fail closed when a local attachment path cannot be canonically resolved via `realpath`, so a `realpath` error can no longer downgrade the canonical-roots allowlist check to a non-canonical comparison; attachments that also have a URL still fall back to the network fetch path. (#66022) 感谢 @eleqtrizit.
- Agents/gateway-tool: reject `config.patch` and `config.apply` calls from the model-facing gateway tool when they would newly enable any flag enumerated by `openclaw security audit` (for example `dangerouslyDisableDeviceAuth`, `allowInsecureAuth`, `dangerouslyAllowHostHeaderOriginFallback`, `hooks.gmail.allowUnsafeExternalContent`, `tools.exec.applyPatch.workspaceOnly: false`); already-enabled flags pass through unchanged so non-dangerous edits in the same patch still apply, and direct authenticated operator RPC behavior is unchanged. (#62006) 感谢 @eleqtrizit.
- Google image generation: strip a trailing `/openai` suffix from configured Google base URLs only when calling the native Gemini image API so Gemini image requests stop 404ing without breaking explicit OpenAI-compatible Google endpoints. (#66445) 感谢 @dapzthelegend.
- Telegram/forum topics: persist learned topic names to the Telegram session sidecar store so agent context can keep using human topic names after a restart instead of relearning from future service metadata. (#66107) 感谢 @obviyus.
- Doctor/systemd: keep `openclaw doctor --repair` and service reinstall from re-embedding dotenv-backed secrets in user systemd units, while preserving newer inline overrides over stale state-dir `.env` values. (#66249) 感谢 @tmimmanuel.
- Ollama/OpenAI-compat: send `stream_options.include_usage` for Ollama streaming completions so local Ollama runs report real usage instead of falling back to bogus prompt-token counts that trigger premature compaction. (#64568) 感谢 @xchunzhao and @vincentkoc.
- Doctor/plugins: cache external `preferOver` catalog lookups within each plugin auto-enable pass so large `agents.list` configs no longer peg CPU and repeatedly reread plugin catalogs during doctor/plugins resolution. (#66246) 感谢 @yfge.
- GitHub Copilot/thinking: allow `github-copilot/gpt-5.4` to use `xhigh` reasoning so Copilot GPT-5.4 matches the rest of the GPT-5.4 family. (#50168) 感谢 @jakepresent and @vincentkoc.
- Memory/embeddings: preserve non-OpenAI provider prefixes when normalizing OpenAI-compatible embedding model refs so proxy-backed memory providers stop failing with `Unknown memory embedding provider`. (#66452) 感谢 @jlapenna.
- Agents/local models: clarify low-context preflight hints for self-hosted models, point config-backed caps at the relevant OpenClaw setting, and stop suggesting larger models when `agents.defaults.contextTokens` is the real limit. (#66236) 感谢 @ImLukeF.
- Browser/SSRF: restore hostname navigation under the default browser SSRF policy while keeping explicit strict mode reachable from config, and keep managed loopback CDP `/json/new` fallback requests on the local CDP control policy so browser follow-up fixes stop regressing normal navigation or self-blocking local CDP control. (#66386) 感谢 @obviyus.
- Models/Codex: canonicalize the legacy `openai-codex/gpt-5.4-codex` runtime alias to `openai-codex/gpt-5.4` while still honoring alias-specific and canonical per-model overrides. (#43060) 感谢 @Sapientropic and @vincentkoc.
- Browser/SSRF: preserve explicit strict browser navigation mode for legacy `browser.ssrfPolicy.allowPrivateNetwork: false` configs by normalizing the legacy alias to the canonical strict marker instead of silently widening those installs to the default non-strict hostname-navigation path.
- Onboarding/custom providers: use `max_tokens=16` for OpenAI-compatible verification probes so stricter custom endpoints stop rejecting onboarding checks that only need a tiny completion. (#66450) 感谢 @WuKongAI-CMU.
- Agents/subagents: emit the subagent registry lazy-runtime stub on the stable dist path that both source and bundled runtime imports resolve, so the follow-up dist fix no longer still fails with `ERR_MODULE_NOT_FOUND` at runtime. (#66420) 感谢 @obviyus.
- Media-understanding/proxy env: auto-upgrade provider HTTP helper requests to trusted env-proxy mode only when `HTTP_PROXY`/`HTTPS_PROXY` is active and the target is not bypassed by `NO_PROXY`, so remote media-understanding and transcription requests stop failing local DNS pre-resolution in proxy-only environments without widening SSRF bypasses. (#52162) 感谢 @mjamiv and @vincentkoc.
- Telegram/media downloads: let Telegram media fetches trust an operator-configured explicit proxy for target DNS resolution after hostname-policy checks, so proxy-backed installs stop failing `could not download media` on Bot API file downloads after the DNS-pinning regression. (#66245) 感谢 @dawei41468 and @vincentkoc.
- Browser: keep loopback CDP readiness checks reachable under strict SSRF defaults so OpenClaw can reconnect to locally started managed Chrome. (#66354) 感谢 @hxy91819.
- Agents/context engine: compact engine-owned sessions from the first tool-loop delta and preserve ingest fallback when `afterTurn` is absent, so long-running tool loops can stay bounded without dropping engine state. (#63555) 感谢 @Bikkies.
- OpenAI Codex/auth: keep malformed Codex CLI auth-file diagnostics on the debug logger instead of stdout so interactive command output stays clean while auth read failures remain traceable. (#66451) 感谢 @SimbaKingjoe.
- Discord/native commands: return the real status card for native `/status` interactions instead of falling through to the synthetic `✅ Done.` ack when the generic dispatcher produces no visible reply. (#54629) 感谢 @tkozzer and @vincentkoc.
- Hooks/Ollama: let LLM-backed session-memory slug generation honor an explicit `agents.defaults.timeoutSeconds` override instead of always aborting after 15 seconds, so slow local Ollama runs stop silently dropping back to generic filenames. (#66237) 感谢 @dmak and @vincentkoc.
- Media/transcription: remap `.aac` filenames to `.m4a` for OpenAI-compatible audio uploads so AAC voice notes stop failing MIME-sensitive transcription endpoints. (#66446) 感谢 @ben-z.
- WhatsApp/Baileys media upload: keep encrypted upload POSTs streaming while still guarding generic-agent dispatcher wiring, so large outbound media sends avoid full-buffer RSS spikes and OOM regressions. (#65966) 感谢 @frankekn.
- UI/chat: replace marked.js with markdown-it so maliciously crafted markdown can no longer freeze the Control UI via ReDoS. (#46707) 感谢 @zhangfnf.
- Auto-reply/send policy: keep `sendPolicy: "deny"` from blocking inbound message processing, so the agent still runs its turn while all outbound delivery is suppressed for observer-style setups. (#65461, #53328) 感谢 @omarshahine.
- BlueBubbles: lazy-refresh the Private API server-info cache on send when reply threading or message effects are requested but status is unknown, so sends no longer silently degrade to plain messages when the 10-minute cache expires. (#65447, #43764) 感谢 @omarshahine.
- Heartbeat/security: force owner downgrade for untrusted `hook:wake` system events [AI-assisted]. (#66031) 感谢 @pgondhi987.
- Browser/security: enforce SSRF policy on snapshot, screenshot, and tab routes [AI]. (#66040) 感谢 @pgondhi987.
- Microsoft Teams/security: enforce sender allowlist checks on SSO signin invokes [AI]. (#66033) 感谢 @pgondhi987.
- Config/security: redact `sourceConfig` and `runtimeConfig` alias fields in `redactConfigSnapshot` [AI]. (#66030) 感谢 @pgondhi987.
- Agents/context engines: run opt-in turn maintenance as idle-aware background work so the next foreground turn no longer waits on proactive maintenance. (#65233) 感谢 @100yenadmin.
- Plugins/status: report the registered context-engine IDs in `plugins inspect` instead of the owning plugin ID, so non-matching engine IDs and multi-engine plugins are classified correctly. (#58766) 感谢 @zhuisDEV.
- Context engines: reject resolved plugin engines whose reported `info.id` does not match their registered slot id, so malformed engines fail fast before id-based runtime branches can misbehave. (#63222) 感谢 @fuller-stack-dev.
- WhatsApp: patch installed Baileys media encryption writes during OpenClaw postinstall so the default npm/install.sh delivery path waits for encrypted media files to finish flushing before readback, avoiding transient `ENOENT` crashes on image sends. (#65896) 感谢 @frankekn.
- Gateway/update: unify service entrypoint resolution around the canonical bundled gateway entrypoint so update, reinstall, and doctor repair stop drifting between stale `dist/entry.js` and current `dist/index.js` paths. (#65984) 感谢 @mbelinky.
- Heartbeat/Telegram topics: keep isolated heartbeat replies on the bound forum topic when `target=last`, instead of dropping them into the group root chat. (#66035) 感谢 @mbelinky.
- Browser/CDP: let managed local Chrome readiness, status probes, and managed loopback CDP control bypass browser SSRF policy for their own loopback control plane, so OpenClaw no longer misclassifies a healthy child browser as "not reachable after start". (#65695, #66043) 感谢 @mbelinky.
- Gateway/sessions: stop heartbeat, cron-event, and exec-event turns from overwriting shared-session routing and origin metadata, preventing synthetic `heartbeat` targets from poisoning later cron or user delivery. (#66073, #63733, #35300) 感谢 @mbelinky.
- Browser/CDP: let local attach-only `manual-cdp` profiles reuse the local loopback CDP control plane under strict default policy and remote-class probe timeouts, so tabs/snapshot stop falsely reporting a live local browser session as not running. (#65611, #66080) 感谢 @mbelinky.
- Cron/scheduler: stop inventing short retries when cron next-run calculation returns no valid future slot, and keep a maintenance wake armed so enabled unscheduled jobs recover without entering a refire loop. (#66019, #66083) 感谢 @mbelinky.
- Cron/scheduler: preserve the active error-backoff floor when maintenance repair recomputes a missing cron next-run, so recurring errored jobs do not resume early after a transient next-run resolution failure. (#66019, #66083, #66113) 感谢 @mbelinky.
- Outbound/delivery-queue: persist the originating outbound `session` context on queued delivery entries and replay it during recovery, so write-ahead-queued sends keep their original outbound media policy context after restart instead of evaluating against a missing session. (#66025) 感谢 @eleqtrizit.
- Memory/Ollama: restore the built-in `ollama` embedding adapter in memory-core so explicit `memorySearch.provider: "ollama"` works again, and include endpoint-aware cache keys so different Ollama hosts do not reuse each other's embeddings. (#63429, #66078, #66163) 感谢 @nnish16 and @vincentkoc.
- Auto-reply/queue: split collect-mode followup drains into contiguous groups by per-message authorization context (sender id, owner status, exec/bash-elevated overrides), so queued items from different senders or exec configs no longer execute under the last queued run's owner-only and exec-approval context. (#66024) 感谢 @eleqtrizit.
- Dreaming/memory-core: require a live queued Dreaming cron event before the heartbeat hook runs the sweep, so managed Dreaming no longer replays on later heartbeats after the scheduled run was already consumed. (#66139) 感谢 @mbelinky.
- Control UI/Dreaming: stop Imported Insights and Memory Palace from calling optional `memory-wiki` gateway methods when the plugin is off, and refresh config before wiki reloads so the Dreaming tab stops showing misleading unknown-method failures. (#66140) 感谢 @mbelinky.
- Agents/tools: only mark streamed unknown-tool retries as counted when a streamed message actually classifies an unavailable tool, and keep incomplete streamed tool names from resetting the retry streak before the final assistant message arrives. (#66145) 感谢 @dutifulbob.
- Memory/active-memory: move recalled memory onto the hidden untrusted prompt-prefix path instead of system prompt injection, label the visible Active Memory status line fields, and include the resolved recall provider/model in gateway debug logs so trace/debug output matches what the model actually saw. (#66144) 感谢 @Takhoffman.
- Memory/QMD: stop treating legacy lowercase `memory.md` as a second default root collection, so QMD recall no longer searches phantom `memory-alt-*` collections and builtin/QMD root-memory fallback stays aligned. (#66141) 感谢 @mbelinky.
- Agents/subagents: ship `dist/agents/subagent-registry.runtime.js` in npm builds so `runtime: "subagent"` runs stop stalling in `queued` after the registry import fails. (#66189) 感谢 @yqli2420 and @vincentkoc.
- Agents/OpenAI: map `minimal` thinking to OpenAI's supported `low` reasoning effort for GPT-5.4 requests, so embedded runs stop failing request validation. 感谢 @steipete.
- Voice-call/media-stream: resolve the source IP from trusted forwarding headers for per-IP pending-connection limits when `webhookSecurity.trustForwardingHeaders` and `trustedProxyIPs` are configured, and reserve `maxConnections` capacity for in-flight WebSocket upgrades so concurrent handshakes can no longer momentarily exceed the operator-set cap. (#66027) 感谢 @eleqtrizit.
- Feishu/allowlist: canonicalize allowlist entries by explicit `user`/`chat` kind, strip repeated `feishu:`/`lark:` provider prefixes, and stop folding opaque Feishu IDs to lowercase, so allowlist matching no longer crosses user/chat namespaces or widens to case-insensitive ID matches the operator did not intend. (#66021) 感谢 @eleqtrizit.
- Telegram/status commands: let read-only status slash commands bypass busy topic turns, while keeping `/export-session` on the normal lane so it cannot interleave with an in-flight session mutation. (#66226) 感谢 @VACInc and @vincentkoc.
- TTS/reply media: persist OpenClaw temp voice outputs into managed outbound media and allow them through reply-media normalization, so voice-note replies stop silently dropping. (#63511) 感谢 @jetd1.
- Agents/tools: treat Windows drive-letter paths (`C:\\...`) as absolute when resolving sandbox and read-tool paths so workspace root is not prepended under POSIX path rules. (#54039) 感谢 @ly85206559 and @vincentkoc.
- Agents/OpenAI: recover embedded GPT-style runs when reasoning-only or empty turns need bounded continuation, with replay-safe retry gating and incomplete-turn fallback when no visible answer arrives. (#66167) thanks @jalehman
- Outbound/relay-status: suppress internal relay-status placeholder payloads (`No channel reply.`, `Replied in-thread.`, `Replied in #...`, wiki-update status variants ending in `No channel reply.`) before channel delivery so internal housekeeping text does not leak to users.
- Slack/doctor: add a dedicated doctor-contract sidecar so config warmup paths such as `openclaw cron` no longer fall back to Slack's broader contract surface, which could trigger Slack-related config-read crashes on affected setups. (#63192) 感谢 @shhtheonlyperson.
- Hooks/session-memory: pass the resolved agent workspace into gateway `/new` and `/reset` session-memory hooks so reset snapshots stay scoped to the right agent workspace instead of leaking into the default workspace. (#64735) 感谢 @suboss87 and @vincentkoc.
- CLI/approvals: raise the default `openclaw approvals get` gateway timeout and report config-load timeouts explicitly, so slow hosts stop showing a misleading `Config unavailable.` note when the approvals snapshot succeeds but the follow-up config RPC needs more time. (#66239) 感谢 @neeravmakwana.
- Media/store: honor configured agent media limits when saving generated media and persisting outbound reply media, so the store no longer hard-stops those flows at 5 MB before the configured limit applies. (#66229) 感谢 @neeravmakwana and @vincentkoc.
- Plugins/setup-entry: preserve separate setup-entry secrets exports when loading bundled setup-runtime channels, so setup-mode flows keep the channel secret contract for split plugin + secrets entrypoints. (#66261) 感谢 @hxy91819.
- CLI/update: prune stale packaged `dist` chunks after npm upgrades, verify installed package inventory, and keep downgrade/update verification working across older releases. (#66959) 感谢 @obviyus.
- Gateway/exec events: dedupe replayed `exec.finished` node events by canonical session key plus `runId` so duplicate async completion replays no longer inject duplicate completion turns into the parent session transcript. (#67281) thanks @jalehman.

## 🚀 v2026.4.12 (2026年4月12日)

### ✨ 新增功能与改进

- QA/lab: add Convex-backed pooled Telegram credential leasing plus `openclaw qa credentials` admin commands and broker setup docs. (#65596) 感谢 @joshavant.
- Memory/Active Memory: add a new optional Active Memory plugin that gives OpenClaw a dedicated memory sub-agent right before the main reply, so ongoing chats can automatically pull in relevant preferences, context, and past details without making users remember to manually say "remember this" or "search memory" first. Includes configurable message/recent/full context modes, live `/verbose` inspection, advanced prompt/thinking overrides for tuning, and opt-in transcript persistence for debugging. Docs: https://docs.openclaw.ai/concepts/active-memory. (#63286) 感谢 @Takhoffman.
- macOS/Talk: add an experimental local MLX speech provider for Talk Mode, with explicit provider selection, local utterance playback, interruption handling, and system-voice fallback. (#63539) 感谢 @ImLukeF.
- CLI/exec policy: add a local `openclaw exec-policy` command with `show`, `preset`, and `set` subcommands for synchronizing requested `tools.exec.*` config with the local exec approvals file, plus follow-up hardening for node-host rejection, rollback safety, and sync conflict detection.（#64050）
- Gateway: add a `commands.list` RPC so remote gateway clients can discover runtime-native, text, skill, and plugin commands with surface-aware naming and serialized argument metadata. (#62656) 感谢 @samzong.
- Models/providers: add per-provider `models.providers.*.request.allowPrivateNetwork` for trusted self-hosted OpenAI-compatible endpoints, keep the opt-in scoped to model request surfaces, and refresh cached WebSocket managers when request transport overrides change. (#63671) 感谢 @qas.
- QA/testing: add a `--runner multipass` lane for `openclaw qa suite` so repo-backed QA scenarios can run inside a disposable Linux VM and write back the usual report, summary, and VM logs. (#63426) 感谢 @shakkernerd.
- Docs i18n: chunk raw doc translation, reject truncated tagged outputs, avoid ambiguous body-only wrapper unwrapping, and recover from terminated Pi translation sessions without changing the default `openai/gpt-5.4` path. (#62969, #63808) 感谢 @hxy91819.
- Control UI/dreaming: simplify the Scene and Diary surfaces, preserve unknown phase state for partial status payloads, and stabilize waiting-entry recency ordering so Dreaming status and review lists stay clear and deterministic. (#64035) 感谢 @davemorin.
- Gateway: split startup and runtime seams so gateway lifecycle sequencing, reload state, and shutdown behavior stay easier to maintain without changing observed behavior. (#63975) 感谢 @gumadeiras.
- Matrix/partial streaming: add MSC4357 live markers to draft preview sends and edits so supporting Matrix clients can render a live/typewriter animation and stop it when the final edit lands. (#63513) 感谢 @TigerInYourDream.
- QA/Telegram: add a live `openclaw qa telegram` lane for private-group bot-to-bot checks, harden its artifact handling, and preserve native Telegram command reply threading for QA verification. (#64303) 感谢 @obviyus.
- Models/Codex: add the bundled Codex provider and plugin-owned app-server harness so `codex/gpt-*` models use Codex-managed auth, native threads, model discovery, and compaction while `openai/gpt-*` stays on the normal OpenAI provider path. (#64298) 感谢 @steipete.
- Models/providers: add a bundled LM Studio provider with onboarding, runtime model discovery, stream preload support, and memory-search embeddings for local/self-hosted OpenAI-compatible models. (#53248) 感谢 @rugvedS07.
- Plugins/loading: narrow CLI, provider, and channel activation to manifest-declared needs, preserve explicit scope and trust boundaries, and centralize manifest-owner policy so startup, command discovery, and runtime activation avoid loading unrelated plugin runtime. (#65120, #65259, #65298, #65429, #65459) 感谢 @vincentkoc.
- Memory/active-memory: default QMD recall to search and surface better search-path telemetry so memory-backed recall works more predictably out of the box. (#65068) 感谢 @Takhoffman.
- Docs/providers: expand bundled provider docs with richer capability, env-var, and setup guidance across provider pages.
- Docs/memory-wiki: add the recommended QMD + bridge-mode hybrid recipe plus zero-artifact troubleshooting guidance for `memory-wiki` bridge setups. (#63165) 感谢 @sercada and @vincentkoc.

### 🐛 问题修复

- fix(security): remove busybox/toybox from interpreter-like safe bins [AI-assisted]. (#65713) 感谢 @pgondhi987.
- fix(approval-auth): prevent empty approver list from granting explicit approval authorization [AI]. (#65714) 感谢 @pgondhi987.
- fix(security): broaden shell-wrapper detection and block env-argv assignment injection [AI-assisted]. (#65717) 感谢 @pgondhi987.
- Gateway/startup: defer scheduled services until sidecars finish, gate chat history and model listing during sidecar resume, and let Control UI retry startup-gated history loads so Sandbox wake resumes channels first. (#65365) 感谢 @lml2468.
- Control UI/chat: load the live gateway slash-command catalog into the composer and command palette so dock commands, plugin commands, and direct skill aliases appear in chat, while keeping trusted local commands authoritative and bounding remote command metadata. (#65620) 感谢 @BunsDev.
- CLI/update: respawn tracked plugin refresh from the updated entrypoint after package self-updates so `openclaw update` stops failing on stale hashed `dist/install.runtime-*.js` chunk imports.（#65471）
- Memory/active-memory: keep recall runs on the resolved channel when wrappers like `mx-claw` are enabled, improve lexical fallback ranking, and keep lexical boosts out of hybrid search so recall finds the right memories more consistently. (#65049, #65395) 感谢 @Takhoffman.
- Dreaming: consume managed heartbeat events exactly once, stage light-sleep confidence from all recorded short-term signals, wake scheduled jobs immediately, raise dreaming-only promotion enough to cross the durable-memory gate, and stop dreaming from re-ingesting its own narrative transcripts.
- Dreaming/narrative: harden transient narrative cleanup by retrying timed-out deletes, scrubbing stale dreaming session artifacts through the lock-aware session-store path, and isolating transient narrative session keys per workspace. (#65320, #61674)
- Memory/wiki: preserve Unicode letters, digits, and combining marks in wiki slugs and contradiction clustering, and cap Unicode filename segments to safe byte lengths so non-ASCII titles stop collapsing or overflowing path limits. (#64742) 感谢 @zhouhe-xydt.
- Memory/short-term recall: allow nested daily notes under `memory/**/YYYY-MM-DD.md` to feed short-term recall, while still excluding generated dream reports under `memory/dreaming/**` so dreaming does not promote its own output. (#64682) 感谢 @SARAMALI15792.
- UI/WebChat: hide synthetic transcript-repair tool results from chat history reloads so internal recovery markers do not leak into visible chat after reconnects. (#65247) 感谢 @wangwllu.
- WhatsApp/outbound: fall back to the first `mediaUrls` entry when `mediaUrl` is empty so gateway media sends stop silently dropping attachments that already have a resolved media list. (#64394) 感谢 @eric-fr4 and @vincentkoc.
- Doctor/Discord: stop `openclaw doctor --fix` from rewriting legacy Discord preview-streaming config into the nested modern shape, so downgrades can still recover without hand-editing `channels.discord.streaming`. (#65035) 感谢 @vincentkoc.
- Gateway/auth: blank the shipped example gateway credential in `.env.example` and fail startup when a copied placeholder token or password is still configured, so operators cannot accidentally launch with a publicly known secret. (#64586) 感谢 @navarrotech and @vincentkoc.

- Memory/active-memory+dreaming: keep active-memory recall runs on the strongest resolved channel, consume managed dreaming heartbeat events exactly once, stop dreaming from re-ingesting its own narrative transcripts, and add explicit repair/dedupe recovery flows in CLI, doctor, and the Dreams UI.
- Agents/queueing: carry orphaned active-turn user text into the next prompt before repairing transcript ordering, so follow-up messages that arrive mid-run are no longer silently dropped. (#65388) 感谢 @adminfedres and @vincentkoc.
- Gateway/keepalive: stop marking WebSocket tick broadcasts as droppable so slow or backpressured clients do not self-disconnect with `tick timeout` while long-running work is still alive. (#65256) 感谢 @100yenadmin and @vincentkoc.
- Matrix/mentions: keep room mention gating strict while accepting visible `@displayName` Matrix URI labels, so `requireMention` works for non-OpenClaw Matrix clients again. (#64796) 感谢 @hclsys.
- Doctor: warn when on-disk agent directories still exist under `~/.openclaw/agents/<id>/agent` but the matching `agents.list[]` entries are missing from config. (#65113) 感谢 @neeravmakwana.
- Telegram: route approval button callback queries onto a separate sequentializer lane so plugin approval clicks can resolve immediately instead of deadlocking behind the blocked agent turn. (#64979) 感谢 @nk3750.
- Telegram/direct sessions: keep commentary-only assistant fallback payloads out of visible direct delivery, so Codex planning chatter cannot leak into Telegram DMs when a run has no `final_answer` text.
- Gateway/keepalive: stop marking WebSocket tick broadcasts as droppable so slow or backpressured clients do not self-disconnect with `tick timeout` while long-running work is still alive.（#65436）
- Gateway/plugins: always send a non-empty `idempotencyKey` for plugin subagent runs, so dreaming narrative jobs stop failing gateway schema validation. (#65354) 感谢 @CodeForgeNet.
- Gateway/auth: blank the shipped example gateway credential in `.env.example` and fail startup when a copied placeholder token or password is still configured, so operators cannot accidentally launch with a publicly known secret. (#64586) 感谢 @navarrotech.
- Plugins/memory-core dreaming: keep bundled `memory-core` loaded alongside an explicit external memory slot owner only when that owner enables dreaming, while preserving `plugins.slots.memory = "none"` disable semantics. (#65411) 感谢 @pradeep7127.
- Doctor/Discord: stop `openclaw doctor --fix` from rewriting legacy Discord preview-streaming config into the nested modern shape, so downgrades can still recover without hand-editing `channels.discord.streaming`.
- Doctor: warn when on-disk agent directories still exist under `~/.openclaw/agents/<id>/agent` but the matching `agents.list[]` entries are missing from config. (#65113) 感谢 @neeravmakwana.
- CLI/plugins: honor `memory-wiki` when `plugins.allow` is set for `openclaw wiki`, and pass the active app config into the metadata registrar so plugin-owned wiki commands resolve the live plugin config instead of falling back to defaults. (#64779, #65012)
- QA/packaging: stop packaged QA helpers from crashing when optional scenario execution config is unavailable, so npm distributions can skip the repo-only scenario pack without breaking completion-cache and startup paths. (#65118) 感谢 @EdderTalmor.
- Media/audio transcription: surface the real provider failure when every audio transcription attempt fails, so status output and the CLI stop collapsing those errors into generic skips. (#65096) 感谢 @l0cka.
- Infra/net: fix multipart FormData fields (including `model`) being silently dropped when a guarded runtime fetch body crosses a FormData implementation boundary, restoring OpenAI audio transcription requests that failed with HTTP 400. (#64349) 感谢 @petr-sloup.
- Dreaming/diary: use the host local timezone for diary timestamps when `dreaming.timezone` is unset, and include the timezone abbreviation so `DREAMS.md` and the UI make local or UTC time explicit. (#65034, #65057)
- Dreaming/promotion: raise phase reinforcement enough for repeated dreaming-only revisits to clear the default durable-memory gate after multiple days, instead of stalling just below the score threshold. (#64068) 感谢 @vincentkoc.
- Dreaming/light-sleep: compute staged candidate confidence from all recorded short-term signals instead of recall-only counts, so dreaming-only entries stop rendering as `confidence: 0.00`. (#64599) 感谢 @vincentkoc.
- Plugins/memory: restore cached memory capability public artifacts on plugin-registry cache hits so memory-backed artifact surfaces stay visible after warm loads.
- Gateway/cron: preserve requested isolated-agent config across runtime reloads so subagent jobs and heartbeat overrides keep the right workspace and heartbeat settings when the hot-loaded snapshot is stale.
- Cron/isolated sessions: persist the right transcript path for each isolated run, including fresh session rollovers, so cron runs stop appending to stale session files.
- Discord/gateway: clear stale heartbeat timers before reconnecting so zombie gateway callbacks cannot crash the process and drop in-flight replies. (#65009) 感谢 @SARAMALI15792.
- Matrix/mentions: keep room mention gating strict while accepting visible `@displayName` Matrix URI labels, so `requireMention` works for non-OpenClaw Matrix clients again. (#64796) 感谢 @hclsys.
- Agents/Anthropic replay: preserve immutable signed-thinking replay safety across stored and live reruns, keep non-thinking embedded `tool_result` user blocks intact, and drop conflicting preserved tool IDs before validation so retries stop degrading into omitted tool calls. (#65126) 感谢 @shakkernerd.
- Memory/QMD: allow channel sessions in the shipped default QMD scope, while still denying groups.
- Memory/QMD: stop registering the legacy lowercase root memory file as a separate default collection, so QMD now prefers `MEMORY.md` and the `memory/` tree without duplicate collection-add warnings.
- Memory/memory-core: watch the `memory` directory directly and ignore non-markdown churn so nested note changes still sync on macOS + Node 25 environments where recursive `memory/**/*.md` glob watching fails. (#64711) 感谢 @jasonxargs-boop and @vincentkoc.
- WhatsApp: centralize per-account connection ownership so reconnects, login recovery, and outbound readiness stay attached to the live socket instead of drifting across monitor and login paths. (#65290) 感谢 @mcaxtr and @vincentkoc.
- iMessage: retry transient `watch.subscribe` startup failures before tearing down the monitor, and sanitize startup error logging so brief local transport stalls do not immediately bounce the channel or leak raw imsg RPC payloads into logs. (#65393) 感谢 @vincentkoc.
- CLI/audio providers: report env-authenticated providers as configured in `openclaw infer audio providers --json`, while keeping trusted workspace provider env lookup defaults stable during auth setup.（#65491）
- Plugins/install: reinstall bundled runtime packages when the matching platform native optional child is missing, so packaged Windows installs can recover dependencies that were packed on another host OS.
- Memory/QMD: preserve explicit `memory.qmd.command` paths, create missing agent workspaces before QMD probes, and keep the current Node binary on QMD subprocess PATH so service and gateway environments do not fall back to builtin search unnecessarily.
- Plugins/Lobster: load the published `@clawdbot/lobster/core` runtime in process so bundled Lobster runs stop depending on private package internals. (#64755) 感谢 @mbelinky.
- Agents/CLI: keep unrelated config, session, transcript, and MCP bootstrap runtime off common `openclaw agent` cold paths so provider selection and agent startup stop stalling on heavyweight imports. 感谢 @vincentkoc.
- Setup/config/install: stop setup, config dry-runs, and daemon install from eagerly booting auth-profile and plugin repair runtime when those paths are not needed, so onboarding and local service setup avoid long cold-start stalls. 感谢 @vincentkoc.
- Cron/direct delivery: slim isolated-agent delivery cold paths so direct channel delivery and related cron execution spend less time loading unrelated auth, plugin, and channel runtime. 感谢 @vincentkoc.
- Channels/replay dedupe: standardize replay claims, retryable-failure release, and post-success commit behavior across Telegram, Discord, Slack, Mattermost, WhatsApp, Matrix, LINE, Feishu, Zalo, Nextcloud Talk, TLON, Nostr, Voice Call, and shared plugin interactive callbacks so duplicate deliveries stay reply-once after success but retry cleanly after pre-delivery failures. 感谢 @vincentkoc.
- Agents/OpenAI mini reasoning: remap unsupported `low` and `minimal` reasoning effort to `medium` for affected OpenAI mini models, and add a live regression lane to keep the compatibility fix covered. (#65478) 感谢 @vincentkoc.
- Configure/wizard: replay wizard edits onto the latest config snapshot after a hash conflict so plugin-auth writes no longer get dropped during `openclaw configure`, including nested config under shared sections such as `plugins`. (#64188) 感谢 @feiskyer and @vincentkoc.

## 🚀 v2026.4.11 (2026年4月11日)

### ✨ 新增功能与改进

- Dreaming/memory-wiki: add ChatGPT import ingestion plus new `Imported Insights` and `Memory Palace` diary subtabs so Dreaming can inspect imported source chats, compiled wiki pages, and full source pages directly from the UI.（#64505）
- Control UI/webchat: render assistant media/reply/voice directives as structured chat bubbles, add the `[embed ...]` rich output tag, and gate external embed URLs behind config.（#64104）
- Tools/video_generate: add URL-only generated asset delivery, typed `providerOptions`, reference audio inputs, per-asset role hints, `adaptive` aspect-ratio support, and a higher image-input cap so video providers can expose richer generation modes without forcing large files into memory. (#61987, #61988) 感谢 @xieyongliang.
- Feishu: improve document comment sessions with richer context parsing, comment reactions, and typing feedback so document-thread conversations behave more like chat conversations.（#63785）
- Microsoft Teams: add reaction support, reaction listing, Graph pagination, and delegated OAuth setup for sending reactions while preserving application-auth read paths.（#51646）
- Plugins: allow plugin manifests to declare activation and setup descriptors so plugin setup flows can describe required auth, pairing, and configuration steps without hardcoded core special cases.（#64780）
- Ollama: cache `/api/show` context-window and capability metadata during model discovery so repeated picker refreshes stop refetching unchanged models, while still retrying after empty responses and invalidating on digest changes. (#64753) 感谢 @ImLukeF.
- Models/providers: surface how configured OpenAI-compatible endpoints are classified in embedded-agent debug logs, so local and proxy routing issues are easier to diagnose. (#64754) 感谢 @ImLukeF.
- QA/parity: add the GPT-5.4 vs Opus 4.6 agentic parity report gate with shared scenario coverage checks, stricter evidence heuristics, and skipped-scenario accounting for maintainer review. (#64441) 感谢 @100yenadmin.

### 🐛 问题修复

- Windows/onboarding: open provider OAuth and sign-in URLs with `explorer.exe` instead of routing them through `cmd /c start`, so quoted provider URLs cannot break out into host command execution. (#64161) 感谢 @coygeek and @vincentkoc.
- OpenAI/Codex OAuth: stop rewriting the upstream authorize URL scopes so new Codex sign-ins do not fail with `invalid_scope` before returning an authorization code. (#64713) 感谢 @fuller-stack-dev.
- Audio transcription: disable pinned DNS only for OpenAI-compatible multipart requests, while still validating hostnames, so OpenAI, Groq, and Mistral transcription works again without weakening other request paths. (#64766) 感谢 @GodsBoy.
- macOS/Talk Mode: after granting microphone permission on first enable, continue starting Talk Mode instead of requiring a second toggle. (#62459) 感谢 @ggarber.
- Control UI/webchat: persist agent-run TTS audio replies into webchat history and preserve interleaved tool card pairing so generated audio and mixed tool output stay attached to the right messages. (#63514) 感谢 @bittoby.
- WhatsApp: honor the configured default account when the active listener helper is used without an explicit account id, so named default accounts do not get registered under `default`. (#53918) 感谢 @yhyatt.
- ACP/agents: suppress commentary-phase child assistant relay text in ACP parent stream updates, so spawned child runs stop leaking internal progress chatter into the parent session. 感谢 @vincentkoc.
- Agents/timeouts: honor explicit run timeouts in the LLM idle watchdog and align default timeout config so slow models can keep working until the configured limit instead of using the wrong idle window.
- Config: include `asyncCompletion` in the generated zod schema so documented async completion config no longer fails with an unrecognized-key error.（#63618）
- Google/Veo: stop sending the unsupported `numberOfVideos` request field so Gemini Developer API Veo runs do not fail before OpenClaw can complete the intended Google video generation path. (#64723) 感谢 @velvet-shark.
- QA/packaging: stop packaged CLI startup and completion cache generation from reading repo-only QA scenario markdown, ship the bundled QA scenario pack in npm releases, and keep `openclaw completion --write-state` working even if QA setup is broken. (#64648) 感谢 @obviyus.
- Codex/QA: keep Codex app-server coordination chatter out of visible replies, add a live QA leak scenario, and classify leaked harness meta text as a QA failure instead of a successful reply. 感谢 @vincentkoc.
- WhatsApp: route `message react` through the gateway-owned action path so reactions use the live WhatsApp listener in both DM and group chats, matching `message send` and `message poll`. 感谢 @mcaxtr.
- Auto-reply/WhatsApp: preserve inbound image attachment notes after media understanding so image edits keep the real saved media path instead of hallucinating a missing local path. (#64918) 感谢 @ngutman.
- Telegram/sessions: keep topic-scoped session initialization on the canonical topic transcript path when inbound turns omit `MessageThreadId`, so one topic session no longer alternates between bare and topic-qualified transcript files. (#64869) 感谢 @jalehman.
- Agents/failover: scope assistant-side fallback classification and surfaced provider errors to the current attempt instead of stale session history, so cross-provider fallback runs stop inheriting the previous provider's failure. (#62907) 感谢 @stainlu.
- MiniMax/OAuth: write `api: "anthropic-messages"` and `authHeader: true` into the `minimax-portal` config patch during `openclaw configure`, so re-authenticated portal setups keep Bearer auth routing working. (#64964) 感谢 @ryanlee666.
- Agents/tools: stop repeated unavailable-tool retries from escaping loop detection when the model changes arguments, and rewrite over-threshold unknown tool calls into plain assistant text before dispatch. (#65922) 感谢 @dutifulbob.
- Cron/announce delivery: tell isolated cron jobs to return the full response exactly instead of a summary, so structured `--announce` deliveries stop dropping fields nondeterministically. (#65638) 感谢 @srinivaspavan9 and @vincentkoc.
- Security/exec approvals: redact bearer tokens, API keys, and similar secrets in exec approval prompt command text before those prompts are posted back to chat channels, regardless of logging redaction settings. (#61077) 感谢 @feiskyer and @vincentkoc.

## 🚀 v2026.4.10 (2026年4月10日)

### ✨ 新增功能与改进

- Models/Codex: add the bundled Codex provider and plugin-owned app-server harness so `codex/gpt-*` models use Codex-managed auth, native threads, model discovery, and compaction while `openai/gpt-*` stays on the normal OpenAI provider path.（#64298）
- Memory/Active Memory: add a new optional Active Memory plugin that gives OpenClaw a dedicated memory sub-agent right before the main reply, so ongoing chats can automatically pull in relevant preferences, context, and past details without making users remember to manually say "remember this" or "search memory" first. Includes configurable message/recent/full context modes, live `/verbose` inspection, advanced prompt/thinking overrides for tuning, and opt-in transcript persistence for debugging. Docs: https://docs.openclaw.ai/concepts/active-memory. (#63286) 感谢 @Takhoffman.
- macOS/Talk: add an experimental local MLX speech provider for Talk Mode, with explicit provider selection, local utterance playback, interruption handling, and system-voice fallback. (#63539) 感谢 @ImLukeF.
- Tools/video generation: add Seedance 2.0 model refs to the bundled fal provider and submit the provider-specific duration, resolution, audio, and seed metadata fields needed for live Seedance 2.0 runs.
- Microsoft Teams: add message actions for pin, unpin, read, react, and listing reactions. (#53432) 感谢 @sudie-codes.
- QA/Matrix: add a live `openclaw qa matrix` lane backed by a disposable Matrix homeserver, shared live-transport seams, and Matrix-specific transport coverage for threading, reactions, restart, and allowlist behavior. (#64489) 感谢 @gumadeiras.
- QA/Telegram: add a live `openclaw qa telegram` lane for private-group bot-to-bot checks, harden its artifact handling, and preserve native Telegram command reply threading for QA verification. (#64303) 感谢 @obviyus.
- QA/testing: add a `--runner multipass` lane for `openclaw qa suite` so repo-backed QA scenarios can run inside a disposable Linux VM and write back the usual report, summary, and VM logs. (#63426) 感谢 @shakkernerd.
- CLI/exec policy: add a local `openclaw exec-policy` command with `show`, `preset`, and `set` subcommands for synchronizing requested `tools.exec.*` config with the local exec approvals file, plus follow-up hardening for node-host rejection, rollback safety, and sync conflict detection.（#64050）
- Gateway: add a `commands.list` RPC so remote gateway clients can discover runtime-native, text, skill, and plugin commands with surface-aware naming and serialized argument metadata. (#62656) 感谢 @samzong.
- Models/providers: add per-provider `models.providers.*.request.allowPrivateNetwork` for trusted self-hosted OpenAI-compatible endpoints, keep the opt-in scoped to model request surfaces, and refresh cached WebSocket managers when request transport overrides change. (#63671) 感谢 @qas.
- Feishu: standardize request user agents and register the bot as an AI agent so Feishu deployments identify OpenClaw consistently. (#63835) 感谢 @evandance.
- Docs i18n: chunk raw doc translation, reject truncated tagged outputs, avoid ambiguous body-only wrapper unwrapping, and recover from terminated Pi translation sessions without changing the default `openai/gpt-5.4` path. (#62969, #63808) 感谢 @hxy91819.
- Gateway: split startup and runtime seams so gateway lifecycle sequencing, reload state, and shutdown behavior stay easier to maintain without changing observed behavior. (#63975) 感谢 @gumadeiras.
- Control UI/webchat: normalize assistant `MEDIA:`/reply/voice directives into structured bubble rendering, rename the unreleased rich web shortcode to `[embed ...]`, and surface session runtime roots so hosted web content is written to the correct document path instead of guessed local files.
- Matrix/partial streaming: add MSC4357 live markers to draft preview sends and edits so supporting Matrix clients can render a live/typewriter animation and stop it when the final edit lands. (#63513) 感谢 @TigerInYourDream.
- Control UI/dreaming: simplify the Scene and Diary surfaces, preserve unknown phase state for partial status payloads, and stabilize waiting-entry recency ordering so Dreaming status and review lists stay clear and deterministic. (#64035) 感谢 @davemorin.
- Agents: add an opt-in strict-agentic embedded Pi execution contract for GPT-5-family runs so plan-only or filler turns keep acting until they hit a real blocker. (#64241) 感谢 @100yenadmin.
- Agents/OpenAI: add provider-owned OpenAI/Codex tool schema compatibility and surface embedded-run replay/liveness state for long-running runs. (#64300) 感谢 @100yenadmin.
- Dreaming/memory-wiki: add ChatGPT import ingestion plus new `Imported Insights` and `Memory Palace` diary subtabs so Dreaming can inspect imported source chats, compiled wiki pages, and full source pages directly from the UI.（#64505）

### 🐛 问题修复

- Browser/security: tighten browser and sandbox navigation defenses across strict SSRF defaults, hostname allowlists, interaction-driven redirects, subframes, CDP discovery, existing sessions, tab actions, noVNC, marker-span sanitization, and Docker CDP source-range enforcement. (#61404, #63332, #63882, #63885, #63889, #64367, #64370, #64371)
- Security/tools: harden exec preflight reads, host env denylisting, node output boundaries, outbound host-media reads, profile-mutation authorization, plugin install dependency scanning, ACPX tool hooks, Gmail watcher token redaction, and oversized realtime WebSocket frame handling. (#62333, #62661, #62662, #63277, #63551, #63553, #63886, #63890, #63891, #64459)
- OpenAI/Codex: add required Codex OAuth scopes, classify provider/runtime failures more clearly, stop suggesting `/elevated full` when auto-approved host exec is unavailable, add OpenAI/Codex tool-schema compatibility, and preserve embedded-run replay/liveness truth across compaction retries and mutating side effects. (#64300, #64439) 感谢 @100yenadmin.
- CLI/WhatsApp media sends: route gateway-mode outbound sends with `--media` through the channel `sendMedia` path and preserve media access context, so WhatsApp document and attachment sends stop silently dropping the file while still delivering the caption. (#64478, #64492) 感谢 @ShionEria.
- Microsoft Teams: restore media downloads for personal DMs, Bot Framework `a:` conversations, OneDrive/SharePoint shared files, and Graph-backed chat IDs; accept Bot Framework audience tokens; prevent feedback-learning filename collisions; keep long tool chains alive with typing indicators; add SSO sign-in callbacks; inject parent context for thread replies; and deliver cron announcements to Teams conversation IDs. (#54932, #55383, #55386, #58001, #58249, #58774, #59731, #60956, #62219, #62674, #63063, #63942, #63945, #63949, #63951, #63953, #64087, #64088, #64089)
- Gateway/tailscale: start Tailscale exposure and the gateway update check before awaiting channel and plugin sidecar startup so remote operators are not locked out when startup sidecars stall.
- Gateway/startup: keep WebSocket RPC available while channels and plugin sidecars start, hold `chat.history` unavailable until startup sidecars finish so synchronous history reads cannot stall startup (reported in #63450), refresh advertised gateway methods after deferred plugin reloads, and enforce the pre-auth WebSocket upgrade budget before the no-handler 503 path so upgrade floods cannot bypass connection limits during that window. (#63480) 感谢 @neeravmakwana.
- WhatsApp: keep inbound replies, media, composing indicators, and queued outbound deliveries attached to the current socket across reconnect gaps, including fresh retry-eligible sends after the listener comes back. (#30806, #46299, #62892, #63916) 感谢 @mcaxtr.
- Gateway/thread routing: preserve Slack, Telegram, Mattermost, Matrix, ACP, restart-sentinel, and agent announce delivery targets so subagent, cron, stream-relay, session fallback, and restart messages land back in the originating thread, topic, or room casing. (#54840, #57056, #63143, #63228, #63506, #64343, #64391)
- Models/fallback: preserve `/models` selection across transient primary-model failures and config reloads, allow timeout cooldown probes, classify OpenRouter no-endpoints responses, detect llama.cpp context overflows, and keep provider/runtime context metadata stable through reloads. (#61472, #64196, #64471)
- Agents/BTW: keep `/btw` side questions working after tool-use turns by stripping replayed tool blocks, hidden reasoning, and malformed image payloads, omitting empty tool arrays, allowing Bedrock `auth: "aws-sdk"`, and routing Feishu `/btw` plus `/stop` through bounded out-of-band lanes. (#64218, #64219, #64225, #64324) 感谢 @ngutman.
- Control UI/BTW: render `/btw` side results as dismissible ephemeral cards in the browser, send `/btw` immediately during active runs, and clear stale BTW cards on reset flows so webchat matches the intended detached side-question behavior. (#64290) 感谢 @ngutman.
- Commands/targeting: use the selected agent or session for command output, send policy, usage/cost, context reports, model lists, bash sandbox hints, BTW/compact working directories, plugin commands, and session exports so multi-agent commands describe and mutate the intended target instead of the requester.
- Conversation bindings: normalize focused/current conversation ids, preserve binding metadata on account and Discord rebinds, avoid stale Discord lifecycle windows, and keep generic activity touches persisted so reply routing survives rebinds and restarts.
- iMessage/self-chat: distinguish normal DM outbound rows from true self-chat using `destination_caller_id` plus chat participants, preserve multi-handle self-chat aliases, drop ambiguous reflected echoes, and strip wrapped imsg RPC text fields. (#61619, #63868, #63980, #63989, #64000) 感谢 @neeravmakwana.
- Matrix: keep multi-account room scoping consistent, keep packaged crypto migrations warning-only when appropriate, preserve ordered block streaming, add explicit Matrix block-streaming opt-in, and resolve verification/bootstrap from the packaged runtime entry. (#58449, #59249, #59266, #64373) 感谢 @gumadeiras.
- Telegram/security: tighten Telegram `allowFrom` sender validation and keep `/whoami` allowlist reporting in sync with command auth checks.
- Agents/timeouts: extend the default LLM idle window to 120s and keep silent no-token idle timeouts on recovery paths, so slow models can retry or fall back before users see an error.
- Gateway/agents: preserve configured model selection and richer `IDENTITY.md` content across agent create/update flows and workspace moves, and fail safely instead of silently overwriting unreadable identity files. (#61577) 感谢 @samzong.
- Skills/TaskFlow: restore valid frontmatter fences for the bundled `taskflow` and `taskflow-inbox-triage` skills and copy bundled `SKILL.md` files as hard dist-runtime copies so skills stay discoverable and loadable after updates. (#64166, #64469) 感谢 @extrasmall0.
- Skills: respect overridden home directories when loading personal skills so service, test, and custom launch environments read the intended user skill directory instead of the process home.
- Windows/exec: settle supervisor waits from child exit state after stdout and stderr drain even when `close` never arrives, so CLI commands stop hanging or dying with forced `SIGKILL` on Windows. (#64072) 感谢 @obviyus.
- Browser/sandbox: prevent sandbox browser CDP startup hangs by recreating containers when the browser security hash changes and by waiting on the correct sandbox browser lifecycle. (#62873) 感谢 @Syysean.
- QQBot/streaming: make block streaming configurable per QQ bot account via `streaming.mode` (`"partial"` | `"off"`, default `"partial"`) instead of hardcoding it off, so responses can be delivered incrementally.（#63746）
- QQBot/config: allow extra fields in `channels.qqbot` and `channels.qqbot.accounts.*` so extended qqbot builds can add new config options without gateway startup failing on schema validation. (#64075) 感谢 @WideLee.
- Dreaming/gateway: require `operator.admin` for persistent `/dreaming on|off` changes and treat missing gateway client scopes as unprivileged instead of silently allowing config writes. (#63872) 感谢 @mbelinky.
- Gateway/pairing: prefer explicit QR bootstrap auth over earlier Tailscale auth classification so iOS `/pair qr` silent bootstrap pairing does not fall through to `pairing required`. (#59232) 感谢 @ngutman.
- Browser/control: auto-generate browser-control auth tokens for `none` and `trusted-proxy` modes, and route browser auth/profile/doctor helpers through the public browser plugin facades. (#63280, #63957) 感谢 @pgondhi987.
- Browser/act: centralize `/act` request normalization and execution dispatch while adding stable machine-readable route-level error codes for invalid requests, selector misuse, evaluate-disabled gating, target mismatch, and existing-session unsupported actions. (#63977) 感谢 @joshavant.
- Security/QQBot: enforce media storage boundaries for all outbound local file paths and route image-size probes through SSRF-guarded media fetching instead of raw `fetch()`. (#63271, #63495) 感谢 @pgondhi987.
- Channel setup: ignore workspace plugin shadows when resolving trusted channel setup catalog entries so onboarding and setup flows keep using the bundled, trusted setup contract.
- Gateway/memory startup: load the explicitly selected memory-slot plugin during gateway startup, while keeping restrictive allowlists and implicit default memory slots from auto-starting unrelated memory plugins. (#64423) 感谢 @EronFan.
- Config/plugins: let config writes keep disabled plugin entries without forcing required plugin config schemas or crashing raw plugin validation, and avoid re-activating plugin registry state during schema checks. (#54971, #63296) 感谢 @fuller-stack-dev.
- Config validation: surface the actual offending field for strict-schema union failures in bindings, including top-level unexpected keys on the matching ACP branch. (#40841) 感谢 @Hollychou924.
- Wizard/plugin config: coerce integer-typed plugin config fields from interactive text input so integer schema values persist as numbers instead of failing validation. (#63346) 感谢 @jalehman.
- Daemon/gateway install: preserve safe custom service env vars on forced reinstall, merge prior custom PATH segments behind the managed service PATH, and stop removed managed env keys from persisting as custom carryover. (#63136) 感谢 @WarrenJones.
- Cron/scheduling: treat `nextRunAtMs <= 0` as invalid across cron update, maintenance, timer, and stale-delivery paths so corrupted zero timestamps self-heal instead of causing immediate runs or skipped deliveries. (#63507) 感谢 @WarrenJones.
- Cron/auth: resolve auth profiles consistently for isolated cron jobs so scheduled runs use the same configured provider credentials as interactive sessions. (#62797) 感谢 @neeravmakwana.
- Tasks: let `openclaw tasks cancel` cancel stuck background tasks that never reached a normal terminal state. (#62506) 感谢 @neeravmakwana.
- Sessions/model selection: preserve catalog-backed session model labels, provider-qualified context limits, and already-qualified session model refs when catalog metadata is unavailable, so model selection and memory/context budgets survive reloads without bogus provider prefixes. (#61382, #62493) 感谢 @Mule-ME.
- Status: show configured fallback models in `/status` and shared session status cards so per-agent fallback configuration is visible before a live failover happens. (#33111) 感谢 @AnCoSONG.
- `/context detail` now compares the tracked prompt estimate with cached context usage and surfaces untracked provider/runtime overhead when present. (#28391) 感谢 @ImLukeF.
- Gateway/sessions: scope bare `sessions.create` aliases like `main` to the requested agent while preserving the canonical `global` and `unknown` sentinel keys. (#58207) 感谢 @jalehman.
- Gateway/session reset: emit the typed `before_reset` hook for gateway `/new` and `/reset`, preserving reset-hook behavior even when the previous transcript has already been archived. (#53872) 感谢 @VACInc.
- Plugins/commands: pass the active host `sessionKey` into plugin command contexts, and include `sessionId` when it is already available from the active session entry, so bundled and third-party commands can resolve the current conversation reliably. (#59044) 感谢 @jalehman.
- Agents/auth: honor `models.providers.*.authHeader` for pi embedded runner model requests by injecting `Authorization: Bearer <apiKey>` when requested. (#54390) 感谢 @lndyzwdxhs.
- Claude CLI: clear inherited Anthropic auth/header environment aliases before spawning Claude Code and add sanitized CLI backend auth-env diagnostics for debugging gateway-run provider selection.
- Agents/failover: classify AbortError and stream-abort messages as timeout so Ollama NDJSON stream aborts stop showing `reason=unknown` in model fallback logs. (#58324) 感谢 @yelog.
- Fireworks/FirePass: disable Kimi K2.5 Turbo reasoning output by forcing thinking off on the FirePass path and hardening the provider wrapper so hidden reasoning no longer leaks into visible replies. (#63607) 感谢 @frankekn.
- Discord: update Carbon to v0.15.0. 感谢 @thewilloftheshadow.
- Config/Discord: coerce safe integer numeric Discord IDs to strings during config validation, keep unsafe or precision-losing numeric snowflakes rejected, and align `openclaw doctor` repair guidance with the same fail-closed behavior. (#45125) 感谢 @moliendocode.
- BlueBubbles/config: accept `enrichGroupParticipantsFromContacts` in the core strict config schema so gateways no longer fail validation or startup when the BlueBubbles plugin writes that field. (#56889) 感谢 @zqchris.
- Feishu/webhooks: read webhook bodies through the pre-auth guard so unauthenticated webhook traffic stays under the same body budget as other protected channel ingress paths.
- Tools/web_fetch: add an opt-in `tools.web.fetch.ssrfPolicy.allowRfc2544BenchmarkRange` config so fake-IP proxy environments that resolve public sites into `198.18.0.0/15` can use `web_fetch` without weakening the default SSRF block. (#61830) 感谢 @xing-xing-coder.
- Dreaming/cron: reconcile managed dreaming cron from startup config and runtime lifecycle changes, but only recover managed dreaming cron state during heartbeat-triggered dreaming checks so ordinary chat traffic does not recreate removed jobs. (#63873, #63929, #63938) 感谢 @mbelinky.
- Memory/lancedb: accept `dreaming` config when `memory-lancedb` owns the memory slot so Dreaming surfaces can read slot-owner settings without schema rejection. (#63874) 感谢 @mbelinky.
- Control UI/dreaming: keep the Dreaming trace area contained and scrollable so overlays no longer cover tabs or blow out the page layout. (#63875) 感谢 @mbelinky.
- Dreaming/narrative: harden request-scoped diary fallback so scheduled dreaming only falls back on the dedicated subagent-runtime error, stop trusting spoofable raw error-code objects, and avoid leaking workspace paths when local fallback writes fail. (#64156) 感谢 @mbelinky.
- Dreaming/diary: add idempotent narrative subagent runs, preserve restrictive `DREAMS.md` permissions during atomic writes, and surface temp cleanup failures so repeated sweeps do not double-run the same narrative request or silently weaken diary safety. (#63876) 感谢 @mbelinky.
- Heartbeats/sessions: remove stale accumulated isolated heartbeat session keys when the next tick converges them back to the canonical sibling, so repaired sessions stop showing orphaned `:heartbeat:heartbeat` variants in session listings. (#59606) 感谢 @rogerdigital.
- Gateway/run cleanup: fix stale run-context TTL cleanup so the new maintenance sweep resets orphaned run sequence state and prevents unbounded run-context growth. (#52731) 感谢 @artwalker.
- UI/compaction: keep the compaction indicator in a retry-pending state until the run actually finishes, so the UI does not show `Context compacted` before compaction actually finishes. (#55132) 感谢 @mpz4life.
- Cron/tool schemas: keep cron tool schemas strict-model-friendly while still preserving `failureAlert=false`, nullable `agentId`/`sessionKey`, and flattened add/update recovery for the newly exposed cron job fields. (#55043) 感谢 @brunolorente.
- Git metadata: read commit ids from packed refs as well as loose refs so version and status metadata stay accurate after repository maintenance.（#63943）
- Gateway: keep `commands.list` skill entries categorized under tools and include provider-aware plugin `nativeName` metadata even when `scope=text`, so remote clients can group skills correctly and map text-surface plugin commands back to native aliases.（#64147）
- TUI: reset footer activity to idle when switching sessions so a stale streaming indicator cannot persist after the selection changes. (#63988) 感谢 @neeravmakwana.
- Claude CLI: stop marking spawned Claude Code runs as host-managed so they keep using normal CLI subscription behavior. (#64023) 感谢 @Alex-Alaniz.
- Codex auth: brand Codex OAuth flows as OpenClaw in user-visible auth prompts and diagnostics.
- Gateway/pairing: fail closed for paired device records that have no device tokens, and reject pairing approvals whose requested scopes do not match the requested device roles.
- ACP/gateway chat: classify lifecycle errors before forwarding them to ACP clients so refusals use ACP's refusal stop reason while transient backend errors continue to finish as normal turns.
- Claude CLI/skills: pass eligible OpenClaw skills into CLI runs, including native Claude Code skill resolution via a temporary plugin plus per-run skill env/API key injection. (#62686, #62723) 感谢 @zomars.
- Discord: keep generated auto-thread names working with reasoning models by giving title generation enough output budget for thinking plus visible title text. (#64172) 感谢 @hanamizuki.
- Heartbeat: ignore doc-only Markdown fence markers in the default `HEARTBEAT.md` template so comment-only heartbeat scaffolds skip API calls again. (#61690, #63434) 感谢 @ravyg.
- Reply/skills: keep resolved skill and memory secret config stable through embedded reply runs so raw SecretRefs in secondary skill settings no longer crash replies when the gateway already has the live env. (#64249) 感谢 @mbelinky.
- Dreaming/startup: keep plugin-registered startup hooks alive across workspace hook reloads and include dreaming startup owners in the gateway startup plugin scope, so managed Dreaming cron registration comes back reliably after gateway boot. (#62327, #64258) 感谢 @mbelinky.
- Plugins: treat duplicate `registerService` calls from the same plugin id as idempotent so snapshot and activation loads no longer emit spurious `service already registered` diagnostics. (#62033, #64128) 感谢 @ly85206559.
- Discord/TTS: route auto voice replies through the native voice-note path so Discord receives Opus voice messages instead of regular audio attachments. (#64096) 感谢 @LiuHuaize.
- Config/plugins: use plugin-owned command alias metadata when `plugins.allow` contains runtime command names like `dreaming`, and point users at the owning plugin instead of stale plugin-not-found guidance. (#64191, #64242) 感谢 @feiskyer.
- Agents/Gemini: strip orphaned `required` entries from Gemini tool schemas so provider validation no longer rejects tools after schema cleanup or union flattening. (#64284) 感谢 @xxxxxmax.
- Assistant text: strip Qwen-style XML tool call payloads from visible replies so web and channel messages no longer show raw `<tool_call><function=...>` output. (#63999, #64214) 感谢 @MoerAI.
- Daemon/gateway: prevent systemd restart storms on configuration errors by exiting with `EX_CONFIG` and adding generated unit restart-prevention guards. (#63913) 感谢 @neo1027144-creator.
- Agents/exec: prevent gateway crash ("Agent listener invoked outside active run") when a subagent exec tool produces stdout/stderr after the agent run has ended or been aborted. (#62821) 感谢 @openperf.
- Gateway/OpenAI compat: return real `usage` for non-stream `/v1/chat/completions` responses, emit the final usage chunk when `stream_options.include_usage=true`, and bound usage-gated stream finalization after lifecycle end. (#62986) 感谢 @Lellansin.
- Matrix/migration: keep packaged warning-only crypto migrations from being misclassified as actionable when only helper chunks are present, so startup and doctor stay on the warning-only path instead of creating unnecessary migration snapshots. (#64373) 感谢 @gumadeiras.
- Matrix/ACP thread bindings: preserve canonical room casing and parent conversation routing during ACP session spawn so mixed-case room ids bind correctly from top-level rooms and existing Matrix threads. (#64343) 感谢 @gumadeiras.
- Agents/subagents: deduplicate delivered completion announces so retry or re-entry cleanup does not inject duplicate internal-context completion turns into the parent session. (#61525) 感谢 @100yenadmin.
- Agents/exec: keep sandboxed `tools.exec.host=auto` sessions from honoring per-call `host=node` or `host=gateway` overrides while a sandbox runtime is active, and stop advertising node routing in that state so exec stays on the sandbox host.（#63880）
- Agents/subagents: preserve archived delete-mode runs until `sessions.delete` succeeds and prevent overlapping archive sweeps from duplicating in-flight cleanup attempts. (#61801) 感谢 @100yenadmin.
- Cron/isolated agent: run scheduled agent turns as non-owner senders so owner-only tools stay unavailable during cron execution.（#63878）
- Discord/sandbox: include `image` in sandbox media param normalization so Discord event cover images cannot bypass sandbox path rewriting. (#64377) 感谢 @mmaps.
- Agents/exec: extend exec completion detection to cover local background exec formats so the owner-downgrade fires correctly for all exec paths. (#64376) 感谢 @mmaps.
- Security/dependencies: pin axios to 1.15.0 and add a plugin install dependency denylist that blocks known malicious packages before install. (#63891) 感谢 @mmaps.
- Browser/security: apply three-phase interaction navigation guard to pressKey and type(submit) so delayed JS redirects from keypress cannot bypass SSRF policy. (#63889) 感谢 @mmaps.

- Browser/security: guard existing-session Chrome MCP interaction routes with SSRF post-checks so delayed navigation from click, type, press, and evaluate cannot bypass the configured policy. (#64370) 感谢 @eleqtrizit.
- Browser/security: default browser SSRF policy to strict mode so unconfigured installs block private-network navigation, and align external-content marker span mapping so ZWS-injected boundary spoofs are fully sanitized. (#63885) 感谢 @eleqtrizit.
- Browser/security: apply SSRF navigation policy to subframe document navigations so iframe-targeted private-network hops are blocked without quarantining the parent page. (#64371) 感谢 @eleqtrizit.
- Hooks/security: mark agent hook system events as untrusted and sanitize hook display names before cron metadata reuse. (#64372) 感谢 @eleqtrizit.
- Daemon/launchd: keep `openclaw gateway stop` persistent without uninstalling the macOS LaunchAgent, re-enable it on explicit restart or repair, and harden launchd label handling. (#64447) 感谢 @ngutman.
- Plugins/context engines: preserve `plugins.slots.contextEngine` through normalization and keep explicitly selected workspace context-engine plugins enabled, so loader diagnostics and plugin activation stop dropping that slot selection. (#64192) 感谢 @hclsys.
- Heartbeat: stop top-level `interval:` and `prompt:` fields outside the `tasks:` block from bleeding into the last parsed heartbeat task. (#64488) 感谢 @Rahulkumar070.
- Slack/plugin commands: include plugin-registered slash commands in Slack native command registration when Slack native commands are enabled. (#64578) 感谢 @rafaelreis-r.
- Agents/OpenAI replay: preserve malformed function-call arguments in stored assistant history, avoid double-encoding preserved raw strings on replay, and coerce replayed string args back to objects at Anthropic and Google provider boundaries. (#61956) 感谢 @100yenadmin.
- Heartbeat/config: accept and honor `agents.defaults.heartbeat.timeoutSeconds` and per-agent heartbeat timeout overrides for heartbeat agent turns. (#64491) 感谢 @cedillarack.
- CLI/devices: make implicit `openclaw devices approve` selection preview-only and require approving the exact request ID, preventing latest-request races during device pairing. (#64160) 感谢 @coygeek.
- Media/security: honor sender-scoped `toolsBySender` policy for outbound host-media reads so denied senders cannot trigger host file disclosure via attachment hydration. (#64459) 感谢 @eleqtrizit.
- Browser/security: reject strict-policy hostname navigation unless the hostname is an explicit allowlist exception or IP literal, and route CDP HTTP discovery through the pinned SSRF fetch path. (#64367) 感谢 @eleqtrizit.
- Models/vLLM: ignore empty `tool_calls` arrays from reasoning-model OpenAI-compatible replies, reset false `toolUse` stop reasons when no actual tool calls were parsed, and stop sending `tool_choice` unless tools are present so vLLM reasoning responses no longer hang indefinitely. (#61197, #61534) 感谢 @balajisiva.
- Heartbeat/scheduling: spread interval heartbeats across stable per-agent phases derived from gateway identity, so provider traffic is distributed more uniformly across the configured interval instead of clustering around startup-relative times. (#64560) 感谢 @odysseus0.
- Config/media: accept `tools.media.asyncCompletion.directSend` in strict config validation so gateways no longer reject the generated-schema-backed async media completion setting at startup. (#63618) 感谢 @qiziAI.
- Telegram/exec: preserve delayed exec completion routing for forum topics by pinning background exec completions to the topic where the run started even if the session route later drifts. (#64580) thanks @jalehman.
- Agents/locks: unregister the session write-lock `exit` cleanup handler during teardown so repeated lock lifecycle resets stop stacking process listeners in long-running gateway processes. (#65391) 感谢 @adminfedres and @vincentkoc.
- CLI/Claude: rename the trusted inbound metadata schema to `openclaw.inbound_meta.v2` so Claude CLI no longer trips Anthropic's blocked `openclaw.inbound_meta.v1` filter on channel-originated turns. (#65399) 感谢 @SzyMig and @vincentkoc.
- Agents/inbound metadata: strip NUL bytes from serialized inbound context blocks before they reach backend spawn args, so malformed message metadata cannot crash agent spawn with `ERR_INVALID_ARG_VALUE`. (#65389) 感谢 @adminfedres and @vincentkoc.
- iMessage: retry transient `watch.subscribe` startup failures before tearing down the monitor, so brief local transport stalls do not immediately bounce the channel. (#65393) 感谢 @vincentkoc.
- Status/session_status: move shared session status text into a neutral internal status module and keep the tool importing a local runtime shim, so built `session_status` no longer depends on reply command internals or a bundler-opaque runtime import. (#65807) 感谢 @dutifulbob.
- QQBot/security: replace raw `fetch()` in the image-size probe with SSRF-guarded `fetchRemoteMedia`, fix `resolveRepoRoot()` to walk up to `.git` instead of hardcoding two parent levels, and refresh the raw-fetch allowlist to match the corrected scan. (#63495) 感谢 @dims.
- WhatsApp/web: rewrite queued `creds.json` updates atomically so interrupted saves do not leave truncated login state behind. (#63577) thanks @OwenYWT

## 🚀 v2026.4.9 (2026年4月9日)

### ✨ 新增功能与改进

- Memory/dreaming: add a grounded REM backfill lane with historical `rem-harness --path`, diary commit/reset flows, cleaner durable-fact extraction, and live short-term promotion integration so old daily notes can replay into Dreams and durable memory without a second memory stack. 感谢 @mbelinky.
- Control UI/dreaming: add a structured diary view with timeline navigation, backfill/reset controls, traceable dreaming summaries, and a grounded Scene lane with promotion hints plus a safe clear-grounded action for staged backfill signals. (#63395) 感谢 @mbelinky.
- QA/lab: add character-vibes evaluation reports with model selection and parallel runs so live QA can compare candidate behavior faster.
- Plugins/provider-auth: let provider manifests declare `providerAuthAliases` so provider variants can share env vars, auth profiles, config-backed auth, and API-key onboarding choices without core-specific wiring.
- iOS: pin release versioning to an explicit CalVer in `apps/ios/version.json`, keep TestFlight iteration on the same short version until maintainers intentionally promote the next gateway version, and add the documented `pnpm ios:version:pin -- --from-gateway` workflow for release trains. (#63001) 感谢 @ngutman.
- Tools/video_generate: extend the tool and the Plugin SDK with `providerOptions` (vendor-specific options forwarded as a JSON object), `inputAudios` / `audioRef` / `audioRefs` reference audio inputs, per-asset semantic role hints (`imageRoles` / `videoRoles` / `audioRoles`) using a typed `VideoGenerationAssetRole` union, a new `"adaptive"` aspect-ratio sentinel, and `maxInputAudios` provider capability declarations. Providers opt into `providerOptions` by declaring a typed `capabilities.providerOptions` schema (`{ seed: "number", draft: "boolean", ... }`); unknown keys and type mismatches cause the runtime fallback loop to skip the candidate with a visible warning and an `attempts` entry, so vendor-specific options never silently reach the wrong provider. Also raises the in-tool image input cap to 9 and updates the docs table to list all new parameters. (#61987) 感谢 @xieyongliang.

### 🐛 问题修复

- Browser/security: re-run blocked-destination safety checks after interaction-driven main-frame navigations from click, evaluate, hook-triggered click, and batched action flows, so browser interactions cannot bypass the SSRF quarantine when they land on forbidden URLs. (#63226) 感谢 @eleqtrizit.
- Security/dotenv: block runtime-control env vars plus browser-control override and skip-server env vars from untrusted workspace `.env` files, and reject unsafe URL-style browser control override specifiers before lazy loading. (#62660, #62663) 感谢 @eleqtrizit.
- Gateway/node exec events: mark remote node `exec.started`, `exec.finished`, and `exec.denied` summaries as untrusted system events and sanitize node-provided command/output/reason text before enqueueing them, so remote node output cannot inject trusted `System:` content into later turns. (#62659) 感谢 @eleqtrizit.
- Plugins/onboarding auth choices: prevent untrusted workspace plugins from colliding with bundled provider auth-choice ids during non-interactive onboarding, so bundled provider setup keeps operator secrets out of untrusted workspace plugin handlers unless those plugins are explicitly trusted. (#62368) 感谢 @pgondhi987.
- Security/dependency audit: force `basic-ftp` to `5.2.1` for the CRLF command-injection fix and bump Hono plus `@hono/node-server` in production resolution paths.
- Android/pairing: clear stale setup-code auth on new QR scans, bootstrap operator and node sessions from fresh pairing, prefer stored device tokens after bootstrap handoff, and pause pairing auto-retry while the app is backgrounded so scan-once Android pairing recovers reliably again. (#63199) 感谢 @obviyus.
- Matrix/gateway: wait for Matrix sync readiness before marking startup successful, keep Matrix background handler failures contained, and route fatal Matrix sync stops through channel-level restart handling instead of crashing the whole gateway. (#62779) 感谢 @gumadeiras.
- Slack/media: preserve bearer auth across same-origin `files.slack.com` redirects while still stripping it on cross-origin Slack CDN hops, so `url_private_download` image attachments load again. (#62960) 感谢 @vincentkoc.
- Reply/doctor: use the active runtime snapshot for queued reply runs, resolve reply-run SecretRefs before preflight helpers touch config, surface gateway OAuth reauth failures to users, and make `openclaw doctor` call out exact reauth commands. (#62693, #63217) 感谢 @mbelinky.
- Control UI: guard stale session-history reloads during fast session switches so the selected session and rendered transcript stay in sync. (#62975) 感谢 @scoootscooob.
- Gateway/chat: suppress exact and streamed `ANNOUNCE_SKIP` / `REPLY_SKIP` control replies across live chat updates and history sanitization so internal agent-to-agent control tokens no longer leak into user-facing gateway chat surfaces. (#51739) 感谢 @Pinghuachiu.
- Auto-reply/NO_REPLY: strip glued leading `NO_REPLY` tokens before reply normalization and ACP-visible streaming so silent sentinel text no longer leaks into user-visible replies while preserving substantive `NO_REPLY ...` text. 感谢 @frankekn.
- Sessions/routing: preserve established external routes on inter-session announce traffic so `sessions_send` follow-ups do not steal delivery from Telegram, Discord, or other external channels. (#58013) 感谢 @duqaXxX.
- Gateway/sessions: clear auto-fallback-pinned model overrides on `/reset` and `/new` while still preserving explicit user model selections, including legacy sessions created before override-source tracking existed. (#63155) 感谢 @frankekn.
- Slack/ACP: treat Slack ACP block replies as visible delivered output so OpenClaw stops re-sending the final fallback text after Slack already rendered the reply. (#62858) 感谢 @gumadeiras.
- Slack/partial streaming: key turn-local dedupe by dispatch kind and keep the final fallback reply path active when preview finalization fails so stale preview text cannot suppress the actual final answer. (#62859) 感谢 @gumadeiras.
- Matrix/doctor: migrate legacy `channels.matrix.dm.policy: "trusted"` configs back to compatible DM policies during `openclaw doctor --fix`, preserving explicit `allowFrom` boundaries as `allowlist` and defaulting empty legacy configs to `pairing`. (#62942) 感谢 @lukeboyett.
- npm packaging: mirror bundled channel runtime deps, stage Nostr runtime deps, derive required root mirrors from manifests and built chunks, and test packed release tarballs without repo `node_modules` so fresh installs fail fast on missing plugin deps instead of crashing at runtime. (#63065) 感谢 @scoootscooob.
- QA/live auth: fail fast when live QA scenarios hit classified auth or runtime failure replies, including raw scenario wait paths, and sanitize missing-key guidance so gateway auth problems surface as actionable errors instead of timeouts. (#63333) 感谢 @shakkernerd.
- Providers/OpenAI: default missing reasoning effort to `high` on OpenAI Responses, WebSocket, and compatible completions transports, while still honoring explicit per-run reasoning levels.
- Providers/Ollama: allow Ollama models using the native `api: "ollama"` path to optionally display thinking output when `/think` is set to a non-off level. (#62712) 感谢 @hoyyeva.
- Codex CLI: pass OpenClaw's system prompt through Codex's `model_instructions_file` config override so fresh Codex CLI sessions receive the same prompt guidance as Claude CLI sessions.
- Auth/profiles: persist explicit auth-profile upserts directly and skip external CLI sync for local writes so profile changes are saved without stale external credential state.
- Agents/timeouts: make the LLM idle timeout inherit `agents.defaults.timeoutSeconds` when configured, disable the unconfigured idle watchdog for cron runs, and point idle-timeout errors at `agents.defaults.llm.idleTimeoutSeconds`. 感谢 @drvoss.
- Agents/failover: classify Z.ai vendor code `1311` as billing and `1113` as auth, including long wrapped `1311` payloads, so these errors stop falling through to generic failover handling. (#49552) 感谢 @1bcMax.
- QQBot/media-tags: support HTML entity-encoded angle brackets (`&lt;`/`&gt;`), URL slashes in attributes, and self-closing media tags so upstream `<qqimg>` payloads are correctly parsed and normalized. (#60493) 感谢 @ylc0919.
- Memory/dreaming: harden grounded backfill inputs, diary writes, status payloads, and diary action classification by preserving source-day labels, rejecting missing or symlinked targets cleanly, normalizing diary headings in gateway backfills, and tightening claim splitting plus diary source metadata. 感谢 @mbelinky.
- Memory/dreaming: accept embedded heartbeat trigger tokens so light and REM dreaming still run when runtime wrappers include extra heartbeat text.
- Android/manual connect: allow blank port input only for TLS manual gateway endpoints so standard HTTPS Tailscale hosts default to `443` without silently changing cleartext manual connects. (#63134) 感谢 @Tyler-RNG.
- Windows/update: add heap headroom to Windows `pnpm build` steps during dev updates so update preflight builds stop failing on low default Node memory.
- Plugin SDK: export the channel plugin base and web-search config contract through the public package so plugins can use them without private imports.
- Plugins/contracts: keep test-only helpers out of production contract barrels, load shared contract harnesses through bundled test surfaces, and harden guardrails so indirect re-exports and canonical `*.test.ts` files stay blocked. (#63311) 感谢 @altaywtf.
- Control UI/models: preserve provider-qualified refs for OpenRouter catalog models whose ids already contain slashes so picker selections submit allowlist-compatible model refs instead of dropping the `openrouter/` prefix. (#63416) 感谢 @sallyom.
- Plugin SDK/command auth: split command status builders onto the lightweight `openclaw/plugin-sdk/command-status` subpath while preserving deprecated `command-auth` compatibility exports, so auth-only plugin imports no longer pull status/context warmup into CLI onboarding paths. (#63174) 感谢 @hxy91819.
- Wizard/plugin config: coerce integer-typed plugin config fields from interactive text input so integer schema values persist as numbers instead of failing validation. (#63346) 感谢 @jalehman.
- npm packaging: derive required root runtime mirrors from bundled plugin manifests and built root chunks, then install packed release tarballs without the repo `node_modules` so release checks catch missing plugin deps before publish.

## 🚀 v2026.4.8 (2026年4月8日)

### 🐛 问题修复

- Telegram/setup: load setup and secret contracts through packaged top-level sidecars so installed npm builds no longer try to import missing `dist/extensions/telegram/src/*` files during gateway startup.
- Bundled channels/setup: load shared secret contracts through packaged top-level sidecars across BlueBubbles, Feishu, Google Chat, IRC, Matrix, Mattermost, Microsoft Teams, Nextcloud Talk, Slack, and Zalo so installed npm builds no longer rely on missing `dist/extensions/*/src/*` files during gateway startup.
- Bundled plugins: align packaged plugin compatibility metadata with the release version so bundled channels and providers load on OpenClaw 2026.4.8.
- Agents/progress: keep `update_plan` available for OpenAI-family runs while returning compact success payloads and allowing `tools.experimental.planTool=false` to opt out.
- Agents/exec: keep `/exec` current-default reporting aligned with real runtime behavior so `host=auto` sessions surface the correct host-aware fallback policy (`full/off` on gateway or node, `deny/off` on sandbox) instead of stale stricter defaults.
- Slack: honor ambient HTTP(S) proxy settings for Socket Mode WebSocket connections, including NO_PROXY exclusions, so proxy-only deployments can connect without a monkey patch. (#62878) 感谢 @mjamiv.
- Slack/actions: pass the already resolved read token into `downloadFile` so SecretRef-backed bot tokens no longer fail after a raw config re-read. (#62097) 感谢 @martingarramon.
- Network/fetch guard: skip target DNS pinning when trusted env-proxy mode is active so proxy-only sandboxes can let the trusted proxy resolve outbound hosts. (#59007) 感谢 @cluster2600.

## 🚀 v2026.4.7-1 (2026年4月7日)

## 🚀 v2026.4.7 (2026年4月7日)

### ✨ 新增功能与改进

- CLI/infer: add a first-class `openclaw infer ...` hub for provider-backed inference workflows across model, media, web, and embedding tasks. 感谢 @Takhoffman.
- Tools/media generation: auto-fallback across auth-backed image, music, and video providers by default, preserve intent during provider switches, remap size/aspect/resolution/duration hints to the closest supported option, and surface provider capabilities plus mode-aware video-to-video support.
- Memory/wiki: restore the bundled `memory-wiki` stack with plugin, CLI, sync/query/apply tooling, memory-host integration, structured claim/evidence fields, compiled digest retrieval, claim-health linting, contradiction clustering, staleness dashboards, and freshness-weighted search. 感谢 @vincentkoc.
- Plugins/webhooks: add a bundled webhook ingress plugin so external automation can create and drive bound TaskFlows through per-route shared-secret endpoints. (#61892) 感谢 @mbelinky.
- Gateway/sessions: add persisted compaction checkpoints plus Sessions UI branch/restore actions so operators can inspect and recover pre-compaction session state. (#62146) 感谢 @scoootscooob.
- Compaction: add pluggable compaction provider registry so plugins can replace the built-in summarization pipeline. Configure via `agents.defaults.compaction.provider`; falls back to LLM summarization on provider failure. (#56224) 感谢 @DhruvBhatia0.
- Agents/system prompt: add `agents.defaults.systemPromptOverride` for controlled prompt experiments plus heartbeat prompt-section controls so heartbeat runtime behavior can stay enabled without injecting heartbeat instructions every turn.
- Providers/Google: add Gemma 4 model support and keep Google fallback resolution on the requested provider path so native Google Gemma routes work again. (#61507) 感谢 @eyjohn.
- Providers/Google: preserve explicit thinking-off semantics for Gemma 4 while still enabling Gemma reasoning support in compatibility wrappers. (#62127) 感谢 @romgenie.
- Providers/Arcee AI: add a bundled Arcee AI provider plugin with Trinity catalog entries, OpenRouter support, and updated onboarding/auth guidance. (#62068) 感谢 @arthurbr11.
- Providers/Anthropic: restore Claude CLI as the preferred local Anthropic path in onboarding, model-auth guidance, doctor flows, and Docker Claude CLI live lanes again.
- Providers/Ollama: detect vision capability from the `/api/show` response and set image input on models that support it so Ollama vision models accept image attachments. (#62193) 感谢 @BruceMacD.
- Memory/dreaming: ingest redacted session transcripts into the dreaming corpus with per-day session-corpus notes, cursor checkpointing, and promotion/doctor support. (#62227) 感谢 @vignesh07.
- Providers/inferrs: add string-content compatibility for stricter OpenAI-compatible chat backends, document `inferrs` setup with a full config example, and add troubleshooting guidance for local backends that pass direct probes but fail on full agent-runtime prompts.
- Agents/context engine: expose prompt-cache runtime context to context engines and keep current-turn prompt-cache usage aligned with the active attempt instead of stale prior-turn assistant state. (#62179) 感谢 @jalehman.
- Plugin SDK/context engines: pass `availableTools` and `citationsMode` into `assemble()`, and expose memory-artifact and memory-prompt seams so companion plugins and non-legacy context engines can consume active memory state without reaching into internals. 感谢 @vincentkoc.
- ACP/ACPX plugin: bump the bundled `acpx` pin to `0.5.1` so plugin-local installs and strict version checks pick up the latest published runtime release. (#62148) 感谢 @onutc.
- Discord/events: allow `event-create` to accept a cover image URL or local file path, load and validate PNG/JPG/GIF event cover media, and pass the encoded image payload through Discord admin action/runtime paths. (#60883) 感谢 @bittoby.
- Plugins/provider-auth: expose runtime-ready provider auth through `openclaw/plugin-sdk/provider-auth-runtime` so native plugins and context engines can resolve request-ready credentials after provider-owned runtime exchanges like GitHub Copilot device-token-to-bearer flows. (#62753) 感谢 @jalehman.

### 🐛 问题修复

- CLI/infer: keep provider-backed infer behavior aligned with actual runtime execution by fixing explicit TTS override handling, profile-aware gateway TTS prefs resolution, per-request transcription `prompt`/`language` overrides, image output MIME/extension mismatches, configured web-search fallback behavior, and agent-vs-CLI web-search execution drift.
- Plugins/media: when `plugins.allow` is set, capability fallback now merges bundled capability plugin ids into the allowlist (not only `plugins.entries`), so media understanding providers such as OpenAI-compatible STT load for voice transcription without requiring `openai` in `plugins.allow`. (#62205) 感谢 @neeravmakwana.
- Agents/history and replies: buffer phaseless OpenAI WS text until a real assistant phase arrives, keep replay and SSE history sequence tracking aligned, hide commentary and leaked tool XML from user-visible history, and keep history-based follow-up replies on `final_answer` text only. (#61729, #61747, #61829, #61855, #61954) 感谢 @100yenadmin and contributors.
- Control UI: show `/tts` audio replies in webchat, detect mistaken `?token=` auth links with the correct `#token=` hint, and keep Copy, Canvas, and mobile exec-approval UI from covering chat content on narrow screens. (#54842, #61514, #61598) 感谢 @neeravmakwana.
- iOS/gateway: replace string-matched connection error UI with structured gateway connection problems, preserve actionable pairing/auth failures over later generic disconnect noise, and surface reusable problem banners and details across onboarding, settings, and root status surfaces. (#62650) 感谢 @ngutman.
- TUI: route `/status` through the shared session-status command, keep commentary hidden in history, strip raw envelope metadata from async command notices, preserve fallback streaming before per-attempt failures finalize, and restore Kitty keyboard state on exit or fatal crashes. (#49130, #59985, #60043, #61463) 感谢 @biefan and contributors.
- iOS/Watch exec approvals: keep Apple Watch review and approval recovery working while the iPhone is locked or backgrounded, including reconnect recovery, pending approval persistence, notification cleanup, and APNs-backed watch refresh recovery. (#61757) 感谢 @ngutman.
- Agents/context overflow: combine oversized and aggregate tool-result recovery in one pass and restore a total-context overflow backstop so recoverable sessions retry instead of failing early. (#61651) 感谢 @Takhoffman.
- Auth/OpenAI Codex OAuth: reload fresh on-disk credentials inside the locked refresh path and retry once after `refresh_token_reused` rotates only the stored refresh token, so relogin/restart recovery stops getting stuck on stale cached auth state. 感谢 @owen-ever.
- Auth/OpenAI Codex OAuth: keep native `/model ...@profile` selections on the target session and honor explicit user-locked auth profiles even when per-agent auth order excludes them. (#62744) 感谢 @jalehman.
- Providers/Anthropic: preserve thinking blocks for Claude Opus 4.5+, Sonnet 4.5+, and newer Claude 4-family models so prompt-cache prefixes keep matching, and skip `service_tier` injection on OAuth-authenticated stream wrapper requests so Claude OAuth streaming stops failing with HTTP 401. (#60356, #61793)
- Agents/Claude CLI: surface nested API error messages from structured CLI output so billing/auth/provider failures show the real provider error instead of an opaque CLI failure.
- Agents/exec: preserve explicit `host=node` routing under elevated defaults when `tools.exec.host=auto`, fail loud on invalid elevated cross-host overrides, and keep `strictInlineEval` commands blocked after approval timeouts instead of falling through to automatic execution. (#61739) 感谢 @obviyus.
- Nodes/exec approvals: keep `host=node` POSIX transport shell wrappers (`/bin/sh -lc ...`) aligned with inner-command allowlist analysis so allowlisted scripts stop prompting unnecessarily, while Windows `cmd.exe` wrapper runs stay approval-gated. (#62401) 感谢 @ngutman.
- Nodes/exec approvals: keep Windows `cmd.exe /c` wrapper runs approval-gated even when `env` carriers, including env-assignment carriers, wrap the shell invocation. (#62439) 感谢 @ngutman.
- Gateway tool/exec config: block model-facing `gateway config.apply` and `config.patch` writes from changing exec approval paths such as `safeBins`, `safeBinProfiles`, `safeBinTrustedDirs`, and `strictInlineEval`, while still allowing unchanged structured values through. (#62001) 感谢 @eleqtrizit.
- Host exec/env sanitization: block dangerous Java, Rust, Cargo, Git, Kubernetes, cloud credential, config-path, and Helm env overrides so host-run tools cannot be redirected to attacker-chosen code, config, credentials, or repository state. (#59119, #62002, #62291) 感谢 @eleqtrizit and contributors.
- Commands/allowlist: require owner authorization for `/allowlist add` and `/allowlist remove` before channel resolution, so non-owner but command-authorized senders can no longer persistently rewrite allowlist policy state. (#62383) 感谢 @pgondhi987.
- Feishu/docx uploads: honor `tools.fs.workspaceOnly` for local `upload_file` and `upload_image` paths by forwarding workspace-constrained `localRoots` into the media loader, so docx uploads can no longer read host-local files outside the workspace when workspace-only mode is active. (#62369) 感谢 @pgondhi987.
- Network/fetch guard: drop request bodies and body-describing headers on cross-origin `307` and `308` redirects by default, so attacker-controlled redirect hops cannot receive secret-bearing POST payloads from SSRF-guarded fetch flows unless a caller explicitly opts in. (#62357) 感谢 @pgondhi987.
- Browser/SSRF: treat main-frame `document` redirect hops as navigations even when Playwright does not flag them as `isNavigationRequest()`, so strict private-network blocking still stops forbidden redirect pivots before the browser reaches the internal target. (#62355) 感谢 @pgondhi987.
- Browser/node invoke: block persistent browser profile create, reset, and delete mutations through `browser.proxy` on both gateway-forwarded `node.invoke` and the node-host proxy path, even when no profile allowlist is configured.（#60489）
- Gateway/node pairing: require a fresh pairing request when a previously paired node reconnects with additional declared commands, and keep the live session pinned to the earlier approved command set until the upgrade is approved. (#62658) 感谢 @eleqtrizit.
- Gateway/auth: invalidate existing shared-token and password WebSocket sessions when the configured secret rotates, so stale authenticated sockets cannot stay attached after token or password changes. (#62350) 感谢 @pgondhi987.
- MS Teams/security: validate file-consent upload URLs against HTTPS, Microsoft/SharePoint host allowlists, and private-IP DNS checks before uploading attachments, blocking SSRF-style consent-upload abuse.（#23596）
- Media/base64 decode guards: enforce byte limits before decoding missed base64-backed Teams, Signal, QQ Bot, and image-tool payloads so oversized inbound media and data URLs no longer bypass pre-decode size checks. (#62007) 感谢 @eleqtrizit.
- Runtime event trust: mark background `notifyOnExit` summaries, ACP parent-stream relays, and wake-hook payloads as untrusted system events so lower-trust runtime output no longer re-enters later turns as trusted `System:` text.（#62003）
- Auto-reply/media: allow managed generated-media `MEDIA:` paths from normal reply text again while still blocking arbitrary host-local media and document paths, so generated media keep delivering without reopening host-path injection holes.
- Gateway/status and containers: auto-bind to `0.0.0.0` inside Docker and Podman environments, and probe local TLS gateways over `wss://` with self-signed fingerprint forwarding so container startup and loopback TLS status checks work again. (#61818, #61935) 感谢 @openperf and contributors.
- Gateway/OpenAI-compatible HTTP: abort in-flight `/v1/chat/completions` and `/v1/responses` turns when clients disconnect so abandoned HTTP requests stop wasting agent runtime. (#54388) 感谢 @Lellansin.
- macOS/gateway version: strip trailing commit metadata from CLI version output before semver parsing so the Mac app recognizes installed gateway versions like `OpenClaw 2026.4.2 (d74a122)` again. (#61111) 感谢 @oliviareid-svg.
- Sessions/model selection: resolve the explicitly selected session model separately from runtime fallback resolution so session status and live model switching stay aligned with the chosen model.
- Discord/ACP bindings: canonicalize DM conversation identity across inbound messages, component interactions, native commands, and current-conversation binding resolution so `--bind here` in Discord DMs keeps routing follow-up replies to the bound agent instead of falling back to the default agent.
- Discord: recover forwarded referenced message text and attachments when snapshots are missing, use `ws://` again for gateway monitor sockets, stop forcing a hardcoded temperature for Codex-backed auto-thread titles, and harden voice receive recovery so rapid speaker restarts keep their next utterance. (#41536, #61670) 感谢 @artwalker and contributors.
- Slack/thread mentions: add `channels.slack.thread.requireExplicitMention` so Slack channels that already require mentions can also require explicit `@bot` mentions inside bot-participated threads. (#58276) 感谢 @praktika-engineer.
- Slack/threading: keep legacy thread stickiness for real replies when older callers omit `isThreadReply`, while still honoring `replyToMode` for Slack's auto-created top-level `thread_ts`. (#61835) 感谢 @kaonash.
- Slack/media: keep attachment downloads on the SSRF-guarded dispatcher path so Slack media fetching works on Node 22 without dropping pinned transport enforcement. (#62239) 感谢 @openperf.
- Matrix/onboarding: add an invite auto-join setup step with explicit off warnings and strict stable-target validation so new Matrix accounts stop silently ignoring invited rooms and fresh DM-style invites unless operators opt in. (#62168) 感谢 @gumadeiras.
- Matrix/formatting: preserve multi-paragraph and loose-list rendering in Element so numbered and bulleted Markdown keeps their content attached to the correct list item. (#60997) 感谢 @gucasbrg.
- Telegram/doctor: keep top-level access-control fallback in place during multi-account normalization while still promoting legacy default auth into `accounts.default`, so existing named bots keep inherited allowlists without dropping the legacy default bot. (#62263) 感谢 @obviyus.
- Plugins/loaders: centralize bundled `dist/**` Jiti native-load policy and keep channel, public-surface, facade, and config-metadata loader seams off native Jiti on Windows so onboarding and configure flows stop tripping `ERR_UNSUPPORTED_ESM_URL_SCHEME`. (#62286) 感谢 @chen-zhang-cs-code.
- Plugins/channels: keep bundled channel artifact and secret-contract loading stable under lazy loading, preserve plugin-schema defaults during install, and fix Windows `file://` plus native-Jiti plugin loader paths so onboarding, doctor, `openclaw secret`, and bundled plugin installs work again. (#61832, #61836, #61853, #61856) 感谢 @Zeesejo and contributors.
- Plugins/ClawHub: verify downloaded plugin archives against version metadata SHA-256, fail closed when archive integrity metadata is missing or malformed, and tighten fallback ZIP verification so plugin installs cannot proceed on mismatched or incomplete ClawHub package metadata. (#60517) 感谢 @mappel-nv.
- Plugins/provider hooks: stop recursive provider snapshot loads from overflowing the stack during plugin initialization, while still preserving cached nested provider-hook results. (#61922, #61938, #61946, #61951)
- Docker/plugins: stop forcing bundled plugin discovery to `/app/extensions` in runtime images so packaged installs use compiled `dist/extensions` artifacts again and Node 24 containers do not boot through source-only plugin entry paths. Fixes #62044. (#62316) 感谢 @gumadeiras.
- Providers/Ollama: honor the selected provider's `baseUrl` during streaming so multi-Ollama setups stop routing every stream to the first configured Ollama endpoint.（#61678）
- Providers/Ollama: stop warning that Ollama could not be reached when discovery only sees empty default local stubs, while still keeping real explicit Ollama overrides loud when the endpoint is unreachable.
- Providers/xAI: recognize `api.grok.x.ai` as an xAI-native endpoint again and keep legacy `x_search` auth resolution working so older xAI web-search configs continue to load. (#61377) 感谢 @jjjojoj.
- Providers/Mistral: send `reasoning_effort` for `mistral/mistral-small-latest` (Mistral Small 4) with thinking-level mapping, and mark the catalog entry as reasoning-capable so adjustable reasoning matches Mistral’s Chat Completions API. (#62162) 感谢 @neeravmakwana.
- OpenAI TTS/Groq: send `wav` to Groq-compatible speech endpoints, honor explicit `responseFormat` overrides on OpenAI-compatible paths, and only mark voice-note output as voice-compatible when the actual format is `opus`. (#62233) 感谢 @neeravmakwana.
- Tools/web_fetch and web_search: fix `TypeError: fetch failed` caused by undici 8.0 enabling HTTP/2 by default; pinned SSRF-guard dispatchers now explicitly set `allowH2: false` to restore HTTP/1.1 behavior and keep the custom DNS-pinning lookup compatible. (#61738, #61777) 感谢 @zozo123.
- Tools/web search/Exa: show Exa Search in onboarding and configure provider pickers again by marking the bundled Exa provider as setup-visible. 感谢 @vincentkoc.
- Memory/vector recall: surface explicit warnings when `sqlite-vec` is unavailable or vector writes are degraded, and strip managed Light Sleep and REM blocks before daily-note ingestion so memory indexing and dreaming stop reporting false-success or re-ingesting staged output. (#61720) 感谢 @MonkeyLeeT.
- Memory/dreaming: make Dreams config reads and writes respect the selected memory slot plugin instead of always targeting `memory-core`. (#62275) 感谢 @SnowSky1.
- QQ Bot/media: route gateway-side attachment and fallback downloads through guarded QQ/Tencent HTTPS fetches so QQ media handling no longer follows arbitrary remote hosts.
- Browser/remote CDP: retry the DevTools websocket once after remote browser restarts so healthy remote browser profiles do not fail availability checks during CDP warm-up. (#57397) 感谢 @ThanhNguyxn07.
- UI/light mode: target both root and nested WebKit scrollbar thumbs in the light theme so page-level and container scrollbars stay visible on light backgrounds. (#61753) 感谢 @chziyue.
- Agents/subagents: honor `sessions_spawn(lightContext: true)` for spawned subagent runs by preserving lightweight bootstrap context through the gateway and embedded runner instead of silently falling back to full workspace bootstrap injection. (#62264) 感谢 @theSamPadilla.
- Cron: load `jobId` into `id` when the on-disk store omits `id`, matching doctor migration and fixing `unknown cron job id` for hand-edited `jobs.json`. (#62246) 感谢 @neeravmakwana.
- Agents/model fallback: classify minimal HTTP 404 API errors (for example `404 status code (no body)`) as `model_not_found` so assistant failures throw into the fallback chain instead of stopping at the first fallback candidate. (#62119) 感谢 @neeravmakwana.
- BlueBubbles/network: respect explicit private-network opt-out for loopback and private `serverUrl` values across account resolution, status probes, monitor startup, and attachment downloads, while keeping public-host attachment hostname pinning intact. (#59373) 感谢 @jpreagan.
- Agents/heartbeat: keep heartbeat runs pinned to the main session so active subagent transcripts are not overwritten by heartbeat status messages. (#61803) 感谢 @100yenadmin.
- Agents/heartbeat: respect disabled heartbeat prompt guidance so operators can suppress heartbeat prompt instructions without disabling heartbeat runtime behavior.
- Agents/compaction: stop compaction-wait aborts from re-entering prompt failover and replaying completed tool turns. (#62600) 感谢 @i-dentifier.
- Approvals/runtime: move native approval lifecycle assembly into shared core bootstrap/runtime seams driven by channel capabilities and runtime contexts, and remove the legacy bundled approval fallback wiring. (#62135) 感谢 @gumadeiras.
- Security/fetch-guard: stop rejecting operator-configured proxy hostnames against the target-scoped hostname allowlist in SSRF-guarded fetches, restoring proxy-based media downloads for Telegram and other channels. (#62312) 感谢 @ademczuk.
- Logging: make `logging.level` and `logging.consoleLevel` honor the documented severity threshold ordering again, and keep child loggers inheriting the parent `minLevel`. (#44646) 感谢 @zhumengzhu.
- Agents/sessions_send: pass `threadId` through announce delivery so cross-session notifications land in the correct Telegram forum topic instead of the group's general thread. (#62758) 感谢 @jalehman.
- Daemon/systemd: keep sudo systemctl calls scoped to the invoking user when machine-scoped systemctl fails, while still avoiding machine fallback for permission-denied user bus errors. (#62337) 感谢 @Aftabbs.
- Docs/i18n: relocalize final localized-page links after translation and remove the zh-CN homepage redirect override so localized Mintlify pages resolve to the correct language roots again. (#61796) 感谢 @hxy91819.
- Agents/exec: keep timed-out shell-backgrounded commands on the failed path and point long-running jobs to exec background/yield sessions so process polling is only suggested for registered sessions.
- Agents/model resolution: let explicit `openai-codex/gpt-5.4` selection prefer provider runtime metadata when it reports a larger context window, keeping configured Codex runs aligned with the live provider limits. (#62694) 感谢 @ruclaw7.
- Agents/model resolution: keep explicit-model runtime comparisons on the configured workspace plugin registry, so workspace-installed providers do not silently fall back to stale explicit metadata during runtime model lookup.
- Providers/Z.AI: default onboarding and endpoint detection to GLM-5.1 instead of GLM-5. (#61998) 感谢 @serg0x.
- Cron/isolated: resolve auth profiles without treating every isolated run as a brand-new auth session, so profile-based providers (for example OpenRouter) keep a stable credential choice instead of rotating or ignoring stored keys. (#62783) 感谢 @neeravmakwana.
- CLI/tasks: `openclaw tasks cancel` now records operator cancellation for CLI runtime tasks instead of returning "Task runtime does not support cancellation yet", so stuck `running` CLI tasks can be cleared. (#62419) 感谢 @neeravmakwana.
- Sessions/context: resolve context window limits using the active provider plus model (not bare model id alone) when persisting session usage, applying inline directives, and sizing memory-flush / preflight compaction thresholds, so duplicate model ids across providers no longer leak the wrong `contextTokens` into the session store or `/status`. (#62472) 感谢 @neeravmakwana.
- Channels/setup: exclude workspace shadow entries from channel setup catalog lookups and align trust checks with auto-enable so workspace-scoped overrides no longer bypass the trusted catalog. (`GHSA-82qx-6vj7-p8m2`) 感谢 @zsxsoft.
- Reply execution: prefer the active runtime snapshot over stale queued reply config during embedded reply and follow-up execution so SecretRef-backed reply turns stop crashing after secrets have already resolved. (#62693) 感谢 @mbelinky.
- Android/manual connect: allow blank port input only for TLS manual gateway endpoints so standard HTTPS Tailscale hosts default to `443` without silently changing cleartext manual connects. (#63134) 感谢 @Tyler-RNG.
- Matrix/agents: hide owner-only `set-profile` from embedded agent channel-action discovery so non-owner runs stop advertising profile updates they cannot execute. (#62662) 感谢 @eleqtrizit.
- iOS/gateway: replace string-matched connection error UI with structured gateway connection problems, preserve actionable pairing/auth failures over later generic disconnect noise, and surface reusable problem banners and details across onboarding, settings, and root status surfaces. (#62650) 感谢 @ngutman.
- Git/env sanitization: block additional Git repository-plumbing env variables such as `GIT_DIR`, `GIT_WORK_TREE`, `GIT_COMMON_DIR`, `GIT_INDEX_FILE`, `GIT_OBJECT_DIRECTORY`, `GIT_ALTERNATE_OBJECT_DIRECTORIES`, and `GIT_NAMESPACE` so host-run Git commands cannot be redirected to attacker-chosen repository state through inherited or request-scoped env. (#62002) 感谢 @eleqtrizit.
- Host exec/env sanitization: block additional request-scoped credential and config-path overrides such as `KUBECONFIG`, cloud credential-path env, `CARGO_HOME`, and `HELM_HOME` so host-run tools can no longer be redirected to attacker-chosen config or state. (#59119) 感谢 @eleqtrizit.


---

# OpenClaw 中文版 - 更新日志

本文档记录 OpenClaw 官方版本的最新更新，实时同步。

---

## 🚀 v2026.4.5 (2026年4月7日)

> 最新稳定版，2718 个新提交同步（相比 v2026.4.2）。

### ⚠️ 重大变更

#### 1. Config：移除旧版配置别名
- 移除 `talk.voiceId` / `talk.apiKey`、`agents.*.sandbox.perSession`、`browser.ssrfPolicy.allowPrivateNetwork`、`hooks.internal.handlers`、channel/group/room `allow` 等旧版配置别名
- 迁移至规范化的公开配置路径
- 支持 `openclaw doctor --fix` 自动迁移

### ✨ 新增功能

#### 1. 视频生成工具
- 新增内置 `video_generate` 工具
- 支持 xAI (grok-imagine-video)、Alibaba Model Studio Wan、Runway 视频提供商
- Agent 可直接生成视频并嵌入回复

#### 2. 音乐生成工具
- 新增内置 `music_generate` 工具
- 支持 Google Lyria、MiniMax、ComfyUI 工作流
- 支持异步任务追踪和完成通知

#### 3. ComfyUI 媒体插件
- 新增捆绑 ComfyUI 工作流媒体插件
- 支持本地 ComfyUI 和 Comfy Cloud
- 集成 image_generate、video_generate、music_generate

#### 4. 新增提供商
- **Qwen**、**Fireworks AI**、**StepFun** 捆绑支持
- **Amazon Bedrock Mantle** 支持
- **MiniMax TTS**、**Ollama Web Search**、**MiniMax Search** 集成
- **Arcee AI** 提供商插件

#### 5. Memory/Dreaming 实验性功能
- 新增加权短期记忆提升机制
- 新增 `/dreaming` 命令和 Dreams UI
- 多语言概念标签
- 三个协作阶段：light、deep、REM
- 新增 `dreams.md` 记录文件

#### 6. Control UI 多语言支持
- 新增简体中文、繁体中文、葡萄牙语、德语、西班牙语、日语、韩语、法语、土耳其语、印尼语、波兰语、乌克兰语界面

#### 7. Control UI Skills 面板增强
- 新增 ClawHub 搜索、详情和安装流程
- 可直接在 Skills 面板中管理插件

#### 8. ACPX 运行时内置
- ACP 运行时直接嵌入 acpx 插件
- 移除外部 ACP CLI 中转
- 新增通用 `reply_dispatch` hook

#### 9. Claude CLI MCP 桥接
- 通过 loopback MCP 桥接将 OpenClaw 工具暴露给 Claude CLI 后台运行
- 切换到 stdin + stream-json partial-message 流式传输

#### 10. 提示词缓存优化
- 改进 MCP 工具顺序确定性
- 改进 compaction、embedded image history、normalized system-prompt fingerprints
- 改进 `openclaw status --verbose` 缓存诊断

#### 11. Sessions 持久化检查点
- 新增持久化 compaction 检查点
- Sessions UI 支持分支/恢复操作
- 可检查和恢复压缩前的会话状态

#### 12. Matrix 执行审批
- 新增 Matrix 原生执行审批提示
- 支持账户作用域审批人
- 支持频道或 DM 投递

#### 13. iOS/Watch 执行审批
- 新增通用 APNs 审批通知
- 支持 Apple Watch 审批和恢复

### 🔐 安全修复

| 修复项 | 说明 |
|--------|------|
| 插件工具白名单保护 | 保留限制性插件专用工具白名单 |
| `/allowlist` 权限控制 | 添加/移除需要所有者访问权限 |
| `before_tool_call` hook 安全 | hook 崩溃时 fail closed |
| 浏览器 SSRF 重定向绕过 | 提前阻止 |
| 非交互式 auth-choice 范围 | 限制为捆绑和可信插件 |

### 🐛 问题修复

| 问题 | 修复内容 |
|------|---------|
| OpenAI Codex OAuth | 修复 refresh_token_reused 导致卡住的问题 |
| Agents/history 和 replies | 缓冲无阶段 OpenAI WS 文本直到真实 assistant 阶段到达 |
| 插件加载稳定性 | 修复 Windows `file://` 和原生 Jiti 插件加载路径 |
| 自动回复媒体 | 恢复 generated-media `MEDIA:` 路径投递 |
| 运行时事件信任 | 标记背景 notifyOnExit、ACP parent-stream relay 为不受信任 |
| Anthropic thinking blocks | 为 Claude Opus 4.5+、Sonnet 4.5+ 保留 thinking blocks |
| Control UI 音频 | 在 webchat 中显示 `/tts` 音频回复 |
| TUI 稳定性 | 修复 Kitty 键盘状态在退出时恢复 |
| Sessions 模型选择 | 解析会话选择的模型与运行时回退解析分开 |
| Apple Watch 审批 | 保持 iPhone 锁定或后台时仍可审批恢复 |
| Agents/context overflow | 组合超大和聚合工具结果恢复 |
| Browser 远程 CDP | 远程浏览器重启后重试 DevTools websocket |
| Gateway 容器 | 在 Docker/Podman 环境中自动绑定 `0.0.0.0` |
| Discord 引用消息 | 恢复引用的消息文本和附件 |
| Slack 线程 | 修复遗留线程粘性 |
| Memory 向量召回 | 当 sqlite-vec 不可用时显示警告 |
| MS Teams 文件上传 | 验证文件 consent upload URL 防止 SSRF |
| Tools/web_fetch | 修复 undici 8.0 启用 HTTP/2 导致的 TypeError |

### 🙏 致谢

感谢所有贡献者！完整列表见 [GitHub v2026.4.5](https://github.com/openclaw/openclaw/compare/v2026.4.2...v2026.4.5)。

---

## 🚀 v2026.4.2 (2026年4月2日)

> 最新稳定版，178 个新提交同步（相比 v2026.4.1）。

### ✨ 新增功能

#### 1. TaskFlow：托管子任务执行
- 新增托管子任务 spawn 机制，支持 sticky cancel intent
- 外部编排器可立即停止调度，让父 TaskFlow 平滑过渡到 `cancelled` 状态
- 配合 TaskFlow 检查/恢复原语，持久化后台编排

#### 2. TaskFlow：恢复托管基板
- 恢复核心 TaskFlow 基板，支持 managed-vs-mirrored 同步模式
- 持久化 flow 状态和修订版本追踪
- `openclaw flows` 检查/恢复命令

#### 3. Exec approvals：策略报告与操作统一
- 统一有效策略报告与操作，提升 `openclaw doctor exec-approvals` 诊断能力
- 修复策略源归属问题

#### 4. TinyFish 浏览器自动化插件
- 新增 TinyFish 作为捆绑浏览器自动化插件
- 提供更强大的浏览器操控能力

#### 5. Slack：Scoped prompts 和 mrkdwn hints
- 新增 Slack 专用 scoped prompts
- mrkdwn 格式提示，减少通用 Markdown 回退

#### 6. Diffs：可配置 viewer base URL
- 新增插件级 `viewerBaseUrl` 配置
- viewer 链接可使用稳定的代理/公共源
- 无需每次工具调用传递 `baseUrl`

#### 7. 插件 Hook：`before_agent_reply`
- 新增 `before_agent_reply` hook，支持合成回复短路 LLM
- 可在内联动作后注入人工回复

#### 8. Feishu：Drive 评论事件流
- 新增专用 Drive comment-event flow
- 评论线程上下文解析，线程内回复
- `feishu_drive` 评论操作

### 🔐 安全修复

| 修复项 | 说明 |
|--------|------|
| 内联图片内存耗尽 | 防止 inline image decoding 内存耗尽攻击 |
| ACP 会话初始化异常 | 修复本地捕获的 ACP 会话初始化异常导致的问题 |
| Discord ID 类型 | 强制数字 Discord ID 转为字符串，避免拒绝有效配置 |

### 🐛 问题修复

| 问题 | 修复内容 |
|------|---------|
| Anthropic thinking 标签泄露 | 剥离 `antml:thinking` 块，防止内部独白泄露到用户可见回复 |
| ACP reconnect prompts | 保持 ACP prompts 在 websocket 瞬断后存活 |
| WhatsApp MIME | 添加 HTML/XML/CSS 到 MIME map，未知类型优雅降级 |
| Matrix mentions | 发出符合规范的 `m.mentions` 元数据，修复 Element 等客户端通知 |
| Kimi Coding 工具调用 | 规范化 Anthropic 工具载荷为 OpenAI 兼容格式 |
| Feishu 评论线程 |硬化文档评论线程投递，延迟回复查找重试更可靠 |
| MS Teams 流式超限 | 剥离已流式传输的文本，防止 4000+ 字符回复重复内容 |
| Slack mrkdwn 格式 | 添加内置 Slack mrkdwn 指导，停止回退到通用 Markdown |
| Gateway exec loopback | 恢复空配对设备 token map 的 legacy-role 回退 |
| Podman launch 噪声 | 移除 `run-openclaw-podman.sh` 中的冗余容器输出 |
| 图片工具路径 | 相对路径解析到 agent `workspaceDir` 而非 `process.cwd()` |

### 🔧 性能优化

- Matrix 客户端运行时依赖懒加载
- Telegram 消息上下文运行时懒加载
- Provider 请求配置重构，添加内部请求配置 seam
- Provider 流请求头集中化管理

### 🙏 致谢

感谢所有贡献者！完整列表见 [GitHub v2026.4.2](https://github.com/openclaw/openclaw/compare/v2026.4.1...v2026.4.2)。

---

## 🚀 v2026.4.1 最新更新 (2026年4月1日)

> 重要 bugfix 版本。

> 最新稳定版，872 个提交同步。

### ⚠️ 重大变更

#### 1. Qwen 提供商：移除旧版 OAuth 集成
- 移除 portal.qwen.ai 的 qwen-portal-auth OAuth 集成
- 迁移至 Model Studio，使用 `openclaw onboard --auth-choice modelstudio-api-key`

#### 2. Config/Doctor：移除两个月以上的自动迁移
- 旧版配置键不再自动迁移，将触发验证错误
- 需使用 `openclaw doctor` 手动处理

---

### ✨ 新增功能

#### 1. xAI / Grok 全面升级
- xAI 提供商迁移至 Responses API
- 新增 first-class `x_search` 支持
- 自动启用 xAI 插件，Grok 搜索配置开箱即用
- onboard 和 `openclaw configure --section web` 支持 x_search 配置向导

#### 2. MiniMax 图像生成
- 新增 MiniMax image-01 模型图像生成
- 支持文生图和图生图编辑
- 支持比例控制

#### 3. 插件 Hooks：异步审批
- `before_tool_call` hooks 支持异步 `requireApproval`
- 插件可暂停工具执行，等待用户审批
- 支持 Telegram 按钮、Discord interactions、/approve 命令

#### 4. ACP/channels：当前对话绑定
- Discord、BlueBubbles、iMessage 支持当前对话 ACP 绑定
- `/acp spawn codex --bind here` 可直接绑定当前聊天

#### 5. OpenAI apply_patch 默认启用
- OpenAI 和 OpenAI Codex 模型默认启用 apply_patch
- Sandbox 策略访问与写权限对齐

#### 6. 插件 CLI backends 统一
- Claude CLI、Codex CLI、Gemini CLI 统一到插件层
- 新增 Gemini CLI 后端支持
- `--claude-cli-logs` 替换为通用 `--cli-backend-logs`

#### 7. Podman 简化
- 简化 rootless 用户容器配置
- launch helper 安装至 `~/.local/bin`
- 文档更新为 host-CLI `openclaw --container ...` 工作流

#### 8. Slack 上传文件
- 新增 Slack `upload-file` action
- 支持 filename/title/comment 覆盖

#### 9. 统一文件发送
- Teams、Google Chat 文件发送统一到 `upload-file`
- BlueBubbles 文件发送通过 upload-file 暴露

#### 10. Matrix TTS 升级
- 自动 TTS 回复发送为原生 Matrix 语音气泡

#### 11. Config schema CLI
- `openclaw config schema` 打印 openclaw.json 的 JSON schema

---

### 🔐 安全修复

- 扩展 web search key 审计，支持 Gemini、Grok/xAI、Kimi、Moonshot、OpenRouter
- 修复 Control UI 敏感配置默认隐藏

---

### 🐛 问题修复

| 问题 | 修复内容 |
|------|---------|
| WhatsApp 自聊循环 | 修复无限 echo loop |
| Telegram HTML 分割 | 修复单词边界分割，避免 mid-word 截断 |
| Telegram 空文本崩溃 | 跳过空白文本回复防止 GrammyError 400 |
| Mistral API | 修复 422 错误 |
| Control UI | 敏感配置默认隐藏，修复 [#55322](https://github.com/openclaw/openclaw/issues/55322) |
| zsh 补全 | 延迟 compdef 注册直到 compinit 可用 |
| BlueBubbles | 修复 debounce null text 问题 |
| Discord 重连 | 修复 resume state 中毒导致的循环 |
| iMessage | 停止 [[reply_to:...]] 标签泄露 |
| CLI/plugins | 修复 bundled channels 自动加载 |
| CLI/message send | 修复 delivery 写入 session transcript |

---

### 🔧 性能优化

- provider policy 移至 plugins
- provider transport hooks 泛化
- 延长 CI 长测试超时

---

## 🚀 v2026.3.28-beta.1 (2026年3月28日)

> 预发布版，核心功能同 v2026.3.29。

### 主要新功能
- xAI Responses API + x_search
- MiniMax image-01 图像生成
- 插件 hooks async requireApproval
- ACP 当前对话绑定

---

## 🚀 v2026.3.14-1 最新更新 (2026年3月18日)

> ⚠️ 此版本为恢复版本，用于修复损坏的 v2026.3.13 标签/发布路径。npm 版本仍为 2026.3.13。

### ✨ 新增功能

#### 1. Android 聊天设置全新 UI
- 重新设计聊天设置页面
- 分组设备媒体设置
- 刷新 Connect 和 Voice tab
- 移动端布局优化

#### 2. iOS 欢迎页
- 新增首次运行欢迎页
- 停止自动打开 QR 扫描器
- 显示 /pair qr 连接说明

#### 3. Docker 时区支持
- 新增 `OPENCLAW_TZ` 环境变量支持
- 自动同步宿主机时区到容器

#### 4. macOS PortGuard 优化
- 防止在远程模式下误杀 Docker Desktop

#### 5. 插件系统增强
- 插件/Bundle 支持 (Codex, Claude, Cursor)
- 新增 Claude marketplace 注册解析
- 支持 `plugin@marketplace` 安装

---

### 🔐 安全更新

#### 1. Docker 安全
- 防止 gateway token 泄露到 Docker build context

#### 2. Discord 元数据处理
- 处理 gateway 元数据获取失败

#### 3. Telegram SSRF
- 将 thread media transport policy 集成到 SSRF 检查

---

### 🐛 问题修复

| 问题 | 修复内容 |
|------|---------|
| Web UI 聊天历史 | 防止 reload storm |
| Chat context notice | 修复图标尺寸 |
| Ollama | 隐藏原生 reasoning-only 输出 |
| Session reset | 保留 lastAccountId 和 lastThreadId |
| Windows | 抑制重启期间的控制台窗口 |
| Cron | 防止 isolated cron 嵌套 lane 死锁 |
| 内存压缩 | 使用完整 session token count 进行压缩后检查 |
| Signal | 添加 groups 配置到 Signal channel schema |
| 跨Agent子Agent | 解决目标 agent workspace 问题 |
| Telegram | 重试 IPv4 回退下载入站媒体 |
| 飞书 | 保留非 ASCII 文件名上传 |
| macOS | 对齐最小 Node.js 版本 (22.16.0) |
| 浏览器 | 强化现有 session driver 验证 |

---

### 🔧 性能优化

#### 1. 构建优化
- 去重 plugin-sdk chunks，修复 ~2x 内存回归

---

## 🚀 v2026.3.14 最新更新 (2026年3月17日)

### ✨ 新增功能

#### 1. 命令增强 - /btw 边问边答
- 新增 `/btw` 快速提问功能
- 可以在当前会话中快速提问而不改变未来会话上下文
- TUI 中提供可关闭的答案显示
- 外部渠道支持显式 BTW 回复

#### 2. Sandbox 可插拔后端
- 新增可插拔沙箱后端架构
- 推出 OpenShell 后端，支持 `mirror` 和 `remote` 工作区模式
- Sandbox list/recreate/prune 现在支持多后端

#### 3. SSH Sandbox
- 新增核心 SSH 沙箱后端
- 支持 secret-backed 密钥、证书和 known_hosts
- 共享远程 exec/文件系统工具

#### 4. Firecrawl 网络工具
- 新增 Firecrawl 作为 onboard/配置的搜索提供商
- 提供 `firecrawl_search` 和 `firecrawl_scrape` 工具
- 与 web_fetch 回退行为对齐

#### 5. 插件/Bundle 支持
- 新增 Codex、Claude 和 Cursor bundle 发现/安装支持
- Bundle skills 映射到 OpenClaw skills
- 应用 Claude bundle settings.json 默认值

#### 6. 插件市场
- 新增 Claude marketplace 注册解析
- 支持 `plugin@marketplace` 安装
- marketplace 列表和更新支持

#### 7. 飞书集成增强
- ACP 当前会话和子 Agent 会话绑定
- 结构化交互式审批卡
- 快速操作启动器
- 流式推理支持 (`onReasoningStream`)

#### 8. Telegram 增强
- 新增 `topic-edit` 支持论坛话题重命名和图标更新
- 新增可选的静默错误回复设置

---

### 🔐 安全更新

#### 1. 设备配对强化
-  bootstrap 设置码改为一次性使用
- 防止未授权的设备配对请求重放和扩大

#### 2. Webhook 安全
- 提前 auth 校验
- 收紧 pre-auth body limits 和超时

#### 3. 入站策略强化
- 强化 Mattermost 和 Google Chat 的回调/webhook 校验
- Nextcloud Talk 房间匹配优化
- Twitch 空允许列表视为拒绝全部

---

### 🐛 问题修复

| 问题 | 修复内容 |
|------|---------|
| Google Auth / Node 25 | 修复 gaxios 兼容性问题 |
| Gateway 启动性能 | 从 dist/extensions 加载插件，修复冷启动慢 |
| 插件上下文引擎 | 强化 owner-aware 注册 |
| 远程 CDP | 严格遵守 SSRP 策略 |
| Webhook 路由 | 固定到启动时注册表 |
| 子 Agent 追踪 | 保持外部投递路由 |
| 配置启动 | 修复 openclaw configure 启动stall |
| 容器化测试 | 修复 Linux 下 pnpm test:docker:all |
| Slack 交互 | 保留 blocks 到 live DM |
| 飞书媒体 | 对齐所有消息类型的媒体处理 |
| WhatsApp 重连 | 修复 protobuf Long timestamps |
| Telegram 消息 | 保留强制文档发送 |
| Z.AI Onboarding | 检测有效的默认模型 |

---

## 🚀 v2026.3.13 (2026年3月18日)

### ✨ 新增功能

#### 1. Docker 时区支持
- 新增 `OPENCLAW_TZ` 环境变量支持
- 自动同步宿主机时区到容器内

#### 2. Android 全新设计
- 重新设计聊天设置 UI
- 使用 Google Code Scanner 替代 ZXing 扫描

#### 3. iOS 欢迎页
- 新增 onboarding welcome pager
- 提升首次用户体验

#### 4. Slack 交互式回复
- 支持 opt-in interactive reply directives
- 新增 Slack interactive replies 文档

#### 5. 移动端优化
- 移动端导航抽屉优化
- 主题变体优化

---

### 🔐 安全更新

#### 1. Docker 安全
- 防止 gateway token 泄露到 Docker build context

#### 2. Discord 元数据
- 处理 gateway 元数据获取失败

#### 3. Telegram SSRF
- 将 thread media transport policy 集成到 SSRF 检查

---

### 🐛 问题修复

| 问题 | 修复内容 |
|------|---------|
| Web UI 聊天历史 | 防止 reload storm |
| Chat context notice | 修复图标尺寸 |
| Ollama | 隐藏原生 reasoning-only 输出 |
| Session reset | 保留 lastAccountId 和 lastThreadId |
| Windows | 抑制重启期间的控制台窗口 |
| Cron | 防止 isolated cron 嵌套 lane 死锁 |
| 内存压缩 | 使用完整 session token count 进行压缩后检查 |
| Signal | 添加 groups 配置到 Signal channel schema |
| 跨Agent子Agent | 解决目标 agent workspace 问题 |

---

### 🔧 性能优化

#### 1. 构建优化
- 去重 plugin-sdk chunks，修复 ~2x 内存回归

---

## v2026.3.12 (2026年3月13日)

### ✨ 新增功能

#### 1. Control UI / Dashboard V2 全新升级
- 模块化仪表盘视图：概览、聊天、配置、Agent、会话
- 命令面板（Command Palette）
- 移动端底部导航栏
- 丰富的聊天工具：斜杠命令、搜索、导出、置顶消息

#### 2. OpenAI GPT-5.4 快速模式
- 支持会话级别的快速切换（/fast 命令）
- 支持 TUI、Control UI、ACP 多端切换
- 每个模型可配置默认快速模式
- OpenAI/Codex 请求优化

#### 3. Anthropic Claude 快速模式
- 共享 /fast 开关
- 直接映射到 Anthropic API 的 service_tier
- 实时验证 Anthropic 和 OpenAI 快速模式

#### 4. Ollama / vLLM / SGLang 插件化
- 迁移到 provider-plugin 架构
- 提供商自有 onboarding 和发现流程
- 模块化模型选择和配置

#### 5. Agents/子Agent优化
- 新增 sessions_yield：让编排器可以立即结束当前轮次
- 跳过排队的工具工作
- 携带隐藏的 follow-up payload 进入下一轮

#### 6. Slack Agent 回复支持
- 支持 channelData.slack.blocks
- Agent 可以发送 Block Kit 消息

#### 7. Kubernetes 部署支持
- 新增 K8s 安装路径
- 提供原始 manifest 文件
- Kind 环境设置和部署文档

---

### 🔐 安全更新

#### 1. 设备配对安全
- /pair 和 openclaw qr 改为短期 bootstrap tokens
- 不再在聊天或 QR 配对中嵌入共享网关凭证

#### 2. 插件安全
- 禁用隐式工作区插件自动加载
- 克隆的仓库无法自动执行插件代码

#### 3. 命令执行安全
- 审批提示中的不可见 Unicode 格式字符转义
- 零宽命令文本显示为可见的 \u{...} 转义

#### 4. 权限安全
- /config 和 /debug 需要发送者所有权
- 共享令牌 WebSocket 连接清除未绑定客户端声明的作用域

---

### 🐛 问题修复

| 问题 | 修复内容 |
|------|---------|
| Kimi Coding 工具调用 | 修复 Anthropic 格式工具调用 |
| TUI 聊天日志 | 修复重复的助手回复 |
| Telegram 模型选择器 | 修复内联模型按钮选择持久化 |
| Cron 主动投递 | 防止重启后重复消息 |
| Ollama Kimi Cloud | 修复 Kimi 模型的 thinking 支持 |
| Moonshot CN API | 尊重显式 baseUrl |
| Mattermost 块流 | 修复重复消息投递 |
| macOS Reminders | 添加缺失的使用说明 |
| 插件缓存 | 修复插件发现/加载缓存 |
| OpenRouter 原生 ID | 规范化配置写入和运行时查找 |
| Windows 原生更新 | 修复 npm 更新路径 |

---

## 📝 历史更新

### v2026.3.12 (2026年3月12日)

#### 安全更新
- Gateway/WebSocket：强制浏览器来源验证，修复跨站 WebSocket 劫持漏洞

#### 功能更新
- OpenRouter 模型目录：新增 Hunter Alpha 和 Healer Alpha
- iOS Home canvas：全新欢迎屏幕

---

## 🔄 即将到来

- 更多中文本土化功能
- 飞书深度集成
- 钉钉/企业微信优化

---

## 📋 版本号说明

OpenClaw 使用日期版本号：
- `v2026.3.13` = 2026年3月13日更新
- `v2026.3.12` = 2026年3月12日更新

---

*本页面由 OpenClaw 中文版团队维护，持续同步官方更新。*

---

## 🚀 v2026.4.15-beta.1 (2026年4月15日)

> 预发布版本，包含多个重要新功能和大量安全修复。

### ✨ 新增功能

#### 1. Model Auth 状态卡片
- Control UI Overview 新增 Model Auth 状态卡片（#66211）
- 显示 OAuth token 健康状态和提供商限速压力
- 关注即将过期或已过期的 OAuth token

#### 2. LanceDB 云存储支持
- memory-lancedb 新增云存储支持（#63502）
- 持久化内存索引可运行在远程对象存储上

#### 3. GitHub Copilot 记忆搜索
- 新增 GitHub Copilot embedding provider 用于记忆搜索（#61718）
- 支持插件复用 transport 和 token 刷新

#### 4. 本地模型轻量模式
- 新增实验性 `agents.defaults.experimental.localModelLean: true`（#66495）
- 移除 browser、cron、message 等重量级默认工具

### 🔐 安全修复

- **exec 审批提示**：Secrets 在 exec 审批提示中脱敏（#61077, #64790）
- **QMD memory_get**：拒绝任意 workspace markdown 路径读取（#66026）
- **Gateway/MCP loopback**：切换到 constant-time `safeEqualSecret` 比较（#66665）
- **浏览器 SSRF**：在 snapshot、screenshot、tab 路由强制执行 SSRF 策略（#66040）
- **Matrix 安全**：规范化沙箱 profile avatar 参数（#64701）
- **Webchat 安全**：拒绝媒体嵌入路径中的远程主机 `file://` URL（#67293）
- **Gateway 安全**：在 webchat 音频嵌入路径强制 `localRoots` 约束（#67298）

### 🐛 问题修复

- **CLI/configure**：写入后重新读取持久化 config hash，解决 stale-hash 竞争（#66528）
- **CLI/update**：npm 升级后清理过时 dist chunks（#66959）
- **Agent/compaction**：为小上下文本地模型（如 Ollama 16K）设置 compaction reserve-token 地板（#65671）
- **Ollama/onboarding**：支持直接 `OLLAMA_API_KEY` 云端设置，无需本地守护进程（#67005）
- **Telegram/documents**：清理二进制回复上下文，防止 .epub 和 .mobi 上传泄漏原始二进制到 prompt（#66877）
- **Docker/build**：在 `node_modules` 下用 `find` 验证 `@matrix-org/matrix-sdk-crypto-nodejs` 原生绑定（#67143）
- **音频/STT**：恢复自托管 STT 的 `allowPrivateNetwork` 设置（#66692）

---

## 🚀 v2026.4.14 (2026年4月14日)

> 上游最新稳定版，大量安全修复和问题修复。

### ✨ 新增功能

#### 1. OpenAI Codex/gpt-5.4-pro 支持
- 新增 `gpt-5.4-pro` 前向兼容支持（#66453）
- 包含 Codex 定价和限流配置

#### 2. Telegram 论坛话题名称
- 在 agent context、prompt metadata、plugin hook metadata 中显示人类可读话题名称（#65973）
- 从 Telegram 论坛服务消息中学习名称

### 🔐 安全修复

- **Agents/gateway-tool**：拒绝模型端 gateway tool 的 `config.patch/apply` 调用（#62006）
- **Slack/interactions**：对 block-action 和 modal interactive 事件应用全局 `allowFrom` 白名单（#66028）
- **媒体附件**：本地附件路径无法解析时 fail closed（#66022）
- **Heartbeat/security**：强制对不可信 `hook:wake` 系统事件进行 owner downgrade（#66031）
- **Config/redact**：在 `redactConfigSnapshot` 中清除 `sourceConfig` 和 `runtimeConfig`（#66030）
- **Teams/security**：对 SSO signin 调用执行发件人白名单检查（#66033）

### 🐛 问题修复

- **Ollama**：正确转发配置的 embedded-run 超时到全局 undici stream 超时
- **Models/Codex**：在代码提供商标目输出中包含 `apiKey`（#66180）
- **UI/chat**：用 markdown-it 替换 marked.js，防止 ReDoS 攻击（#46707）
- **WhatsApp/Baileys**：npm/postinstall 时等待加密媒体文件flush完毕再读回（#65896）
- **Telegram/forum**：持久化话题名称到 session sidecar store，重启后可继续使用（#66107）
- **Gateway/sessions**：阻止 heartbeat/cron/exec 事件覆盖共享会话路由元数据（#66073）
- **Cron/scheduler**：修复无有效未来 slot 时的重试逻辑（#66019）
- **Auto-reply/send policy**：`sendPolicy: "deny"` 不再阻塞入站消息处理（#65461）
- **Feishu/allowlist**：规范化 allowlist 条目，防止 user/chat 命名空间交叉（#66021）
- **Media/store**：遵守配置的 agent 媒体限制（#66229）
- **Hook/session-memory**：传递解析后的 agent workspace 到 `/new` 和 `/reset` hook（#64735）

---

## 🚀 v2026.4.12 (2026年4月12日)

> 上游版本，Active Memory 正式发布，QA 能力大幅增强。

### ✨ 新增功能

#### 1. Active Memory 插件正式版
- 新增可选 Active Memory 插件（#63286）
- 在主回复前运行专用记忆子 Agent
- 支持 message/recent/full context 模式
- 支持 `/verbose` 实时查看
- 文档：https://docs.openclaw.ai/concepts/active-memory

#### 2. macOS Talk Mode MLX 语音
- 新增实验性本地 MLX 语音合成器（#63539）
- 支持本地 utterance 播放和系统语音 fallback

#### 3. CLI exec-policy 命令
- 新增 `openclaw exec-policy` 命令（#64050）
- 支持 `show`、`preset`、`set` 子命令

#### 4. Gateway commands.list RPC
- 新增 `commands.list` RPC（#62656）
- 远程 gateway 客户端可发现运行时命令

#### 5. LM Studio Provider
- 新增捆绑 LM Studio provider（#53248）
- 支持本地/自托管 OpenAI 兼容模型

### 🔐 安全修复

- 移除 busybox/toybox 解释器类似安全 bin（#65713）
- 防止空审批人列表授予显式审批授权（#65714）
- 扩大 shell-wrapper 检测并阻止 env-argv 赋值注入（#65717）
- `.env.example` 中的示例凭证清空，启动时拒绝占位符 token（#64586）

### 🐛 问题修复

- **Gateway/startup**：延迟调度服务直到 sidecar 完成（#65365）
- **Control UI/chat**：加载 live gateway slash-command 目录到 composer（#65620）
- **CLI/update**：修复自更新后重新加载跟踪插件的入口点（#65471）
- **Memory/active-memory**：改进 lexical fallback 排名（#65049）
- **WhatsApp/outbound**：修复 `mediaUrl` 为空时回退到 `mediaUrls` 第一个条目（#64394）
- **Discord/doctor**：防止 `doctor --fix` 重写 legacy streaming config（#65035）
- **Agent/queueing**：在修复前将孤立 active-turn 用户文本带入下一 prompt（#65388）
- **Gateway/keepalive**：停止将 WebSocket tick 广播标记为可丢弃（#65256）
- **Telegram**：路由审批按钮回调查询到单独顺序通道（#64979）
- **Memory/wiki**：保留 Unicode 字母、数字和组合标记在 wiki slugs 中（#64742）
- **Dreaming**：正确使用时区，在 diary timestamps 中包含时区缩写（#65034）
- **WhatsApp**：集中化每账户连接所有权（#65290）
- **iMessage**：重试瞬态 `watch.subscribe` 启动失败（#65393）

---

## 🚀 v2026.4.11 (2026年4月11日)

> 上游版本，Dreaming UI 增强，视频生成和 Feishu 改进。

### ✨ 新增功能

#### 1. Dreaming/Memory Wiki 导入
- 新增 ChatGPT 导入 ingestion（#64505）
- 新增 Imported Insights 和 Memory Palace diary 子标签页

#### 2. Control UI/WebChat 富媒体
- 渲染 assistant media/reply/voice 指令为结构化聊天气泡（#64104）
- 新增 `[embed ...]` 富输出标签

#### 3. 视频生成增强
- 新增 URL-only 生成资源传递（#61987）
- 支持自适应宽高比和更高图像输入上限

#### 4. Feishu 文档评论
- 改进文档评论会话的上下文解析（#63785）
- 支持评论反应和打字反馈

#### 5. Microsoft Teams 反应
- 新增反应支持、Graph 分页（#51646）

### 🐛 问题修复

- **OpenAI/Codex OAuth**：停止重写 authorize URL scopes（#64713）
- **音频转录**：仅为 OpenAI 兼容 multipart 请求禁用 pinned DNS（#64766）
- **macOS/Talk Mode**：授予麦克风权限后继续启动（#62459）
- **Google/Veo**：停止发送不支持的 `numberOfVideos` 请求字段（#64723）
- **WhatsApp**：路由 `message react` 通过 gateway-owned action path（#53918）
- **Telegram/sessions**：修复话题 scoped session 初始化（#64869）
- **Agent/failover**：将回退分类范围限定为当前 attempt（#62907）

---

## 🚀 v2026.4.10 (2026年4月10日)

> 上游最新版本，162 个新提交同步（相比 v2026.4.9）。

### ✨ 新增功能

#### 1. Active Memory recall 插件
- 新增 Active Memory recall 插件（#63286），在主回复前运行专用记忆子 Agent
- 支持 message/recent/full context 模式配置
- 新增 `/verbose` 实时查看功能
- 支持 transcript 持久化用于调试

#### 2. macOS Talk Mode MLX 语音
- 新增实验性本地 MLX 语音合成器
- 支持显式 provider 选择和本地 utterance 播放
- 支持中断处理和系统语音 fallback

#### 3. 文档国际化增强
- raw doc 翻译分块处理，拒绝截断输出
- 避免歧义的 body-only wrapper 展开
- 从 terminated Pi 翻译会话中恢复

#### 4. QA 多跳测试
- `openclaw qa suite` 新增 `--runner multipass` 模式
- 支持在 disposable Linux VM 中运行 repo-backed QA 场景

#### 5. Gateway 启动优化
- 拆分启动和运行时边界，改进 lifecycle 排序和 reload 行为

### 🔐 安全修复

#### 1. 浏览器 SSRF 防护加固
- 修复交互驱动的主帧导航后 SSRF 检查被绕过的问题（#63226）

#### 2. dotenv 安全
- 阻止不可信 workspace .env 文件中的运行时控制环境变量
- 拒绝不安全的 URL 风格浏览器控制 override（#62660, #62663）

#### 3. Node 远程执行事件
- 将 node exec 事件标记为不可信系统事件，防止注入可信 `System:` 内容

#### 4. 依赖安全审计
- 强制 `basic-ftp` 升级至 5.2.1（CRLF 命令注入修复）
- 升级 Hono 和 @hono/node-server

#### 5. 插件认证隔离
- 防止不可信 workspace 插件与捆绑 provider auth-choice id 冲突

### 🐛 问题修复

- **WhatsApp**：修复断连重连后消息丢失问题
- **Matrix**：修复启动时 sync 就绪等待和 background handler 故障处理
- **Slack**：修复 url_private_download 图片附件认证问题
- **Android/Pairing**：修复 QR 扫描恢复可靠性
- **iOS 版本锁定**：通过 CalVer 和 pnpm ios:version:pin 工作流稳定版本号
- **Dreaming/cron**：修复时区配置和启动配置解析
- **QQBot**：新增可配置流式输出模式（streaming.mode）
- **Windows/exec**：修复 supervisor wait 导致的挂起和 SIGKILL 问题

---

## 🚀 v2026.4.9 (2026年4月9日)

> 上游版本，重要安全修复和 Memory/Dreaming 功能增强。

### ✨ 新增功能

#### 1. Memory/Dreaming 重大升级
- 新增 grounded REM backfill lane
- 支持历史 `rem-harness --path` 和 diary commit/reset 流程
- 新增 cleaner durable-fact extraction
- 短期记忆提升集成

#### 2. Control UI/Dreaming
- 新增结构化 diary 视图，支持时间线导航
- 新增 backfill/reset 控制和 grounded Scene lane
- 安全 clear-grounded 操作

#### 3. QA/lab 角色评估
- 新增 character-vibes 评估报告
- 支持模型选择和并行运行

#### 4. Provider Auth Aliases
- provider manifest 可声明 `providerAuthAliases`
- provider 变体可共享环境变量和认证配置

### 🔐 安全修复

- 浏览器 SSRF 防护（#63226）
- dotenv 安全（#62660, #62663）
- Node 远程执行事件注入防护（#62659）
- basic-ftp 5.2.1 升级

### 🐛 问题修复

- Android/Pairing 恢复可靠性
- Matrix 启动和 background handler
- Slack 图片附件认证
- Discord/Telegram approval 路径对齐
