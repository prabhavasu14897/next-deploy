import type { Metadata } from "next";
import { ComingSoonSurface } from "@/components/app-shell/ComingSoonSurface";

export const metadata: Metadata = {
  title: "Terms of Service · Ascentware Social Media Platform",
};

export default function TermsPage() {
  return (
    <ComingSoonSurface
      title="Terms of Service"
      description="The terms governing use of the Ascentware Social Media Platform."
    />
  );
}
