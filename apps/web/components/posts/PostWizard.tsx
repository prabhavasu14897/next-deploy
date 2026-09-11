"use client";

import { useState } from "react";
import type { Organization } from "@/lib/organizations/types";
import { usePosts } from "@/lib/posts/store";
import { useTemplates } from "@/lib/templates/store";
import { usePlatforms } from "@/lib/platforms/store";
import { StepTypeAndPlatform, type PlatformTarget } from "./steps/StepTypeAndPlatform";
import { StepPrompt } from "./steps/StepPrompt";
import { StepEditor } from "./steps/StepEditor";
import { StepPreview } from "./steps/StepPreview";
import { StepPublish } from "./steps/StepPublish";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { BackIcon, ChevronRightIcon, SparklesIcon } from "@/components/ui/icons";

const STEPS = [
  { id: "type", label: "Type & Platform" },
  { id: "prompt", label: "Prompt" },
  { id: "editor", label: "Editor" },
  { id: "preview", label: "Preview" },
  { id: "publish", label: "Publish" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

export function PostWizard({
  organizations,
  organizationId,
  onOrganizationChange,
}: {
  organizations: Organization[];
  organizationId: string;
  onOrganizationChange: (id: string) => void;
}) {
  const { state, createDraft, createTestDraft } = usePosts();
  const { state: templatesState, templateById } = useTemplates();
  const { state: platformsState } = usePlatforms();
  const [step, setStep] = useState<StepId>("type");
  const [contentType, setContentType] = useState<string | null>(null);
  const [targets, setTargets] = useState<PlatformTarget[]>([]);
  const [prompt, setPrompt] = useState("");
  const [imageStyles, setImageStyles] = useState<string[]>([]);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [activePlatformId, setActivePlatformId] = useState<string | null>(null);

  const activePost = activePostId ? state.posts.find((p) => p.id === activePostId) ?? null : null;
  const organizationName = organizations.find((o) => o.id === organizationId)?.name ?? "";
  // Generation (image + caption + hashtags) is async and takes a few
  // seconds — without this, "Continue"/the step pills were only gated on a
  // post existing, so clicking through fast landed on Preview/Publish with
  // nothing actually ready yet, a confusing dead end.
  const hasReadyDraft = activePost?.drafts.some((d) => d.status === "ready") ?? false;

  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const editorIndex = STEPS.findIndex((s) => s.id === "editor");

  function resetForNewPost() {
    setStep("type");
    setContentType(null);
    setTargets([]);
    setPrompt("");
    setImageStyles([]);
    setActivePostId(null);
    setActivePlatformId(null);
  }

  function handleContentTypeChange(id: string) {
    setContentType(id);
    setPrompt(templateById(id)?.promptTemplate.replaceAll("{orgName}", organizationName) ?? "");
  }

  function handleGenerate() {
    if (!contentType || targets.length === 0 || !prompt.trim()) return;
    const postId = createDraft(organizationId, contentType, prompt, imageStyles, targets);
    if (postId) {
      setActivePostId(postId);
      setActivePlatformId(targets[0]?.platformId ?? null);
      setStep("editor");
    }
  }

  function goBack() {
    if (stepIndex > 0) setStep(STEPS[stepIndex - 1].id);
  }

  function goNext() {
    if (stepIndex < STEPS.length - 1) setStep(STEPS[stepIndex + 1].id);
  }

  const canLeaveType = !!organizationId && !!contentType && targets.length > 0;

  // Demo-only: fills type/platform/prompt with sample data and jumps
  // straight to a populated Editor step, bypassing "Generate with AI"
  // (which needs the backend) entirely via createTestDraft.
  function fillTestDataAndGenerate() {
    if (!organizationId) return;
    const template = (contentType && templateById(contentType)) || templatesState.templates[0];
    const firstPlatform = platformsState.platforms[0];
    const targetList = targets.length > 0 ? targets : firstPlatform ? [{ platformId: firstPlatform.id, accountId: null }] : [];
    if (!template || targetList.length === 0) return;

    const promptText =
      prompt.trim() || template.promptTemplate.replaceAll("{orgName}", organizationName) || "Sample post content.";

    setContentType(template.id);
    setTargets(targetList);
    setPrompt(promptText);

    const postId = createTestDraft(organizationId, template.id, promptText, targetList);
    if (postId) {
      setActivePostId(postId);
      setActivePlatformId(targetList[0].platformId);
      setStep("editor");
    }
  }

  const canFillTestData =
    !activePost && templatesState.templates.length > 0 && (targets.length > 0 || platformsState.platforms.length > 0);

  return (
    <div className="space-y-6">
      <ol className="flex flex-wrap items-center gap-1.5">
        {STEPS.map((s, i) => {
          // Jumping ahead to the Editor just needs a post to exist (that's
          // where generation-in-progress is watched); jumping past it to
          // Preview/Publish needs generation to have actually finished.
          const meetsStepGate = i <= editorIndex ? !!activePost : hasReadyDraft;
          return (
          <li key={s.id} className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={i > stepIndex && !meetsStepGate}
              onClick={() => (i <= stepIndex || meetsStepGate) && setStep(s.id)}
              aria-current={s.id === step ? "step" : undefined}
              className={`h-7 rounded-full px-3 text-[12px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                s.id === step
                  ? "bg-primary text-on-primary"
                  : i < stepIndex
                    ? "bg-surface-variant dark:bg-white/[0.08] text-on-surface"
                    : "bg-transparent text-on-surface-variant ring-1 ring-inset ring-outline-variant"
              }`}
            >
              {i + 1}. {s.label}
            </button>
            {i < STEPS.length - 1 && <ChevronRightIcon className="h-3.5 w-3.5 text-on-surface-variant" />}
          </li>
          );
        })}
      </ol>

      <div className="rounded-lg border border-outline-variant dark:border-white/15 bg-surface-container-low dark:bg-white/[0.02] p-5">
        {step === "type" && (
          <StepTypeAndPlatform
            organizations={organizations}
            organizationId={organizationId}
            onOrganizationChange={onOrganizationChange}
            contentType={contentType}
            onContentTypeChange={handleContentTypeChange}
            targets={targets}
            onTargetsChange={setTargets}
          />
        )}

        {step === "prompt" && (
          <StepPrompt prompt={prompt} onPromptChange={setPrompt} imageStyles={imageStyles} onImageStylesChange={setImageStyles} />
        )}

        {step === "editor" &&
          (activePost ? (
            <StepEditor post={activePost} activePlatformId={activePlatformId} onActivePlatformChange={setActivePlatformId} />
          ) : (
            <EmptyState title="Nothing generated yet" description="Go back and generate content first." />
          ))}

        {step === "preview" &&
          (activePost ? (
            <StepPreview post={activePost} organizationName={organizationName} />
          ) : (
            <EmptyState title="Nothing to preview yet" description="Go back and generate content first." />
          ))}

        {step === "publish" &&
          (activePost ? (
            <StepPublish post={activePost} />
          ) : (
            <EmptyState title="Nothing to publish yet" description="Go back and generate content first." />
          ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="md" disabled={stepIndex === 0} onClick={goBack}>
            <BackIcon className="h-4 w-4" />
            Back
          </Button>
          {(step === "type" || step === "prompt") && (
            <Button variant="secondary" size="md" disabled={!canFillTestData} onClick={fillTestDataAndGenerate}>
              <SparklesIcon className="h-4 w-4" />
              Fill test data
            </Button>
          )}
        </div>

        {step === "prompt" ? (
          <Button variant="primary" size="md" disabled={!prompt.trim()} onClick={handleGenerate}>
            <SparklesIcon className="h-4 w-4" />
            Generate with AI
          </Button>
        ) : step === "publish" ? (
          activePost && (
            <Button variant="ghost" size="md" onClick={resetForNewPost}>
              Start a new post
            </Button>
          )
        ) : (
          <Button
            variant="primary"
            size="md"
            disabled={step === "type" ? !canLeaveType : step === "editor" || step === "preview" ? !hasReadyDraft : !activePost}
            onClick={goNext}
          >
            Continue
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
