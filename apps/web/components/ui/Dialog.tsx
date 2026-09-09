"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "./icons";
import { IconButton } from "./Button";

export function Dialog({
  open,
  onClose,
  titleId,
  labelledBy,
  children,
  width = "26rem",
}: {
  open: boolean;
  onClose: () => void;
  titleId?: string;
  labelledBy?: string;
  children: React.ReactNode;
  width?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  // Kept current without being an effect dependency: a caller passing an
  // inline onClose (the common case) gets a new function identity on every
  // one of its own re-renders — e.g. each keystroke in a field inside this
  // dialog. Depending on onClose directly would re-run the effect below on
  // every keystroke and re-focus the panel, yanking focus off the input.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-surface-container-lowest/80"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId ?? labelledBy}
        tabIndex={-1}
        style={{ width }}
        className="relative max-w-full rounded-lg border border-outline-variant dark:border-white/20 bg-surface-container-high/95 p-5 backdrop-blur-md outline-none"
      >
        <IconButton
          label="Close dialog"
          onClick={onClose}
          className="absolute right-3 top-3"
        >
          <CloseIcon className="h-4 w-4" />
        </IconButton>
        {children}
      </div>
    </div>,
    document.body
  );
}
