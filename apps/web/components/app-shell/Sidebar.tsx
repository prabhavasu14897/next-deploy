import { SidebarNavLinks } from "./SidebarNavLinks";

/** Desktop-only rail, part of the page's own flex flow (sm and up).
 *  `open` is owned by AppShell and toggled from the header's hamburger. */
export function Sidebar({ open }: { open: boolean }) {
  return (
    <aside
      className={`hidden shrink-0 flex-col border-r border-outline-variant bg-surface-container-lowest pt-3 transition-[width] duration-200 ease-out sm:flex ${
        open ? "w-56" : "w-16"
      }`}
    >
      <SidebarNavLinks collapsed={!open} />
    </aside>
  );
}
