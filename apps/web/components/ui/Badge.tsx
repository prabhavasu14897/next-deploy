import { Badge as LibBadge } from "@ascentware/react-ui-library";

// The library's Badge only ships default/destructive/outline/secondary
// variants — neutral/error map onto those directly, success/warning don't
// have a library equivalent so they layer this app's own status tokens on
// top via className (Badge merges className with its variant classes).
const TONE_PROPS = {
  neutral: { variant: "secondary" as const, className: "" },
  success: { variant: "outline" as const, className: "border-transparent bg-status-success-container text-status-success" },
  warning: {
    variant: "outline" as const,
    className: "border-transparent bg-status-pending-accent-container text-status-pending-accent",
  },
  error: { variant: "destructive" as const, className: "" },
};

/** A small pill label for a static state (e.g. an organization's own
 *  Active/Inactive status) — StatusPill covers the richer connection-status
 *  vocabulary; this is the plain generic version. */
export function Badge({
  tone = "neutral",
  title,
  children,
}: {
  tone?: keyof typeof TONE_PROPS;
  title?: string;
  children: React.ReactNode;
}) {
  const { variant, className } = TONE_PROPS[tone];
  return (
    <LibBadge
      variant={variant}
      shape="circle"
      title={title}
      className={`h-6 shrink-0 whitespace-nowrap px-2.5 text-[12px] font-semibold ${className}`}
    >
      {children}
    </LibBadge>
  );
}
