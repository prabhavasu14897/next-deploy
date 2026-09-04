import { forwardRef, type SelectHTMLAttributes } from "react";
import { FormField } from "./FormField";
import { Select } from "./Select";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  required?: boolean;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

/** FormField + Select, pre-wired — same pairing as TextField, for a
 *  labeled dropdown. */
export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, id, required, hint, error, containerClassName, className = "", children, ...props },
  ref
) {
  return (
    <FormField label={label} htmlFor={id} required={required} hint={hint} error={error} className={containerClassName}>
      <Select ref={ref} id={id} className={className} {...props}>
        {children}
      </Select>
    </FormField>
  );
});
