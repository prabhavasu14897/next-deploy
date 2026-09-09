import Image from "next/image";

/** The real Ascentware triangle mark — kept at the fixed pixel size the nav
 *  bar and mobile drawer badge slot were built for. */
export function BrandMark() {
  return (
    <Image
      src="/brand/ascentware-mark.png"
      alt="Ascentware"
      width={24}
      height={24}
      className="h-6 w-6 shrink-0"
      priority
    />
  );
}
