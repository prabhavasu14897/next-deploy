"use client";

import { useState } from "react";
import { useOrganizations } from "@/lib/organizations/store";
import { usePosts } from "@/lib/posts/store";
import { usePlatforms } from "@/lib/platforms/store";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { SelectField } from "@ascentware/react-ui-library";
import { PostWizard } from "./PostWizard";
import { PostHistoryTable } from "./PostHistoryTable";
import { BackIcon, PlusIcon, SparklesIcon } from "@/components/ui/icons";

export function PostsView() {
  const { state: orgState } = useOrganizations();
  const { postsForOrg, seedDemoPosts } = usePosts();
  const { state: platformsState } = usePlatforms();
  // Explicit selection, once the user makes one, wins; otherwise fall back
  // to the active org (derived at render time, not via an effect+setState,
  // since orgState.organizations only becomes non-empty after hydration).
  const [explicitOrgId, setExplicitOrgId] = useState<string | null>(null);
  const [mode, setMode] = useState<"list" | "create">("list");
  const organizationId = explicitOrgId ?? orgState.activeOrgId ?? orgState.organizations[0]?.id ?? "";
  const noOrganizations = orgState.hydrated && orgState.organizations.length === 0;

  function seedSamplePosts() {
    if (!organizationId) return;
    const platformId = platformsState.platforms[0]?.id ?? "demo-platform";
    seedDemoPosts(organizationId, platformId);
  }

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
            <div className="flex shrink-0 items-center gap-2">
              <Button variant="secondary" size="md" disabled={noOrganizations} onClick={seedSamplePosts}>
                <SparklesIcon className="h-4 w-4" />
                Load sample data
              </Button>
              <Button variant="primary" size="md" disabled={noOrganizations} onClick={() => setMode("create")}>
                <PlusIcon className="h-4 w-4" />
                Create Post
              </Button>
            </div>
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
            <div className="max-w-xs">
              <SelectField
                label="Organization"
                value={organizationId}
                onValueChange={setExplicitOrgId}
                options={orgState.organizations.map((org) => ({ value: org.id, label: org.name }))}
              />
            </div>
            <PostHistoryTable posts={organizationId ? postsForOrg(organizationId) : []} />
          </div>
        )}
      </main>
    </div>
  );
}
