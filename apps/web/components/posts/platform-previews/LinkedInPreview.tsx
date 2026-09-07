import type { PlatformPreviewProps } from "./types";
import { CommentIcon, HeartIcon, SendIcon, ShareIcon } from "@/components/ui/icons";

/** Simulates LinkedIn's own real (light) chrome, not the app's dark theme —
 *  the point of a network preview is trusting what will actually publish. */
export function LinkedInPreview({ pageName, imageBase64, caption, hashtags }: PlatformPreviewProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-white text-[#000000e6]">
      <div className="flex items-start gap-2 p-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0a66c2] text-[14px] font-bold text-white">
          {pageName.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold">{pageName}</p>
          <p className="text-[11px] text-black/60">Just now · 🌐</p>
        </div>
      </div>
      <p className="whitespace-pre-wrap px-3 pb-2 text-[13px] leading-snug">
        {caption}
        {hashtags.length > 0 && <span className="text-[#0a66c2]"> {hashtags.join(" ")}</span>}
      </p>
      {imageBase64 && (
        // eslint-disable-next-line @next/next/no-img-element -- data: URL preview, no upload backend to optimize against
        <img src={`data:image/png;base64,${imageBase64}`} alt="" className="aspect-square w-full object-cover" />
      )}
      <div className="flex items-center justify-between border-t border-black/10 px-3 py-1.5 text-[12px] font-medium text-black/60">
        <span className="flex items-center gap-1.5">
          <HeartIcon className="h-4 w-4" /> Like
        </span>
        <span className="flex items-center gap-1.5">
          <CommentIcon className="h-4 w-4" /> Comment
        </span>
        <span className="flex items-center gap-1.5">
          <ShareIcon className="h-4 w-4" /> Repost
        </span>
        <span className="flex items-center gap-1.5">
          <SendIcon className="h-4 w-4" /> Send
        </span>
      </div>
    </div>
  );
}
