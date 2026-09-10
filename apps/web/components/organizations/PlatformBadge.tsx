import Image from "next/image";
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

/** Real brand marks for the platforms this app ships sample data for.
 *  Keyed by the platform's catalog name, lowercased — an admin-added
 *  platform with no matching entry here falls back to the monogram below,
 *  so the catalog isn't limited to only these names. */
export const PLATFORM_LOGOS: Record<string, string> = {
  linkedin: "/brand/platforms/linkedin.png",
  facebook: "/brand/platforms/facebook.png",
  instagram: "/brand/platforms/instagram.png",
};

export function platformLogoSrc(name: string): string | undefined {
  return PLATFORM_LOGOS[name.trim().toLowerCase()];
}

/** The icon to show for a platform: its own admin-uploaded logo first (a
 *  data: URL — see Platform.logoDataUrl), then the built-in brand mark for
 *  a matching name, else undefined (caller falls back to the monogram). */
export function platformIconSrc(platform: Pick<Platform, "name" | "logoDataUrl">): string | undefined {
  return platform.logoDataUrl ?? platformLogoSrc(platform.name);
}

const SIZES = {
  sm: { box: "h-6 w-6", text: "text-[10px]", px: 24 },
  md: { box: "h-9 w-9", text: "text-[13px]", px: 36 },
} as const;

/**
 * A platform's icon — the real brand mark when the catalog name matches one
 * we ship a logo for (see PLATFORM_LOGOS), otherwise a monogram drawn from
 * the name's initial so an admin-added platform with no matching asset
 * still gets a sensible icon rather than a broken image.
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
  const { box, text, px } = SIZES[size];
  const logoSrc = platformIconSrc(platform);

  if (logoSrc) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ${box}`}
        style={{ boxShadow: `inset 0 0 0 1.4px ${RING[status]}` }}
      >
        {platform.logoDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- data: URL upload, next/image can't optimize these.
          <img src={logoSrc} alt={platform.name} className="h-full w-full object-cover" />
        ) : (
          <Image src={logoSrc} alt={platform.name} width={px} height={px} className="h-full w-full object-cover" />
        )}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold uppercase ${box} ${text}`}
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
