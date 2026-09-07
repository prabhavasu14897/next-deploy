"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardIcon, OrganizationsIcon, PlugIcon, SparklesIcon } from "@/components/ui/icons";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", Icon: DashboardIcon },
  { href: "/organizations", label: "Organizations", Icon: OrganizationsIcon },
  { href: "/post", label: "Post", Icon: SparklesIcon },
  { href: "/add-platform", label: "Add Platform", Icon: PlugIcon },
];

export function SidebarNavLinks({
  onNavigate,
  collapsed = false,
}: {
  onNavigate?: () => void;
  /** Icon-only rail: labels drop to sr-only, rows become square. */
  collapsed?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav className={`flex flex-col gap-1 ${collapsed ? "items-center px-2" : "px-3"}`}>
      {LINKS.map(({ href, label, Icon }) => {
        const active = pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-2.5 rounded font-medium transition-colors ${
              collapsed ? "h-9 w-9 justify-center px-0 text-[14px]" : "px-3 py-2 text-[14px]"
            } ${
              active
                ? "bg-primary/15 text-primary"
                : "text-on-surface-variant hover:bg-white/[0.06] hover:text-on-surface"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className={collapsed ? "sr-only" : ""}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
