"use client";

import { useState } from "react";
import { useOrganizations } from "@/lib/organizations/store";
import { usePosts } from "@/lib/posts/store";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { SelectField } from "@/components/ui/SelectField";
import { PostWizard } from "./PostWizard";
import { PostHistoryTable } from "./PostHistoryTable";
import { BackIcon, PlusIcon } from "@/components/ui/icons";

export function PostsView() {
  const { state: orgState } = useOrganizations();
  const { postsForOrg } = usePosts();
  // Explicit selection, once the user makes one, wins; otherwise fall back
  // to the active org (derived at render time, not via an effect+setState,
  // since orgState.organizations only becomes non-empty after hydration).
  const [explicitOrgId, setExplicitOrgId] = useState<string | null>(null);
  const [mode, setMode] = useState<"list" | "create">("list");
  const organizationId = explicitOrgId ?? orgState.activeOrgId ?? orgState.organizations[0]?.id ?? "";
  const noOrganizations = orgState.hydrated && orgState.organizations.length === 0;

  return (
    <div className="min-h-full bg-background">
      <header className="px-4 pb-6 pt-10 sm:px-16">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-semibold text-on-surface">Post</h1>
            <p className="mt-1 text-[16px] text-on-surface-variant">
              Generate AI images and captions, then publish to your connected platforms.
            </p>
          </div>
          {mode === "list" ? (
            <Button
              variant="primary"
              size="md"
              disabled={noOrganizations}
              onClick={() => setMode("create")}
              className="shrink-0"
            >
              <PlusIcon className="h-4 w-4" />
              Create Post
            </Button>
          ) : (
            <Button variant="ghost" size="md" onClick={() => setMode("list")} className="shrink-0">
              <BackIcon className="h-4 w-4" />
              Back to posts
            </Button>
          )}
        </div>
      </header>

      <main className="px-4 pb-24 sm:px-16">
        {!orgState.hydrated ? null : noOrganizations ? (
          <EmptyState
            title="No organizations yet"
            description="Create an organization in Organizations before creating a post."
          />
        ) : mode === "create" ? (
          <div className="mx-auto max-w-[900px]">
            <PostWizard
              organizations={orgState.organizations}
              organizationId={organizationId}
              onOrganizationChange={setExplicitOrgId}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <SelectField
              label="Organization"
              id="posts-list-org"
              value={organizationId}
              onChange={(e) => setExplicitOrgId(e.target.value)}
              containerClassName="max-w-xs"
            >
              {orgState.organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </SelectField>
            <PostHistoryTable posts={organizationId ? postsForOrg(organizationId) : []} />
          </div>
        )}
      </main>
    </div>
  );
}
