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
  const dims =
    size === "lg" ? "h-14 w-14 text-[18px]" : size === "md" ? "h-11 w-11 text-[15px]" : "h-8 w-8 text-[12px]";

  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- data: URLs (no upload backend); next/image can't optimize these.
      <img
        src={imageUrl}
        alt=""
        className={`shrink-0 rounded-lg border border-white/15 object-cover ${dims} ${className}`}
      />
    );
  }
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-lg border border-white/15 bg-surface-container-highest font-bold uppercase text-on-surface-variant ${dims} ${className}`}
    >
      {name.slice(0, 1)}
    </span>
  );
}
