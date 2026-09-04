"use client";

import type { Platform, PlatformIntegrationConfig } from "@/lib/organizations/types";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { DialogActions } from "@/components/ui/DialogActions";
import { PlatformBadge } from "./PlatformBadge";

export function ConnectPlatformDialog({
  open,
  onClose,
  platform,
  integration,
  organizationName,
  isReconnect,
  onAuthorize,
}: {
  open: boolean;
  onClose: () => void;
  platform: Platform;
  integration: PlatformIntegrationConfig;
  organizationName: string;
  isReconnect: boolean;
  onAuthorize: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} titleId="connect-platform-title" width="24rem">
      <div className="flex items-start gap-3">
        <PlatformBadge platform={platform} status="not_connected" size="md" />
        <div className="min-w-0 pr-6">
          <h2 id="connect-platform-title" className="text-[16px] font-bold text-on-surface">
            {isReconnect ? "Reconnect to" : "Connect to"} {platform.name}
          </h2>
          <p className="mt-0.5 text-[12px] text-on-surface-variant">
            On behalf of <span className="font-semibold text-on-surface">{organizationName}</span>
          </p>
        </div>
      </div>

      <div className="mt-4 rounded border border-white/10 bg-surface-container-highest p-3">
        <p className="text-[12px] font-medium uppercase tracking-wide text-on-surface-variant">
          This will allow access to
        </p>
        <ul className="mt-1.5 space-y-1">
          {integration.scopes.map((scope) => (
            <li key={scope} className="text-[12px] text-on-surface tabular">
              {scope}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-3 text-[12px] leading-snug text-status-pending-accent">
        Simulated connection — no real {platform.name} account will be contacted.
        Platform integrations are not yet live.
      </p>

      <DialogActions>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            onAuthorize();
            onClose();
          }}
        >
          Authorize
        </Button>
      </DialogActions>
    </Dialog>
  );
}
