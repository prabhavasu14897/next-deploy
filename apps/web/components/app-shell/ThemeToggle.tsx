"use client";

import { useSyncExternalStore } from "react";
import { IconButton } from "@/components/ui/Button";
import { MoonIcon, SunIcon } from "@/components/ui/icons";

const STORAGE_KEY = "asw-theme-mode";
const CHANGE_EVENT = "asw-theme-mode-change";

function isDarkSnapshot() {
  return document.documentElement.classList.contains("dark");
}

// SSR/pre-hydration guess matches the <html> fallback rendered in
// app/layout.tsx (dark), which the head script there corrects before paint.
function isDarkServerSnapshot() {
  return true;
}

function subscribe(onChange: () => void) {
  document.addEventListener(CHANGE_EVENT, onChange);
  return () => document.removeEventListener(CHANGE_EVENT, onChange);
}

function setMode(mode: "light" | "dark") {
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  root.dataset.aswTheme = mode === "dark" ? "luminous-dark" : "luminous-light";
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Private browsing / storage disabled: the toggle still works for this
    // page load, it just won't be remembered next visit.
  }
  document.dispatchEvent(new Event(CHANGE_EVENT));
}

export function ThemeToggle() {
  // Syncs to the DOM class the head script (app/layout.tsx) and this
  // toggle both write to, rather than tracking theme in React state that
  // could drift from what's actually on <html>.
  const isDark = useSyncExternalStore(subscribe, isDarkSnapshot, isDarkServerSnapshot);

  return (
    <IconButton
      label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setMode(isDark ? "light" : "dark")}
    >
      {isDark ? <SunIcon className="h-[18px] w-[18px]" /> : <MoonIcon className="h-[18px] w-[18px]" />}
    </IconButton>
  );
}
