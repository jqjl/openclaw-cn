---
summary: "How to enable and tune guardrails that detect repetitive tool-call loops"
title: "Tool-loop detection"
read_when:
  - A user reports agents getting stuck repeating tool calls
  - You need to tune repetitive-call protection
  - You are editing agent tool/runtime policies
<<<<<<< HEAD
---

OpenClaw can keep agents from getting stuck in repeated tool-call patterns.
The guard is **disabled by default**.

Enable it only where needed, because it can block legitimate repeated calls with strict settings.
=======
  - You hit `compaction_loop_persisted` aborts after a context-overflow retry
---

OpenClaw has two cooperating guardrails for repetitive tool-call patterns:

1. **Loop detection** (`tools.loopDetection.enabled`) — disabled by default. Watches the rolling tool-call history for repeated patterns and unknown-tool retries.
2. **Post-compaction guard** (`tools.loopDetection.postCompactionGuard`) — enabled by default unless `tools.loopDetection.enabled` is explicitly `false`. Arms after every compaction-retry and aborts the run when the agent emits the same `(tool, args, result)` triple within the window.

Both are configured under the same `tools.loopDetection` block, but the post-compaction guard runs whenever the master switch is not explicitly off. Set `tools.loopDetection.enabled: false` to silence both surfaces.
>>>>>>> upstream/main

## Why this exists

- Detect repetitive sequences that do not make progress.
- Detect high-frequency no-result loops (same tool, same inputs, repeated errors).
- Detect specific repeated-call patterns for known polling tools.
<<<<<<< HEAD

## Configuration block

Global defaults:
=======
- Prevent context-overflow then compaction then same-loop cycles from running indefinitely.

## Configuration block

Global defaults, with every documented field shown:
>>>>>>> upstream/main

```json5
{
  tools: {
    loopDetection: {
<<<<<<< HEAD
      enabled: false,
      historySize: 30,
      warningThreshold: 10,
      criticalThreshold: 20,
=======
      enabled: false, // master switch for the rolling-history detectors
      historySize: 30,
      warningThreshold: 10,
      criticalThreshold: 20,
      unknownToolThreshold: 10,
>>>>>>> upstream/main
      globalCircuitBreakerThreshold: 30,
      detectors: {
        genericRepeat: true,
        knownPollNoProgress: true,
        pingPong: true,
      },
<<<<<<< HEAD
=======
      postCompactionGuard: {
        windowSize: 3, // armed after compaction-retry; runs unless enabled is explicitly false
      },
>>>>>>> upstream/main
    },
  },
}
```

Per-agent override (optional):

```json5
{
  agents: {
    list: [
      {
        id: "safe-runner",
        tools: {
          loopDetection: {
            enabled: true,
            warningThreshold: 8,
            criticalThreshold: 16,
          },
        },
      },
    ],
  },
}
```

### Field behavior

<<<<<<< HEAD
- `enabled`: Master switch. `false` means no loop detection is performed.
- `historySize`: number of recent tool calls kept for analysis.
- `warningThreshold`: threshold before classifying a pattern as warning-only.
- `criticalThreshold`: threshold for blocking repetitive loop patterns.
- `globalCircuitBreakerThreshold`: global no-progress breaker threshold.
- `detectors.genericRepeat`: detects repeated same-tool + same-params patterns.
- `detectors.knownPollNoProgress`: detects known polling-like patterns with no state change.
- `detectors.pingPong`: detects alternating ping-pong patterns.

For `exec`, no-progress checks compare stable command outcomes and ignore volatile runtime metadata such as duration, PID, session ID, and working directory.
When a run id is available, recent tool-call history is evaluated only within that run so scheduled heartbeat cycles and fresh runs do not inherit stale loop counts from earlier runs.

## Recommended setup

- For smaller models, start with `enabled: true`, defaults unchanged. Flagship models rarely need loop detection and can leave it disabled.
- Keep thresholds ordered as `warningThreshold < criticalThreshold < globalCircuitBreakerThreshold`.
- If false positives occur:
  - raise `warningThreshold` and/or `criticalThreshold`
  - (optionally) raise `globalCircuitBreakerThreshold`
  - disable only the detector causing issues
  - reduce `historySize` for less strict historical context

## Post-compaction guard

When the runner completes an auto-compaction-retry (after a context-overflow), it arms a short-window guard that watches the next few tool calls. If the agent emits the _same_ `(toolName, args, result)` triple multiple times within that window, the guard concludes that compaction did not break the loop and aborts the run with a `compaction_loop_persisted` error.

This is a separate code path from the global `tools.loopDetection` detectors. It is independently configurable:
=======
| Field                            | Default | Effect                                                                                                                          |
| -------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `enabled`                        | `false` | Master switch for the rolling-history detectors. Setting `false` also disables the post-compaction guard.                       |
| `historySize`                    | `30`    | Number of recent tool calls kept for analysis.                                                                                  |
| `warningThreshold`               | `10`    | Threshold before a pattern is classified as warning-only.                                                                       |
| `criticalThreshold`              | `20`    | Threshold for blocking repetitive loop patterns.                                                                                |
| `unknownToolThreshold`           | `10`    | Block repeated calls to the same unavailable tool after this many misses.                                                       |
| `globalCircuitBreakerThreshold`  | `30`    | Global no-progress breaker threshold across all detectors.                                                                      |
| `detectors.genericRepeat`        | `true`  | Detects repeated same-tool + same-params patterns.                                                                              |
| `detectors.knownPollNoProgress`  | `true`  | Detects known polling-like patterns with no state change.                                                                       |
| `detectors.pingPong`             | `true`  | Detects alternating ping-pong patterns.                                                                                         |
| `postCompactionGuard.windowSize` | `3`     | Number of post-compaction tool calls during which the guard stays armed and the count of identical triples that aborts the run. |

For `exec`, no-progress checks compare stable command outcomes and ignore volatile runtime metadata such as duration, PID, session ID, and working directory. When a run id is available, recent tool-call history is evaluated only within that run so scheduled heartbeat cycles and fresh runs do not inherit stale loop counts from earlier runs.

## Recommended setup

- For smaller models, set `enabled: true` and leave the thresholds at their defaults. Flagship models rarely need rolling-history detection and can leave the master switch at `false` while still benefiting from the post-compaction guard.
- Keep thresholds ordered as `warningThreshold < criticalThreshold < globalCircuitBreakerThreshold`.
- If false positives occur:
  - Raise `warningThreshold` and/or `criticalThreshold`.
  - Optionally raise `globalCircuitBreakerThreshold`.
  - Disable only the specific detector causing issues (`detectors.<name>: false`).
  - Reduce `historySize` for less strict historical context.
- To disable everything (including the post-compaction guard), set `tools.loopDetection.enabled: false` explicitly.

## Post-compaction guard

When the runner completes a compaction-retry after a context-overflow, it arms a short-window guard that watches the next few tool calls. If the agent emits the same `(toolName, argsHash, resultHash)` triple multiple times within the window, the guard concludes that compaction did not break the loop and aborts the run with a `compaction_loop_persisted` error.

The guard is gated by the master `tools.loopDetection.enabled` flag with one twist: it stays **enabled when the flag is unset or `true`** and only deactivates when the flag is explicitly `false`. This is intentional. The guard exists to escape compaction loops that would otherwise burn unbounded tokens, so a no-config user still gets the protection.
>>>>>>> upstream/main

```json5
{
  tools: {
    loopDetection: {
<<<<<<< HEAD
      enabled: true, // existing master switch; set false to disable loop guards
      postCompactionGuard: {
        windowSize: 3, // default: 3
=======
      // master switch; set false to disable the guard along with the rolling detectors
      enabled: true,
      postCompactionGuard: {
        windowSize: 3, // default
>>>>>>> upstream/main
      },
    },
  },
}
```

<<<<<<< HEAD
- `windowSize`: number of post-compaction tool calls during which the guard stays armed _and_ the count of identical (tool, args, result) triples that triggers an abort.

The guard never aborts when results are changing, only when results are byte-identical across the window. It is intentionally narrow: it fires only in the immediate aftermath of a compaction-retry.

## Logs and expected behavior

When a loop is detected, OpenClaw reports a loop event and blocks or dampens the next tool-cycle depending on severity.
This protects users from runaway token spend and lockups while preserving normal tool access.

- Prefer warning and temporary suppression first.
- Escalate only when repeated evidence accumulates.

## Notes

- `tools.loopDetection` is merged with agent-level overrides.
- Per-agent config fully overrides or extends global values.
- If no config exists, guardrails stay off.

## Related

- [Exec approvals](/tools/exec-approvals)
- [Thinking levels](/tools/thinking)
- [Sub-agents](/tools/subagents)
=======
- Lower `windowSize` is stricter (fewer attempts before abort).
- Higher `windowSize` gives the agent more recovery attempts.
- The guard never aborts when results are changing, only when results are byte-identical across the window.
- It is intentionally narrow: it fires only in the immediate aftermath of a compaction-retry.

<Note>
  The post-compaction guard runs whenever the master flag is not explicitly `false`, even if you never wrote a `tools.loopDetection` block. To verify, look for `post-compaction guard armed for N attempts` in the gateway log immediately after a compaction event.
</Note>

## Logs and expected behavior

When a loop is detected, OpenClaw reports a loop event and either dampens or blocks the next tool-cycle depending on severity. This protects users from runaway token spend and lockups while preserving normal tool access.

- Warnings come first.
- Suppression follows when patterns persist past the warning threshold.
- Critical thresholds block the next tool-cycle and surface a clear loop-detection reason in the run record.
- The post-compaction guard emits `compaction_loop_persisted` errors with the offending tool name and identical-call count.

## Related

<CardGroup cols={2}>
  <Card title="Exec approvals" href="/tools/exec-approvals" icon="shield">
    Allow/deny policy for shell execution.
  </Card>
  <Card title="Thinking levels" href="/tools/thinking" icon="brain">
    Reasoning effort levels and provider-policy interaction.
  </Card>
  <Card title="Sub-agents" href="/tools/subagents" icon="users">
    Spawning isolated agents to bound runaway behavior.
  </Card>
  <Card title="Configuration reference" href="/gateway/configuration-reference" icon="gear">
    Full `tools.loopDetection` schema and merging semantics.
  </Card>
</CardGroup>
>>>>>>> upstream/main
