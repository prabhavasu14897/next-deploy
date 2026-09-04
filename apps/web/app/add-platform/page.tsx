import type { Metadata } from "next";
import { PlatformsView } from "@/components/platforms/PlatformsView";

export const metadata: Metadata = {
  title: "Add Platform · Ascentware Social Media Platform",
};

export default function AddPlatformPage() {
  return <PlatformsView />;
}
