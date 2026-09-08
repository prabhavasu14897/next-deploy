"use client";

import { useState } from "react";
import type { ContentTemplate, ContentTemplateDraft } from "@/lib/templates/types";
import { ICON_KEYS, iconFor } from "@/lib/templates/icon-registry";
import { Dialog } from "@/components/ui/Dialog";
import { DialogActions } from "@/components/ui/DialogActions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { TextareaField } from "@/components/ui/TextareaField";
import { FormField } from "@/components/ui/FormField";

const EMPTY_DRAFT: ContentTemplateDraft = {
  label: "",
  description: "",
  iconKey: ICON_KEYS[0],
  promptTemplate: "",
  defaultCta: "",
};

/** Create/edit form for one content template — the Post wizard's "What
 *  are you posting?" catalog, admin-defined rather than hardcoded. Same
 *  structure as PlatformFormDialog: sync from an editing prop, a plain
 *  derived valid boolean, Cancel/Submit actions. */
export function TemplateFormDialog({
  open,
  onClose,
  onSubmit,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (draft: ContentTemplateDraft) => void;
  editing?: ContentTemplate | null;
}) {
  const [draft, setDraft] = useState<ContentTemplateDraft>(EMPTY_DRAFT);
  // Reset the local draft whenever the dialog transitions to open (fresh
  // create, or editing a possibly-different target) — adjusted during
  // render off a remembered previous `open` value rather than in an
  // effect, so it takes effect the same render instead of one render late.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setDraft(editing ? { ...editing } : EMPTY_DRAFT);
  }

  function update<K extends keyof ContentTemplateDraft>(key: K, value: ContentTemplateDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  const valid =
    draft.label.trim().length > 0 &&
    draft.description.trim().length > 0 &&
    draft.promptTemplate.trim().length > 0 &&
    draft.defaultCta.trim().length > 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    onSubmit({
      label: draft.label.trim(),
      description: draft.description.trim(),
      iconKey: draft.iconKey,
      promptTemplate: draft.promptTemplate.trim(),
      defaultCta: draft.defaultCta.trim(),
    });
  }

  return (
    <Dialog open={open} onClose={onClose} titleId="template-form-title" width="34rem">
      <h2 id="template-form-title" className="pr-6 text-[16px] font-bold text-on-surface">
        {editing ? `Edit ${editing.label}` : "Add template"}
      </h2>

      <form onSubmit={submit} className="mt-4">
        <div className="max-h-[65vh] space-y-5 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="Label"
              id="template-label"
              required
              value={draft.label}
              onChange={(e) => update("label", e.target.value)}
              placeholder="e.g. Product Launch"
              autoFocus
            />
            <TextField
              label="Description"
              id="template-description"
              required
              value={draft.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="What this template is for"
            />
          </div>

          <FormField label="Icon" htmlFor="template-icon-grid">
            <div id="template-icon-grid" className="flex flex-wrap gap-1.5">
              {ICON_KEYS.map((key) => {
                const Icon = iconFor(key);
                const active = draft.iconKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={active}
                    aria-label={`Use ${key} icon`}
                    onClick={() => update("iconKey", key)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                      active ? "border-primary bg-primary/10 text-primary" : "border-white/15 text-on-surface-variant hover:bg-white/[0.06]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
          </FormField>

          <TextareaField
            label="Prompt template"
            id="template-prompt"
            required
            rows={5}
            value={draft.promptTemplate}
            onChange={(e) => update("promptTemplate", e.target.value)}
            hint="Use {orgName} to insert the organization's name — this is what prefills the Post wizard's prompt step."
          />

          <TextField
            label="Default call to action"
            id="template-cta"
            required
            value={draft.defaultCta}
            onChange={(e) => update("defaultCta", e.target.value)}
            placeholder="e.g. Learn more today!"
            hint="Used by Post's Apply All Suggestions when a caption has no CTA."
          />
        </div>

        <DialogActions>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={!valid}>
            {editing ? "Save changes" : "Add template"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
