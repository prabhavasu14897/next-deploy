import type { SVGProps } from "react";

/**
 * One consistent stroke family for every control glyph on the surface —
 * 1.6px stroke, round joins, no fills. Never swap in an emoji or a unicode
 * glyph; every icon used in the product is drawn here.
 */
function Icon({ children, ...props }: SVGProps<SVGSVGElement> & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M10 4v12M4 10h12" />
    </Icon>
  );
}

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <circle cx="8.5" cy="8.5" r="5" />
      <path d="M16 16l-3.6-3.6" />
    </Icon>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M5 5l10 10M15 5L5 15" />
    </Icon>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M4.5 10.5l3.5 3.5 7.5-8" />
    </Icon>
  );
}

export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M7.5 4.5l6 5.5-6 5.5" />
    </Icon>
  );
}

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M4.5 7.5l5.5 6 5.5-6" />
    </Icon>
  );
}

export function PencilIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M12.5 3.5l4 4L6 18H2v-4z" />
    </Icon>
  );
}

export function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M4 6h12M8 6V4h4v2M6 6l.7 10.2a1 1 0 0 0 1 .8h4.6a1 1 0 0 0 1-.8L14 6" />
    </Icon>
  );
}

export function PlugIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M7 3v4M13 3v4M5.5 7h9v3a4.5 4.5 0 0 1-9 0z" />
      <path d="M10 14v3" />
    </Icon>
  );
}

export function AlertIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M10 3.5l7.5 13h-15z" />
      <path d="M10 8.5v3.2M10 14.3v.1" />
    </Icon>
  );
}

export function RefreshIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M15.5 8a5.5 5.5 0 0 0-9.9-3.2M4.5 12a5.5 5.5 0 0 0 9.9 3.2" />
      <path d="M15.5 3.5V8h-4.5M4.5 16.5V12H9" />
    </Icon>
  );
}

export function SpinnerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="animate-spin"
      {...props}
    >
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeOpacity={0.25} strokeWidth={1.8} />
      <path d="M17.5 10a7.5 7.5 0 0 0-7.5-7.5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}

export function BackIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M12.5 4.5l-6 5.5 6 5.5" />
    </Icon>
  );
}

export function DashboardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="6" height="6" rx="1.2" />
      <rect x="11" y="3" width="6" height="6" rx="1.2" />
      <rect x="3" y="11" width="6" height="6" rx="1.2" />
      <rect x="11" y="11" width="6" height="6" rx="1.2" />
    </Icon>
  );
}

/** Three stacked strips, echoing the rail's own signature composition. */
export function OrganizationsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="3" y="4" width="14" height="3" rx="1" />
      <rect x="3" y="9" width="14" height="3" rx="1" />
      <rect x="3" y="14" width="9" height="3" rx="1" />
    </Icon>
  );
}

export function SettingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <circle cx="10" cy="10" r="2.6" />
      <path d="M10 3.2v2M10 14.8v2M16.8 10h-2M5.2 10h-2M15.1 4.9l-1.4 1.4M6.3 13.7l-1.4 1.4M15.1 15.1l-1.4-1.4M6.3 6.3L4.9 4.9" />
    </Icon>
  );
}

export function UserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <circle cx="10" cy="7" r="3" />
      <path d="M3.5 17a6.5 6.5 0 0 1 13 0" />
    </Icon>
  );
}

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M3.5 6h13M3.5 10h13M3.5 14h13" />
    </Icon>
  );
}

export function ListIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="3" y="4.2" width="2.4" height="2.4" rx="0.6" />
      <path d="M8 5.4h9" />
      <rect x="3" y="8.8" width="2.4" height="2.4" rx="0.6" />
      <path d="M8 10h9" />
      <rect x="3" y="13.4" width="2.4" height="2.4" rx="0.6" />
      <path d="M8 14.6h9" />
    </Icon>
  );
}

export function GridIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="6" height="6" rx="1.2" />
      <rect x="11" y="3" width="6" height="6" rx="1.2" />
      <rect x="3" y="11" width="6" height="6" rx="1.2" />
      <rect x="11" y="11" width="6" height="6" rx="1.2" />
    </Icon>
  );
}

export function FilterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M3.5 4.5h13l-5.2 6v5.3l-2.6 1.3v-6.6z" />
    </Icon>
  );
}
