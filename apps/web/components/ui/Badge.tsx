const TONES = {
  neutral: "text-on-surface-variant bg-surface-container-highest",
  success: "text-status-success bg-status-success-container",
  warning: "text-status-pending-accent bg-status-pending-accent-container",
  error: "text-error bg-error-container",
} as const;

/** A small pill label for a static state (e.g. an organization's own
 *  Active/Inactive status) — StatusPill covers the richer connection-status
 *  vocabulary; this is the plain generic version. */
export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: keyof typeof TONES;
  children: React.ReactNode;
}) {
  return (
    <span className={`inline-flex h-6 items-center rounded-full px-2.5 text-[12px] font-semibold ${TONES[tone]}`}>
      {children}
    </span>
  );
}
