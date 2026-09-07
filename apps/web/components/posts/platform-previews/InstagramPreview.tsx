import type { PlatformPreviewProps } from "./types";
import { BookmarkIcon, CommentIcon, HeartIcon, SendIcon } from "@/components/ui/icons";

export function InstagramPreview({ pageName, imageBase64, caption, hashtags }: PlatformPreviewProps) {
  const handle = pageName.toLowerCase().replace(/\s+/g, "_");
  return (
    <div className="overflow-hidden rounded-lg bg-white text-[#000000e6]">
      <div className="flex items-center gap-2 p-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5] text-[12px] font-bold text-white">
          {pageName.slice(0, 1).toUpperCase()}
        </span>
        <p className="text-[13px] font-semibold">{handle}</p>
      </div>
      {imageBase64 && (
        // eslint-disable-next-line @next/next/no-img-element -- data: URL preview, no upload backend to optimize against
        <img src={`data:image/png;base64,${imageBase64}`} alt="" className="aspect-square w-full object-cover" />
      )}
      <div className="flex items-center gap-3 px-3 pt-2 text-black/80">
        <HeartIcon className="h-5 w-5" />
        <CommentIcon className="h-5 w-5" />
        <SendIcon className="h-5 w-5" />
        <BookmarkIcon className="ml-auto h-5 w-5" />
      </div>
      <p className="whitespace-pre-wrap px-3 pb-3 pt-1.5 text-[13px] leading-snug">
        <span className="font-semibold">{handle}</span> {caption}
        {hashtags.length > 0 && <span className="text-[#00376b]"> {hashtags.join(" ")}</span>}
      </p>
    </div>
  );
}
