/** A pill-shaped filter toggle — active state solid `primary`, inactive a
 *  transparent ring. Shared by any filter row (AccountPicker's type filter,
 *  Organizations' status filter). */
export function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`h-6 shrink-0 rounded-full px-2.5 text-[12px] font-semibold transition-colors ${
        active
          ? "bg-primary text-on-primary"
          : "bg-transparent text-on-surface-variant ring-1 ring-inset ring-outline-variant hover:text-on-surface"
      }`}
    >
      {children}
    </button>
  );
}
