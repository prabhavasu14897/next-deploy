import { forwardRef, type TextareaHTMLAttributes } from "react";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className = "", ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={`w-full resize-none rounded border border-outline-variant bg-surface-container-high px-2.5 py-2 text-[14px] text-on-surface placeholder:text-on-surface-variant/70 outline-none transition-colors focus-visible:border-white ${className}`}
        {...props}
      />
    );
  }
);
