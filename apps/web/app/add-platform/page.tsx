import { Suspense } from "react";
import type { Metadata } from "next";
import { PlatformsView } from "@/components/platforms/PlatformsView";
import { PageLoading } from "@/components/ui/PageLoading";

export const metadata: Metadata = {
  title: "Add Platform · Ascentware Social Media Platform",
};

export default function AddPlatformPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <PlatformsView />
    </Suspense>
  );
}
