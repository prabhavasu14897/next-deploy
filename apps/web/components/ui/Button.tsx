import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-1.5 rounded font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-45";

const variants: Record<Variant, string> = {
  // Solid white, bold blue text — the spec's primary button.
  primary:
    "bg-white text-on-primary-fixed-variant hover:bg-white/90 active:bg-white/80 disabled:hover:bg-white",
  // White ghost border (40% opacity), white text — the spec's secondary button.
  secondary:
    "border border-white/40 text-on-surface bg-transparent hover:bg-white/10 active:bg-white/15",
  danger:
    "border border-error/50 text-error bg-transparent hover:bg-error-container/40 active:bg-error-container/60",
  ghost: "text-on-surface-variant hover:text-on-surface hover:bg-white/5",
};

const sizes: Record<Size, string> = {
  md: "h-9 px-3.5 text-[14px]",
  sm: "h-7 px-2.5 text-[12px]",
};

export function Button({
  variant = "secondary",
  size = "md",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}

const iconTones = {
  surface: "text-on-surface-variant hover:bg-white/10 hover:text-on-surface",
};

export function IconButton({
  label,
  tone = "surface",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  tone?: keyof typeof iconTones;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${iconTones[tone]} ${className}`}
      {...props}
    />
  );
}
