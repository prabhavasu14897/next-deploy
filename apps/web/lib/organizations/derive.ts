import type { ConnectionStatus, OrganizationPlatformConnection } from "./types";

/** The single status an organization's strip clip shows, worst-first. */
export function aggregateStatus(
  connections: OrganizationPlatformConnection[]
): ConnectionStatus | "empty" {
  if (connections.length === 0) return "empty";
  if (connections.some((c) => c.status === "error")) return "error";
  if (connections.some((c) => c.status === "connecting")) return "connecting";
  if (connections.some((c) => c.status === "connected")) return "connected";
  return "not_connected";
}

/** The create form only collects name/description/industry — code has no
 *  input of its own, but OrgDetailSheet displays it as a subtitle, so it's
 *  derived from the name rather than left blank. */
export function deriveOrgCode(name: string): string {
  const slug = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, 8);
  return slug || "ORG";
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/** Whether any organization has any connection record to this platform,
 *  regardless of status — the Add Platform delete-guard's test. */
export function isPlatformInUse(
  platformId: string,
  connections: OrganizationPlatformConnection[]
): boolean {
  return connections.some((c) => c.platformId === platformId);
}
