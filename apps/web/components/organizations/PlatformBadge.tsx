import type { ConnectionStatus, Platform } from "@/lib/organizations/types";

const RING: Record<ConnectionStatus, string> = {
  not_connected: "var(--outline-variant)",
  connecting: "var(--status-pending-accent)",
  connected: "var(--status-success)",
  error: "var(--error)",
};

const FG: Record<ConnectionStatus, string> = {
  not_connected: "var(--on-surface-variant)",
  connecting: "var(--status-pending-accent)",
  connected: "var(--surface)",
  error: "var(--surface)",
};

const BG: Record<ConnectionStatus, string> = {
  not_connected: "transparent",
  connecting: "transparent",
  connected: "var(--status-success)",
  error: "var(--error)",
};

/**
 * A platform's monogram, drawn from catalog data (its initial) rather than
 * a brand mark — the palette stays intact regardless of which platforms
 * the catalog lists.
 */
export function PlatformBadge({
  platform,
  status,
  size = "sm",
}: {
  platform: Platform;
  status: ConnectionStatus;
  size?: "sm" | "md";
}) {
  const dims = size === "sm" ? "h-6 w-6 text-[10px]" : "h-9 w-9 text-[13px]";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold uppercase ${dims}`}
      style={{
        color: FG[status],
        background: BG[status],
        boxShadow: `inset 0 0 0 1.4px ${RING[status]}`,
      }}
    >
      {platform.name.slice(0, 1)}
    </span>
  );
}
