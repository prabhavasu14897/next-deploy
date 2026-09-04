import { forwardRef, type InputHTMLAttributes } from "react";
import { FormField } from "./FormField";
import { Input } from "./Input";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  required?: boolean;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

/** FormField + Input, pre-wired — the pairing every labeled text input in
 *  the app needs (label, htmlFor/id, required mark, hint/error). Reach for
 *  Input directly only for an unlabeled or non-standard layout. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, id, required, hint, error, containerClassName, className = "", ...props },
  ref
) {
  return (
    <FormField label={label} htmlFor={id} required={required} hint={hint} error={error} className={containerClassName}>
      <Input ref={ref} id={id} className={`w-full ${className}`} {...props} />
    </FormField>
  );
});
