import type { PlatformPreviewProps } from "./types";
import { LinkedInPreview } from "./LinkedInPreview";
import { InstagramPreview } from "./InstagramPreview";
import { FacebookPreview } from "./FacebookPreview";
import { XPreview } from "./XPreview";
import { GenericPreview } from "./GenericPreview";

export type { PlatformPreviewProps };

/** Registry keyed by lowercased catalog platform name — same pattern as
 *  lib/posts/publish-support.ts and the backend's PublishProvider map. A
 *  platform without a specific entry still renders, via GenericPreview. */
const PLATFORM_PREVIEW_COMPONENTS: Record<string, (props: PlatformPreviewProps) => React.ReactElement> = {
  linkedin: LinkedInPreview,
  instagram: InstagramPreview,
  facebook: FacebookPreview,
  x: XPreview,
  twitter: XPreview,
};

export function previewComponentFor(platformName: string) {
  return PLATFORM_PREVIEW_COMPONENTS[platformName.trim().toLowerCase()] ?? GenericPreview;
}
