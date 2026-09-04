"use client";

import { useMemo, useState } from "react";
import type { ConnectionStatus, OrganizationDraft } from "@/lib/organizations/types";
import { useOrganizations } from "@/lib/organizations/store";
import { aggregateStatus } from "@/lib/organizations/derive";
import { OrganizationsTable } from "./OrganizationsTable";
import { OrgCard } from "./OrgCard";
import { CreateOrganizationWizard } from "./CreateOrganizationWizard";
import { OrgDetailSheet } from "./OrgDetailSheet";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FilterChip } from "@/components/ui/FilterChip";
import { EmptyState } from "@/components/ui/EmptyState";
import { PlusIcon, SearchIcon, ListIcon, GridIcon } from "@/components/ui/icons";

type View = "list" | "grid";
type StatusFilter = "all" | ConnectionStatus;

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "connected", label: "Connected" },
  { value: "connecting", label: "Connecting" },
  { value: "not_connected", label: "Not connected" },
  { value: "error", label: "Error" },
];

export function OrganizationsView() {
  const { state, createOrganization, setActiveOrganization, connectPlatform, addManualAccounts } =
    useOrganizations();
  const [openOrgId, setOpenOrgId] = useState<string | null>(null);
  const [openOrgEditMode, setOpenOrgEditMode] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [view, setView] = useState<View>("list");

  const connectionsFor = (organizationId: string) =>
    state.connections.filter((c) => c.organizationId === organizationId);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = state.organizations;
    if (q) list = list.filter((o) => o.name.toLowerCase().includes(q));
    if (statusFilter !== "all") {
      list = list.filter((o) => {
        const status = aggregateStatus(state.connections.filter((c) => c.organizationId === o.id));
        return (status === "empty" ? "not_connected" : status) === statusFilter;
      });
    }
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, [state.organizations, state.connections, query, statusFilter]);

  const openOrg = state.organizations.find((o) => o.id === openOrgId) ?? null;
  const hasOrganizations = state.organizations.length > 0;

  const emptyMessage = !hasOrganizations
    ? "No organizations yet"
    : query.trim()
      ? `No organizations match “${query}”.`
      : "No organizations match the selected filter.";

  function openStrip(id: string, editMode = false) {
    setActiveOrganization(id);
    setOpenOrgId(id);
    setOpenOrgEditMode(editMode);
  }

  function handleCreate(draft: OrganizationDraft) {
    const id = createOrganization(draft);
    draft.platformIds.forEach((platformId) => {
      const pages = draft.platformPages[platformId] ?? [];
      // Pages typed in by hand are already "connected" — no simulated
      // discovery to run. A platform with no pages entered still goes
      // through the normal connect flow.
      if (pages.length > 0) {
        addManualAccounts(id, platformId, pages);
      } else {
        connectPlatform(id, platformId);
      }
    });
    // The wizard shows its own success step and redirects back to this list
    // itself (via onClose) — just mark the new org active, don't jump
    // straight into its detail sheet.
    setActiveOrganization(id);
  }

  if (!state.hydrated) {
    return <div className="min-h-full bg-background" />;
  }

  if (createOpen) {
    return (
      <div className="min-h-full bg-background">
        <div className="px-4 pb-24 pt-10 sm:px-16">
          <CreateOrganizationWizard onClose={() => setCreateOpen(false)} onCreate={handleCreate} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">
      <header className="px-4 pb-6 pt-10 sm:px-16">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-semibold text-on-surface">Organizations</h1>
            <p className="mt-1 text-[16px] text-on-surface-variant">
              Connect a platform to an organization, then choose which accounts it manages.
            </p>
          </div>
          <Button variant="primary" size="md" onClick={() => setCreateOpen(true)} className="shrink-0">
            <PlusIcon className="h-4 w-4" />
            Add Organization
          </Button>
        </div>

        {hasOrganizations && (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-xs">
              <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name"
                aria-label="Search organizations by name"
                className="w-full pl-8"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {STATUS_FILTERS.map((f) => (
                <FilterChip key={f.value} active={statusFilter === f.value} onClick={() => setStatusFilter(f.value)}>
                  {f.label}
                </FilterChip>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-0.5 rounded-full p-0.5 ring-1 ring-inset ring-outline-variant">
              <button
                type="button"
                aria-label="List view"
                aria-pressed={view === "list"}
                onClick={() => setView("list")}
                className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                  view === "list" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <ListIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Grid view"
                aria-pressed={view === "grid"}
                onClick={() => setView("grid")}
                className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                  view === "grid" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <GridIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="px-4 pb-24 sm:px-16">
        {!hasOrganizations ? (
          <EmptyState
            title="No organizations yet"
            description="Add your first organization to start connecting its social platforms."
            action={
              <Button variant="primary" size="sm" onClick={() => setCreateOpen(true)}>
                <PlusIcon className="h-4 w-4" />
                Add Organization
              </Button>
            }
          />
        ) : view === "list" ? (
          <OrganizationsTable
            organizations={filtered}
            connectionsFor={connectionsFor}
            activeOrgId={state.activeOrgId}
            onOpen={openStrip}
            emptyMessage={emptyMessage}
          />
        ) : filtered.length === 0 ? (
          <EmptyState title={emptyMessage} />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((org) => (
              <OrgCard
                key={org.id}
                organization={org}
                connections={connectionsFor(org.id)}
                active={org.id === state.activeOrgId}
                onOpen={() => openStrip(org.id)}
              />
            ))}
          </div>
        )}
      </main>

      <OrgDetailSheet
        organization={openOrg}
        onClose={() => setOpenOrgId(null)}
        startInEditMode={openOrgEditMode}
      />
    </div>
  );
}
