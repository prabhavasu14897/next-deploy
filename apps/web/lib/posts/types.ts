export type RewriteAction = "improve" | "shorten" | "grammar";
export type ContentTone = "professional" | "casual" | "enthusiastic" | "formal";

export type TabStatus = "generating" | "ready" | "draft" | "scheduled" | "posting" | "posted" | "failed";

/** One selected platform's generated content — image, caption, hashtags —
 *  independently editable and postable. `platformId` points at the
 *  existing Platform catalog rather than a hardcoded platform union.
 *  `accountId` is which ManagedAccount ("page") the post is attributed to
 *  for preview/history purposes — the real publish call still targets the
 *  single configured LinkedIn org / Facebook Page (see publish-support.ts). */
export interface PlatformDraft {
  platformId: string;
  accountId: string | null;
  imageBase64: string | null;
  imageStyles: string[];
  caption: string;
  hashtags: string[];
  tone: ContentTone;
  status: TabStatus;
  error: string | null;
  scheduledFor: string | null;
  externalPostId: string | null;
}

export interface Post {
  id: string;
  organizationId: string;
  /** References a ContentTemplate.id from lib/templates/store.tsx — an
   *  admin-editable catalog, not a fixed union. */
  contentType: string;
  prompt: string;
  drafts: PlatformDraft[];
  createdAt: string;
}

export interface OptimizationSuggestion {
  id: string;
  label: string;
  delta: number;
  met: boolean;
}

export interface OptimizationResult {
  score: number;
  suggestions: OptimizationSuggestion[];
}
