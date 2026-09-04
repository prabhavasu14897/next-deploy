"use client";

import { useRef, useState } from "react";
import { CloseIcon, PlusIcon } from "./icons";

const MAX_BYTES = 1_000_000; // 1MB — this app persists state to localStorage, so keep images small

/** Reads a chosen image into a data: URL — this mock app has no upload
 *  backend, so the preview *is* the stored value. */
export function LogoUpload({
  value,
  onChange,
}: {
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
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-surface-container-high">
            {/* eslint-disable-next-line @next/next/no-img-element -- data: URL preview, no upload backend to optimize against */}
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label="Remove logo"
              onClick={() => onChange(null)}
              className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-surface-container-lowest/90 text-on-surface-variant transition-colors hover:text-on-surface"
            >
              <CloseIcon className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-outline text-on-surface-variant transition-colors hover:border-primary hover:text-on-surface"
          >
            <PlusIcon className="h-4 w-4" />
            <span className="text-[10px] font-medium">Logo</span>
          </button>
        )}
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-[13px] font-semibold text-primary hover:underline"
          >
            {value ? "Replace image" : "Upload image"}
          </button>
          <p className="mt-0.5 text-[12px] text-on-surface-variant">PNG or JPG, up to 1MB.</p>
        </div>
      </div>
      {error && <p className="mt-1.5 text-[12px] text-error">{error}</p>}
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
