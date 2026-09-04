import type { Metadata } from "next";
import { ComingSoonSurface } from "@/components/app-shell/ComingSoonSurface";

export const metadata: Metadata = {
  title: "Dashboard · Ascentware Social Media Platform",
};

export default function DashboardPage() {
  return (
    <ComingSoonSurface
      title="Dashboard"
      description="An at-a-glance overview of organizations, connections, and activity."
    />
  );
}
