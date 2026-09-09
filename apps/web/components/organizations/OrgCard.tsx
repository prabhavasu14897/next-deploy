"use client";

import type { Organization, OrganizationPlatformConnection } from "@/lib/organizations/types";
import { aggregateStatus, formatDate } from "@/lib/organizations/derive";
import { usePlatforms } from "@/lib/platforms/store";
import { StatusDot } from "./StatusDot";
import { PlatformBadge } from "./PlatformBadge";
import { statusLabel } from "@/components/ui/StatusPill";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

/** Grid view's unit — the same organization facts as the table row,
 *  reflowed into a card. */
export function OrgCard({
  organization,
  connections,
  active,
  onOpen,
}: {
  organization: Organization;
  connections: OrganizationPlatformConnection[];
  active: boolean;
  onOpen: () => void;
}) {
  const {
    state: { platforms },
  } = usePlatforms();
  const status = aggregateStatus(connections);
  const connectedCount = connections.filter((c) => c.status === "connected").length;

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`flex w-full flex-col gap-3 rounded-lg border p-4 text-left transition-colors ${
        active
          ? "border-primary/40 bg-primary/10 hover:bg-primary/15"
          : "border-outline-variant dark:border-white/15 bg-surface-container-highest dark:bg-white/[0.04] hover:bg-surface-variant dark:hover:bg-white/[0.08]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar name={organization.name} imageUrl={organization.logoDataUrl} size="sm" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <StatusDot
                status={status}
                title={`${organization.name}: ${statusLabel(status === "empty" ? "not_connected" : status)}`}
              />
              <span className="truncate text-[14px] font-semibold text-on-surface">{organization.name}</span>
            </div>
            <p className="mt-0.5 text-[12px] text-on-surface-variant tabular">
              Added {formatDate(organization.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {active && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-on-primary">
              Current
            </span>
          )}
          {organization.status === "inactive" && <Badge tone="neutral">Inactive</Badge>}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {platforms.map((platform) => {
          const connection = connections.find((c) => c.platformId === platform.id);
          return (
            <PlatformBadge key={platform.id} platform={platform} status={connection?.status ?? "not_connected"} />
          );
        })}
      </div>

      <p className="text-[12px] text-on-surface-variant tabular">
        {connectedCount} of {platforms.length} platforms connected
      </p>
    </button>
  );
}
