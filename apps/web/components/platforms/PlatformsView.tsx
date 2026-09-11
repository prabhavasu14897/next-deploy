"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Platform, PlatformDraft } from "@/lib/organizations/types";
import { usePlatforms } from "@/lib/platforms/store";
import { useOrganizations } from "@/lib/organizations/store";
import { isPlatformInUse } from "@/lib/organizations/derive";
import { PlatformsTable } from "./PlatformsTable";
import { PlatformFormDialog } from "./PlatformFormDialog";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PlusIcon, SparklesIcon, CloseIcon, CheckIcon, AlertIcon } from "@/components/ui/icons";
import { PageLoading } from "@/components/ui/PageLoading";

const HTML_ENTITIES: Record<string, string> = {
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
};

/** LinkedIn's own OAuth error_description comes back HTML-entity-encoded
 *  (e.g. literal "&quot;") — decode the common ones before displaying, or
 *  the banner shows the entities as visible text instead of real quotes. */
function decodeHtmlEntities(text: string): string {
  return text.replace(/&(quot|#39|apos|amp|lt|gt);/g, (entity) => HTML_ENTITIES[entity] ?? entity);
}

export function PlatformsView() {
  const { state: platformsState, createPlatform, updatePlatform, deletePlatform, seedDemoPlatforms, refetch } =
    usePlatforms();
  const { state: orgState } = useOrganizations();
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Platform | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [linkedinStatus, setLinkedinStatus] = useState<{ ok: boolean; message: string } | null>(null);

  const { platforms, integrations } = platformsState;

  // Land here after the Connect-with-LinkedIn OAuth round trip — the
  // backend already saved the token/URN server-side, so this tab just
  // needs to pick up the new data and show what happened.
  useEffect(() => {
    const status = searchParams.get("linkedin");
    if (!status) return;
    if (status === "connected") {
      setLinkedinStatus({ ok: true, message: "LinkedIn connected — Access Token and Organization URN were filled in." });
      refetch();
    } else if (status === "error") {
      const raw = searchParams.get("message") ?? "Connecting to LinkedIn failed.";
      setLinkedinStatus({ ok: false, message: decodeHtmlEntities(raw) });
    }
    router.replace("/add-platform");
    // Only ever meant to run once, right after landing with the query param.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Once the refetch lands and the LinkedIn platform is in hand, reopen its
  // edit form so the now-filled Access Token / Organization URN are visible
  // — once only, so it doesn't keep reopening every time the dialog closes.
  const autoOpenedRef = useRef(false);
  useEffect(() => {
    if (linkedinStatus?.ok && !autoOpenedRef.current) {
      const linkedin = platforms.find((p) => p.name.trim().toLowerCase() === "linkedin");
      if (linkedin) {
        autoOpenedRef.current = true;
        setEditingPlatform(linkedin);
        setFormOpen(true);
      }
    }
  }, [linkedinStatus, platforms]);

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
    return <PageLoading />;
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
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="secondary" size="md" onClick={seedDemoPlatforms}>
              <SparklesIcon className="h-4 w-4" />
              Load sample data
            </Button>
            <Button variant="primary" size="md" onClick={openCreate}>
              <PlusIcon className="h-4 w-4" />
              Add Platform
            </Button>
          </div>
        </div>
        <p className="mt-3 text-[12px] text-on-surface-variant">
          Demo mode: sample platforms load instantly for preview and are kept in this browser only — they
          aren&apos;t saved to the server, so they won&apos;t appear for anyone else or in a real deployment&apos;s
          database.
        </p>

        {linkedinStatus && (
          <div
            className={`mt-3 flex items-start gap-2 rounded border px-3 py-2.5 text-[13px] ${
              linkedinStatus.ok
                ? "border-status-success/30 bg-status-success/10 text-status-success"
                : "border-error/30 bg-error/10 text-error"
            }`}
          >
            {linkedinStatus.ok ? (
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <p className="flex-1">{linkedinStatus.message}</p>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => setLinkedinStatus(null)}
              className="shrink-0 opacity-70 transition-opacity hover:opacity-100"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        )}
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
        confirmationText={deleteBlocked ? undefined : deleteTarget?.name}
        onConfirm={() => {
          if (!deleteTarget || deleteBlocked) return;
          deletePlatform(deleteTarget.id);
        }}
      />
    </div>
  );
}
