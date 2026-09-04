"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { IconButton } from "@/components/ui/Button";
import { CloseIcon } from "@/components/ui/icons";
import { BrandMark } from "./BrandMark";
import { SidebarNavLinks } from "./SidebarNavLinks";

/** The sidebar's mobile form — a left-edge slide-over, same portal/backdrop
 *  language as OrgDetailSheet and AccountPicker, mirrored to the left edge. */
export function MobileSidebarDrawer({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex sm:hidden">
      <div className="absolute inset-0 animate-fade-in bg-surface-container-lowest/70" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className="relative flex h-full w-64 max-w-[80vw] animate-slide-in-left flex-col border-r border-white/15 bg-surface-container-lowest shadow-[16px_0_40px_-12px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 text-[14px] font-semibold text-on-surface">
            <BrandMark />
            Ascentware
          </div>
          <IconButton label="Close navigation" onClick={onClose}>
            <CloseIcon className="h-4 w-4" />
          </IconButton>
        </div>
        <SidebarNavLinks onNavigate={onClose} />
      </div>
    </div>,
    document.body
  );
}
