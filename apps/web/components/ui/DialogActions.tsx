/** The Cancel + primary-action row at the bottom of a single-decision
 *  Dialog (connect authorization, delete confirmation, ...). */
export function DialogActions({ children }: { children: React.ReactNode }) {
  return <div className="mt-5 flex justify-end gap-2">{children}</div>;
}
