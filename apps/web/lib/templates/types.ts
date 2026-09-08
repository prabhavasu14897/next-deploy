/** One admin-defined content-type template — what the Post wizard's
 *  "What are you posting?" step offers. Plain serializable data (no
 *  function fields, no React components) so it can live in localStorage
 *  the same way Platform/PlatformIntegrationConfig do. */
export interface ContentTemplate {
  id: string;
  label: string;
  description: string;
  /** Key into ICON_REGISTRY (lib/templates/icon-registry.ts). */
  iconKey: string;
  /** May contain the literal token {orgName}, substituted at use time. */
  promptTemplate: string;
  /** Used by Post's "Apply All Suggestions" when the caption has no CTA. */
  defaultCta: string;
}

export type ContentTemplateDraft = Omit<ContentTemplate, "id">;
