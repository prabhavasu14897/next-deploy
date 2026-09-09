import Link from "next/link";
import type { SVGProps } from "react";

/** One dashboard stat — an icon, a big tabular count, a caption, wrapped as
 *  a shortcut to the surface that owns the number. Same Card fill/border
 *  convention as the rest of the app (DESIGN.md's "brighten, don't
 *  recolor" hover rule), not a bespoke tile shape. */
export function StatTile({
  Icon,
  label,
  count,
  href,
}: {
  Icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement;
  label: string;
  count: number | null;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg border border-outline-variant dark:border-white/15 bg-surface-container-highest dark:bg-white/[0.04] px-4 py-3.5 transition-colors hover:bg-surface-variant dark:hover:bg-white/[0.08]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-[24px] font-semibold leading-8 tabular text-on-surface">{count ?? "–"}</p>
        <p className="text-[12px] text-on-surface-variant">{label}</p>
      </div>
    </Link>
  );
}
