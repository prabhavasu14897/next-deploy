import { Checkbox as LibCheckbox } from "@ascentware/react-ui-library";

/** checked/onChange()-shaped wrapper around the library's Radix-based
 *  Checkbox (which uses checked/onCheckedChange) — preserves this app's
 *  existing call-site API. */
export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label?: string;
}) {
  return <LibCheckbox checked={checked} onCheckedChange={() => onChange()} aria-label={label} />;
}
