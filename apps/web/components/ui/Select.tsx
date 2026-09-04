import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDownIcon } from "./icons";

/** Native select, restyled to match Input — a real listbox (keyboard,
 *  screen-reader, mobile picker behavior) rather than a rebuilt one. */
export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className = "", ...props }, ref) {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={`h-9 w-full appearance-none rounded border border-outline-variant bg-surface-container-high px-2.5 pr-8 text-[14px] text-on-surface outline-none transition-colors focus-visible:border-white ${className}`}
          {...props}
        />
        <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-on-surface-variant" />
      </div>
    );
  }
);
