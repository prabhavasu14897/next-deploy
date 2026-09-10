"use client";

import { useRef, useState } from "react";
import { CloseIcon, PlusIcon } from "./icons";

const MAX_BYTES = 1_000_000; // 1MB — this app persists state to localStorage, so keep images small

/** Compact square logo picker — reads a chosen image into a data: URL, same
 *  no-backend approach as the rest of this demo app's uploads. Kept as a
 *  small custom component rather than the company library's
 *  `FileUploadField`: that one is a full-width dropzone with no compact
 *  variant, which doesn't fit next to a single-line field like Name. */
export function LogoUpload({
  id,
  value,
  onChange,
}: {
  id?: string;
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image must be under 1MB.");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        {value ? (
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-outline-variant dark:border-white/15 bg-surface-container-high">
            {/* eslint-disable-next-line @next/next/no-img-element -- data: URL preview, no upload backend to optimize against */}
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label="Remove logo"
              onClick={() => onChange(null)}
              className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-surface-container-lowest/90 text-on-surface-variant transition-colors hover:text-on-surface"
            >
              <CloseIcon className="h-2.5 w-2.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg border border-dashed border-outline text-on-surface-variant transition-colors hover:border-primary hover:text-on-surface"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        )}
        <button
          id={id}
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-[13px] font-semibold text-primary hover:underline"
        >
          {value ? "Replace" : "Upload"}
        </button>
      </div>
      {error && <p className="mt-1 text-[12px] text-error">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="sr-only"
      />
    </div>
  );
}
