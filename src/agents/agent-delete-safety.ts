import fs from "node:fs";
import path from "node:path";
import type { OpenClawConfig } from "../config/types.openclaw.js";
<<<<<<< HEAD
=======
import { isPathInside } from "../infra/path-guards.js";
>>>>>>> upstream/main
import { normalizeAgentId } from "../routing/session-key.js";
import { lowercasePreservingWhitespace } from "../shared/string-coerce.js";
import { listAgentEntries, resolveAgentWorkspaceDir } from "./agent-scope.js";

function normalizeWorkspacePathForComparison(input: string): string {
  const resolved = path.resolve(input.replaceAll("\0", ""));
  let normalized = resolved;
  try {
    normalized = fs.realpathSync.native(resolved);
  } catch {
    // Keep lexical path for non-existent directories.
  }
  if (process.platform === "win32") {
    return lowercasePreservingWhitespace(normalized);
  }
  return normalized;
}

<<<<<<< HEAD
function isPathWithinRoot(candidatePath: string, rootPath: string): boolean {
  const relative = path.relative(rootPath, candidatePath);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

=======
>>>>>>> upstream/main
function workspacePathsOverlap(left: string, right: string): boolean {
  const normalizedLeft = normalizeWorkspacePathForComparison(left);
  const normalizedRight = normalizeWorkspacePathForComparison(right);
  return (
<<<<<<< HEAD
    isPathWithinRoot(normalizedLeft, normalizedRight) ||
    isPathWithinRoot(normalizedRight, normalizedLeft)
=======
    isPathInside(normalizedRight, normalizedLeft) || isPathInside(normalizedLeft, normalizedRight)
>>>>>>> upstream/main
  );
}

export function findOverlappingWorkspaceAgentIds(
  cfg: OpenClawConfig,
  agentId: string,
  workspaceDir: string,
): string[] {
  const entries = listAgentEntries(cfg);
  const normalizedAgentId = normalizeAgentId(agentId);
  const overlappingAgentIds: string[] = [];
  for (const entry of entries) {
    const otherAgentId = normalizeAgentId(entry.id);
    if (otherAgentId === normalizedAgentId) {
      continue;
    }
    const otherWorkspace = resolveAgentWorkspaceDir(cfg, otherAgentId);
    if (workspacePathsOverlap(workspaceDir, otherWorkspace)) {
      overlappingAgentIds.push(otherAgentId);
    }
  }
  return overlappingAgentIds;
}
