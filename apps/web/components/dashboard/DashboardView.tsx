"use client";

import { useOrganizations } from "@/lib/organizations/store";
import { usePlatforms } from "@/lib/platforms/store";
import { usePosts } from "@/lib/posts/store";
import { StatTile } from "./StatTile";
import { ListIcon, OrganizationsIcon, PlugIcon, SparklesIcon } from "@/components/ui/icons";

export function DashboardView() {
  const { state: orgState } = useOrganizations();
  const { state: platformsState } = usePlatforms();
  const { state: postsState } = usePosts();

  const hydrated = orgState.hydrated && platformsState.hydrated && postsState.hydrated;
  const pagesCount = orgState.accounts.filter((a) => a.selected).length;

  return (
    <div className="min-h-full bg-background">
      <header className="px-4 pb-6 pt-10 sm:px-16">
        <h1 className="text-[24px] font-semibold text-on-surface">Dashboard</h1>
        <p className="mt-1 text-[16px] text-on-surface-variant">
          An at-a-glance overview of organizations, connections, and activity.
        </p>
      </header>

      <main className="px-4 pb-24 sm:px-16">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile
            Icon={OrganizationsIcon}
            label="Organizations"
            count={hydrated ? orgState.organizations.length : null}
            href="/organizations"
          />
          <StatTile
            Icon={PlugIcon}
            label="Platforms"
            count={hydrated ? platformsState.platforms.length : null}
            href="/add-platform"
          />
          <StatTile Icon={ListIcon} label="Pages" count={hydrated ? pagesCount : null} href="/organizations" />
          <StatTile
            Icon={SparklesIcon}
            label="Posts"
            count={hydrated ? postsState.posts.length : null}
            href="/post"
          />
        </div>
      </main>
    </div>
  );
}
