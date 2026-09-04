"use client";

import Link from "next/link";
import { IconButton } from "@/components/ui/Button";
import { MenuIcon, SettingsIcon, UserIcon } from "@/components/ui/icons";
import { BrandMark } from "./BrandMark";

export function TopHeader({
  onOpenMobileNav,
  desktopNavOpen,
  onToggleDesktopNav,
}: {
  onOpenMobileNav: () => void;
  desktopNavOpen: boolean;
  onToggleDesktopNav: () => void;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <IconButton label="Open navigation" onClick={onOpenMobileNav} className="sm:hidden">
          <MenuIcon className="h-5 w-5" />
        </IconButton>
        <IconButton
          label={desktopNavOpen ? "Collapse navigation" : "Expand navigation"}
          onClick={onToggleDesktopNav}
          className="hidden sm:flex"
        >
          <MenuIcon className="h-5 w-5" />
        </IconButton>
        <Link href="/organizations" className="flex items-center gap-2 text-[14px] font-bold text-on-surface">
          <BrandMark />
          Ascentware
        </Link>
      </div>

      <div className="flex items-center gap-1">
        <IconButton label="Settings">
          <SettingsIcon className="h-[18px] w-[18px]" />
        </IconButton>
        <button
          type="button"
          aria-label="Account"
          title="Account"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-highest text-on-surface-variant transition-colors hover:text-on-surface"
        >
          <UserIcon className="h-[18px] w-[18px]" />
        </button>
      </div>
    </header>
  );
}
