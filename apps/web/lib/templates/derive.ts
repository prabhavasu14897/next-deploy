import type { Post } from "../posts/types";

/** Whether any post references this template — mirrors
 *  lib/organizations/derive.ts's isPlatformInUse, same reason: block a
 *  delete that would orphan existing history rather than silently letting
 *  a post point at nothing. */
export function isTemplateInUse(templateId: string, posts: Post[]): boolean {
  return posts.some((p) => p.contentType === templateId);
}
