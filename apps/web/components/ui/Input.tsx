import { forwardRef, type InputHTMLAttributes } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`h-9 rounded border border-outline-variant bg-surface-container-high px-2.5 text-[14px] text-on-surface placeholder:text-on-surface-variant/70 outline-none transition-colors focus-visible:border-white ${className}`}
        {...props}
      />
    );
  }
);
