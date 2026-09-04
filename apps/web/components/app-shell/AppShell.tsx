"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { MobileSidebarDrawer } from "./MobileSidebarDrawer";
import { Footer } from "./Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [desktopNavOpen, setDesktopNavOpen] = useState(true);

  return (
    <div className="flex h-full flex-col">
      <TopHeader
        onOpenMobileNav={() => setMobileNavOpen(true)}
        desktopNavOpen={desktopNavOpen}
        onToggleDesktopNav={() => setDesktopNavOpen((v) => !v)}
      />
      <div className="flex min-h-0 flex-1">
        <Sidebar open={desktopNavOpen} />
        {mobileNavOpen && <MobileSidebarDrawer onClose={() => setMobileNavOpen(false)} />}
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
