<<<<<<< HEAD
export type DraftPreviewFinalizerDraft<TId> = {
  flush: () => Promise<void>;
  id: () => TId | undefined;
  seal?: () => Promise<void>;
  discardPending?: () => Promise<void>;
  clear: () => Promise<void>;
};

export type DraftPreviewFinalizerResult =
  | "normal-delivered"
  | "normal-skipped"
  | "preview-finalized";

=======
import {
  deliverFinalizableLivePreview,
  type LivePreviewFinalizerDraft,
  type LivePreviewFinalizerResultKind,
} from "./message/live.js";

/**
 * @deprecated Use `LivePreviewFinalizerDraft` from `openclaw/plugin-sdk/channel-message`.
 */
export type DraftPreviewFinalizerDraft<TId> = LivePreviewFinalizerDraft<TId>;

/**
 * @deprecated Use `LivePreviewFinalizerResult` from `openclaw/plugin-sdk/channel-message`.
 */
export type DraftPreviewFinalizerResult = Exclude<
  LivePreviewFinalizerResultKind,
  "preview-retained"
>;

/**
 * @deprecated Use `deliverFinalizableLivePreview` from `openclaw/plugin-sdk/channel-message`.
 */
>>>>>>> upstream/main
export async function deliverFinalizableDraftPreview<TPayload, TId, TEdit>(params: {
  kind: "tool" | "block" | "final";
  payload: TPayload;
  draft?: DraftPreviewFinalizerDraft<TId>;
  buildFinalEdit: (payload: TPayload) => TEdit | undefined;
  editFinal: (id: TId, edit: TEdit) => Promise<void>;
  deliverNormally: (payload: TPayload) => Promise<boolean | void>;
  onPreviewFinalized?: (id: TId) => Promise<void> | void;
  onNormalDelivered?: () => Promise<void> | void;
  logPreviewEditFailure?: (error: unknown) => void;
}): Promise<DraftPreviewFinalizerResult> {
<<<<<<< HEAD
  if (params.kind !== "final" || !params.draft) {
    const delivered = await params.deliverNormally(params.payload);
    if (delivered === false) {
      return "normal-skipped";
    }
    await params.onNormalDelivered?.();
    return "normal-delivered";
  }

  const edit = params.buildFinalEdit(params.payload);
  if (edit !== undefined) {
    await params.draft.flush();
    const previewId = params.draft.id();
    if (previewId !== undefined) {
      await params.draft.seal?.();
      try {
        await params.editFinal(previewId, edit);
        await params.onPreviewFinalized?.(previewId);
        return "preview-finalized";
      } catch (err) {
        params.logPreviewEditFailure?.(err);
      }
    }
  }

  if (params.draft.discardPending) {
    await params.draft.discardPending();
  } else {
    await params.draft.clear();
  }

  let delivered = false;
  try {
    const result = await params.deliverNormally(params.payload);
    delivered = result !== false;
    if (delivered) {
      await params.onNormalDelivered?.();
    }
  } finally {
    if (delivered) {
      await params.draft.clear();
    }
  }

  return delivered ? "normal-delivered" : "normal-skipped";
=======
  const result = await deliverFinalizableLivePreview({
    kind: params.kind,
    payload: params.payload,
    ...(params.draft ? { draft: params.draft } : {}),
    buildFinalEdit: params.buildFinalEdit,
    editFinal: params.editFinal,
    deliverNormally: params.deliverNormally,
    onPreviewFinalized: async (id) => {
      await params.onPreviewFinalized?.(id);
    },
    ...(params.onNormalDelivered ? { onNormalDelivered: params.onNormalDelivered } : {}),
    ...(params.logPreviewEditFailure
      ? { logPreviewEditFailure: params.logPreviewEditFailure }
      : {}),
  });

  return result.kind === "preview-retained" ? "normal-skipped" : result.kind;
>>>>>>> upstream/main
}
