"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { ManagedAccount, Organization, Platform } from "@/lib/organizations/types";
import { useOrganizations } from "@/lib/organizations/store";
import { formatFollowers } from "@/lib/organizations/derive";
import { IconButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FilterChip } from "@/components/ui/FilterChip";
import { Checkbox } from "@/components/ui/Checkbox";
import { BackIcon, SearchIcon } from "@/components/ui/icons";

export function AccountPicker({
  onClose,
  platform,
  organization,
  accounts,
}: {
  onClose: () => void;
  platform: Platform;
  organization: Organization;
  accounts: ManagedAccount[];
}) {
  const { toggleAccountSelected } = useOrganizations();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const types = useMemo(
    () => Array.from(new Set(accounts.map((a) => a.type))).sort(),
    [accounts]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return accounts.filter((a) => {
      if (typeFilter && a.type !== typeFilter) return false;
      if (!q) return true;
      return a.name.toLowerCase().includes(q) || a.handle.toLowerCase().includes(q);
    });
  }, [accounts, query, typeFilter]);

  const selectedCount = accounts.filter((a) => a.selected).length;

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div
        className="absolute inset-0 animate-fade-in bg-surface-container-lowest/70"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-picker-title"
        className="relative flex h-full w-full max-w-md animate-slide-in-right flex-col border-l border-white/15 bg-surface-container-high shadow-[-16px_0_40px_-12px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-start gap-2 border-b border-white/10 px-5 py-4">
          <IconButton label="Back to organization" onClick={onClose}>
            <BackIcon className="h-4 w-4" />
          </IconButton>
          <div className="min-w-0 flex-1">
            <h2 id="account-picker-title" className="text-[18px] font-semibold text-on-surface">
              {platform.name} {platform.accountNounPlural.toLowerCase()}
            </h2>
            <p className="text-[12px] text-on-surface-variant">
              Managed by {organization.name} · {selectedCount} of {accounts.length} selected
            </p>
          </div>
        </div>

        <div className="space-y-2.5 border-b border-white/10 px-5 py-3">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${platform.accountNounPlural.toLowerCase()}`}
              aria-label={`Search ${platform.accountNounPlural.toLowerCase()}`}
              className="w-full pl-8"
            />
          </div>
          {types.length > 1 && (
            <div className="flex flex-wrap gap-1.5">
              <FilterChip active={typeFilter === null} onClick={() => setTypeFilter(null)}>
                All
              </FilterChip>
              {types.map((t) => (
                <FilterChip key={t} active={typeFilter === t} onClick={() => setTypeFilter(t)}>
                  {t}
                </FilterChip>
              ))}
            </div>
          )}
        </div>

        <ul className="flex-1 overflow-y-auto px-2 py-2">
          {filtered.length === 0 && (
            <li className="px-3 py-8 text-center text-[14px] text-on-surface-variant">
              No {platform.accountNounPlural.toLowerCase()} match &ldquo;{query}&rdquo;.
            </li>
          )}
          {filtered.map((account) => (
            <li key={account.id} className="border-b border-white/[0.06] last:border-b-0">
              <label className="flex cursor-pointer items-center gap-3 rounded px-3 py-2.5 hover:bg-white/[0.06]">
                <Checkbox
                  checked={account.selected}
                  onChange={() => toggleAccountSelected(account.id)}
                  label={account.name}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold text-on-surface">
                    {account.name}
                  </span>
                  <span className="block truncate text-[12px] text-on-surface-variant">
                    {account.handle} · {account.type}
                  </span>
                </span>
                <span className="shrink-0 text-[12px] text-on-surface-variant tabular">
                  {formatFollowers(account.followers)}
                </span>
              </label>
            </li>
          ))}
        </ul>

        <div className="border-t border-white/10 px-5 py-3">
          <p className="text-[12px] text-on-surface-variant">
            Selections save immediately and persist for this organization.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
