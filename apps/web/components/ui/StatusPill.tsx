import type { ConnectionStatus } from "@/lib/organizations/types";
import { Badge } from "./Badge";
import { AlertIcon, CheckIcon, SpinnerIcon } from "./icons";

const STATUS_META: Record<ConnectionStatus, { label: string; tone: "neutral" | "warning" | "success" | "error" }> = {
  not_connected: { label: "Not connected", tone: "neutral" },
  connecting: { label: "Connecting", tone: "warning" },
  connected: { label: "Connected", tone: "success" },
  error: { label: "Connection error", tone: "error" },
};

export function StatusPill({ status }: { status: ConnectionStatus }) {
  const meta = STATUS_META[status];
  return (
    <Badge tone={meta.tone}>
      <span className="inline-flex items-center gap-1.5 tabular">
        {status === "connecting" && <SpinnerIcon className="h-3 w-3" />}
        {status === "connected" && <CheckIcon className="h-3 w-3" />}
        {status === "error" && <AlertIcon className="h-3 w-3" />}
        {meta.label}
      </span>
    </Badge>
  );
}

export function statusLabel(status: ConnectionStatus): string {
  return STATUS_META[status].label;
}
