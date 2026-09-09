"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Organization } from "@/lib/organizations/types";
import { useOrganizations } from "@/lib/organizations/store";
import { usePlatforms } from "@/lib/platforms/store";
import { formatDate } from "@/lib/organizations/derive";
import { INDUSTRIES, TIMEZONES } from "@/lib/organizations/reference-data";

// Radix SelectItem can't take an empty-string value, so "no industry chosen"
// (a real, explicitly re-selectable option here, unlike the other fields'
// disabled placeholders) is represented by this sentinel and mapped back to
// "" at the value/onValueChange boundary.
const NO_INDUSTRY_VALUE = "__no_industry__";
import { IconButton, Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { TextField } from "@/components/ui/TextField";
import { TextareaField } from "@/components/ui/TextareaField";
import { SelectField } from "@ascentware/react-ui-library";
import { CloseIcon, PencilIcon, TrashIcon } from "@/components/ui/icons";
import { PlatformRow } from "./PlatformRow";
import { EditPlatformPagesSection } from "./EditPlatformPagesSection";

export function OrgDetailSheet({
  organization,
  onClose,
  startInEditMode = false,
}: {
  organization: Organization | null;
  onClose: () => void;
  /** Open straight into the full edit form — the table's Edit action skips
   *  the extra click to reach the pencil icon inside the sheet. */
  startInEditMode?: boolean;
}) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      aria-hidden={!organization}
      className={`fixed inset-0 z-40 flex justify-end transition-opacity duration-200 ${
        organization ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-surface-container-lowest/70" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="org-detail-title"
        className={`relative flex h-full w-full max-w-lg flex-col border-l border-outline-variant dark:border-white/15 bg-surface-container-high shadow-[-16px_0_40px_-12px_rgba(0,0,0,0.5)] transition-transform duration-200 ${
          organization ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Keyed by org id so switching organizations remounts fresh
            edit/delete-confirm state instead of resetting it in an effect. */}
        {organization && (
          <OrgDetailContent
            key={organization.id}
            organization={organization}
            onClose={onClose}
            startInEditMode={startInEditMode}
          />
        )}
      </div>
    </div>,
    document.body
  );
}

/** The subset of Organization the edit form actually collects — everything
 *  but id/createdAt, the same shape the create wizard's step 1 works with. */
type EditableFields = Omit<Organization, "id" | "createdAt">;

function toEditable(org: Organization): EditableFields {
  return {
    name: org.name,
    code: org.code,
    logoDataUrl: org.logoDataUrl,
    description: org.description,
    website: org.website,
    industry: org.industry,
    country: org.country,
    timezone: org.timezone,
    status: org.status,
  };
}

function OrgDetailContent({
  organization,
  onClose,
  startInEditMode,
}: {
  organization: Organization;
  onClose: () => void;
  startInEditMode: boolean;
}) {
  const { state, updateOrganization, deleteOrganization } = useOrganizations();
  const {
    state: { platforms },
  } = usePlatforms();
  const [editing, setEditing] = useState(startInEditMode);
  const [draft, setDraft] = useState<EditableFields>(() => toEditable(organization));
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !editing && !confirmDelete) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [editing, confirmDelete, onClose]);

  function startEdit() {
    setDraft(toEditable(organization));
    setEditing(true);
  }

  function update<K extends keyof EditableFields>(key: K, value: EditableFields[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  const editValid = draft.name.trim().length > 0;

  function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editValid) return;
    updateOrganization(organization.id, {
      ...draft,
      name: draft.name.trim(),
      description: draft.description.trim(),
    });
    setEditing(false);
  }

  if (editing) {
    return (
      <>
        <div className="flex items-center justify-between border-b border-outline-variant dark:border-white/10 px-6 py-5">
          <h2 id="org-detail-title" className="text-[18px] font-semibold text-on-surface">
            Edit organization
          </h2>
          <IconButton label="Close" onClick={onClose}>
            <CloseIcon className="h-4 w-4" />
          </IconButton>
        </div>

        <form onSubmit={saveEdit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2">
              <TextField
                label="Organization name"
                id="edit-org-name"
                required
                value={draft.name}
                onChange={(e) => update("name", e.target.value)}
                autoFocus
              />
              <SelectField
                label="Industry"
                placeholder="Select an industry"
                value={draft.industry === "" ? NO_INDUSTRY_VALUE : draft.industry}
                onValueChange={(v) => update("industry", v === NO_INDUSTRY_VALUE ? "" : v)}
                options={[
                  { value: NO_INDUSTRY_VALUE, label: "No industry" },
                  ...INDUSTRIES.map((i) => ({ value: i, label: i })),
                ]}
              />
              <TextareaField
                label="Description"
                id="edit-org-description"
                containerClassName="sm:col-span-2"
                rows={3}
                value={draft.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </div>

            <div className="mt-6 border-t border-outline-variant dark:border-white/10 pt-5">
              <EditPlatformPagesSection organization={organization} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-outline-variant dark:border-white/10 px-6 py-4">
            <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={!editValid}>
              Save changes
            </Button>
          </div>
        </form>
      </>
    );
  }

  return (
    <>
      <div className="flex items-start gap-3 border-b border-outline-variant dark:border-white/10 px-6 py-5">
        <Avatar name={organization.name} imageUrl={organization.logoDataUrl} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h2 id="org-detail-title" className="truncate text-[18px] font-semibold text-on-surface">
              {organization.name}
            </h2>
            <IconButton label="Edit organization" onClick={startEdit}>
              <PencilIcon className="h-3.5 w-3.5" />
            </IconButton>
          </div>
          <p className="mt-0.5 text-[12px] text-on-surface-variant tabular">
            {organization.code} · Added {formatDate(organization.createdAt)}
          </p>
        </div>

        <IconButton label="Delete organization" onClick={() => setConfirmDelete(true)}>
          <TrashIcon className="h-4 w-4" />
        </IconButton>
        <IconButton label="Close" onClick={onClose}>
          <CloseIcon className="h-4 w-4" />
        </IconButton>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-2">
        <h3 className="pt-3 text-[12px] font-medium uppercase tracking-wide text-on-surface-variant">
          Details
        </h3>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2.5 border-b border-outline-variant dark:border-white/10 pb-4 text-[12px]">
          <div>
            <dt className="text-on-surface-variant">Status</dt>
            <dd className="mt-0.5">
              <Badge tone={organization.status === "active" ? "success" : "neutral"}>
                {organization.status === "active" ? "Active" : "Inactive"}
              </Badge>
            </dd>
          </div>
          <div>
            <dt className="text-on-surface-variant">Country</dt>
            <dd className="mt-0.5 truncate text-on-surface">{organization.country || "—"}</dd>
          </div>
          <div>
            <dt className="text-on-surface-variant">Timezone</dt>
            <dd className="mt-0.5 truncate text-on-surface">
              {TIMEZONES.find((t) => t.value === organization.timezone)?.label || organization.timezone || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-on-surface-variant">Website</dt>
            <dd className="mt-0.5 truncate">
              {organization.website ? (
                <a
                  href={organization.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  {organization.website}
                </a>
              ) : (
                <span className="text-on-surface">—</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-on-surface-variant">Industry</dt>
            <dd className="mt-0.5 truncate text-on-surface">{organization.industry || "—"}</dd>
          </div>
          {organization.description && (
            <div className="col-span-2">
              <dt className="text-on-surface-variant">Description</dt>
              <dd className="mt-0.5 text-on-surface">{organization.description}</dd>
            </div>
          )}
        </dl>

        <h3 className="pt-4 text-[12px] font-medium uppercase tracking-wide text-on-surface-variant">
          Platforms
        </h3>
        <ul>
          {platforms.map((platform) => (
            <PlatformRow
              key={platform.id}
              organization={organization}
              platform={platform}
              connection={state.connections.find(
                (c) => c.organizationId === organization.id && c.platformId === platform.id
              )}
            />
          ))}
        </ul>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        titleId="delete-org-title"
        title={`Delete ${organization.name}?`}
        description="This removes its platform connections and managed account selections. This cannot be undone."
        confirmLabel="Delete organization"
        onConfirm={() => {
          deleteOrganization(organization.id);
          onClose();
        }}
      />
    </>
  );
}
