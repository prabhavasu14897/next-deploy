"use client";

import { useState } from "react";
import { usePlatforms } from "@/lib/platforms/store";
import { usePosts } from "@/lib/posts/store";
import { useTemplates } from "@/lib/templates/store";
import { scorePost } from "@/lib/posts/optimization";
import type { Post } from "@/lib/posts/types";
import { OptimizationScoreGauge } from "@/components/posts/OptimizationScoreGauge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CheckIcon, SparklesIcon, SpinnerIcon } from "@/components/ui/icons";

type PublishMode = "now" | "schedule";

function defaultScheduleValue(): string {
  const in1h = new Date(Date.now() + 60 * 60 * 1000);
  in1h.setSeconds(0, 0);
  in1h.setMinutes(in1h.getMinutes() - in1h.getTimezoneOffset());
  return in1h.toISOString().slice(0, 16);
}

export function StepPublish({ post }: { post: Post }) {
  const { platformById } = usePlatforms();
  const { applyAllSuggestions, saveAsDraft, scheduleDraft, submitPost } = usePosts();
  const { templateById } = useTemplates();
  const [modes, setModes] = useState<Record<string, PublishMode>>({});
  const [scheduleTimes, setScheduleTimes] = useState<Record<string, string>>({});
  const [applyingFor, setApplyingFor] = useState<string | null>(null);

  const readyDrafts = post.drafts.filter((d) => d.status === "ready" && d.imageBase64);

  if (readyDrafts.length === 0) {
    return (
      <p className="text-[14px] text-on-surface-variant">
        No platform is ready to publish yet — go back and finish generating content first.
      </p>
    );
  }

  function handlePublish() {
    for (const draft of readyDrafts) {
      if (modes[draft.platformId] === "schedule") {
        const local = scheduleTimes[draft.platformId] ?? defaultScheduleValue();
        scheduleDraft(post.id, draft.platformId, new Date(local).toISOString());
      }
    }
    submitPost(post.id);
  }

  const primaryDraft = readyDrafts[0];
  const overall = scorePost(primaryDraft);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 rounded-lg border border-outline-variant dark:border-white/15 bg-surface-container-low dark:bg-white/[0.02] p-5 sm:flex-row sm:items-start">
        <OptimizationScoreGauge score={overall.score} size={110} />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-on-surface">AI optimization score</h2>
            <Button
              variant="secondary"
              size="sm"
              disabled={applyingFor !== null}
              onClick={async () => {
                setApplyingFor(primaryDraft.platformId);
                try {
                  const defaultCta = templateById(post.contentType)?.defaultCta ?? "Learn more today!";
                  await applyAllSuggestions(post.id, primaryDraft.platformId, defaultCta);
                } finally {
                  setApplyingFor(null);
                }
              }}
            >
              {applyingFor === primaryDraft.platformId ? (
                <SpinnerIcon className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <SparklesIcon className="h-3.5 w-3.5" />
              )}
              Apply All Suggestions
            </Button>
          </div>
          <ul className="space-y-1.5">
            {overall.suggestions.map((s) => (
              <li key={s.id} className="flex items-center gap-2 text-[14px]">
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                    s.met ? "bg-status-success text-surface" : "border border-outline-variant text-transparent"
                  }`}
                >
                  <CheckIcon className="h-3 w-3" />
                </span>
                <span className={s.met ? "text-on-surface-variant line-through" : "text-on-surface"}>{s.label}</span>
                <span className="ml-auto tabular text-on-surface-variant">
                  {s.met ? "" : `+${s.delta}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-[18px] font-semibold text-on-surface">Publish to</h2>
        <div className="overflow-hidden rounded-lg border border-outline-variant dark:border-white/15">
          {readyDrafts.map((draft) => {
            const platform = platformById(draft.platformId);
            const mode = modes[draft.platformId] ?? "now";
            return (
              <div key={draft.platformId} className="flex flex-col gap-2 border-b border-outline-variant dark:border-white/[0.06] p-3 last:border-b-0 sm:flex-row sm:items-center">
                <span className="text-[14px] font-medium text-on-surface sm:w-32">{platform?.name ?? draft.platformId}</span>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-1.5 text-[14px] text-on-surface">
                    <input
                      type="radio"
                      name={`mode-${draft.platformId}`}
                      checked={mode === "now"}
                      onChange={() => setModes((prev) => ({ ...prev, [draft.platformId]: "now" }))}
                    />
                    Publish now
                  </label>
                  <label className="flex items-center gap-1.5 text-[14px] text-on-surface">
                    <input
                      type="radio"
                      name={`mode-${draft.platformId}`}
                      checked={mode === "schedule"}
                      onChange={() => setModes((prev) => ({ ...prev, [draft.platformId]: "schedule" }))}
                    />
                    Schedule
                  </label>
                  {mode === "schedule" && (
                    <Input
                      type="datetime-local"
                      value={scheduleTimes[draft.platformId] ?? defaultScheduleValue()}
                      onChange={(e) => setScheduleTimes((prev) => ({ ...prev, [draft.platformId]: e.target.value }))}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[12px] text-on-surface-variant">
          A schedule fires from this browser tab — it needs the tab to stay open, since there is no server-side
          scheduler in this workspace yet.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="md" onClick={() => saveAsDraft(post.id)}>
          Save as Draft
        </Button>
        <Button variant="primary" size="md" onClick={handlePublish}>
          Publish
        </Button>
      </div>
    </div>
  );
}
