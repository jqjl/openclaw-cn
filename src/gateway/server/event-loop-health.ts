import { monitorEventLoopDelay, performance } from "node:perf_hooks";

const EVENT_LOOP_MONITOR_RESOLUTION_MS = 20;
const EVENT_LOOP_DELAY_WARN_MS = 1_000;
const EVENT_LOOP_UTILIZATION_WARN = 0.95;
const CPU_CORE_RATIO_WARN = 0.9;
<<<<<<< HEAD
=======
const SUSTAINED_LOAD_SAMPLE_MIN_INTERVAL_MS = 1_000;
>>>>>>> upstream/main

type EventLoopDelayMonitor = ReturnType<typeof monitorEventLoopDelay>;
type EventLoopUtilization = ReturnType<typeof performance.eventLoopUtilization>;
type CpuUsage = ReturnType<typeof process.cpuUsage>;

export type GatewayEventLoopHealthReason = "event_loop_delay" | "event_loop_utilization" | "cpu";

export type GatewayEventLoopHealth = {
  degraded: boolean;
  reasons: GatewayEventLoopHealthReason[];
  intervalMs: number;
  delayP99Ms: number;
  delayMaxMs: number;
  utilization: number;
  cpuCoreRatio: number;
};

export type GatewayEventLoopHealthMonitor = {
  snapshot: () => GatewayEventLoopHealth | undefined;
  stop: () => void;
};

<<<<<<< HEAD
=======
type EventLoopUtilizationReader = typeof performance.eventLoopUtilization;

type EventLoopDelayMonitorFactory = (resolutionMs: number) => EventLoopDelayMonitor;

type GatewayEventLoopHealthMonitorDeps = {
  now?: () => number;
  cpuUsage?: typeof process.cpuUsage;
  eventLoopUtilization?: EventLoopUtilizationReader;
  createDelayMonitor?: EventLoopDelayMonitorFactory;
};

>>>>>>> upstream/main
function roundMetric(value: number, digits = 3): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function nanosecondsToMilliseconds(value: number): number {
  return roundMetric(value / 1_000_000, 1);
}

<<<<<<< HEAD
export function createGatewayEventLoopHealthMonitor(): GatewayEventLoopHealthMonitor {
  let monitor: EventLoopDelayMonitor | null = null;
  let lastWallAt = Date.now();
  let lastCpuUsage: CpuUsage | null = process.cpuUsage();
  let lastEventLoopUtilization: EventLoopUtilization | null = performance.eventLoopUtilization();

  try {
    monitor = monitorEventLoopDelay({ resolution: EVENT_LOOP_MONITOR_RESOLUTION_MS });
=======
function resolveGatewayEventLoopHealthReasons(params: {
  intervalMs: number;
  delayP99Ms: number;
  delayMaxMs: number;
  utilization: number;
  cpuCoreRatio: number;
}): GatewayEventLoopHealthReason[] {
  const reasons: GatewayEventLoopHealthReason[] = [];
  const hasSustainedLoadWindow = params.intervalMs >= SUSTAINED_LOAD_SAMPLE_MIN_INTERVAL_MS;

  if (
    params.delayP99Ms >= EVENT_LOOP_DELAY_WARN_MS ||
    params.delayMaxMs >= EVENT_LOOP_DELAY_WARN_MS
  ) {
    reasons.push("event_loop_delay");
  }
  if (hasSustainedLoadWindow && params.utilization >= EVENT_LOOP_UTILIZATION_WARN) {
    reasons.push("event_loop_utilization");
  }
  if (hasSustainedLoadWindow && params.cpuCoreRatio >= CPU_CORE_RATIO_WARN) {
    reasons.push("cpu");
  }

  return reasons;
}

export function createGatewayEventLoopHealthMonitor(
  deps: GatewayEventLoopHealthMonitorDeps = {},
): GatewayEventLoopHealthMonitor {
  const nowMs = deps.now ?? Date.now;
  const readCpuUsage = deps.cpuUsage ?? process.cpuUsage.bind(process);
  const readEventLoopUtilization =
    deps.eventLoopUtilization ?? performance.eventLoopUtilization.bind(performance);
  const createDelayMonitor =
    deps.createDelayMonitor ??
    ((resolutionMs: number) => monitorEventLoopDelay({ resolution: resolutionMs }));
  let monitor: EventLoopDelayMonitor | null = null;
  let lastWallAt = nowMs();
  let lastCpuUsage: CpuUsage | null = readCpuUsage();
  let lastEventLoopUtilization: EventLoopUtilization | null = readEventLoopUtilization();

  try {
    monitor = createDelayMonitor(EVENT_LOOP_MONITOR_RESOLUTION_MS);
>>>>>>> upstream/main
    monitor.enable();
    monitor.reset();
  } catch {
    monitor = null;
  }

  return {
    snapshot: () => {
      if (!monitor || !lastCpuUsage || !lastEventLoopUtilization || lastWallAt <= 0) {
        return undefined;
      }

<<<<<<< HEAD
      const now = Date.now();
      const intervalMs = Math.max(1, now - lastWallAt);
      const cpuUsage = process.cpuUsage(lastCpuUsage);
      const currentEventLoopUtilization = performance.eventLoopUtilization();
      const utilization = roundMetric(
        performance.eventLoopUtilization(currentEventLoopUtilization, lastEventLoopUtilization)
          .utilization,
      );
      const delayP99Ms = nanosecondsToMilliseconds(monitor.percentile(99));
      const delayMaxMs = nanosecondsToMilliseconds(monitor.max);
      const cpuTotalMs = roundMetric((cpuUsage.user + cpuUsage.system) / 1_000, 1);
      const cpuCoreRatio = roundMetric(cpuTotalMs / intervalMs);
      const reasons: GatewayEventLoopHealthReason[] = [];

      if (delayP99Ms >= EVENT_LOOP_DELAY_WARN_MS || delayMaxMs >= EVENT_LOOP_DELAY_WARN_MS) {
        reasons.push("event_loop_delay");
      }
      if (utilization >= EVENT_LOOP_UTILIZATION_WARN) {
        reasons.push("event_loop_utilization");
      }
      if (cpuCoreRatio >= CPU_CORE_RATIO_WARN) {
        reasons.push("cpu");
      }

      monitor.reset();
      lastWallAt = now;
      lastCpuUsage = process.cpuUsage();
=======
      const now = nowMs();
      const intervalMs = Math.max(1, now - lastWallAt);
      const delayP99Ms = nanosecondsToMilliseconds(monitor.percentile(99));
      const delayMaxMs = nanosecondsToMilliseconds(monitor.max);
      const hasDelayWarning =
        delayP99Ms >= EVENT_LOOP_DELAY_WARN_MS || delayMaxMs >= EVENT_LOOP_DELAY_WARN_MS;

      if (!hasDelayWarning && intervalMs < SUSTAINED_LOAD_SAMPLE_MIN_INTERVAL_MS) {
        monitor.reset();
        return undefined;
      }

      const cpuUsage = readCpuUsage(lastCpuUsage);
      const currentEventLoopUtilization = readEventLoopUtilization();
      const utilization = roundMetric(
        readEventLoopUtilization(currentEventLoopUtilization, lastEventLoopUtilization).utilization,
      );
      const cpuTotalMs = roundMetric((cpuUsage.user + cpuUsage.system) / 1_000, 1);
      const cpuCoreRatio = roundMetric(cpuTotalMs / intervalMs);
      const reasons = resolveGatewayEventLoopHealthReasons({
        intervalMs,
        delayP99Ms,
        delayMaxMs,
        utilization,
        cpuCoreRatio,
      });

      monitor.reset();
      lastWallAt = now;
      lastCpuUsage = readCpuUsage();
>>>>>>> upstream/main
      lastEventLoopUtilization = currentEventLoopUtilization;

      return {
        degraded: reasons.length > 0,
        reasons,
        intervalMs,
        delayP99Ms,
        delayMaxMs,
        utilization,
        cpuCoreRatio,
      };
    },
    stop: () => {
      monitor?.disable();
      monitor = null;
      lastWallAt = 0;
      lastCpuUsage = null;
      lastEventLoopUtilization = null;
    },
  };
}
