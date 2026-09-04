/** Label + hint/error + control, the one layout every form field in the
 *  app shares. Wrap any Input/Select/Textarea/custom control in it. */
export function FormField({
  label,
  htmlFor,
  required,
  hint,
  error,
  className = "",
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-center gap-1 text-[12px] font-medium text-on-surface-variant">
        {label}
        {required && (
          <span className="text-error" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-[12px] text-error">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-[12px] text-on-surface-variant">{hint}</p>
      ) : null}
    </div>
  );
}
