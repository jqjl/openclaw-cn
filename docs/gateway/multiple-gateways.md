---
summary: "Run multiple OpenClaw Gateways on one host (isolation, ports, and profiles)"
read_when:
  - Running more than one Gateway on the same machine
  - You need isolated config/state/ports per Gateway
title: "Multiple gateways"
---

Most setups should use one Gateway because a single Gateway can handle multiple messaging connections and agents. If you need stronger isolation or redundancy (e.g., a rescue bot), run separate Gateways with isolated profiles/ports.

<<<<<<< HEAD
## Isolation checklist (required)
=======
## Best recommended setup

For most users, the simplest rescue-bot setup is:

- keep the main bot on the default profile
- run the rescue bot on `--profile rescue`
- use a completely separate Telegram bot for the rescue account
- keep the rescue bot on a different base port such as `19789`

This keeps the rescue bot isolated from the main bot so it can debug or apply
config changes if the primary bot is down. Leave at least 20 ports between
base ports so the derived browser/canvas/CDP ports never collide.

## Rescue-Bot Quickstart

Use this as the default path unless you have a strong reason to do something
else:

```bash
# Rescue bot (separate Telegram bot, separate profile, port 19789)
openclaw --profile rescue onboard
openclaw --profile rescue gateway install --port 19789
```

If your main bot is already running, that is usually all you need.

During `openclaw --profile rescue onboard`:

- use the separate Telegram bot token
- keep the `rescue` profile
- use a base port at least 20 higher than the main bot
- accept the default rescue workspace unless you already manage one yourself

If onboarding already installed the rescue service for you, the final
`gateway install` is not needed.

## Why this works

The rescue bot stays independent because it has its own:

- profile/config
- state directory
- workspace
- base port (plus derived ports)
- Telegram bot token

For most setups, use a completely separate Telegram bot for the rescue profile:

- easy to keep operator-only
- separate bot token and identity
- independent from the main bot's channel/app install
- simple DM-based recovery path when the main bot is broken

## What `--profile rescue onboard` Changes

`openclaw --profile rescue onboard` uses the normal onboarding flow, but it
writes everything into a separate profile.

In practice, that means the rescue bot gets its own:

- config file
- state directory
- workspace (by default `~/.openclaw/workspace-rescue`)
- managed service name

The prompts are otherwise the same as normal onboarding.

## General multi-gateway setup

The rescue-bot layout above is the easiest default, but the same isolation
pattern works for any pair or group of Gateways on one host.

For a more general setup, give each extra Gateway its own named profile and its
own base port:

```bash
# main (default profile)
openclaw setup
openclaw gateway --port 18789

# extra gateway
openclaw --profile ops setup
openclaw --profile ops gateway --port 19789
```

If you want both Gateways to use named profiles, that also works:

```bash
openclaw --profile main setup
openclaw --profile main gateway --port 18789

openclaw --profile ops setup
openclaw --profile ops gateway --port 19789
```

Services follow the same pattern:

```bash
openclaw gateway install
openclaw --profile ops gateway install --port 19789
```

Use the rescue-bot quickstart when you want a fallback operator lane. Use the
general profile pattern when you want multiple long-lived Gateways for
different channels, tenants, workspaces, or operational roles.

## Isolation checklist

Keep these unique per Gateway instance:
>>>>>>> upstream/main

- `OPENCLAW_CONFIG_PATH` — per-instance config file
- `OPENCLAW_STATE_DIR` — per-instance sessions, creds, caches
- `agents.defaults.workspace` — per-instance workspace root
- `gateway.port` (or `--port`) — unique per instance
<<<<<<< HEAD
- Derived ports (browser/canvas) must not overlap

If these are shared, you will hit config races and port conflicts.

## Recommended: profiles (`--profile`)

Profiles auto-scope `OPENCLAW_STATE_DIR` + `OPENCLAW_CONFIG_PATH` and suffix service names.

```bash
# main
openclaw --profile main setup
openclaw --profile main gateway --port 18789

# rescue
openclaw --profile rescue setup
openclaw --profile rescue gateway --port 19001
```

Per-profile services:

```bash
openclaw --profile main gateway install
openclaw --profile rescue gateway install
```

## Rescue-bot guide

Run a second Gateway on the same host with its own:

- profile/config
- state dir
- workspace
- base port (plus derived ports)

This keeps the rescue bot isolated from the main bot so it can debug or apply config changes if the primary bot is down.

Port spacing: leave at least 20 ports between base ports so the derived browser/canvas/CDP ports never collide.

### How to install (rescue bot)

```bash
# Main bot (existing or fresh, without --profile param)
# Runs on port 18789 + Chrome CDC/Canvas/... Ports
openclaw onboard
openclaw gateway install

# Rescue bot (isolated profile + ports)
openclaw --profile rescue onboard
# Notes:
# - workspace name will be postfixed with -rescue per default
# - Port should be at least 18789 + 20 Ports,
#   better choose completely different base port, like 19789,
# - rest of the onboarding is the same as normal

# To install the service (if not happened automatically during setup)
openclaw --profile rescue gateway install
```

=======
- derived browser/canvas/CDP ports

If these are shared, you will hit config races and port conflicts.

>>>>>>> upstream/main
## Port mapping (derived)

Base port = `gateway.port` (or `OPENCLAW_GATEWAY_PORT` / `--port`).

- browser control service port = base + 2 (loopback only)
- canvas host is served on the Gateway HTTP server (same port as `gateway.port`)
- Browser profile CDP ports auto-allocate from `browser.controlPort + 9 .. + 108`

If you override any of these in config or env, you must keep them unique per instance.

## Browser/CDP notes (common footgun)

- Do **not** pin `browser.cdpUrl` to the same values on multiple instances.
- Each instance needs its own browser control port and CDP range (derived from its gateway port).
- If you need explicit CDP ports, set `browser.profiles.<name>.cdpPort` per instance.
- Remote Chrome: use `browser.profiles.<name>.cdpUrl` (per profile, per instance).

## Manual env example

```bash
OPENCLAW_CONFIG_PATH=~/.openclaw/main.json \
<<<<<<< HEAD
OPENCLAW_STATE_DIR=~/.openclaw-main \
=======
OPENCLAW_STATE_DIR=~/.openclaw \
>>>>>>> upstream/main
openclaw gateway --port 18789

OPENCLAW_CONFIG_PATH=~/.openclaw/rescue.json \
OPENCLAW_STATE_DIR=~/.openclaw-rescue \
<<<<<<< HEAD
openclaw gateway --port 19001
=======
openclaw gateway --port 19789
>>>>>>> upstream/main
```

## Quick checks

```bash
<<<<<<< HEAD
openclaw --profile main gateway status --deep
openclaw --profile rescue gateway status --deep
openclaw --profile rescue gateway probe
openclaw --profile main status
=======
openclaw gateway status --deep
openclaw --profile rescue gateway status --deep
openclaw --profile rescue gateway probe
openclaw status
>>>>>>> upstream/main
openclaw --profile rescue status
openclaw --profile rescue browser status
```

Interpretation:

- `gateway status --deep` helps catch stale launchd/systemd/schtasks services from older installs.
- `gateway probe` warning text such as `multiple reachable gateways detected` is expected only when you intentionally run more than one isolated gateway.

## Related

- [Gateway runbook](/gateway)
- [Gateway lock](/gateway/gateway-lock)
- [Configuration](/gateway/configuration)
