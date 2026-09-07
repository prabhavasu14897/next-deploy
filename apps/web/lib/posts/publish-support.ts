import type { Platform } from "../organizations/types";

/** Platform catalog names (lowercased) with a real publish integration
 *  registered on the backend (see apps/api/src/publish/publish.module.ts).
 *  A platform can exist in the catalog — and be picked for generation —
 *  without being in this list; it just can't be posted to yet. Extending
 *  support later is adding a backend provider plus a key here. */
export const SUPPORTED_PUBLISH_PLATFORM_KEYS = ["linkedin", "facebook"];

export function publishKeyFor(platform: Platform): string {
  return platform.name.trim().toLowerCase();
}

export function isPublishSupported(platform: Platform): boolean {
  return SUPPORTED_PUBLISH_PLATFORM_KEYS.includes(publishKeyFor(platform));
}
