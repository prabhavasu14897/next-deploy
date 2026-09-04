/** The dashed-border "nothing here" box — used for a genuinely empty
 *  collection, a no-results filter, and an honest "not built yet" surface
 *  alike. One shape, three callers today (ComingSoonSurface, Organizations'
 *  empty/no-match states, the wizard's reserved step). */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-outline px-6 py-14 text-center">
      <p className="text-[14px] font-semibold text-on-surface">{title}</p>
      {description && (
        <p className="mx-auto mt-1 max-w-sm text-[14px] text-on-surface-variant">{description}</p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
