"use client";

import type { Organization } from "@/lib/organizations/types";
import { useOrganizations } from "@/lib/organizations/store";
import { usePlatforms } from "@/lib/platforms/store";
import { CONTENT_TYPES } from "@/lib/posts/content-templates";
import { isPublishSupported } from "@/lib/posts/publish-support";
import type { ContentTypeId } from "@/lib/posts/types";
import { SelectField } from "@/components/ui/SelectField";
import { Checkbox } from "@/components/ui/Checkbox";
import { PlatformBadge } from "@/components/organizations/PlatformBadge";

export interface PlatformTarget {
  platformId: string;
  accountId: string | null;
}

export function StepTypeAndPlatform({
  organizations,
  organizationId,
  onOrganizationChange,
  contentType,
  onContentTypeChange,
  targets,
  onTargetsChange,
}: {
  organizations: Organization[];
  organizationId: string;
  onOrganizationChange: (id: string) => void;
  contentType: ContentTypeId | null;
  onContentTypeChange: (id: ContentTypeId) => void;
  targets: PlatformTarget[];
  onTargetsChange: (targets: PlatformTarget[]) => void;
}) {
  const { state: platformsState } = usePlatforms();
  const { connectionFor, accountsFor } = useOrganizations();

  function togglePlatform(platformId: string) {
    const exists = targets.some((t) => t.platformId === platformId);
    onTargetsChange(
      exists ? targets.filter((t) => t.platformId !== platformId) : [...targets, { platformId, accountId: null }]
    );
  }

  function setAccount(platformId: string, accountId: string | null) {
    onTargetsChange(targets.map((t) => (t.platformId === platformId ? { ...t, accountId } : t)));
  }

  return (
    <div className="space-y-8">
      <SelectField
        label="Organization"
        id="wizard-org"
        value={organizationId}
        onChange={(e) => onOrganizationChange(e.target.value)}
      >
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </SelectField>

      <div className="space-y-3">
        <h2 className="text-[18px] font-semibold text-on-surface">Select post type</h2>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {CONTENT_TYPES.map((type) => {
            const active = contentType === type.id;
            return (
              <button
                key={type.id}
                aria-pressed={active}
                onClick={() => onContentTypeChange(type.id)}
                className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                  active ? "border-primary bg-primary/10" : "border-white/15 bg-white/[0.02] hover:bg-white/[0.06]"
                }`}
              >
                <type.Icon className={`h-5 w-5 shrink-0 ${active ? "text-primary" : "text-on-surface-variant"}`} />
                <div>
                  <p className={`text-[14px] font-semibold ${active ? "text-primary" : "text-on-surface"}`}>
                    {type.label}
                  </p>
                  <p className="mt-0.5 text-[12px] text-on-surface-variant">{type.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-[18px] font-semibold text-on-surface">Select platforms</h2>
        <div className="overflow-hidden rounded-lg border border-white/15">
          {platformsState.platforms.map((platform) => {
            const supported = isPublishSupported(platform);
            const target = targets.find((t) => t.platformId === platform.id);
            const connection = connectionFor(organizationId, platform.id);
            const accounts = connection ? accountsFor(connection.id).filter((a) => a.selected) : [];

            return (
              <div key={platform.id} className="border-b border-white/[0.06] last:border-b-0">
                <label
                  className={`flex items-center gap-3 px-3 py-2.5 ${
                    supported ? "cursor-pointer hover:bg-white/[0.04]" : "opacity-50"
                  }`}
                >
                  <Checkbox
                    checked={!!target}
                    onChange={() => supported && togglePlatform(platform.id)}
                    label={platform.name}
                  />
                  <PlatformBadge platform={platform} status="not_connected" size="sm" />
                  <span className="flex-1 text-[14px] font-medium text-on-surface">{platform.name}</span>
                  {!supported && (
                    <span className="text-[12px] text-on-surface-variant">Publishing not available yet</span>
                  )}
                </label>

                {target && accounts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 px-3 pb-3 pl-11">
                    {accounts.map((account) => (
                      <label
                        key={account.id}
                        className={`flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors ${
                          target.accountId === account.id
                            ? "bg-primary text-on-primary"
                            : "bg-transparent text-on-surface-variant ring-1 ring-inset ring-outline-variant hover:text-on-surface"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`account-${platform.id}`}
                          className="sr-only"
                          checked={target.accountId === account.id}
                          onChange={() => setAccount(platform.id, account.id)}
                        />
                        {account.name}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-[12px] text-on-surface-variant">
          Posts publish to the LinkedIn organization and Facebook Page configured for this workspace, regardless of
          which organization or page is selected here — page selection is for labeling and preview only.
        </p>
      </div>
    </div>
  );
}
