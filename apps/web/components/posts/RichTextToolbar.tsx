"use client";

import { useRef } from "react";
import { FormField } from "@/components/ui/FormField";
import { Textarea } from "@/components/ui/Textarea";
import { IconButton } from "@/components/ui/Button";
import { BoldIcon, ItalicIcon, LinkIcon, ListBulletIcon } from "@/components/ui/icons";
import { toBulletList, toUnicodeBold, toUnicodeItalic } from "@/lib/posts/rich-text";

/** A caption editor with Bold/Italic/List/Link actions that transform the
 *  selected plain text in place — real formatting for real plain-text
 *  platforms (Unicode substitution), not HTML that would vanish on
 *  publish. See lib/posts/rich-text.ts for why. */
export function RichTextToolbar({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function transformSelection(transform: (text: string) => string) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart, selectionEnd } = el;
    if (selectionStart === selectionEnd) return;
    const before = value.slice(0, selectionStart);
    const selected = value.slice(selectionStart, selectionEnd);
    const after = value.slice(selectionEnd);
    const transformed = transform(selected);
    onChange(before + transformed + after);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(selectionStart, selectionStart + transformed.length);
    });
  }

  function insertLink() {
    const url = window.prompt("Link URL");
    if (!url) return;
    const el = ref.current;
    const insertAt = el ? el.selectionEnd : value.length;
    const before = value.slice(0, insertAt);
    const after = value.slice(insertAt);
    const needsSpaceBefore = before.length > 0 && !before.endsWith(" ") && !before.endsWith("\n");
    onChange(`${before}${needsSpaceBefore ? " " : ""}${url}${after}`);
  }

  return (
    <FormField label={label} htmlFor={id}>
      <div className="flex items-center gap-0.5 rounded-t border border-b-0 border-outline-variant bg-surface-container-high px-1 py-1">
        <IconButton label="Bold selection" onClick={() => transformSelection(toUnicodeBold)}>
          <BoldIcon className="h-3.5 w-3.5" />
        </IconButton>
        <IconButton label="Italicize selection" onClick={() => transformSelection(toUnicodeItalic)}>
          <ItalicIcon className="h-3.5 w-3.5" />
        </IconButton>
        <IconButton label="Bullet list" onClick={() => transformSelection(toBulletList)}>
          <ListBulletIcon className="h-3.5 w-3.5" />
        </IconButton>
        <IconButton label="Insert link" onClick={insertLink}>
          <LinkIcon className="h-3.5 w-3.5" />
        </IconButton>
      </div>
      <Textarea
        ref={ref}
        id={id}
        rows={5}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        className="rounded-t-none"
      />
    </FormField>
  );
}
