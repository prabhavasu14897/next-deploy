import type { ConnectionStatus } from "@/lib/organizations/types";

const DOT_COLOR: Record<ConnectionStatus | "empty", string> = {
  empty: "var(--on-surface-variant)",
  not_connected: "var(--on-surface-variant)",
  connecting: "var(--status-pending-accent)",
  connected: "var(--status-success)",
  error: "var(--error)",
};

/** A precise status dot — an org strip's at-a-glance connection state. */
export function StatusDot({
  status,
  title,
}: {
  status: ConnectionStatus | "empty";
  title: string;
}) {
  return (
    <span
      role="img"
      aria-label={title}
      title={title}
      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
      style={{ background: DOT_COLOR[status] }}
    />
  );
}
