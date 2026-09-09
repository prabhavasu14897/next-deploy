import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Button as LibButton, type ButtonProps as LibButtonProps } from "@ascentware/react-ui-library";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "md" | "sm";

// Maps this app's semantic variant/size names onto @ascentware/react-ui-library's
// Button vocabulary, so call sites don't need to know the library's naming.
const variantMap: Record<Variant, LibButtonProps["variant"]> = {
  primary: "default",
  secondary: "outline",
  danger: "destructive",
  ghost: "ghost",
};
const sizeMap: Record<Size, LibButtonProps["size"]> = {
  md: "default",
  sm: "sm",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }
>(function Button({ variant = "secondary", size = "md", ...props }, ref) {
  return <LibButton ref={ref} variant={variantMap[variant]} size={sizeMap[size]} {...props} />;
});

export const IconButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { label: string }>(
  function IconButton({ label, className = "", ...props }, ref) {
    return (
      <LibButton
        ref={ref}
        variant="ghost"
        size="icon"
        aria-label={label}
        title={label}
        className={className}
        {...props}
      />
    );
  }
);
