import type { Metadata } from "next";
import { TemplatesView } from "@/components/templates/TemplatesView";

export const metadata: Metadata = {
  title: "Templates · Ascentware Social Media Platform",
};

export default function TemplatesPage() {
  return <TemplatesView />;
}
