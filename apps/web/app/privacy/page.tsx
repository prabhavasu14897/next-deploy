import type { Metadata } from "next";
import { ComingSoonSurface } from "@/components/app-shell/ComingSoonSurface";

export const metadata: Metadata = {
  title: "Privacy Policy · Ascentware Social Media Platform",
};

export default function PrivacyPage() {
  return (
    <ComingSoonSurface
      title="Privacy Policy"
      description="How Ascentware handles organization and account data across connected platforms."
    />
  );
}
