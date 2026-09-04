"use client";

import { useState } from "react";
import type { Organization } from "@/lib/organizations/types";
import { useOrganizations } from "@/lib/organizations/store";
import { usePlatforms } from "@/lib/platforms/store";
import { formatFollowers } from "@/lib/organizations/derive";
import { PlatformBadge } from "./PlatformBadge";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Dialog } from "@/components/ui/Dialog";
import { DialogActions } from "@/components/ui/DialogActions";
import { PlusIcon } from "@/components/ui/icons";

const EMPTY_PAGE_FORM = { name: "", type: "", followers: "" };

/** Add-pages management for an existing organization — the same
 *  tabs/header/table shape as the create wizard's Add Pages / Accounts
 *  step, wired to real connections/accounts (via addAccount) instead of
 *  wizard-local draft state. Lives inside the edit form. */
export function EditPlatformPagesSection({ organization }: { organization: Organization }) {
  const { connectionFor, accountsFor, addAccount, toggleAccountSelected } = useOrganizations();
  const {
    state: { platforms },
  } = usePlatforms();
  const [activePlatformTab, setActivePlatformTab] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [pageForm, setPageForm] = useState(EMPTY_PAGE_FORM);

  // Falls back to the first available platform whenever the stored tab is
  // unset or no longer exists (e.g. platforms hasn't hydrated from
  // localStorage yet on first render) rather than relying on a one-time
  // useState initializer, since platforms now loads asynchronously.
  const activeTab =
    activePlatformTab && platforms.some((p) => p.id === activePlatformTab)
      ? activePlatformTab
      : (platforms[0]?.id ?? null);
  const activePlatform = platforms.find((p) => p.id === activeTab) ?? null;
  const connection = activePlatform ? connectionFor(organization.id, activePlatform.id) : undefined;
  const pages = connection ? accountsFor(connection.id) : [];

  if (!activePlatform) return null;

  function openAddPage() {
    setPageForm(EMPTY_PAGE_FORM);
    setAddOpen(true);
  }

  function submitPage(e: React.FormEvent) {
    e.preventDefault();
    const name = pageForm.name.trim();
    if (!activePlatform || !name) return;
    addAccount(organization.id, activePlatform.id, {
      name,
      type: pageForm.type.trim() || activePlatform.accountNoun,
      followers: Math.max(0, Number(pageForm.followers) || 0),
    });
    setAddOpen(false);
  }

  return (
    <div>
      <h3 className="text-[12px] font-medium uppercase tracking-wide text-on-surface-variant">Pages / Accounts</h3>

      <div className="mt-2 flex flex-wrap gap-1 border-b border-white/10">
        {platforms.map((platform) => {
          const tabActive = platform.id === activeTab;
          return (
            <button
              key={platform.id}
              type="button"
              onClick={() => setActivePlatformTab(platform.id)}
              className={`flex items-center gap-1.5 border-b-2 px-2.5 py-2 text-[14px] font-semibold transition-colors ${
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

      <div className="mt-3 flex flex-wrap items-start justify-between gap-2">
        <p className="text-[12px] text-on-surface-variant">
          Select {activePlatform.name} {activePlatform.accountNounPlural.toLowerCase()} that belong to this
          organization.
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={openAddPage}>
          <PlusIcon className="h-4 w-4" />
          Add {activePlatform.name} {activePlatform.accountNoun}
        </Button>
      </div>

      <div className="mt-3 overflow-hidden rounded-lg border border-white/15">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[440px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                <th className="px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant">
                  Name
                </th>
                <th className="px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant">
                  Type
                </th>
                <th className="px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant">
                  Followers
                </th>
                <th className="px-3 py-2 text-right text-[12px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant">
                  Select
                </th>
              </tr>
            </thead>
            <tbody>
              {pages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-8 text-center text-[12px] text-on-surface-variant">
                    No {activePlatform.accountNounPlural.toLowerCase()} added yet.
                  </td>
                </tr>
              ) : (
                pages.map((page) => (
                  <tr key={page.id} className="border-b border-white/[0.06] last:border-b-0">
                    <td className="px-3 py-2 text-[14px] font-semibold text-on-surface">{page.name}</td>
                    <td className="px-3 py-2 text-[12px] text-on-surface-variant">{page.type}</td>
                    <td className="px-3 py-2 text-[12px] text-on-surface-variant tabular">
                      {formatFollowers(page.followers)}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end">
                        <Checkbox
                          checked={page.selected}
                          onChange={() => toggleAccountSelected(page.id)}
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

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} titleId="edit-add-page-title" width="22rem">
        <h2 id="edit-add-page-title" className="pr-6 text-[16px] font-bold text-on-surface">
          Add {activePlatform.name} {activePlatform.accountNoun}
        </h2>
        <form onSubmit={submitPage} className="mt-4 space-y-4">
          <TextField
            label="Name"
            id="edit-page-name"
            required
            value={pageForm.name}
            onChange={(e) => setPageForm((f) => ({ ...f, name: e.target.value }))}
            placeholder={`e.g. Acme ${activePlatform.accountNoun}`}
            autoFocus
          />
          <TextField
            label="Type"
            id="edit-page-type"
            hint={`Defaults to "${activePlatform.accountNoun}" if left blank.`}
            value={pageForm.type}
            onChange={(e) => setPageForm((f) => ({ ...f, type: e.target.value }))}
            placeholder={activePlatform.accountNoun}
          />
          <TextField
            label="Followers"
            id="edit-page-followers"
            type="number"
            min="0"
            value={pageForm.followers}
            onChange={(e) => setPageForm((f) => ({ ...f, followers: e.target.value }))}
            placeholder="0"
          />
          <DialogActions>
            <Button type="button" variant="ghost" size="sm" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={!pageForm.name.trim()}>
              Add {activePlatform.accountNoun}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
