"use client";

import { useState } from "react";
import { usePlatforms } from "@/lib/platforms/store";
import { usePosts } from "@/lib/posts/store";
import { scorePost } from "@/lib/posts/optimization";
import type { ContentTone, Post, RewriteAction } from "@/lib/posts/types";
import { RichTextToolbar } from "@/components/posts/RichTextToolbar";
import { HashtagChips } from "@/components/posts/HashtagChips";
import { OptimizationScoreGauge } from "@/components/posts/OptimizationScoreGauge";
import { SelectField } from "@ascentware/react-ui-library";
import { FormField } from "@/components/ui/FormField";
import { Textarea } from "@/components/ui/Textarea";
import { Button, IconButton } from "@/components/ui/Button";
import { FilterChip } from "@/components/ui/FilterChip";
import { AlertIcon, CloseIcon, RefreshIcon, SparklesIcon, SpinnerIcon } from "@/components/ui/icons";

const TONES: { value: ContentTone; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "formal", label: "Formal" },
];

const REWRITE_ACTIONS: { value: RewriteAction; label: string }[] = [
  { value: "improve", label: "Improve Writing" },
  { value: "shorten", label: "Shorten" },
  { value: "grammar", label: "Grammar Check" },
];

export function StepEditor({
  post,
  activePlatformId,
  onActivePlatformChange,
}: {
  post: Post;
  activePlatformId: string | null;
  onActivePlatformChange: (platformId: string) => void;
}) {
  const { platformById } = usePlatforms();
  const { regenerateImage, generateHashtagsFor, applyRewrite, updateDraftText } = usePosts();
  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [correction, setCorrection] = useState("");
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const draft = post.drafts.find((d) => d.platformId === activePlatformId) ?? post.drafts[0];
  if (!draft) return null;

  async function runBusy(key: string, action: () => Promise<void>) {
    setBusyAction(key);
    try {
      await action();
    } finally {
      setBusyAction(null);
    }
  }

  const optimization = scorePost(draft);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {post.drafts.map((d) => {
          const platform = platformById(d.platformId);
          return (
            <FilterChip key={d.platformId} active={draft.platformId === d.platformId} onClick={() => onActivePlatformChange(d.platformId)}>
              <span className="inline-flex items-center gap-1">
                {platform?.name ?? d.platformId}
                {d.status === "generating" && <SpinnerIcon className="h-3 w-3 animate-spin" />}
                {d.status === "failed" && <AlertIcon className="h-3 w-3" />}
              </span>
            </FilterChip>
          );
        })}
      </div>

      {draft.status === "generating" && (
        <div className="flex h-64 items-center justify-center rounded-lg border border-outline-variant dark:border-white/15 bg-surface-container-high">
          <SpinnerIcon className="h-6 w-6 animate-spin text-on-surface-variant" />
        </div>
      )}

      {draft.status === "failed" && (
        <div className="rounded-lg border border-error/40 bg-error-container/20 p-3">
          <p className="text-[14px] text-error">{draft.error}</p>
          <Button variant="secondary" size="sm" className="mt-2" onClick={() => regenerateImage(post.id, draft.platformId)}>
            <RefreshIcon className="h-3.5 w-3.5" />
            Retry
          </Button>
        </div>
      )}

      {draft.imageBase64 && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-on-surface">Content</h3>
              <OptimizationScoreGauge score={optimization.score} size={56} />
            </div>

            <RichTextToolbar
              id={`editor-caption-${draft.platformId}`}
              label="Caption"
              value={draft.caption}
              onChange={(value) => updateDraftText(post.id, draft.platformId, { caption: value })}
            />

            <FormField label="Hashtags" htmlFor={`editor-hashtags-${draft.platformId}`}>
              <HashtagChips
                hashtags={draft.hashtags}
                onChange={(hashtags) => updateDraftText(post.id, draft.platformId, { hashtags })}
              />
            </FormField>
            <Button
              variant="secondary"
              size="sm"
              disabled={busyAction === "hashtags"}
              onClick={() => runBusy("hashtags", () => generateHashtagsFor(post.id, draft.platformId))}
            >
              {busyAction === "hashtags" ? <SpinnerIcon className="h-3.5 w-3.5 animate-spin" /> : <SparklesIcon className="h-3.5 w-3.5" />}
              Generate Hashtags
            </Button>

            <SelectField
              label="Content tone"
              value={draft.tone}
              onValueChange={(v) => updateDraftText(post.id, draft.platformId, { tone: v as ContentTone })}
              options={TONES}
            />

            <div>
              <p className="mb-1.5 text-[12px] font-medium text-on-surface-variant">AI writing tools</p>
              <div className="flex flex-wrap gap-1.5">
                {REWRITE_ACTIONS.map((action) => (
                  <Button
                    key={action.value}
                    variant="secondary"
                    size="sm"
                    disabled={busyAction === action.value}
                    onClick={() => runBusy(action.value, () => applyRewrite(post.id, draft.platformId, action.value))}
                  >
                    {busyAction === action.value ? <SpinnerIcon className="h-3.5 w-3.5 animate-spin" /> : null}
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[14px] font-semibold text-on-surface">Image preview</p>
            {/* eslint-disable-next-line @next/next/no-img-element -- data: URL preview, no upload backend to optimize against */}
            <img
              src={`data:image/png;base64,${draft.imageBase64}`}
              alt=""
              className="aspect-square w-full rounded-lg border border-outline-variant dark:border-white/15 object-cover"
            />
            <p className="text-[12px] text-on-surface-variant">AI-generated via OpenAI — review before posting.</p>

            {correctionOpen ? (
              <div className="space-y-2">
                <FormField label="What should change?" htmlFor={`editor-correction-${draft.platformId}`}>
                  <Textarea
                    id={`editor-correction-${draft.platformId}`}
                    rows={2}
                    value={correction}
                    onChange={(e) => setCorrection(e.target.value)}
                  />
                </FormField>
                <div className="flex gap-1.5">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      regenerateImage(post.id, draft.platformId, correction);
                      setCorrectionOpen(false);
                      setCorrection("");
                    }}
                  >
                    <SparklesIcon className="h-3.5 w-3.5" />
                    Regenerate Image
                  </Button>
                  <IconButton label="Cancel" onClick={() => setCorrectionOpen(false)}>
                    <CloseIcon className="h-3.5 w-3.5" />
                  </IconButton>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                <Button variant="secondary" size="sm" onClick={() => regenerateImage(post.id, draft.platformId)}>
                  <RefreshIcon className="h-3.5 w-3.5" />
                  Regenerate Image
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setCorrectionOpen(true)}>
                  Change style
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
