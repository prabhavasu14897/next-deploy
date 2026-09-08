import type { SVGProps } from "react";
import {
  AwardIcon,
  BriefcaseIcon,
  CalendarIcon,
  GiftIcon,
  GridIcon,
  ListIcon,
  MegaphoneIcon,
  PlugIcon,
  SparklesIcon,
  TrophyIcon,
} from "@/components/ui/icons";

type IconComponent = (props: SVGProps<SVGSVGElement>) => React.ReactElement;

/** The fixed set of icons an admin can assign to a content template —
 *  reuses icons already drawn for this app, no new glyphs. Adding a
 *  choice later is one entry here, not a new icon file. */
export const ICON_REGISTRY: Record<string, IconComponent> = {
  briefcase: BriefcaseIcon,
  gift: GiftIcon,
  trophy: TrophyIcon,
  award: AwardIcon,
  calendar: CalendarIcon,
  megaphone: MegaphoneIcon,
  sparkles: SparklesIcon,
  plug: PlugIcon,
  list: ListIcon,
  grid: GridIcon,
};

export const ICON_KEYS = Object.keys(ICON_REGISTRY);

/** Never crashes on a stale or unrecognized key — falls back to Sparkles. */
export function iconFor(key: string): IconComponent {
  return ICON_REGISTRY[key] ?? SparklesIcon;
}
