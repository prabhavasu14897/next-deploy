import type { Metadata } from "next";
import { ComingSoonSurface } from "@/components/app-shell/ComingSoonSurface";

export const metadata: Metadata = {
  title: "Support · Ascentware Social Media Platform",
};

export default function SupportPage() {
  return (
    <ComingSoonSurface
      title="Support"
      description="Where to get help with organizations, platform connections, and account access."
    />
  );
}
