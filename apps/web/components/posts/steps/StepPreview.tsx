"use client";

import { useOrganizations } from "@/lib/organizations/store";
import { usePlatforms } from "@/lib/platforms/store";
import type { Post } from "@/lib/posts/types";
import { previewComponentFor } from "@/components/posts/platform-previews";
import { EmptyState } from "@/components/ui/EmptyState";

export function StepPreview({ post, organizationName }: { post: Post; organizationName: string }) {
  const { platformById } = usePlatforms();
  const { accountsFor, connectionFor } = useOrganizations();

  const readyDrafts = post.drafts.filter((d) => d.imageBase64);

  if (readyDrafts.length === 0) {
    return (
      <EmptyState
        title="Nothing to preview yet"
        description="Go back and finish generating content for at least one platform."
      />
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-[18px] font-semibold text-on-surface">Platform preview</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {readyDrafts.map((draft) => {
          const platform = platformById(draft.platformId);
          const connection = connectionFor(post.organizationId, draft.platformId);
          const account = draft.accountId
            ? accountsFor(connection?.id ?? "").find((a) => a.id === draft.accountId)
            : undefined;
          const Preview = previewComponentFor(platform?.name ?? draft.platformId);

          return (
            <div key={draft.platformId} className="space-y-2">
              <p className="text-[12px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant">
                {platform?.name ?? draft.platformId}
              </p>
              <Preview
                pageName={account?.name ?? organizationName}
                imageBase64={draft.imageBase64}
                caption={draft.caption}
                hashtags={draft.hashtags}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
