"use client";

import { useState } from "react";
import type { Organization, OrganizationPlatformConnection, Platform } from "@/lib/organizations/types";
import { useOrganizations } from "@/lib/organizations/store";
import { usePlatforms } from "@/lib/platforms/store";
import { PlatformBadge } from "./PlatformBadge";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { ConnectPlatformDialog } from "./ConnectPlatformDialog";
import { AccountPicker } from "./AccountPicker";

export function PlatformRow({
  organization,
  platform,
  connection,
}: {
  organization: Organization;
  platform: Platform;
  connection: OrganizationPlatformConnection | undefined;
}) {
  const { connectPlatform, accountsFor } = useOrganizations();
  const { integrationFor } = usePlatforms();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const integration = integrationFor(platform.id);
  if (!integration) return null;

  const status = connection?.status ?? "not_connected";
  const accounts = connection ? accountsFor(connection.id) : [];
  const selectedCount = accounts.filter((a) => a.selected).length;

  return (
    <li className="flex items-start gap-3 border-b border-outline-variant dark:border-white/10 px-1 py-3.5 last:border-b-0">
      <PlatformBadge platform={platform} status={status} size="md" />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[14px] font-semibold text-on-surface">{platform.name}</span>
          <StatusPill status={status} />
        </div>
        <p className="mt-0.5 text-[12px] text-on-surface-variant">{platform.summary}</p>

        {status === "connected" && connection?.discoveringAccounts && (
          <p className="mt-1.5 text-[12px] text-status-pending-accent">Discovering {platform.accountNounPlural.toLowerCase()}…</p>
        )}

        {status === "error" && connection?.lastError && (
          <p className="mt-1.5 text-[12px] leading-snug text-error">{connection.lastError}</p>
        )}

        <div className="mt-2.5">
          {status === "not_connected" && (
            <Button variant="secondary" size="sm" onClick={() => setDialogOpen(true)}>
              Connect
            </Button>
          )}
          {status === "error" && (
            <Button variant="secondary" size="sm" onClick={() => setDialogOpen(true)}>
              Reconnect
            </Button>
          )}
          {status === "connected" && connection?.accountsDiscovered && (
            <Button variant="secondary" size="sm" onClick={() => setPickerOpen(true)}>
              Manage {platform.accountNounPlural.toLowerCase()} · {selectedCount} of {accounts.length} selected
            </Button>
          )}
        </div>
      </div>

      <ConnectPlatformDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        platform={platform}
        integration={integration}
        organizationName={organization.name}
        isReconnect={status === "error"}
        onAuthorize={() => connectPlatform(organization.id, platform.id)}
      />

      {connection && pickerOpen && (
        <AccountPicker
          onClose={() => setPickerOpen(false)}
          platform={platform}
          organization={organization}
          accounts={accounts}
        />
      )}
    </li>
  );
}
