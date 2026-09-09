"use client";

import { useEffect, useRef, useState } from "react";
import type { DraftPage, OrganizationDraft } from "@/lib/organizations/types";
import { INDUSTRIES } from "@/lib/organizations/reference-data";
import { deriveOrgCode, formatFollowers } from "@/lib/organizations/derive";
import { makeId } from "@/lib/organizations/id";
import { usePlatforms } from "@/lib/platforms/store";
import { DEMO_ORGANIZATIONS } from "@/lib/demo-data";
import { Stepper, type Step } from "@/components/ui/Stepper";
import { TextField } from "@/components/ui/TextField";
import { TextareaField } from "@/components/ui/TextareaField";
import { SelectField } from "@ascentware/react-ui-library";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button, IconButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Dialog } from "@/components/ui/Dialog";
import { DialogActions } from "@/components/ui/DialogActions";
import { BackIcon, CheckIcon, PlusIcon, SparklesIcon } from "@/components/ui/icons";
import { PlatformBadge } from "./PlatformBadge";

const STEPS: Step[] = [
  { id: "basics", label: "Basic info" },
  { id: "platforms", label: "Select Platforms" },
  { id: "pages", label: "Add Pages / Accounts" },
  { id: "review", label: "Review & Confirm" },
  { id: "success", label: "Done" },
];

// Redirect back to the Organizations list this long after the success step
// appears — long enough to read the confirmation, short enough not to force
// a wait. The header's back arrow still leaves immediately if the user
// doesn't want to wait for it.
const SUCCESS_REDIRECT_DELAY_MS = 2000;

const EMPTY_DRAFT: OrganizationDraft = {
  name: "",
  code: "",
  logoDataUrl: null,
  description: "",
  website: "",
  industry: "",
  country: "",
  timezone: "",
  status: "active",
  platformIds: [],
  platformPages: {},
};

const EMPTY_PAGE_FORM = { name: "", type: "", followers: "" };

/** Multi-step "Add organization" flow. Renders in-page — inside
 *  Organizations' own <main>, swapped in place of the list/grid — rather
 *  than a modal takeover, so the app shell (sidebar, top header, footer)
 *  stays visible and interactive the whole time. Built entirely from the
 *  shared field/empty-state components so the next admin form (e.g. Add
 *  Platform) can be assembled the same way. */
export function CreateOrganizationWizard({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (draft: OrganizationDraft) => void;
}) {
  const {
    state: { platforms: wizardPlatforms },
    seedDemoPlatforms,
  } = usePlatforms();
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<OrganizationDraft>(EMPTY_DRAFT);
  const [activePlatformTab, setActivePlatformTab] = useState<string | null>(null);
  const [addPageOpen, setAddPageOpen] = useState(false);
  const [pageForm, setPageForm] = useState(EMPTY_PAGE_FORM);

  function update<K extends keyof OrganizationDraft>(key: K, value: OrganizationDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function togglePlatform(platformId: string) {
    setDraft((d) => ({
      ...d,
      platformIds: d.platformIds.includes(platformId)
        ? d.platformIds.filter((id) => id !== platformId)
        : [...d.platformIds, platformId],
    }));
  }

  // Selected platforms drive the tabs; a deselected platform's tab
  // disappears, so fall back to the first remaining one automatically
  // rather than tracking that as separate state.
  const selectedPlatforms = wizardPlatforms.filter((p) => draft.platformIds.includes(p.id));
  const activeTab =
    activePlatformTab && selectedPlatforms.some((p) => p.id === activePlatformTab)
      ? activePlatformTab
      : (selectedPlatforms[0]?.id ?? null);
  const activePlatform = selectedPlatforms.find((p) => p.id === activeTab) ?? null;
  const activePages = activeTab ? (draft.platformPages[activeTab] ?? []) : [];

  const reviewRows = [
    { label: "Organization Name", value: draft.name },
    { label: "Industry", value: draft.industry },
    { label: "Description", value: draft.description },
  ];

  function togglePageSelected(platformId: string, pageId: string) {
    setDraft((d) => ({
      ...d,
      platformPages: {
        ...d.platformPages,
        [platformId]: (d.platformPages[platformId] ?? []).map((p) =>
          p.id === pageId ? { ...p, selected: !p.selected } : p
        ),
      },
    }));
  }

  function openAddPage() {
    setPageForm(EMPTY_PAGE_FORM);
    setAddPageOpen(true);
  }

  function submitPage(e: React.FormEvent) {
    e.preventDefault();
    const name = pageForm.name.trim();
    if (!activeTab || !activePlatform || !name) return;
    const newPage: DraftPage = {
      id: makeId("draftpage"),
      name,
      type: pageForm.type.trim() || activePlatform.accountNoun,
      followers: Math.max(0, Number(pageForm.followers) || 0),
      selected: true,
    };
    setDraft((d) => ({
      ...d,
      platformPages: {
        ...d.platformPages,
        [activeTab]: [...(d.platformPages[activeTab] ?? []), newPage],
      },
    }));
    setAddPageOpen(false);
  }

  // Demo-only: fills the current step with sample data — one button per
  // step, matching each step's own fields.
  function fillBasicsTestData() {
    const sample = DEMO_ORGANIZATIONS[Math.floor(Math.random() * DEMO_ORGANIZATIONS.length)];
    setDraft((d) => ({ ...d, name: sample.name, industry: sample.industry, description: sample.description }));
  }

  function fillPlatformsTestData() {
    if (wizardPlatforms.length === 0) {
      seedDemoPlatforms();
      return; // platforms arrive on the next render; click again to select them
    }
    setDraft((d) => ({ ...d, platformIds: wizardPlatforms.map((p) => p.id) }));
  }

  function fillPagesTestData() {
    if (!activeTab || !activePlatform) return;
    const samplePages: DraftPage[] = [
      { id: makeId("draftpage"), name: `${activePlatform.name} Main`, type: activePlatform.accountNoun, followers: 12_400, selected: true },
      { id: makeId("draftpage"), name: `${activePlatform.name} Support`, type: activePlatform.accountNoun, followers: 3_150, selected: true },
    ];
    setDraft((d) => ({
      ...d,
      platformPages: { ...d.platformPages, [activeTab]: [...(d.platformPages[activeTab] ?? []), ...samplePages] },
    }));
  }

  const basicsValid = draft.name.trim().length > 0;
  // Review & Confirm is the last step with a decision to make; success is a
  // terminal display after it, not a step the footer's Back/Next row applies
  // to (STEPS.length - 1).
  const isReviewStep = stepIndex === STEPS.length - 2;
  const isSuccessStep = stepIndex === STEPS.length - 1;

  function next() {
    if (!basicsValid) return;
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function back() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (isReviewStep) {
      if (!basicsValid) return;
      onCreate({ ...draft, code: deriveOrgCode(draft.name) });
      setStepIndex(STEPS.length - 1);
      return;
    }
    next();
  }

  // Auto-redirect once the success step is showing. onClose lives in a ref
  // so a caller passing an inline function (the normal case) doesn't reset
  // the timer on every unrelated re-render — same reasoning as Dialog's own
  // effect fix.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    if (!isSuccessStep) return;
    const timer = setTimeout(() => onCloseRef.current(), SUCCESS_REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isSuccessStep]);

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <IconButton label="Back to organizations" onClick={onClose}>
          <BackIcon className="h-4 w-4" />
        </IconButton>
        <h1 className="text-[24px] font-semibold text-on-surface">Add organization</h1>
      </div>

      <div className="mb-8 max-w-4xl">
        <Stepper steps={STEPS} currentIndex={stepIndex} />
      </div>

      <form onSubmit={submit} className="max-w-4xl">
        {stepIndex === 0 && (
          <div>
            <div className="mb-4 flex justify-end">
              <Button type="button" variant="secondary" size="sm" onClick={fillBasicsTestData}>
                <SparklesIcon className="h-4 w-4" />
                Fill test data
              </Button>
            </div>
            <div className="grid grid-cols-1 items-start gap-x-4 gap-y-5 sm:grid-cols-2">
            <TextField
              label="Organization name"
              id="org-name"
              required
              value={draft.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Acme Retail"
              autoFocus
            />
            <SelectField
              label="Industry"
              placeholder="Select an industry"
              value={draft.industry}
              onValueChange={(v) => update("industry", v)}
              options={INDUSTRIES.map((i) => ({ value: i, label: i }))}
            />
            <TextareaField
              label="Description"
              id="org-description"
              value={draft.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              placeholder="What this organization is, for your own reference."
              containerClassName="sm:col-span-2"
            />
            </div>
          </div>
        )}

        {stepIndex === 1 && (
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-[16px] font-bold text-on-surface">Select Platforms</h2>
                <p className="mt-1 text-[14px] text-on-surface-variant">
                  Select the social media platforms that the organization will use.
                </p>
              </div>
              <Button type="button" variant="secondary" size="sm" onClick={fillPlatformsTestData}>
                <SparklesIcon className="h-4 w-4" />
                Fill test data
              </Button>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {wizardPlatforms.map((platform) => {
                const selected = draft.platformIds.includes(platform.id);
                return (
                  <label
                    key={platform.id}
                    className={`flex cursor-pointer flex-col gap-3 rounded-lg border p-4 transition-colors ${
                      selected
                        ? "border-primary/40 bg-primary/10 hover:bg-primary/15"
                        : "border-outline-variant dark:border-white/15 bg-surface-container-highest dark:bg-white/[0.04] hover:bg-surface-variant dark:hover:bg-white/[0.08]"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <PlatformBadge platform={platform} status="not_connected" size="md" />
                      <Checkbox checked={selected} onChange={() => togglePlatform(platform.id)} label={platform.name} />
                    </div>
                    <span className="text-[14px] font-semibold text-on-surface">{platform.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {stepIndex === 2 && (
          <div>
            <h2 className="text-[16px] font-bold text-on-surface">Add Pages / Accounts</h2>
            <p className="mt-1 text-[14px] text-on-surface-variant">
              Add or connect pages / accounts for the selected platforms.
            </p>

            {selectedPlatforms.length === 0 || !activePlatform ? (
              <EmptyState
                title="No platforms selected"
                description="Go back to Select Platforms and choose at least one to add its pages or accounts here."
                action={
                  <Button type="button" variant="secondary" size="sm" onClick={back}>
                    Back to Select Platforms
                  </Button>
                }
              />
            ) : (
              <div className="mt-5">
                <div className="flex flex-wrap gap-1 border-b border-outline-variant dark:border-white/10">
                  {selectedPlatforms.map((platform) => {
                    const tabActive = platform.id === activeTab;
                    return (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => setActivePlatformTab(platform.id)}
                        className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-[14px] font-semibold transition-colors ${
                          tabActive
                            ? "border-primary text-primary"
                            : "border-transparent text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        <PlatformBadge platform={platform} status="not_connected" size="sm" />
                        {platform.name}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[14px] font-bold text-on-surface">
                      {activePlatform.name} {activePlatform.accountNounPlural}
                    </h3>
                    <p className="mt-0.5 text-[12px] text-on-surface-variant">
                      Select {activePlatform.name} {activePlatform.accountNounPlural.toLowerCase()} that belong to
                      this organization.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="secondary" size="sm" onClick={fillPagesTestData}>
                      <SparklesIcon className="h-4 w-4" />
                      Fill test data
                    </Button>
                    <Button type="button" variant="secondary" size="sm" onClick={openAddPage}>
                      <PlusIcon className="h-4 w-4" />
                      Add {activePlatform.name} {activePlatform.accountNoun}
                    </Button>
                  </div>
                </div>

                <div className="mt-3 overflow-hidden rounded-lg border border-outline-variant dark:border-white/15">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[480px] border-collapse text-left">
                      <thead>
                        <tr className="border-b border-outline-variant dark:border-white/10 bg-surface-container-low dark:bg-white/[0.03]">
                          <th className="px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant">
                            Name
                          </th>
                          <th className="px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant">
                            Type
                          </th>
                          <th className="px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant">
                            Followers
                          </th>
                          <th className="px-4 py-2.5 text-right text-[12px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant">
                            Select
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {activePages.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-10 text-center text-[14px] text-on-surface-variant">
                              No {activePlatform.accountNounPlural.toLowerCase()} added yet.
                            </td>
                          </tr>
                        ) : (
                          activePages.map((page) => (
                            <tr key={page.id} className="border-b border-outline-variant dark:border-white/[0.06] last:border-b-0">
                              <td className="px-4 py-2.5 text-[14px] font-semibold text-on-surface">{page.name}</td>
                              <td className="px-4 py-2.5 text-[12px] text-on-surface-variant">{page.type}</td>
                              <td className="px-4 py-2.5 text-[12px] text-on-surface-variant tabular">
                                {formatFollowers(page.followers)}
                              </td>
                              <td className="px-4 py-2.5">
                                <div className="flex justify-end">
                                  <Checkbox
                                    checked={page.selected}
                                    onChange={() => togglePageSelected(activeTab!, page.id)}
                                    label={`Select ${page.name}`}
                                  />
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {stepIndex === 3 && (
          <div>
            <h2 className="text-[16px] font-bold text-on-surface">Review &amp; Confirm</h2>
            <p className="mt-1 text-[14px] text-on-surface-variant">
              Review the organization information and selected platforms with pages/accounts.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-outline-variant dark:border-white/15 bg-surface-container-highest dark:bg-white/[0.04] p-5">
                <h3 className="text-[14px] font-bold text-on-surface">Organization Details</h3>
                <dl className="mt-4 space-y-3">
                  {reviewRows.map((row) => (
                    <div key={row.label}>
                      <dt className="text-[12px] text-on-surface-variant">{row.label}</dt>
                      <dd className="mt-0.5 text-[14px] font-medium text-on-surface">{row.value || "—"}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rounded-lg border border-outline-variant dark:border-white/15 bg-surface-container-highest dark:bg-white/[0.04] p-5">
                <h3 className="text-[14px] font-bold text-on-surface">Selected Platforms &amp; Pages/Accounts</h3>
                {selectedPlatforms.length === 0 ? (
                  <p className="mt-3 text-[12px] text-on-surface-variant">No platforms selected.</p>
                ) : (
                  <div className="mt-3 divide-y divide-white/10">
                    {selectedPlatforms.map((platform) => {
                      const pages = draft.platformPages[platform.id] ?? [];
                      const noun = pages.length === 1 ? platform.accountNoun : platform.accountNounPlural;
                      return (
                        <div key={platform.id} className="py-3 first:pt-0 last:pb-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <PlatformBadge platform={platform} status="not_connected" size="sm" />
                              <span className="text-[14px] font-semibold text-on-surface">{platform.name}</span>
                            </div>
                            <span className="shrink-0 rounded-full bg-surface-container-highest px-2.5 py-0.5 text-[12px] font-semibold text-on-surface-variant tabular">
                              {pages.length} {noun}
                            </span>
                          </div>
                          {pages.length > 0 ? (
                            <ul className="mt-2 list-disc space-y-1 pl-8 marker:text-on-surface-variant">
                              {pages.map((page) => (
                                <li key={page.id} className="text-[12px] text-on-surface-variant">
                                  {page.name}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-2 pl-8 text-[12px] text-on-surface-variant">No pages added yet.</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {isSuccessStep && (
          <div className="flex flex-col items-center py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-status-success">
              <CheckIcon className="h-7 w-7 text-surface" />
            </span>
            <h2 className="mt-4 text-[18px] font-bold text-on-surface">Organization Created Successfully!</h2>
            <p className="mt-1 text-[14px] text-on-surface-variant">
              The organization has been created and is ready to use.
            </p>
          </div>
        )}

        {!isSuccessStep && (
          <div className="mt-8 flex items-center justify-between border-t border-outline-variant dark:border-white/10 pt-5">
            <Button type="button" variant="ghost" size="sm" onClick={stepIndex === 0 ? onClose : back}>
              {stepIndex === 0 ? "Cancel" : "Back"}
            </Button>
            {isReviewStep ? (
              <Button type="submit" variant="primary" size="sm" disabled={!basicsValid}>
                Create organization
              </Button>
            ) : (
              <Button type="submit" variant="primary" size="sm" disabled={!basicsValid}>
                Next
              </Button>
            )}
          </div>
        )}
      </form>

      {activePlatform && (
        <Dialog open={addPageOpen} onClose={() => setAddPageOpen(false)} titleId="add-page-title" width="22rem">
          <h2 id="add-page-title" className="pr-6 text-[16px] font-bold text-on-surface">
            Add {activePlatform.name} {activePlatform.accountNoun}
          </h2>
          <form onSubmit={submitPage} className="mt-4 space-y-4">
            <TextField
              label="Name"
              id="page-name"
              required
              value={pageForm.name}
              onChange={(e) => setPageForm((f) => ({ ...f, name: e.target.value }))}
              placeholder={`e.g. Acme ${activePlatform.accountNoun}`}
              autoFocus
            />
            <TextField
              label="Type"
              id="page-type"
              hint={`Defaults to "${activePlatform.accountNoun}" if left blank.`}
              value={pageForm.type}
              onChange={(e) => setPageForm((f) => ({ ...f, type: e.target.value }))}
              placeholder={activePlatform.accountNoun}
            />
            <TextField
              label="Followers"
              id="page-followers"
              type="number"
              min="0"
              value={pageForm.followers}
              onChange={(e) => setPageForm((f) => ({ ...f, followers: e.target.value }))}
              placeholder="0"
            />
            <DialogActions>
              <Button type="button" variant="ghost" size="sm" onClick={() => setAddPageOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={!pageForm.name.trim()}>
                Add {activePlatform.accountNoun}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
    </div>
  );
}
