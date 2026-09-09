import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { AppShell } from "@/components/app-shell/AppShell";
import { PlatformsProvider } from "@/lib/platforms/store";
import { OrganizationsProvider } from "@/lib/organizations/store";
import { PostsProvider } from "@/lib/posts/store";
import { TemplatesProvider } from "@/lib/templates/store";
import "./globals.css";

// Self-hosted (next/font downloads and serves the files at build time, no
// runtime call to Google Fonts) — Manrope per the company theme spec.
const brandSans = Manrope({
  variable: "--font-brand-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ascentware Social Media Platform",
  description: "Manage social platform connections across every client organization.",
};

// Runs before hydration so the right theme is on <html> for the very first
// paint — no flash of the wrong theme. suppressHydrationWarning on <html>
// below is required because of this: React would otherwise complain that
// the class/data-attribute it sees at hydration don't match what it
// server-rendered, when in fact this script deliberately changed them
// first, before the user has seen anything.
const themeInitScript = `(function(){try{var s=localStorage.getItem("asw-theme-mode");var m=s==="light"||s==="dark"?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var r=document.documentElement;r.classList.toggle("dark",m==="dark");r.dataset.aswTheme=m==="dark"?"luminous-dark":"luminous-light";}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // Luminous Dark is the app's primary identity (DESIGN.md) and the
      // safe fallback for no-JS/pre-hydration; the head script above
      // corrects this to the user's actual saved/OS preference.
      data-asw-theme="luminous-dark"
      className={`dark ${brandSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/** biome-ignore lint: static literal, no user input — safe to inline. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="h-full bg-background text-foreground">
        <AppShell>
          <PlatformsProvider>
            <OrganizationsProvider>
              <TemplatesProvider>
                <PostsProvider>{children}</PostsProvider>
              </TemplatesProvider>
            </OrganizationsProvider>
          </PlatformsProvider>
        </AppShell>
      </body>
    </html>
  );
}
