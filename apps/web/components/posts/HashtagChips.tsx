"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { CloseIcon } from "@/components/ui/icons";

function normalizeTag(raw: string): string | null {
  const trimmed = raw.trim().replace(/^#+/, "");
  if (!trimmed) return null;
  return `#${trimmed.replace(/\s+/g, "")}`;
}

/** A removable hashtag chip list with an add-input — replaces a plain
 *  space-separated text field so individual tags can be added/removed. */
export function HashtagChips({
  hashtags,
  onChange,
}: {
  hashtags: string[];
  onChange: (hashtags: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  function addTag() {
    const tag = normalizeTag(draft);
    if (tag && !hashtags.includes(tag)) {
      onChange([...hashtags, tag]);
    }
    setDraft("");
  }

  function removeTag(tag: string) {
    onChange(hashtags.filter((t) => t !== tag));
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {hashtags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-surface-container-highest dark:bg-white/[0.06] py-1 pl-2.5 pr-1.5 text-[12px] font-medium text-on-surface"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
              className="rounded-full p-0.5 text-on-surface-variant transition-colors hover:bg-white/10 hover:text-on-surface"
            >
              <CloseIcon className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
          }
        }}
        onBlur={addTag}
        placeholder="Add a hashtag and press Enter"
        aria-label="Add a hashtag"
        className="w-full"
      />
    </div>
  );
}
