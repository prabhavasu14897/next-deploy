import { forwardRef, type TextareaHTMLAttributes } from "react";
import { FormField } from "./FormField";
import { Textarea } from "./Textarea";

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  required?: boolean;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

/** FormField + Textarea, pre-wired — same pairing as TextField, for a
 *  labeled multi-line input. */
export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(function TextareaField(
  { label, id, required, hint, error, containerClassName, className = "", ...props },
  ref
) {
  return (
    <FormField label={label} htmlFor={id} required={required} hint={hint} error={error} className={containerClassName}>
      <Textarea ref={ref} id={id} className={`w-full ${className}`} {...props} />
    </FormField>
  );
});
