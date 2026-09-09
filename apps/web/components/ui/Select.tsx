"use client";

import { Children, forwardRef, isValidElement, type OptionHTMLAttributes, type ReactElement, type SelectHTMLAttributes } from "react";
import {
  Select as LibSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ascentware/react-ui-library";

// Radix's SelectItem can't take an empty-string value, so a real (selectable,
// not just a disabled placeholder) empty-value <option> is mapped to this
// sentinel internally and translated back to "" at the value/onChange boundary.
const EMPTY_VALUE_SENTINEL = "__select_empty__";

type OptionElement = ReactElement<OptionHTMLAttributes<HTMLOptionElement>>;

/** Native-<select>-shaped wrapper around @ascentware/react-ui-library's Radix
 *  Select, so call sites keep using <option> children, value/onChange — no
 *  call-site rewrite needed to pick up the library's real Select underneath. */
export const Select = forwardRef<HTMLButtonElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { value, defaultValue, onChange, children, className, disabled, id, name, required, "aria-label": ariaLabel },
  ref
) {
  const options = Children.toArray(children).filter((child): child is OptionElement => isValidElement(child));

  // A disabled empty-value option is a pure "Select a…" placeholder (never a
  // real selectable value) — Radix has native placeholder support for that,
  // so it's excluded from the rendered item list rather than sentinel-mapped.
  const placeholderOption = options.find((opt) => opt.props.value === "" && opt.props.disabled);
  const items = options.filter((opt) => opt !== placeholderOption);

  const toItemValue = (v: unknown) => (v === "" ? EMPTY_VALUE_SENTINEL : v == null ? undefined : String(v));
  const fromItemValue = (v: string) => (v === EMPTY_VALUE_SENTINEL ? "" : v);

  return (
    <LibSelect
      value={toItemValue(value)}
      defaultValue={toItemValue(defaultValue)}
      onValueChange={(next) => {
        onChange?.({ target: { value: fromItemValue(next), name } } as unknown as React.ChangeEvent<HTMLSelectElement>);
      }}
      disabled={disabled}
      name={name}
      required={required}
    >
      <SelectTrigger ref={ref} id={id} className={className} aria-label={ariaLabel}>
        <SelectValue placeholder={placeholderOption ? placeholderOption.props.children : undefined} />
      </SelectTrigger>
      <SelectContent>
        {items.map((opt) => (
          <SelectItem
            key={String(opt.props.value)}
            value={toItemValue(opt.props.value) ?? ""}
            disabled={opt.props.disabled}
          >
            {opt.props.children}
          </SelectItem>
        ))}
      </SelectContent>
    </LibSelect>
  );
});
