import { Avatar as LibAvatar, AvatarFallback, AvatarImage } from "@ascentware/react-ui-library";

const SIZE_CLASSES = {
  sm: "h-8 w-8 text-[12px]",
  md: "h-11 w-11 text-[15px]",
  lg: "h-14 w-14 text-[18px]",
} as const;

/** Image avatar with an initial-letter fallback — used anywhere an entity
 *  (organization, later a user) may or may not have an uploaded image. */
export function Avatar({
  name,
  imageUrl,
  size = "sm",
  className = "",
}: {
  name: string;
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <LibAvatar className={`rounded-lg border border-outline-variant dark:border-white/15 ${SIZE_CLASSES[size]} ${className}`}>
      {imageUrl && <AvatarImage src={imageUrl} alt="" />}
      <AvatarFallback className="rounded-lg bg-surface-container-highest font-bold uppercase text-on-surface-variant">
        {name.slice(0, 1)}
      </AvatarFallback>
    </LibAvatar>
  );
}
