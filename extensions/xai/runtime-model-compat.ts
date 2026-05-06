import { applyXaiModelCompat } from "openclaw/plugin-sdk/provider-tools";

type XaiRuntimeModelCompat = {
  compat?: unknown;
  thinkingLevelMap?: Partial<
    Record<"off" | "minimal" | "low" | "medium" | "high" | "xhigh", string | null>
  >;
};

<<<<<<< HEAD
=======
const XAI_UNSUPPORTED_REASONING_EFFORTS = {
  off: null,
  minimal: null,
  low: null,
  medium: null,
  high: null,
  xhigh: null,
} satisfies NonNullable<XaiRuntimeModelCompat["thinkingLevelMap"]>;

>>>>>>> upstream/main
export function applyXaiRuntimeModelCompat<T extends XaiRuntimeModelCompat>(model: T): T {
  const withCompat = applyXaiModelCompat(model);
  return {
    ...withCompat,
    thinkingLevelMap: {
      ...withCompat.thinkingLevelMap,
<<<<<<< HEAD
      off: null,
=======
      ...XAI_UNSUPPORTED_REASONING_EFFORTS,
>>>>>>> upstream/main
    },
  };
}
