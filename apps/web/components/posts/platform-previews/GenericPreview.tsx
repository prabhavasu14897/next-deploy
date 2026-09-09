import type { PlatformPreviewProps } from "./types";

/** Fallback for any catalog platform without a network-specific preview —
 *  a platform still previews and posts, just without bespoke chrome.
 *  Matches the app's own dark card language since there's no real network
 *  look to imitate. */
export function GenericPreview({ pageName, imageBase64, caption, hashtags }: PlatformPreviewProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-outline-variant dark:border-white/15 bg-surface-container-low dark:bg-white/[0.02]">
      <div className="flex items-center gap-2 p-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-container-highest text-[12px] font-bold text-on-surface">
          {pageName.slice(0, 1).toUpperCase()}
        </span>
        <p className="text-[13px] font-semibold text-on-surface">{pageName}</p>
      </div>
      <p className="whitespace-pre-wrap px-3 pb-2 text-[13px] leading-snug text-on-surface">
        {caption}
        {hashtags.length > 0 && <span className="text-primary"> {hashtags.join(" ")}</span>}
      </p>
      {imageBase64 && (
        // eslint-disable-next-line @next/next/no-img-element -- data: URL preview, no upload backend to optimize against
        <img src={`data:image/png;base64,${imageBase64}`} alt="" className="aspect-square w-full object-cover" />
      )}
    </div>
  );
}
