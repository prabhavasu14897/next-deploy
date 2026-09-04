import { CheckIcon } from "./icons";

/** The account-selection checkbox visual — solid white fill with a deep-blue
 *  check when selected, an outline box when not (the spec's literal
 *  instruction). Renders the visual box plus the real input; wrap it in a
 *  <label> for the click target rather than passing an id/htmlFor. */
export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label?: string;
}) {
  return (
    <span
      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border transition-colors ${
        checked ? "border-white bg-white text-on-primary-fixed-variant" : "border-outline bg-transparent text-transparent"
      }`}
    >
      <CheckIcon className="h-3 w-3" />
      <input type="checkbox" checked={checked} onChange={onChange} aria-label={label} className="sr-only" />
    </span>
  );
}
