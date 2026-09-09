"use client";

import { useState } from "react";
import type { Organization, OrganizationPlatformConnection } from "@/lib/organizations/types";
import { aggregateStatus, formatDate } from "@/lib/organizations/derive";
import { useOrganizations } from "@/lib/organizations/store";
import { usePlatforms } from "@/lib/platforms/store";
import { StatusDot } from "./StatusDot";
import { PlatformBadge } from "./PlatformBadge";
import { StatusPill, statusLabel } from "@/components/ui/StatusPill";
import { IconButton } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PencilIcon, PlugIcon, TrashIcon } from "@/components/ui/icons";

const HEADERS = ["Name", "Platforms", "Status", "Actions"] as const;

/** List view — a real table (Name, Platforms, Status, Actions), with the
 *  empty state living in its own full-width row rather than a card outside it. */
export function OrganizationsTable({
  organizations,
  connectionsFor,
  activeOrgId,
  onOpen,
  emptyMessage,
}: {
  organizations: Organization[];
  connectionsFor: (organizationId: string) => OrganizationPlatformConnection[];
  activeOrgId: string | null;
  onOpen: (id: string, editMode?: boolean) => void;
  emptyMessage: string;
}) {
  const { deleteOrganization } = useOrganizations();
  const {
    state: { platforms },
  } = usePlatforms();
  const [deleteTarget, setDeleteTarget] = useState<Organization | null>(null);

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-outline-variant dark:border-white/15">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-outline-variant dark:border-white/10 bg-surface-container-low dark:bg-white/[0.03]">
                {HEADERS.map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className={`px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant ${
                      header === "Actions" ? "text-right" : ""
                    } ${header === "Platforms" ? "hidden sm:table-cell" : ""}`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {organizations.length === 0 ? (
                <tr>
                  <td colSpan={HEADERS.length} className="px-4 py-14 text-center">
                    <p className="text-[14px] font-semibold text-on-surface">{emptyMessage}</p>
                  </td>
                </tr>
              ) : (
                organizations.map((org) => {
                  const connections = connectionsFor(org.id);
                  const status = aggregateStatus(connections);
                  const normalizedStatus = status === "empty" ? "not_connected" : status;
                  const connectedCount = connections.filter((c) => c.status === "connected").length;
                  const active = org.id === activeOrgId;

                  return (
                    <tr
                      key={org.id}
                      className={`border-b border-outline-variant dark:border-white/[0.06] transition-colors last:border-b-0 hover:bg-surface-container-highest dark:hover:bg-white/[0.04] ${
                        active ? "bg-primary/[0.06]" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => onOpen(org.id)}
                          className="flex items-center gap-2.5 text-left"
                        >
                          <Avatar name={org.name} imageUrl={org.logoDataUrl} size="sm" />
                          <span className="min-w-0">
                            <span className="flex flex-wrap items-center gap-1.5">
                              <StatusDot status={status} title={`${org.name}: ${statusLabel(normalizedStatus)}`} />
                              <span className="truncate text-[14px] font-semibold text-on-surface hover:underline">
                                {org.name}
                              </span>
                              {active && (
                                <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-on-primary">
                                  Current
                                </span>
                              )}
                              {org.status === "inactive" && <Badge tone="neutral">Inactive</Badge>}
                            </span>
                            <span className="block text-[12px] text-on-surface-variant tabular">
                              Added {formatDate(org.createdAt)}
                            </span>
                          </span>
                        </button>
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <div className="flex items-center gap-1.5">
                          {platforms.map((platform) => {
                            const connection = connections.find((c) => c.platformId === platform.id);
                            return (
                              <PlatformBadge
                                key={platform.id}
                                platform={platform}
                                status={connection?.status ?? "not_connected"}
                              />
                            );
                          })}
                        </div>
                        <p className="mt-1 text-[12px] text-on-surface-variant tabular">
                          {connectedCount} of {platforms.length} connected
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={normalizedStatus} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <IconButton label={`Edit ${org.name}`} onClick={() => onOpen(org.id, true)}>
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                          <IconButton label={`Connect platforms for ${org.name}`} onClick={() => onOpen(org.id)}>
                            <PlugIcon className="h-4 w-4" />
                          </IconButton>
                          <IconButton label={`Delete ${org.name}`} onClick={() => setDeleteTarget(org)}>
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        titleId="delete-org-title"
        title={`Delete ${deleteTarget?.name ?? "this organization"}?`}
        description="This removes its platform connections and managed account selections. This cannot be undone."
        confirmLabel="Delete organization"
        onConfirm={() => {
          if (deleteTarget) deleteOrganization(deleteTarget.id);
        }}
      />
    </>
  );
}
