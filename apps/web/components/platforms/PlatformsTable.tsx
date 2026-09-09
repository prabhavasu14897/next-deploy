"use client";

import type { Platform } from "@/lib/organizations/types";
import { PlatformBadge } from "@/components/organizations/PlatformBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconButton } from "@/components/ui/Button";
import { PencilIcon, TrashIcon } from "@/components/ui/icons";

const HEADERS = ["Platform", "Summary", "Accounts called", "Actions"] as const;

/** The platform catalog, in the same table shape as OrganizationsTable —
 *  this is a sibling admin-CRUD surface, not a new pattern. */
export function PlatformsTable({
  platforms,
  onEdit,
  onDelete,
}: {
  platforms: Platform[];
  onEdit: (platform: Platform) => void;
  onDelete: (platform: Platform) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-outline-variant dark:border-white/15">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant dark:border-white/10 bg-surface-container-low dark:bg-white/[0.03]">
              {HEADERS.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className={`px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant ${
                    header === "Actions" ? "text-right" : ""
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {platforms.length === 0 ? (
              <tr>
                <td colSpan={HEADERS.length} className="px-4 py-14 text-center">
                  <EmptyState
                    title="No platforms yet"
                    description="Add a platform so organizations have something to connect to."
                  />
                </td>
              </tr>
            ) : (
              platforms.map((platform) => (
                <tr key={platform.id} className="border-b border-outline-variant dark:border-white/[0.06] transition-colors last:border-b-0 hover:bg-surface-container-highest dark:hover:bg-white/[0.04]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <PlatformBadge platform={platform} status="not_connected" size="sm" />
                      <span className="text-[14px] font-semibold text-on-surface">{platform.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="max-w-md text-[12px] text-on-surface-variant">{platform.summary}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[12px] text-on-surface-variant">
                      {platform.accountNoun} / {platform.accountNounPlural}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <IconButton label={`Edit ${platform.name}`} onClick={() => onEdit(platform)}>
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                      <IconButton label={`Delete ${platform.name}`} onClick={() => onDelete(platform)}>
                        <TrashIcon className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
