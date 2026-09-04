"use client";

import { useEffect, useState } from "react";
import type { Platform, PlatformDraft, PlatformIntegrationConfig } from "@/lib/organizations/types";
import { makeId } from "@/lib/organizations/id";
import { Dialog } from "@/components/ui/Dialog";
import { DialogActions } from "@/components/ui/DialogActions";
import { Button, IconButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { PlusIcon, TrashIcon } from "@/components/ui/icons";

interface FieldRow {
  id: string;
  label: string;
  secret: boolean;
  value: string;
}

const EMPTY_CATALOG = { name: "", summary: "", accountNoun: "", accountNounPlural: "" };

function slugify(label: string): string {
  const slug = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || makeId("field");
}

/** Create/edit form for one platform — the catalog fields plus a dynamic
 *  credential-field builder. Nothing here is pre-populated from a known
 *  list: the admin names the platform and defines exactly what it needs to
 *  connect, field by field. */
export function PlatformFormDialog({
  open,
  onClose,
  onSubmit,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (draft: PlatformDraft) => void;
  /** Present when editing an existing platform — pre-fills every field. */
  editing?: { platform: Platform; integration: PlatformIntegrationConfig } | null;
}) {
  const [catalog, setCatalog] = useState(EMPTY_CATALOG);
  const [fields, setFields] = useState<FieldRow[]>([]);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setCatalog({
        name: editing.platform.name,
        summary: editing.platform.summary,
        accountNoun: editing.platform.accountNoun,
        accountNounPlural: editing.platform.accountNounPlural,
      });
      setFields(
        editing.integration.credentialFields.map((f) => ({
          id: makeId("field"),
          label: f.label,
          secret: f.secret,
          value: editing.integration.credentials[f.key] ?? "",
        }))
      );
    } else {
      setCatalog(EMPTY_CATALOG);
      setFields([]);
    }
  }, [open, editing]);

  function updateCatalog<K extends keyof typeof EMPTY_CATALOG>(key: K, value: string) {
    setCatalog((c) => ({ ...c, [key]: value }));
  }

  function addField() {
    setFields((f) => [...f, { id: makeId("field"), label: "", secret: false, value: "" }]);
  }

  function updateField(id: string, updates: Partial<FieldRow>) {
    setFields((f) => f.map((row) => (row.id === id ? { ...row, ...updates } : row)));
  }

  function removeField(id: string) {
    setFields((f) => f.filter((row) => row.id !== id));
  }

  const valid =
    catalog.name.trim().length > 0 &&
    catalog.summary.trim().length > 0 &&
    catalog.accountNoun.trim().length > 0 &&
    catalog.accountNounPlural.trim().length > 0 &&
    fields.every((f) => f.label.trim().length > 0);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    const credentialFields = fields.map((f) => ({
      key: slugify(f.label),
      label: f.label.trim(),
      secret: f.secret,
    }));
    const credentials = Object.fromEntries(fields.map((f) => [slugify(f.label), f.value]));
    onSubmit({
      name: catalog.name.trim(),
      summary: catalog.summary.trim(),
      accountNoun: catalog.accountNoun.trim(),
      accountNounPlural: catalog.accountNounPlural.trim(),
      credentialFields,
      credentials,
    });
  }

  return (
    <Dialog open={open} onClose={onClose} titleId="platform-form-title" width="34rem">
      <h2 id="platform-form-title" className="pr-6 text-[16px] font-bold text-on-surface">
        {editing ? `Edit ${editing.platform.name}` : "Add platform"}
      </h2>

      <form onSubmit={submit} className="mt-4">
        <div className="max-h-[65vh] space-y-5 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="Name"
              id="platform-name"
              required
              value={catalog.name}
              onChange={(e) => updateCatalog("name", e.target.value)}
              placeholder="e.g. TikTok"
              autoFocus
            />
            <TextField
              label="Summary"
              id="platform-summary"
              required
              value={catalog.summary}
              onChange={(e) => updateCatalog("summary", e.target.value)}
              placeholder="What this platform manages"
            />
            <TextField
              label="Account term (singular)"
              id="platform-noun"
              required
              value={catalog.accountNoun}
              onChange={(e) => updateCatalog("accountNoun", e.target.value)}
              placeholder="e.g. Page"
            />
            <TextField
              label="Account term (plural)"
              id="platform-noun-plural"
              required
              value={catalog.accountNounPlural}
              onChange={(e) => updateCatalog("accountNounPlural", e.target.value)}
              placeholder="e.g. Pages"
            />
          </div>

          <div className="border-t border-white/10 pt-4">
            <p className="text-[12px] font-medium text-on-surface-variant">Credential fields</p>
            <p className="mt-0.5 text-[12px] text-on-surface-variant">
              What this platform needs to connect — defined here, not assumed by this app.
            </p>

            <div className="mt-3 space-y-2">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-end gap-2 rounded border border-white/15 bg-white/[0.04] p-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <label
                      className="mb-1 block text-[12px] font-medium text-on-surface-variant"
                      htmlFor={`field-label-${field.id}`}
                    >
                      Field name
                    </label>
                    <Input
                      id={`field-label-${field.id}`}
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      placeholder="e.g. Client ID"
                      className="w-full"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <label
                      className="mb-1 block text-[12px] font-medium text-on-surface-variant"
                      htmlFor={`field-value-${field.id}`}
                    >
                      Value
                    </label>
                    <Input
                      id={`field-value-${field.id}`}
                      type={field.secret ? "password" : "text"}
                      value={field.value}
                      onChange={(e) => updateField(field.id, { value: e.target.value })}
                      className="w-full"
                    />
                  </div>
                  <label className="flex shrink-0 items-center gap-1.5 pb-2 text-[12px] text-on-surface-variant">
                    <Checkbox
                      checked={field.secret}
                      onChange={() => updateField(field.id, { secret: !field.secret })}
                      label={`Mark ${field.label || "this field"} as secret`}
                    />
                    Secret
                  </label>
                  <div className="pb-0.5">
                    <IconButton
                      type="button"
                      label={`Remove ${field.label || "field"}`}
                      onClick={() => removeField(field.id)}
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </IconButton>
                  </div>
                </div>
              ))}

              <Button type="button" variant="secondary" size="sm" onClick={addField}>
                <PlusIcon className="h-4 w-4" />
                Add field
              </Button>
            </div>

            <p className="mt-2.5 text-[12px] text-status-pending-accent">
              Stored locally in your browser for this demo — not production secret storage.
            </p>
          </div>
        </div>

        <DialogActions>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={!valid}>
            {editing ? "Save changes" : "Add platform"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
