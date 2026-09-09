import { forwardRef, type InputHTMLAttributes } from "react";
import { Field } from "@ascentware/react-ui-library";

// Input's own `size` prop is the library's variant union ("sm"/"lg"/...),
// not the native numeric HTML attribute — omit it same as the library does.
interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  id: string;
  required?: boolean;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

/** Thin wrapper around @ascentware/react-ui-library's Field, adding the
 *  outer-wrapper className this app's grid layouts rely on (the library's
 *  Field has no such slot of its own). */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { containerClassName, className = "", ...props },
  ref
) {
  const field = <Field ref={ref} className={`w-full ${className}`} {...props} />;
  return containerClassName ? <div className={containerClassName}>{field}</div> : field;
});
