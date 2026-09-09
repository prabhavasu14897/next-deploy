import { forwardRef, type TextareaHTMLAttributes } from "react";
import { TextareaField as LibTextareaField } from "@ascentware/react-ui-library";

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  required?: boolean;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

/** Thin wrapper around @ascentware/react-ui-library's TextareaField, adding
 *  the outer-wrapper className this app's grid layouts rely on. */
export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(function TextareaField(
  { containerClassName, className = "", ...props },
  ref
) {
  const field = <LibTextareaField ref={ref} className={`w-full ${className}`} {...props} />;
  return containerClassName ? <div className={containerClassName}>{field}</div> : field;
});
