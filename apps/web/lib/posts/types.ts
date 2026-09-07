import type { SVGProps } from "react";

export type ContentTypeId = "jd" | "birthday" | "workAnniversary" | "achievement" | "event" | "generalPost";

export interface ContentType {
  id: ContentTypeId;
  label: string;
  description: string;
  Icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement;
  defaultPrompt: (orgName: string) => string;
}

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
  contentType: ContentTypeId;
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
