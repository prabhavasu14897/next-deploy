import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { AppShell } from "@/components/app-shell/AppShell";
import { PlatformsProvider } from "@/lib/platforms/store";
import { OrganizationsProvider } from "@/lib/organizations/store";
import { PostsProvider } from "@/lib/posts/store";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${brandSans.variable} h-full antialiased`}>
      <body className="h-full bg-background text-foreground">
        <AppShell>
          <PlatformsProvider>
            <OrganizationsProvider>
              <PostsProvider>{children}</PostsProvider>
            </OrganizationsProvider>
          </PlatformsProvider>
        </AppShell>
      </body>
    </html>
  );
}
