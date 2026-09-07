import type { PlatformPreviewProps } from "./types";
import { CommentIcon, HeartIcon, RefreshIcon, ShareIcon } from "@/components/ui/icons";

export function XPreview({ pageName, imageBase64, caption, hashtags }: PlatformPreviewProps) {
  const handle = pageName.toLowerCase().replace(/\s+/g, "");
  return (
    <div className="overflow-hidden rounded-lg bg-white text-black">
      <div className="flex items-start gap-2 p-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-[13px] font-bold text-white">
          {pageName.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px]">
            <span className="font-semibold">{pageName}</span> <span className="text-black/50">@{handle} · 2h</span>
          </p>
          <p className="mt-0.5 whitespace-pre-wrap text-[13px] leading-snug">
            {caption}
            {hashtags.length > 0 && <span className="text-[#1d9bf0]"> {hashtags.join(" ")}</span>}
          </p>
        </div>
      </div>
      {imageBase64 && (
        <div className="px-3 pb-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- data: URL preview, no upload backend to optimize against */}
          <img
            src={`data:image/png;base64,${imageBase64}`}
            alt=""
            className="aspect-square w-full rounded-2xl border border-black/10 object-cover"
          />
        </div>
      )}
      <div className="flex items-center justify-between px-6 py-2 text-[12px] text-black/50">
        <CommentIcon className="h-4 w-4" />
        <RefreshIcon className="h-4 w-4" />
        <HeartIcon className="h-4 w-4" />
        <ShareIcon className="h-4 w-4" />
      </div>
    </div>
  );
}
