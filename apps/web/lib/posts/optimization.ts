import type { ContentTypeId, OptimizationResult } from "./types";

const CTA_PHRASES = [
  "apply",
  "join",
  "learn more",
  "sign up",
  "register",
  "rsvp",
  "contact",
  "click",
  "visit",
  "read more",
  "get started",
  "reach out",
];

const BENEFIT_WORDS = [
  "benefit",
  "growth",
  "opportunity",
  "flexible",
  "remote",
  "learn",
  "grow",
  "impact",
  "team",
  "culture",
  "reward",
  "perks",
];

const EMOJI_PATTERN = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

function firstParagraph(caption: string): string {
  const trimmed = caption.trim();
  const breakIndex = trimmed.search(/\n\s*\n/);
  return breakIndex === -1 ? trimmed : trimmed.slice(0, breakIndex);
}

/**
 * A deterministic content-quality scorer — not an LLM call. Real, fast,
 * and explainable: the checklist the UI shows is exactly what this
 * function evaluated, so the gauge and the suggestions can never disagree
 * with each other the way an LLM-guessed number could.
 */
export function scorePost({ caption, hashtags }: { caption: string; hashtags: string[] }): OptimizationResult {
  const lower = caption.toLowerCase();

  const hasCta = CTA_PHRASES.some((phrase) => lower.includes(phrase));
  const hashtagCountOk = hashtags.length >= 3 && hashtags.length <= 8;
  const firstParagraphOk = firstParagraph(caption).length <= 220;
  const hasBenefitWords = BENEFIT_WORDS.some((word) => lower.includes(word));
  const hasHook = EMOJI_PATTERN.test(caption) || /!/.test(caption);

  const suggestions = [
    { id: "cta", label: "Add a strong call to action", delta: 10, met: hasCta },
    { id: "hashtags", label: "Add more relevant hashtags", delta: 8, met: hashtagCountOk },
    { id: "first-paragraph", label: "Reduce text in first paragraph", delta: 7, met: firstParagraphOk },
    { id: "benefits", label: "Highlight more benefits", delta: 5, met: hasBenefitWords },
    { id: "hook", label: "Add an engaging hook", delta: 5, met: hasHook },
  ];

  const score = 65 + suggestions.filter((s) => s.met).reduce((sum, s) => sum + s.delta, 0);

  return { score: Math.min(100, score), suggestions };
}

const DEFAULT_CTA: Record<ContentTypeId, string> = {
  jd: "If you're ready for the challenge, apply now!",
  birthday: "Join us in wishing them a fantastic year ahead!",
  workAnniversary: "Join us in celebrating this milestone!",
  achievement: "Congratulations to everyone involved!",
  event: "RSVP today — we'd love to see you there!",
  generalPost: "Learn more today!",
};

export function defaultCtaFor(contentType: ContentTypeId): string {
  return DEFAULT_CTA[contentType];
}

const DEFAULT_BENEFIT_SENTENCE = "Great benefits and a supportive team culture await.";

export function defaultBenefitSentence(): string {
  return DEFAULT_BENEFIT_SENTENCE;
}

/** Inserts a paragraph break near the given character budget, at the
 *  nearest preceding whitespace, so a long first paragraph gets split
 *  rather than truncated (no content is discarded). No-op if the text
 *  already has a paragraph break before the budget. */
export function breakLongFirstParagraph(caption: string, budget = 180): string {
  const trimmed = caption.trim();
  const existingBreak = trimmed.search(/\n\s*\n/);
  if (existingBreak !== -1 && existingBreak <= budget) return caption;

  const searchFrom = Math.min(budget, trimmed.length);
  const spaceIndex = trimmed.lastIndexOf(" ", searchFrom);
  if (spaceIndex <= 0) return caption;

  return `${trimmed.slice(0, spaceIndex)}\n\n${trimmed.slice(spaceIndex + 1)}`;
}
