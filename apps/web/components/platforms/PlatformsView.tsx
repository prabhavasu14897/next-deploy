"use client";

import { useState } from "react";
import type { Platform, PlatformDraft } from "@/lib/organizations/types";
import { usePlatforms } from "@/lib/platforms/store";
import { useOrganizations } from "@/lib/organizations/store";
import { isPlatformInUse } from "@/lib/organizations/derive";
import { PlatformsTable } from "./PlatformsTable";
import { PlatformFormDialog } from "./PlatformFormDialog";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PlusIcon } from "@/components/ui/icons";

export function PlatformsView() {
  const { state: platformsState, createPlatform, updatePlatform, deletePlatform } = usePlatforms();
  const { state: orgState } = useOrganizations();
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Platform | null>(null);

  const { platforms, integrations } = platformsState;

  function openCreate() {
    setEditingPlatform(null);
    setFormOpen(true);
  }

  function openEdit(platform: Platform) {
    setEditingPlatform(platform);
    setFormOpen(true);
  }

  function handleSubmit(draft: PlatformDraft) {
    if (editingPlatform) {
      updatePlatform(editingPlatform.id, draft);
    } else {
      createPlatform(draft);
    }
    setFormOpen(false);
  }

  const deleteBlocked = deleteTarget ? isPlatformInUse(deleteTarget.id, orgState.connections) : false;

  if (!platformsState.hydrated || !orgState.hydrated) {
    return <div className="min-h-full bg-background" />;
  }

  return (
    <div className="min-h-full bg-background">
      <header className="px-4 pb-6 pt-10 sm:px-16">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-semibold text-on-surface">Platforms</h1>
            <p className="mt-1 text-[16px] text-on-surface-variant">
              Manage the catalog of social platforms organizations can connect to.
            </p>
          </div>
          <Button variant="primary" size="md" onClick={openCreate} className="shrink-0">
            <PlusIcon className="h-4 w-4" />
            Add Platform
          </Button>
        </div>
      </header>

      <main className="px-4 pb-24 sm:px-16">
        <PlatformsTable platforms={platforms} onEdit={openEdit} onDelete={setDeleteTarget} />
      </main>

      <PlatformFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        editing={editingPlatform ? { platform: editingPlatform, integration: integrations[editingPlatform.id] } : null}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        titleId="delete-platform-title"
        title={deleteBlocked ? `Can't delete ${deleteTarget?.name ?? "this platform"}` : `Delete ${deleteTarget?.name ?? "this platform"}?`}
        description={
          deleteBlocked
            ? "One or more organizations have a connection to this platform. Remove those connections first."
            : "Organizations will no longer be able to select or connect to this platform. This cannot be undone."
        }
        confirmLabel={deleteBlocked ? "Understood" : "Delete platform"}
        danger={!deleteBlocked}
        onConfirm={() => {
          if (!deleteTarget || deleteBlocked) return;
          deletePlatform(deleteTarget.id);
        }}
      />
    </div>
  );
}
