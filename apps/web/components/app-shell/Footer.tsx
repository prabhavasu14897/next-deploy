import Link from "next/link";

const LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/support", label: "Support" },
];

/** The shell's third persistent region, alongside Sidebar and TopHeader —
 *  full-width beneath the sidebar+content row, on every page. */
export function Footer() {
  return (
    <footer className="flex min-h-11 shrink-0 flex-wrap items-center justify-center gap-x-5 gap-y-1.5 border-t border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-[12px] text-on-surface-variant sm:justify-between sm:px-6">
      <p>© {new Date().getFullYear()} Ascentware. All rights reserved.</p>
      <nav className="flex items-center gap-4" aria-label="Footer">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="transition-colors hover:text-on-surface hover:underline">
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
