import type { ConnectionStatus } from "@/lib/organizations/types";
import { AlertIcon, CheckIcon, SpinnerIcon } from "./icons";

const STATUS_META: Record<
  ConnectionStatus,
  { label: string; fg: string; bg: string }
> = {
  not_connected: {
    label: "Not connected",
    fg: "var(--on-surface-variant)",
    bg: "var(--surface-container-highest)",
  },
  connecting: {
    label: "Connecting",
    fg: "var(--status-pending-accent)",
    bg: "var(--status-pending-accent-container)",
  },
  connected: {
    label: "Connected",
    fg: "var(--status-success)",
    bg: "var(--status-success-container)",
  },
  error: {
    label: "Connection error",
    fg: "var(--error)",
    bg: "var(--error-container)",
  },
};

export function StatusPill({ status }: { status: ConnectionStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className="inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-semibold tabular"
      style={{ color: meta.fg, background: meta.bg }}
    >
      {status === "connecting" && <SpinnerIcon className="h-3 w-3" />}
      {status === "connected" && <CheckIcon className="h-3 w-3" />}
      {status === "error" && <AlertIcon className="h-3 w-3" />}
      {meta.label}
    </span>
  );
}

export function statusLabel(status: ConnectionStatus): string {
  return STATUS_META[status].label;
}
