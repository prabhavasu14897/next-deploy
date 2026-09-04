import type { Metadata } from "next";
import { OrganizationsView } from "@/components/organizations/OrganizationsView";

export const metadata: Metadata = {
  title: "Organizations · Ascentware Social Media Platform",
};

export default function OrganizationsPage() {
  return <OrganizationsView />;
}
